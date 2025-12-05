import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import userStore from '../store/userStore' // Adjust path as needed

const AttemptedQuiz = () => {
  const { user ,getUser} = userStore()
  const [searchQuery, setSearchQuery] = useState('')
  
  const totalQuizzes = user.quizzes.length
  const passedQuizzes = user.quizzes.filter(quiz => quiz.status === 'PASSED').length
  const totalMarks = user.quizzes.reduce((sum, quiz) => sum + quiz.obtainedMarks, 0)
  const averagePercentage = ((totalMarks / (user.quizzes.length * 100)) * 100).toFixed(1)

  useEffect(() => {
    getUser()
  }, [])

  // Filter quizzes based on search query
  const filteredQuizzes = user.quizzes.filter(quiz => 
    quiz.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user || !user.quizzes || user.quizzes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noQuizText}>No quizzes attempted yet</Text>
      </View>
    )
  }

  // Status ke hisaab se color
  const getStatusColor = (status) => {
    return status === 'PASSED' ? '#4CAF50' : '#FF6B6B'
  }

  // Date format karne ke liye
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    return { date: formattedDate, time: formattedTime }
  }

  // Percentage calculate karne ke liye
  const calculatePercentage = (obtained, total) => {
    return ((obtained / total) * 100).toFixed(1)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attempted Quizzes</Text>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by subject name..."
          placeholderTextColor={"black"}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Statistics Card */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your Performance</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredQuizzes.length}</Text>
            <Text style={styles.statLabel}>Total Attempts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {filteredQuizzes.filter(quiz => quiz.status === 'PASSED').length}
            </Text>
            <Text style={styles.statLabel}>Passed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {filteredQuizzes.length > 0 
                ? ((filteredQuizzes.reduce((sum, quiz) => sum + quiz.obtainedMarks, 0) / (filteredQuizzes.length * 100)) * 100).toFixed(1)
                : '0.0'
              }%
            </Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredQuizzes.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              {searchQuery ? `No quizzes found for "${searchQuery}"` : 'No quizzes available'}
            </Text>
          </View>
        ) : (
          filteredQuizzes.map((quiz, index) => (
            <View key={quiz._id || index} style={styles.quizCard}>
              
              {/* Quiz Basic Info */}
              <View style={styles.quizHeader}>
                <Text style={styles.quizName}>{quiz.quizName}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(quiz.status) }]}>
                  <Text style={styles.statusText}>{quiz.status}</Text>
                </View>
              </View>

              {/* Subject and Class */}
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>Subject: {quiz.subject}</Text>
                <Text style={styles.detailText}>Class: {quiz.className}</Text>
              </View>

              {/* Marks and Percentage */}
              <View style={styles.marksContainer}>
                <View style={styles.marksRow}>
                  <Text style={styles.marksLabel}>Marks:</Text>
                  <Text style={styles.marksValue}>
                    {quiz.obtainedMarks}/{quiz.totalMarks}
                  </Text>
                </View>
                
                <View style={styles.marksRow}>
                  <Text style={styles.marksLabel}>Percentage:</Text>
                  <Text style={styles.marksValue}>
                    {calculatePercentage(quiz.obtainedMarks, quiz.totalMarks)}%
                  </Text>
                </View>
              </View>

              {/* Attempt Date */}
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                  Attempted on: {formatDate(quiz.attemptedAt).date} at {formatDate(quiz.attemptedAt).time}
                </Text>
              </View>

              {/* Separator */}
              {index < filteredQuizzes.length - 1 && <View style={styles.separator} />}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default AttemptedQuiz

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#041E42',
    textAlign: 'center',
    marginBottom: 10,
  },
  // Search Bar Styles
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
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
    marginBottom: 15,
    textAlign: 'center',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#041E42',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  quizCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
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
    marginBottom: 10,
  },
  quizName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#041E42',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  marksContainer: {
    marginBottom: 10,
  },
  marksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  marksLabel: {
    fontSize: 14,
    color: '#666',
  },
  marksValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#041E42',
  },
  dateContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 15,
  },
  noQuizText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  noResultsContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
})