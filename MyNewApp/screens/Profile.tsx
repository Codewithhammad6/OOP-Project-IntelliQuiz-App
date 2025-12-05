// import {
//   Image,
//   ScrollView,
//   StatusBar,
//   Text,
//   TouchableOpacity,
//   View,
//   StyleSheet,
//   Platform,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import userStore from "../store/userStore";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Ionicons from "react-native-vector-icons/Ionicons";
// const Profile = ({ navigation }) => {
//   const { logout, user } = userStore();
// console.log(user)
//   return (
//     <>
//       <StatusBar backgroundColor="#4199c7ff" barStyle="dark-content" />
//       <SafeAreaView style={styles.container}>
//         <ScrollView>
          
//           <View style={styles.header}>
//             <View style={styles.brandRow}>
//               <Text style={styles.brandHL}>Quiz</Text>
//               <Text style={styles.brandDotCom}> Master</Text>
//             </View>
//             <View style={styles.avatar}>
//               <Ionicons name="person" size={28} color="#4199c7ff" />
//             </View>
//           </View>

        
//           <View style={styles.profileCard}>
//             <Ionicons name="person-circle" size={70} color="#4199c7ff" />
//             <Text style={styles.welcomeText}>
//               Welcome, <Text style={styles.userName}>{user?.name}</Text>
//             </Text>
//             <Text style={styles.emailText}>{user?.email}</Text>
//           </View>

        
//           <View style={styles.actions}>
 

//             <TouchableOpacity style={styles.actionBtn} onPress={() => logout()}>
//               <Ionicons name="log-out-outline" size={22} color="#fff" />
//               <Text style={styles.actionText}>Logout</Text>
//             </TouchableOpacity>


      
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: Platform.OS === "android" ? 0 : 0,
//     flex: 1,
//     backgroundColor: "#fdfbfbec",
//   },
//   header: {
//     backgroundColor: "#4199c7ff",
//     justifyContent: "space-between",
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 14,
//   },
//   brandRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   brandHL: {
//     fontSize: 24,
//     fontWeight: "700",
//     fontFamily: "serif",
//     color: "#fff",
//   },
//   brandDotCom: {
//     fontSize: 20,
//     marginTop:2,
//     fontWeight: "500",
//     color: "#fff",
//   },
//   avatar: {
//     borderWidth: 2,
//     borderRadius: 50,
//     padding: 6,
//     borderColor: "#fff",
//     backgroundColor: "#fff",
//   },
//   profileCard: {
//     alignItems: "center",
//     marginVertical: 20,
//     padding: 20,
//   },
//   welcomeText: {
//     fontSize: 16,
//     fontWeight: "500",
//     marginTop: 10,
//     color: "#111",
//   },
//   userName: {
//     fontWeight: "700",
//     color: "#4199c7ff",
//   },
//   emailText: {
//     fontSize: 13,
//     color: "#6B7280",
//     marginTop: 4,
//   },
//   actions: {
//     marginTop: 20,
//     paddingHorizontal: 20,
//   },
//   actionBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#4199c7ff",
//     padding: 14,
//     borderRadius: 12,
//     marginVertical: 8,
//   },
//   actionText: {
//     color: "#fff",
//     fontSize: 14,
//     marginLeft: 10,
//     fontWeight: "600",
//   },
// });

// export default Profile;











