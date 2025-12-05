import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  FlatList 
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import userStore from '../store/userStore'
import quizStore from '../store/quizStore'
import axiosInstance from '../utils/axiosInstance'

const Results = () => {
  const { user } = userStore()
  const { quizzes, getAllQuizzes } = quizStore()
  
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [view, setView] = useState('overview') // 'overview' or 'quiz'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      await getAllQuizzes()
      await fetchAllUsers()
    } catch (error) {
      console.log('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllUsers = async () => {
    try {
      const response = await axiosInstance.get('/user/users')
      setAllUsers(response.data.users || [])
    } catch (error) {
      console.log('Error fetching users:', error)
    }
  }

  // Get teacher's created quizzes
  const getTeacherQuizzes = () => {
    if (!user || user.role !== 'teacher') return []
    return quizzes.filter(quiz => quiz.userId === user._id)
  }

  // Get attempts for specific quiz
  const getAttemptsForQuiz = (quizCode) => {
    if (!allUsers.length) return []

    const attempts = []
    allUsers.forEach(student => {
      if (student.role === 'student') {
        student.quizzes?.forEach(attempt => {
          if (attempt.quizCode === quizCode) {
            attempts.push({
              student,
              attempt,
              quiz: quizzes.find(q => q.quizCode === quizCode)
            })
          }
        })
      }
    })
    
    return attempts
  }

  // Get all students who attempted teacher's quizzes
  const getAllStudentsWithAttempts = () => {
    const teacherQuizzes = getTeacherQuizzes()
    const teacherQuizCodes = teacherQuizzes.map(quiz => quiz.quizCode)
    
    const studentsWithAttempts = []
    
    allUsers.forEach(student => {
      if (student.role === 'student') {
        const studentAttempts = student.quizzes?.filter(attempt => 
          teacherQuizCodes.includes(attempt.quizCode)
        ) || []
        
        if (studentAttempts.length > 0) {
          studentsWithAttempts.push({
            student,
            attempts: studentAttempts
          })
        }
      }
    })
    
    return studentsWithAttempts
  }

  // Calculate statistics
  const getQuizStatistics = (quizCode) => {
    const attempts = getAttemptsForQuiz(quizCode)
    const totalAttempts = attempts.length
    const passedAttempts = attempts.filter(a => a.attempt.status === 'PASSED').length
    const averagePercentage = attempts.reduce((sum, a) => sum + ((a.attempt.obtainedMarks / a.attempt.totalMarks) * 100), 0) / totalAttempts || 0
    const highestMarks = Math.max(...attempts.map(a => a.attempt.obtainedMarks), 0)
    const lowestMarks = Math.min(...attempts.map(a => a.attempt.obtainedMarks), attempts[0]?.attempt.obtainedMarks || 0)

    return {
      totalAttempts,
      passedAttempts,
      averagePercentage: averagePercentage.toFixed(1),
      highestMarks,
      lowestMarks: lowestMarks === Infinity ? 0 : lowestMarks,
      successRate: totalAttempts > 0 ? ((passedAttempts / totalAttempts) * 100).toFixed(1) : 0
    }
  }

  // Calculate overall statistics
  const getOverallStatistics = () => {
    const teacherQuizzes = getTeacherQuizzes()
    const studentsWithAttempts = getAllStudentsWithAttempts()
    
    const totalAttempts = studentsWithAttempts.reduce((total, item) => total + item.attempts.length, 0)
    const totalStudents = studentsWithAttempts.length
    
    return {
      totalQuizzes: teacherQuizzes.length,
      totalStudents,
      totalAttempts
    }
  }

  const teacherQuizzes = getTeacherQuizzes()
  const studentsWithAttempts = getAllStudentsWithAttempts()
  const overallStats = getOverallStatistics()

  if (user?.role !== 'teacher') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="school-outline" size={64} color="#CCC" />
          <Text style={styles.accessDeniedText}>Access Denied</Text>
          <Text style={styles.accessDeniedSubtext}>
            This page is only available for teachers
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  const StudentCard = ({ student, attempt }) => (
    <View style={styles.studentCard}>
      <View style={styles.studentHeader}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentDetails}>
            <Text style={{fontWeight:"600",color:'#000'}}>Roll No:</Text> {student.rollNumber} • {student.email}
          </Text>
        </View>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: attempt.status === 'PASSED' ? '#4CAF50' : '#FF6B6B' }
        ]}>
          <Text style={styles.statusText}>{attempt.status}</Text>
        </View>
      </View>
      <View style={styles.attemptDetails}>
        {/* <Text style={styles.quizName}>Quiz: {attempt.quizName}</Text> */}
        <Text style={styles.marksText}>
          Marks: {attempt.obtainedMarks}/{attempt.totalMarks} 
          ({((attempt.obtainedMarks / attempt.totalMarks) * 100).toFixed(1)}%)
        </Text>
        <Text style={styles.dateText}>
          Attempted: {new Date(attempt.attemptedAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  )

  const QuizCard = ({ quiz }) => {
    const stats = getQuizStatistics(quiz.quizCode)

    return (
      <TouchableOpacity 
        style={styles.quizCard}
        onPress={() => {
          setSelectedQuiz(quiz)
          setView('quiz')
        }}
      >
        <View style={styles.quizHeader}>
          <View style={styles.quizInfo}>
            <Text style={styles.quizName}>{quiz.quizName}</Text>
            <Text style={styles.quizCode}>Code: {quiz.quizCode}</Text>
            <Text style={styles.quizDetails}>
              {quiz.subject} • {quiz.className}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
        
        <View style={styles.quizStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalAttempts}</Text>
            <Text style={styles.statLabel}>Attempts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.successRate}%</Text>
            <Text style={styles.statLabel}>Success</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.averagePercentage}%</Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {view === 'overview' ? 'Quiz Results' : selectedQuiz?.quizName}
        </Text>
        {view === 'quiz' && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setView('overview')}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4199c7" style={styles.loader} />
      ) : view === 'overview' ? (
        <ScrollView style={styles.content}>
          {/* Overview Statistics */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{overallStats.totalQuizzes}</Text>
                <Text style={styles.statLabel}>My Quizzes</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{overallStats.totalStudents}</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{overallStats.totalAttempts}</Text>
                <Text style={styles.statLabel}>Total Attempts</Text>
              </View>
            </View>
          </View>

          {/* My Quizzes Section */}
          <Text style={styles.sectionTitle}>My Quizzes</Text>
          {teacherQuizzes.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#CCC" />
              <Text style={styles.emptyStateText}>No quizzes created yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Create quizzes to see student results
              </Text>
            </View>
          ) : (
            teacherQuizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))
          )}
        </ScrollView>
      ) : (
        // Quiz Details View
        <ScrollView style={styles.content}>
          {selectedQuiz && (
            <>
              <View style={styles.quizHeaderCard}>
                <Text style={styles.quizTitle}>{selectedQuiz.quizName}</Text>
                <Text style={styles.quizSubtitle}>
                  Code: {selectedQuiz.quizCode} • {selectedQuiz.subject} • {selectedQuiz.className}
                </Text>
                
                <View style={styles.quizStats}>
                  {Object.entries(getQuizStatistics(selectedQuiz.quizCode)).map(([key, value]) => (
                    <View key={key} style={styles.detailStat}>
                      <View>
                      <Text style={styles.detailStatLabel}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Text>
                      </View>
                      <View>
                      <Text style={styles.detailStatValue}>{value}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <Text style={styles.sectionTitle}>
                Student Attempts ({getAttemptsForQuiz(selectedQuiz.quizCode).length})
              </Text>

              {getAttemptsForQuiz(selectedQuiz.quizCode).length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={48} color="#CCC" />
                  <Text style={styles.emptyStateText}>No attempts yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Students haven't attempted this quiz yet
                  </Text>
                </View>
              ) : (
                getAttemptsForQuiz(selectedQuiz.quizCode).map(({ student, attempt }, index) => (
                  <StudentCard key={index} student={student} attempt={attempt} />
                ))
              )}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

// Styles remain the same as previous version
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#041E42',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loader: {
    marginTop: 50,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  accessDeniedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  accessDeniedSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#041E42',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 16,
  },
  quizCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quizInfo: {
    flex: 1,
  },
  quizName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 4,
  },
  quizCode: {
    fontSize: 14,
    color: '#4199c7',
    fontWeight: '600',
    marginBottom: 4,
  },
  quizDetails: {
    fontSize: 14,
    color: '#666',
  },
  quizStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  quizHeaderCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 8,
  },
  quizSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  detailStat: {
    alignItems: 'center',
    marginHorizontal: 8,
    maxWidth: '30%',
  },
  detailStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  detailStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#041E42',
  },
  studentCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  attemptDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  marksText: {
    fontSize: 14,
    color: '#041E42',
    fontWeight: '600',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
})

export default Results