import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView, 
  StatusBar, 
  SafeAreaView 
} from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import userStore from '../store/userStore'

const Home = ({ navigation }) => {
  const { user } = userStore()
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  const StatCard = ({ icon, title, value, subtitle, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.statCard, { borderLeftColor: color }]} 
      onPress={onPress}
    >
      <View style={styles.statHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          {icon}
        </View>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  )

  const FeatureCard = ({ icon, title, description, onPress, color }) => (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
      <View style={[styles.featureIcon, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#041E42" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Student'}! 👋</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person-circle" size={32} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >

        {isStudent && (
      <>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon={<Ionicons name="trophy" size={20} color="#FFF" />}
              title="Quizzes Passed"
              value={user?.quizzes?.filter(q => q.status === 'PASSED').length || 0}
              subtitle="Excellent work!"
              color="#4CAF50"
            />
            <StatCard
              icon={<MaterialIcons name="quiz" size={20} color="#FFF" />}
              title="Total Attempts"
              value={user?.quizzes?.length || 0}
              subtitle="Keep learning!"
              color="#2196F3"
            />
          </View>
        </View>
        </>
        )}

{isTeacher && (

 <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
 <View style={styles.featuresGrid}>
      <FeatureCard
        icon={<MaterialIcons name="add-circle" size={28} color="#FFF" />}
        title="Create Quiz"
        description="Create new quizzes for your students"
        onPress={() => navigation.navigate("QuizManagement")}
        color="#FF6B35"
      />
          <FeatureCard
        icon={<Ionicons name="analytics" size={28} color="#FFF" />}
        title="View Results"
        description="Check student performances"
        onPress={() => navigation.navigate("Results")}
        color="#9C27B0"
      />

      </View>
    </View>

)}




        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore Features</Text>
          <View style={styles.featuresGrid}>
            {isStudent && (
              <>
            <FeatureCard
              icon={<MaterialIcons name="quiz" size={28} color="#FFF" />}
              title="Take Quiz"
              description="Test your knowledge with new challenges"
              onPress={() => navigation.navigate("QuizApp")}
              color="#FF6B35"
            />
            <FeatureCard
              icon={<Ionicons name="analytics" size={28} color="#FFF" />}
              title="Quiz History"
              description="Review your past performances"
              onPress={() => navigation.navigate("AttemptedQuiz")}
              color="#4ECDC4"
            />
            </>
            )}
            <FeatureCard
              icon={<FontAwesome5 name="user-graduate" size={24} color="#FFF" />}
              title="My Profile"
              description="Manage your account and progress"
              onPress={() => navigation.navigate("Profile")}
              color="#9C27B0"
            />
            <FeatureCard
              icon={<Ionicons name="settings" size={28} color="#FFF" />}
              title="Settings"
              description="Customize your experience"
              onPress={() => navigation.navigate("Settings")}
              color="#607D8B"
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            {user?.quizzes?.length > 0 ? (
              <>
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Ionicons name="time" size={20} color="#FF6B35" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>
                      Last quiz: {user.quizzes[user.quizzes.length - 1]?.quizName}
                    </Text>
                    <Text style={styles.activitySubtitle}>
                      {user.quizzes[user.quizzes.length - 1]?.status} • 
                      {user.quizzes[user.quizzes.length - 1]?.obtainedMarks}/
                      {user.quizzes[user.quizzes.length - 1]?.totalMarks} marks
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => navigation.navigate("AttemptedQuiz")}
                >
                  <Text style={styles.viewAllText}>View All Activity</Text>
                  <Ionicons name="chevron-forward" size={16} color="#041E42" />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.noActivity}>
                <Ionicons name="document-text" size={40} color="#CCC" />
                <Text style={styles.noActivityText}>No quiz activity yet</Text>
                <Text style={styles.noActivitySubtext}>Start your first quiz to see your progress!</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#041E42',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  greeting: {
    fontSize: 16,
    color: '#E3F2FD',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 4,
    flexWrap: 'wrap',
    maxWidth: 250,
  },
  profileButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    marginTop: -15,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#041E42',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#041E42',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  activityCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#041E42',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#666',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#041E42',
    marginRight: 4,
  },
  noActivity: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noActivityText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 8,
  },
  noActivitySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
})