import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import userStore from "../store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Profile = ({ navigation }) => {
  const { logout, user, updateUser } = userStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedRollNumber, setEditedRollNumber] = useState(user?.rollNumber || "");
  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];

  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSaveProfile = async () => {
    if (editedName.trim().length < 2) {
      Alert.alert("Invalid Name", "Please enter a valid name (min 2 characters)");
      return;
    }

    if (editedRollNumber.trim().length === 0) {
      Alert.alert("Invalid Roll Number", "Please enter your roll number");
      return;
    }

    try {
      await updateUser({ 
        name: editedName,
        rollNumber: editedRollNumber 
      });
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMemberSince = () => {
    if (!user?.createdAt) return "Recently joined";
    const joinDate = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Joined today";
    if (diffDays < 30) return `Joined ${diffDays} days ago`;
    if (diffDays < 365) return `Joined ${Math.floor(diffDays / 30)} months ago`;
    return `Joined ${Math.floor(diffDays / 365)} years ago`;
  };

  const StatItem = ({ icon, value, label }) => (
    <View style={styles.statItem}>
      <View style={styles.statIcon}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const InfoRow = ({ icon, label, value, editable = false, onEdit }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <View style={styles.infoIcon}>
          {icon}
        </View>
        <View>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
      {editable && (
        <TouchableOpacity style={styles.editFieldButton} onPress={onEdit}>
          <Ionicons name="pencil" size={16} color="#4199c7" />
        </TouchableOpacity>
      )}
    </View>
  );

  // Calculate user statistics
  const totalQuizzes = user?.quizzes?.length || 0;
  const passedQuizzes = user?.quizzes?.filter(q => q.status === 'PASSED').length || 0;
  const failedQuizzes = totalQuizzes - passedQuizzes;
  const totalMarks = user?.quizzes?.reduce((sum, quiz) => sum + quiz.obtainedMarks, 0) || 0;
  const averageScore = totalQuizzes > 0 
    ? ((totalMarks / (totalQuizzes * 100)) * 100).toFixed(1)
    : 0;

  // Calculate success rate
  const successRate = totalQuizzes > 0 ? ((passedQuizzes / totalQuizzes) * 100).toFixed(0) : 0;

  return (
    <>
      <StatusBar backgroundColor="#041E42" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Profile</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Ionicons 
                name={isEditing ? "close" : "create-outline"} 
                size={22} 
                color="#FFF" 
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                </View>
              </View>

              {isEditing ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={editedName}
                    onChangeText={setEditedName}
                    placeholder="Enter your full name"
                    autoFocus
                  />
                  {isStudent && (
                  <TextInput
                    style={styles.nameInput}
                    value={editedRollNumber}
                    onChangeText={setEditedRollNumber}
                    placeholder="Enter your roll number"
                    keyboardType="numeric"
                  />
                  )}
                  <View style={styles.editActions}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => setIsEditing(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.saveButton}
                      onPress={handleSaveProfile}
                    >
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <Text style={styles.userName}>{user?.name}</Text>
                  <Text style={styles.userEmail}>{user?.email}</Text>
                  <View style={styles.memberSince}>
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.memberSinceText}>{getMemberSince()}</Text>
                  </View>
                </>
              )}
{isStudent && (
              
              <View style={styles.statsContainer}>
                <StatItem
                  icon={<MaterialIcons name="quiz" size={20} color="#4199c7" />}
                  value={totalQuizzes}
                  label="Total"
                />
                <StatItem
                  icon={<Ionicons name="trophy" size={20} color="#4CAF50" />}
                  value={passedQuizzes}
                  label="Passed"
                />
                <StatItem
                  icon={<Ionicons name="stats-chart" size={20} color="#FF6B35" />}
                  value={`${successRate}%`}
                  label="Success"
                />
              </View>
            )}
            </View>

            {/* Personal Information */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <InfoRow
                icon={<Ionicons name="person-outline" size={20} color="#4199c7" />}
                label="Full Name"
                value={user?.name}
                editable
                onEdit={() => {
                  setIsEditing(true);
                  setActiveField('name');
                }}
              />
              
              <InfoRow
                icon={<MaterialIcons name="email" size={20} color="#FF6B35" />}
                label="Email Address"
                value={user?.email}
              />
              {isStudent && (
              <InfoRow
                icon={<FontAwesome5 name="id-card" size={18} color="#9C27B0" />}
                label="Roll Number"
                value={user?.rollNumber}
                editable
                onEdit={() => {
                  setIsEditing(true);
                  setActiveField('rollNumber');
                }}
              />
              )}
              <InfoRow
                icon={<MaterialCommunityIcons name="account-school" size={20} color="#4CAF50" />}
                label="Role"
                value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              />
              
              <InfoRow
                icon={<Ionicons name="calendar-outline" size={20} color="#FF9800" />}
                label="Member Since"
                value={user?.createdAt ? formatDate(user.createdAt) : "N/A"}
              />
            </View>

            {/* Academic Performance */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Academic Performance</Text>
              
              <View style={styles.performanceGrid}>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceValue}>{totalQuizzes}</Text>
                  <Text style={styles.performanceLabel}>Quizzes Taken</Text>
                </View>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceValue}>{averageScore}%</Text>
                  <Text style={styles.performanceLabel}>Average Score</Text>
                </View>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceValue}>{totalMarks}</Text>
                  <Text style={styles.performanceLabel}>Total Marks</Text>
                </View>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceValue}>{successRate}%</Text>
                  <Text style={styles.performanceLabel}>Success Rate</Text>
                </View>
              </View>

              {/* Progress Bars */}
              <View style={styles.progressSection}>
                <View style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Passed Quizzes</Text>
                    <Text style={styles.progressValue}>{passedQuizzes}/{totalQuizzes}</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${totalQuizzes > 0 ? (passedQuizzes / totalQuizzes) * 100 : 0}%`,
                          backgroundColor: '#4CAF50'
                        }
                      ]} 
                    />
                  </View>
                </View>
                
                <View style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Failed Quizzes</Text>
                    <Text style={styles.progressValue}>{failedQuizzes}/{totalQuizzes}</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${totalQuizzes > 0 ? (failedQuizzes / totalQuizzes) * 100 : 0}%`,
                          backgroundColor: '#EF4444'
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              
              <View style={styles.quickActions}>
                <TouchableOpacity 
                  style={styles.quickAction}
                  onPress={() => navigation.navigate("QuizApp")}
                >
                  <View style={[styles.quickIcon, { backgroundColor: "#4199c7" }]}>
                    <MaterialIcons name="quiz" size={24} color="#FFF" />
                  </View>
                  <Text style={styles.quickText}>Take Quiz</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.quickAction}
                  onPress={() => navigation.navigate("AttemptedQuiz")}
                >
                  <View style={[styles.quickIcon, { backgroundColor: "#4CAF50" }]}>
                    <Ionicons name="analytics" size={24} color="#FFF" />
                  </View>
                  <Text style={styles.quickText}>Quiz History</Text>
                </TouchableOpacity>

            
              </View>
            </View>

            {/* Account Status */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Account Status</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <Ionicons 
                    name={user?.verified ? "checkmark-circle" : "close-circle"} 
                    size={20} 
                    color={user?.verified ? "#4CAF50" : "#EF4444"} 
                  />
                  <Text style={styles.statusText}>
                    {user?.verified ? "Verified Account" : "Unverified Account"}
                  </Text>
                </View>
                {isStudent && (
                <View style={styles.statusItem}>
                  <Ionicons name="shield-checkmark" size={20} color="#4199c7" />
                  <Text style={styles.statusText}>Student Account</Text>
                </View>
                )}
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>User ID: {user?._id?.substring(0, 8)}...</Text>
              <Text style={styles.footerText}>Quiz Master v1.0</Text>
            </View>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#041E42",
  },
  content: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#041E42",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  editButton: {
    padding: 4,
  },
  profileCard: {
    backgroundColor: "#FFF",
    margin: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#041E42",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#E3F2FD",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFF",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 2,
  },
  editContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#041E42",
    width: "100%",
    marginBottom: 12,
    textAlign: "center",
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#4199c7",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#6B7280",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
  },
  cancelButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#041E42",
    marginBottom: 4,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 8,
    textAlign: "center",
  },
  memberSince: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  memberSinceText: {
    fontSize: 12,
    color: "#6B7280",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 16,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#041E42",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  menuSection: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#041E42",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#041E42",
  },
  editFieldButton: {
    padding: 6,
  },
  performanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  performanceItem: {
    width: '45%',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  progressSection: {
    gap: 12,
  },
  progressItem: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickAction: {
    alignItems: "center",
    flex: 1,
  },
  quickIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
    textAlign: "center",
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
});

export default Profile;