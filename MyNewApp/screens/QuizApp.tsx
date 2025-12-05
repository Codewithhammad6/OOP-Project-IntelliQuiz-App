
// import React, { useState, useEffect, useRef, use } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   Animated,
//   TextInput,
//   KeyboardAvoidingView,
//   Platform,
//   BackHandler,
// } from 'react-native';
// import userStore from '../store/userStore';
// import quizStore from '../store/quizStore.ts';

// // // Constants
// // const QUIZ_DATA = [
// //   {
// //     quizCode: "O",
// //     quizName: "Tet",
// //     totalMarks: 100,
// //     passingMarks: 40,
// //     timePerQuestion: 4,
// //     marksPerQuestion: 25,
// //     className: "SS1",
// //     subject: "General",
// //     questions: [
// //       {
// //         question: "What is the capital of France?",
// //         options: ["London", "Berlin", "Paris", "Madrid"],
// //         correctAnswer: 2,
// //       },
// //       {
// //         question: "Which planet is known as the Red Planet?",
// //         options: ["Venus", "Mars", "Jupiter", "Saturn"],
// //         correctAnswer: 1,
// //       },
// //       {
// //         question: "What is 2 + 2?",
// //         options: ["3", "4", "5", "6"],
// //         correctAnswer: 1,
// //       },
// //       {
// //         question: "Who wrote 'Romeo and Juliet'?",
// //         options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
// //         correctAnswer: 1,
// //       }
// //     ]
// //   },
// //   {
// //     quizCode: "SCI",
// //     quizName: "Science Quiz",
// //     totalMarks: 100,
// //     passingMarks: 50,
// //     timePerQuestion: 15,
// //     marksPerQuestion: 20,
// //     className: "SS1",
// //     subject: "Science",
// //     questions: [
// //       {
// //         question: "What is H2O?",
// //         options: ["Oxygen", "Carbon Dioxide", "Water", "Hydrogen"],
// //         correctAnswer: 2,
// //       },
// //       {
// //         question: "Which gas do plants absorb?",
// //         options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
// //         correctAnswer: 1,
// //       },
// //       {
// //         question: "What is the largest planet in our solar system?",
// //         options: ["Earth", "Saturn", "Jupiter", "Mars"],
// //         correctAnswer: 2,
// //       },
// //       {
// //         question: "How many bones are in the human body?",
// //         options: ["106", "206", "306", "406"],
// //         correctAnswer: 1,
// //       },
// //       {
// //         question: "What is the chemical symbol for gold?",
// //         options: ["Go", "Gd", "Au", "Ag"],
// //         correctAnswer: 2,
// //       }
// //     ]
// //   },
// //   {
// //     quizCode: "MA",
// //     quizName: "Mathatics Challenge",
// //     totalMarks: 100,
// //     passingMarks: 60,
// //     timePerQuestion: 3,
// //     marksPerQuestion: 10,
// //     className: "SS1",
// //     subject: "Mathematics",
// //     questions: [
// //       {
// //         question: "What is 15 × 3?",
// //         options: ["35", "40", "45", "50"],
// //         correctAnswer: 2,
// //       },
// //       {
// //         question: "What is the square root of 64?",
// //         options: ["6", "7", "8", "9"],
// //         correctAnswer: 2,
// //       },
// //       {
// //         question: "Solve: 2x + 5 = 15",
// //         options: ["x = 5", "x = 10", "x = 15", "x = 20"],
// //         correctAnswer: 0,
// //       },
// //       {
// //         question: "What is 3/4 as a percentage?",
// //         options: ["25%", "50%", "75%", "100%"],
// //         correctAnswer: 2,
// //       },
// //       {
// //         question: "What is the area of a rectangle with length 8 and width 5?",
// //         options: ["13", "26", "40", "45"],
// //         correctAnswer: 2,
// //       }
// //     ]
// //   }
// // ];

// const QuizApp = ({navigation}) => {
//   // State
//   const [currentQuizIndex, setCurrentQuizIndex] = useState(null);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [quizStarted, setQuizStarted] = useState(false);
//   const [quizCompleted, setQuizCompleted] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [savingResult, setSavingResult] = useState(false);
//   const [quizCodeInput, setQuizCodeInput] = useState('');
//   const [showQuizDetails, setShowQuizDetails] = useState(false);
//   const [quizInProgress, setQuizInProgress] = useState(false);
  
//   // Refs and store
//   const progress = useRef(new Animated.Value(0)).current;
//   const backHandler = useRef(null);
//   const {getUser, user, quizResult } = userStore();
//   const {quizzes,loading, getAllQuizzes} = quizStore();

//   // Use a ref to track the actual score to avoid state timing issues
//   const actualScoreRef = useRef(0);
//   const QUIZ_DATA = quizzes;

//   // Derived data
//   const currentQuiz = currentQuizIndex !== null ? QUIZ_DATA[currentQuizIndex] : null;
  
//   // Check if quiz is already attempted from user store
//   const isQuizAttempted = (quizCode) => {
//     return user?.quizzes?.some(quiz => quiz.quizCode === quizCode) || false;
//   };

//   const isAttempted = currentQuiz ? isQuizAttempted(currentQuiz.quizCode) : false;

//   // Get previous attempt results
//   const getPreviousAttempt = (quizCode) => {
//     return user?.quizzes?.find(quiz => quiz.quizCode === quizCode) || null;
//   };

//   const previousAttempt = currentQuiz ? getPreviousAttempt(currentQuiz.quizCode) : null;

//   // Effects (remain the same)
//   useEffect(() => {
//     getAllQuizzes()
//     getUser()
//     if (quizStarted && !quizCompleted) {
//       backHandler.current = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
//     } else if (backHandler.current) {
//       backHandler.current.remove();
//     }

//     return () => {
//       if (backHandler.current) {
//         backHandler.current.remove();
//       }
//     };
//   }, [quizStarted, quizCompleted]);

//   useEffect(() => {
//     if (currentQuiz && quizStarted && !quizCompleted && timeLeft > 0) {
//       const timer = setTimeout(() => {
//         setTimeLeft(timeLeft - 1);
//         updateProgressBar();
//       }, 1000);

//       return () => clearTimeout(timer);
//     } else if (timeLeft === 0 && quizStarted && !quizCompleted) {
//       handleTimeUp();
//     }
//   }, [timeLeft, quizStarted, quizCompleted, currentQuizIndex]);

//   // Handlers
//   const handleBackPress = () => {
//     Alert.alert(
//       "Quiz in Progress",
//       "You cannot go back during the quiz. You must complete it.",
//       [{ text: "OK" }]
//     );
//     return true;
//   };

//   const updateProgressBar = () => {
//     Animated.timing(progress, {
//       toValue: (currentQuiz.timePerQuestion - timeLeft) / currentQuiz.timePerQuestion,
//       duration: 1000,
//       useNativeDriver: false,
//     }).start();
//   };

//   const calculateMarks = () => {
//     if (!currentQuiz) return 0;
//     // Use the ref value which is always up-to-date
//     const finalScore = actualScoreRef.current;
//     const calculatedMarks = finalScore * currentQuiz.marksPerQuestion;
//     console.log(`Calculating marks: ${finalScore} correct × ${currentQuiz.marksPerQuestion} = ${calculatedMarks}`);
//     return calculatedMarks;
//   };

//   const handleQuizCodeSubmit = () => {
//     const code = quizCodeInput.trim().toUpperCase();
    
//     if (!code) {
//       Alert.alert('Error', 'Please enter a quiz code');
//       return;
//     }

//     const quizIndex = QUIZ_DATA.findIndex(quiz => quiz.quizCode === code);

//     if (quizIndex === -1) {
//       Alert.alert('Invalid Quiz Code', `No quiz found with code: ${code}`, [{ text: 'OK' }]);
//       return;
//     }

//     const quiz = QUIZ_DATA[quizIndex];
    
//     if (isQuizAttempted(quiz.quizCode)) {
//       Alert.alert(
//         "Quiz Already Attempted",
//         "You have already attempted this quiz. You cannot take it again.",
//         [{ text: "OK" }]
//       );
//       return;
//     }

//     setCurrentQuizIndex(quizIndex);
//     setShowQuizDetails(true);
//     setQuizCodeInput('');
//   };

//   const backToCodeInput = () => {
//     if (quizStarted && !quizCompleted) {
//       Alert.alert(
//         "Quiz in Progress",
//         "You cannot go back during the quiz. You must complete it.",
//         [{ text: "OK" }]
//       );
//       return;
//     }
//     setShowQuizDetails(false);
//     setCurrentQuizIndex(null);
//     setQuizInProgress(false);
//   };

//   const handleQuizCompletion = async () => {
//     if (!currentQuiz || isAttempted || savingResult) return;

//     try {
//       setSavingResult(true);
//       const calculatedMarks = calculateMarks();
      
//       const resultData = {
//         quizCode: currentQuiz.quizCode,
//         className: currentQuiz.className,
//         subject: currentQuiz.subject,
//         quizName: currentQuiz.quizName,
//         obtainedMarks: calculatedMarks,
//         totalMarks: currentQuiz.totalMarks,
//         status: calculatedMarks >= currentQuiz.passingMarks ? 'PASSED' : 'FAILED'
//       };

//       console.log('Saving quiz result:', resultData);
//       await quizResult(resultData);
      
//     } catch (error) {
//       console.log('Error saving quiz result:', error);
//       Alert.alert('Sorry', 'Already attempted this quiz.', [
//         {
//           text: 'OK',
//           onPress: () => navigation.navigate('Home'),
//         },
//       ]);
//     } finally {
//       setSavingResult(false);
//     }
//   };

//   const startQuiz = () => {
//     Alert.alert(
//       "Start Quiz?",
//       `Once started, you cannot go back or pause the quiz.\n\nYou have ${currentQuiz.timePerQuestion} seconds per question.\n\nAre you ready to begin?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Start Quiz", 
//           onPress: () => {
//             // Reset both state and ref
//             setScore(0);
//             actualScoreRef.current = 0;
//             setCurrentQuestion(0);
//             setSelectedOption(null);
//             setQuizCompleted(false);
//             setTimeLeft(currentQuiz.timePerQuestion);
//             progress.setValue(0);
//             setQuizStarted(true);
//             setQuizInProgress(true);
            
//             console.log(`Quiz started. Total questions: ${currentQuiz.questions.length}`);
//           }
//         }
//       ]
//     );
//   };

//   const handleTimeUp = () => {
//     if (selectedOption !== null) return;
//     Alert.alert("Time's Up!", "Moving to next question...");
//     handleNextQuestion();
//   };

//   const handleAnswer = (optionIndex) => {
//     if (selectedOption !== null) return;
    
//     setSelectedOption(optionIndex);
    
//     // Update both state and ref simultaneously
//     const isCorrect = optionIndex === currentQuiz.questions[currentQuestion].correctAnswer;
    
//     if (isCorrect) {
//       const newScore = score + 1;
//       setScore(newScore);
//       actualScoreRef.current = newScore;
      
//       console.log(`Question ${currentQuestion + 1}: Selected ${optionIndex}, Correct: ${currentQuiz.questions[currentQuestion].correctAnswer}, Score: ${newScore}`);
//     } else {
//       console.log(`Question ${currentQuestion + 1}: Selected ${optionIndex}, Correct: ${currentQuiz.questions[currentQuestion].correctAnswer}, Score: ${score}`);
//     }

//     setTimeout(() => {
//       handleNextQuestion();
//     }, 1000);
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestion < currentQuiz.questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//       setTimeLeft(currentQuiz.timePerQuestion);
//       setSelectedOption(null);
//       progress.setValue(0);
//     } else {
//       console.log(`Final Score: ${actualScoreRef.current}/${currentQuiz.questions.length}`);
//       setQuizCompleted(true);
//       setQuizStarted(false);
//       setQuizInProgress(false);
//       handleQuizCompletion();
//     }
//   };

//   const getOptionStyle = (optionIndex) => {
//     if (selectedOption === null) return styles.option;
    
//     if (optionIndex === currentQuiz.questions[currentQuestion].correctAnswer) {
//       return styles.correctOption;
//     }
    
//     if (optionIndex === selectedOption && optionIndex !== currentQuiz.questions[currentQuestion].correctAnswer) {
//       return styles.wrongOption;
//     }
    
//     return styles.option;
//   };

//   const getOptionTextStyle = (optionIndex) => {
//     if (selectedOption !== null && (
//         optionIndex === currentQuiz.questions[currentQuestion].correctAnswer || 
//         optionIndex === selectedOption
//       )) {
//       return styles.optionTextSelected;
//     }
//     return styles.optionText;
//   };

//   const progressWidth = progress.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0%', '100%'],
//   });

//   const getStatusColor = (marks, passingMarks) => {
//     return marks >= passingMarks ? '#4CAF50' : '#FF6B6B';
//   };

//   const getStatusText = (marks, passingMarks) => {
//     return marks >= passingMarks ? 'PASSED' : 'FAILED';
//   };


//   // Render Methods
//   const renderQuizCodeInput = () => (
//     <KeyboardAvoidingView 
//       style={styles.container} 
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Secure Quiz App</Text>
//           <Text style={styles.subtitle}>Enter your quiz code to begin</Text>
//         </View>
        
//         <View style={styles.codeInputContainer}>
//           <View style={styles.inputCard}>
//             <Text style={styles.inputLabel}>Enter Quiz Code</Text>
//             <TextInput
//               style={styles.textInput}
//               value={quizCodeInput}
//               onChangeText={setQuizCodeInput}
//               placeholder="Enter quiz code"
//               placeholderTextColor="#999"
//               autoCapitalize="characters"
//               autoCorrect={false}
//               maxLength={10}
//               textAlign="left"
//             />
            
//             <TouchableOpacity 
//               style={[
//                 styles.submitButton,
//                 !quizCodeInput.trim() && styles.submitButtonDisabled
//               ]} 
//               onPress={handleQuizCodeSubmit}
//               disabled={!quizCodeInput.trim()}
//             >
//               <Text style={styles.submitButtonText}>Continue to Quiz</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.securityInfo}>
//           <Text style={styles.securityTitle}>🔒 Security Features:</Text>
//           <Text style={styles.securityText}>• One attempt per quiz</Text>
//           <Text style={styles.securityText}>• No back navigation during quiz</Text>
//           <Text style={styles.securityText}>• Auto-submit on time completion</Text>
//           <Text style={styles.securityText}>• Results saved automatically</Text>
//         </View>

//       </ScrollView>
//     </KeyboardAvoidingView>
//   );

//   const renderQuizDetails = () => (
//     <ScrollView>
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Quiz Details</Text>
//         <Text style={styles.subtitle}>Review quiz information before starting</Text>
//       </View>
      
//       <View style={styles.quizDetailsCard}>
//         <Text style={styles.quizName}>{currentQuiz.quizName}</Text>
//         <Text style={styles.quizSubject}>Subject: {currentQuiz.subject}</Text>
//         <Text style={styles.quizCode}>Code: {currentQuiz.quizCode}</Text>
        
//         <View style={styles.detailsGrid}>
//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Total Questions</Text>
//             <Text style={styles.detailValue}>{currentQuiz.questions.length}</Text>
//           </View>
//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Time per Question</Text>
//             <Text style={styles.detailValue}>{currentQuiz.timePerQuestion}s</Text>
//           </View>
//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Marks per Question</Text>
//             <Text style={styles.detailValue}>{currentQuiz.marksPerQuestion}</Text>
//           </View>
//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Total Marks</Text>
//             <Text style={styles.detailValue}>{currentQuiz.totalMarks}</Text>
//           </View>
//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Passing Marks</Text>
//             <Text style={styles.detailValue}>{currentQuiz.passingMarks}</Text>
//           </View>
//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Duration</Text>
//             <Text style={styles.detailValue}>
//               {currentQuiz.questions.length * currentQuiz.timePerQuestion}s
//             </Text>
//           </View>
//         </View>

//         <View style={styles.warningBox}>
//           <Text style={styles.warningTitle}>⚠️ Important Instructions:</Text>
//           <Text style={styles.warningText}>• Once started, you cannot go back</Text>
//           <Text style={styles.warningText}>• Back button will be disabled</Text>
//           <Text style={styles.warningText}>• You have only one attempt</Text>
//           <Text style={styles.warningText}>• Quiz auto-submits when time ends</Text>
//         </View>
//       </View>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.backButton} onPress={backToCodeInput}>
//           <Text style={styles.backButtonText}>← Enter Different Code</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
//           <Text style={styles.startButtonText}>Start Quiz Now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//     </ScrollView>
//   );

//   const renderActiveQuiz = () => (
//     <ScrollView>
//     <View style={styles.secureContainer}>
//       <View style={styles.secureHeader}>
//         <View style={styles.quizInfoSecure}>
//           <Text style={styles.quizTitleSecure}>{currentQuiz.quizName}</Text>
//           <Text style={styles.quizSubjectSecure}>{currentQuiz.subject}</Text>
//         </View>
//         <View style={styles.secureBadge}>
//           <Text style={styles.secureBadgeText}>SECURE MODE</Text>
//         </View>
//       </View>

//       <View style={styles.quizStatsSecure}>
//         <View style={styles.timerContainerSecure}>
//           <Text style={styles.timerText}>{timeLeft}s</Text>
//           <View style={styles.timerBackground}>
//             <Animated.View style={[styles.timerProgress, { width: progressWidth }]} />
//           </View>
//         </View>
        
//         <View style={styles.scoreContainerSecure}>
//           <Text style={styles.scoreText}>Q: {currentQuestion + 1}/{currentQuiz.questions.length}</Text>
//           <Text style={styles.scoreText}>Score: {score}</Text>
//         </View>
//       </View>

//       <View style={styles.questionContainerSecure}>
//         <Text style={styles.questionTextSecure}>
//           {currentQuiz.questions[currentQuestion].question}
//         </Text>
//         <Text style={styles.marksIndicatorSecure}>Marks: {currentQuiz.marksPerQuestion}</Text>
//       </View>

//       <View style={styles.optionsContainerSecure}>
//         {currentQuiz.questions[currentQuestion].options.map((option, index) => (
//           <TouchableOpacity
//             key={index}
//             style={getOptionStyle(index)}
//             onPress={() => handleAnswer(index)}
//             disabled={selectedOption !== null}
//           >
//             <Text style={getOptionTextStyle(index)}>
//               {String.fromCharCode(65 + index)}. {option}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <View style={styles.securityWarning}>
//         <Text style={styles.securityWarningText}>
//           🔒 Back button disabled • Auto-submit enabled • One attempt only
//         </Text>
//       </View>
//     </View>
//     </ScrollView>
//   );

//   const renderCompletedQuiz = () => {
//     const finalMarks = calculateMarks();
    
//     return (
//       <ScrollView>
//       <View style={styles.container}>
//         <View style={styles.completedContainer}>
//           <Text style={styles.completedTitle}>Quiz Completed!</Text>
//           <Text style={styles.quizName}>{currentQuiz.quizName}</Text>
//           <Text style={styles.quizSubject}>Subject: {currentQuiz.subject}</Text>
          
//           <View style={[styles.statusBadge, { backgroundColor: getStatusColor(finalMarks, currentQuiz.passingMarks) }]}>
//             <Text style={styles.statusText}>{getStatusText(finalMarks, currentQuiz.passingMarks)}</Text>
//           </View>
          
//           <View style={styles.scoreCircle}>
//             <Text style={styles.finalScore}>
//               {finalMarks}/{currentQuiz.totalMarks}
//             </Text>
//             <Text style={styles.finalPercentage}>
//               {((finalMarks / currentQuiz.totalMarks) * 100).toFixed(1)}%
//             </Text>
//           </View>
          
//           <View style={styles.detailedResults}>
//             <Text style={styles.detailedTitle}>Detailed Results:</Text>
//             <View style={styles.resultRow}>
//               <Text style={styles.resultLabel}>Correct Answers:</Text>
//               <Text style={styles.resultValue}>{score}/{currentQuiz.questions.length}</Text>
//             </View>
//             <View style={styles.resultRow}>
//               <Text style={styles.resultLabel}>Marks per Question:</Text>
//               <Text style={styles.resultValue}>{currentQuiz.marksPerQuestion}</Text>
//             </View>
//             <View style={styles.resultRow}>
//               <Text style={styles.resultLabel}>Total Obtained:</Text>
//               <Text style={styles.resultValue}>{finalMarks} marks</Text>
//             </View>
//           </View>
          
//           <View style={styles.successMessage}>
//             <Text style={styles.successText}>✅ Result saved to your profile!</Text>
//           </View>
          
//           <View style={styles.attemptNotice}>
//             <Text style={styles.attemptNoticeText}>
//               ✓ This was your one and only attempt
//             </Text>
//             <Text style={styles.attemptNoticeText}>
//               ✓ You cannot retake this quiz
//             </Text>
//           </View>
          
//           <TouchableOpacity 
//             style={styles.goBackButton} 
//             onPress={() => {
//               setShowQuizDetails(false);
//               setCurrentQuizIndex(null);
//               setQuizCompleted(false);
//             }}
//           >
//             <Text style={styles.goBackButtonText}>← Go Back to Quiz Codes</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       </ScrollView>
//     );
//   };

//   const renderPreviousAttempt = () => {
//     const attempt = previousAttempt;
    
//     return (
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Quiz Completed</Text>
//           <Text style={styles.subtitle}>You have already attempted this quiz</Text>
//         </View>
        
//         <View style={styles.resultContainer}>
//           <Text style={styles.quizName}>{currentQuiz.quizName}</Text>
//           <Text style={styles.quizSubject}>Subject: {currentQuiz.subject}</Text>
          
//           <View style={[styles.statusBadge, { backgroundColor: getStatusColor(attempt.obtainedMarks, currentQuiz.passingMarks) }]}>
//             <Text style={styles.statusText}>{getStatusText(attempt.obtainedMarks, currentQuiz.passingMarks)}</Text>
//           </View>
          
//           <View style={styles.marksContainer}>
//             <View style={styles.marksRow}>
//               <Text style={styles.marksLabel}>Obtained Marks:</Text>
//               <Text style={styles.marksValue}>{attempt.obtainedMarks}/{currentQuiz.totalMarks}</Text>
//             </View>
//             <View style={styles.marksRow}>
//               <Text style={styles.marksLabel}>Percentage:</Text>
//               <Text style={styles.marksValue}>
//                 {((attempt.obtainedMarks / currentQuiz.totalMarks) * 100).toFixed(1)}%
//               </Text>
//             </View>
//             <View style={styles.marksRow}>
//               <Text style={styles.marksLabel}>Attempted On:</Text>
//               <Text style={styles.marksValue}>
//                 {new Date(attempt.attemptedAt).toLocaleDateString()}
//               </Text>
//             </View>
//           </View>
          
//           <View style={styles.attemptInfo}>
//             <Text style={styles.attemptText}>✓ Quiz completed successfully</Text>
//             <Text style={styles.attemptText}>✓ One attempt allowed per student</Text>
//             <Text style={styles.attemptText}>✓ Result saved to your profile</Text>
//           </View>

//           <TouchableOpacity 
//             style={styles.goBackButton} 
//             onPress={backToCodeInput}
//           >
//             <Text style={styles.goBackButtonText}>← Try Another Quiz</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   // Main render logic
//   if (!showQuizDetails && currentQuizIndex === null) {
//     return renderQuizCodeInput();
//   }

//   if (showQuizDetails && !quizStarted && !quizCompleted) {
//     if (isAttempted) {
//       return renderPreviousAttempt();
//     }
//     return renderQuizDetails();
//   }

//   if (quizStarted && !quizCompleted) {
//     return renderActiveQuiz();
//   }

//   if (quizCompleted && savingResult) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.completedContainer}>
//           <Text style={styles.completedTitle}>Saving Result...</Text>
//           <Text style={styles.subtitle}>Please wait while we save your quiz result</Text>
//         </View>
//       </View>
//     );
//   }

//   if (quizCompleted && !savingResult) {
//     return renderCompletedQuiz();
//   }

//   return null;
// };

// const styles = StyleSheet.create({
//   goBackButton: {
//     backgroundColor: '#6c757d',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   goBackButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '500',
//   },

//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     padding: 20,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#041E42',
//     marginBottom: 5,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//   },

//   codeInputContainer: {
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   inputCard: {
//     backgroundColor: '#fff',
//     padding: 25,
//     borderRadius: 20,
//     width: '100%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
 
//   inputLabel: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#041E42',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   textInput: {
//     borderWidth: 2,
//     borderColor: '#041E42',
//     borderRadius: 12,
//     padding: 15,
//     fontSize: 16,
//     backgroundColor: '#fff',
//     color: '#041E42',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   submitButton: {
//     backgroundColor: '#041E42',
//     paddingVertical: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   submitButtonDisabled: {
//     backgroundColor: '#ccc',
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   // Security Info
//   securityInfo: {
//     backgroundColor: '#e8f4fd',
//     padding: 20,
//     borderRadius: 15,
//     marginBottom: 20,
//     borderLeftWidth: 4,
//     borderLeftColor: '#041E42',
//   },
//   securityTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#041E42',
//     marginBottom: 10,
//   },
//   securityText: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 5,
//   },
//   // Quiz Details
//   quizDetailsCard: {
//     backgroundColor: '#fff',
//     padding: 25,
//     borderRadius: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   quizName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#041E42',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   quizSubject: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   quizCode: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   detailsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   detailItem: {
//     width: '48%',
//     backgroundColor: '#f8f9fa',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   detailLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 5,
//   },
//   detailValue: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#041E42',
//   },
//   warningBox: {
//     backgroundColor: '#fff3cd',
//     padding: 15,
//     borderRadius: 10,
//     borderLeftWidth: 4,
//     borderLeftColor: '#ffc107',
//   },
//   warningTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#856404',
//     marginBottom: 8,
//   },
//   warningText: {
//     fontSize: 12,
//     color: '#856404',
//     marginBottom: 4,
//   },
//   // Secure Quiz Styles
//   secureContainer: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   secureHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#041E42',
//     padding: 15,
//     paddingTop: Platform.OS === 'ios' ? 50 : 15,
//   },
//   quizInfoSecure: {
//     flex: 1,
//   },
//   quizTitleSecure: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   quizSubjectSecure: {
//     fontSize: 14,
//     color: '#ccc',
//   },
//   secureBadge: {
//     backgroundColor: '#dc3545',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 12,
//   },
//   secureBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   quizStatsSecure: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   timerContainerSecure: {
//     alignItems: 'center',
//   },
//   timerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#041E42',
//     marginBottom: 5,
//   },
//   timerBackground: {
//     width: 100,
//     height: 8,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   timerProgress: {
//     height: '100%',
//     backgroundColor: '#FF6B6B',
//   },
//   scoreContainerSecure: {
//     alignItems: 'flex-end',
//   },
//   scoreText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#041E42',
//     marginBottom: 5,
//   },
//   questionContainerSecure: {
//     backgroundColor: '#fff',
//     padding: 25,
//     margin: 15,
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   questionTextSecure: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333',
//     lineHeight: 28,
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   marksIndicatorSecure: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     fontStyle: 'italic',
//   },
//   optionsContainerSecure: {
//     padding: 15,
//   },
//   securityWarning: {
//     backgroundColor: '#dc3545',
//     padding: 10,
//     margin: 15,
//     borderRadius: 8,
//   },
//   securityWarningText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   // Buttons
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     gap: 10,
//   },
//   backButton: {
//     backgroundColor: '#6c757d',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     alignItems: 'center',
//     flex: 1,
//   },
//   backButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   startButton: {
//     backgroundColor: '#041E42',
//     paddingVertical: 15,
//     paddingHorizontal: 25,
//     borderRadius: 25,
//     flex: 1,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   startButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   // Options
//   option: {
//     backgroundColor: '#fff',
//     padding: 18,
//     borderRadius: 12,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   correctOption: {
//     backgroundColor: '#4CAF50',
//     padding: 18,
//     borderRadius: 12,
//     marginBottom: 12,
//     borderWidth: 2,
//     borderColor: '#45a049',
//   },
//   wrongOption: {
//     backgroundColor: '#FF6B6B',
//     padding: 18,
//     borderRadius: 12,
//     marginBottom: 12,
//     borderWidth: 2,
//     borderColor: '#ff5252',
//   },
//   optionText: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
//   optionTextSelected: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '500',
//   },
//   // Quiz Results
//   quizNameHeader: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#041E42',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   quizInfo: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 15,
//     marginBottom: 30,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   quizInfoText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 8,
//   },
//   resultContainer: {
//     backgroundColor: '#fff',
//     padding: 25,
//     borderRadius: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   statusBadge: {
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginBottom: 20,
//   },
//   statusText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   marksContainer: {
//     width: '100%',
//     marginBottom: 20,
//   },
//   marksRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   marksLabel: {
//     fontSize: 16,
//     color: '#666',
//   },
//   marksValue: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#041E42',
//   },
//   percentageCircle: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#041E42',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   percentageText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   attemptInfo: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   attemptText: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 8,
//   },
//   resetButton: {
//     backgroundColor: '#FF6B6B',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 20,
//     marginTop: 30,
//   },
//   resetButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   completedContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   completedTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#041E42',
//     marginBottom: 10,
//   },
//   scoreCircle: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     backgroundColor: '#4CAF50',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   finalScore: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   finalPercentage: {
//     fontSize: 18,
//     color: '#fff',
//     marginTop: 5,
//   },
//   detailedResults: {
//     width: '100%',
//     backgroundColor: '#f8f9fa',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   detailedTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#041E42',
//     marginBottom: 10,
//   },
//   resultRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 5,
//   },
//   resultLabel: {
//     fontSize: 14,
//     color: '#666',
//   },
//   resultValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#041E42',
//   },
//   attemptNotice: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   attemptNoticeText: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 8,
//   },
//   quizInfoBar: {
//     backgroundColor: '#041E42',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   quizNameSmall: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 5,
//   },
//   marksInfo: {
//     fontSize: 14,
//     color: '#fff',
//     opacity: 0.9,
//   },
//   questionContainer: {
//     backgroundColor: '#fff',
//     padding: 25,
//     borderRadius: 20,
//     marginBottom: 30,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   questionText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333',
//     lineHeight: 28,
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   marksIndicator: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     fontStyle: 'italic',
//   },
//   noticeContainer: {
//     backgroundColor: '#FFF3CD',
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 20,
//     borderLeftWidth: 4,
//     borderLeftColor: '#FFC107',
//   },
//   noticeText: {
//     color: '#856404',
//     fontSize: 12,
//     fontWeight: '500',
//     textAlign: 'center',
//   },
//   quizHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//     marginTop: 10,
//   },
//   timerContainer: {
//     alignItems: 'center',
//   },
//   scoreContainer: {
//     alignItems: 'flex-end',
//   },
//   questionCount: {
//     fontSize: 14,
//     color: '#666',
//   },
//   optionsContainer: {
//     marginBottom: 30,
//   },
//   progressContainer: {
//     marginTop: 20,
//   },
//   progressBackground: {
//     width: '100%',
//     height: 6,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   progressBar: {
//     height: '100%',
//     backgroundColor: '#041E42',
//   },
//   successMessage: {
//     backgroundColor: '#d4edda',
//     padding: 15,
//     borderRadius: 10,
//     marginVertical: 10,
//     borderLeftWidth: 4,
//     borderLeftColor: '#28a745',
//   },
//   successText: {
//     color: '#155724',
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
// });

// export default QuizApp;












import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  AppState,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import userStore from '../store/userStore';
import quizStore from '../store/quizStore.ts';

const QuizApp = ({navigation}) => {
  // State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [savingResult, setSavingResult] = useState(false);
  const [quizCodeInput, setQuizCodeInput] = useState('');
  const [showQuizDetails, setShowQuizDetails] = useState(false);
  const [quizInProgress, setQuizInProgress] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [violationCount, setViolationCount] = useState(0);
  
  // Refs and store
  const progress = useRef(new Animated.Value(0)).current;
  const backHandlerSubscription = useRef(null);
  const appStateHandler = useRef(null);
  const violationTimer = useRef(null);
  const {getUser, user, quizResult } = userStore();
  const {quizzes,loading, getAllQuizzes} = quizStore();

  // Use a ref to track the actual score to avoid state timing issues
  const actualScoreRef = useRef(0);
  const QUIZ_DATA = quizzes;

  // Derived data
  const currentQuiz = currentQuizIndex !== null ? QUIZ_DATA[currentQuizIndex] : null;
  
  // Check if quiz is already attempted from user store
  const isQuizAttempted = (quizCode) => {
    return user?.quizzes?.some(quiz => quiz.quizCode === quizCode) || false;
  };

  const isAttempted = currentQuiz ? isQuizAttempted(currentQuiz.quizCode) : false;

  // Get previous attempt results
  const getPreviousAttempt = (quizCode) => {
    return user?.quizzes?.find(quiz => quiz.quizCode === quizCode) || null;
  };

  const previousAttempt = currentQuiz ? getPreviousAttempt(currentQuiz.quizCode) : null;

  // Effects
  useEffect(() => {
    getAllQuizzes()
    getUser()
    
    // Handle app state changes (when app goes to background/foreground)
    appStateHandler.current = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      if (appStateHandler.current) {
        appStateHandler.current.remove();
      }
      // Re-enable navigation when component unmounts
      removeBackHandler();
      clearTimeout(violationTimer.current);
    };
  }, []);

  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      // Enable full lock mode
      addBackHandler();
      setViolationCount(0); // Reset violation count when quiz starts
    } else {
      // Disable lock mode
      removeBackHandler();
      clearTimeout(violationTimer.current);
    }

    return () => {
      removeBackHandler();
      clearTimeout(violationTimer.current);
    };
  }, [quizStarted, quizCompleted]);

  useEffect(() => {
    if (currentQuiz && quizStarted && !quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        updateProgressBar();
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted && !quizCompleted) {
      handleTimeUp();
    }
  }, [timeLeft, quizStarted, quizCompleted, currentQuizIndex]);

  // Enhanced Security Functions
  const enableStrictMode = () => {
    console.log('Strict security mode enabled');
    // Multiple layers of protection
    addBackHandler();
    
    // Additional protection for Android
    if (Platform.OS === 'android') {
      try {
        // Try to use Android's immersive mode
        if (NativeModules.AndroidFullScreen) {
          NativeModules.AndroidFullScreen.immersiveMode();
        }
      } catch (error) {
        console.log('Android full screen mode not available');
      }
    }
  };

  const disableStrictMode = () => {
    console.log('Strict security mode disabled');
    removeBackHandler();
    
    if (Platform.OS === 'android') {
      try {
        if (NativeModules.AndroidFullScreen) {
          NativeModules.AndroidFullScreen.showSystemUI();
        }
      } catch (error) {
        console.log('Error disabling full screen mode');
      }
    }
  };

  // BackHandler Functions
  const addBackHandler = () => {
    removeBackHandler();
    backHandlerSubscription.current = BackHandler.addEventListener(
      'hardwareBackPress', 
      handleBackPress
    );
  };

  const removeBackHandler = () => {
    if (backHandlerSubscription.current) {
      backHandlerSubscription.current.remove();
      backHandlerSubscription.current = null;
    }
  };

  // Enhanced App State Handler with Multiple Violation Detection
  const handleAppStateChange = (nextAppState) => {
    if (quizStarted && !quizCompleted) {
      if (appState.match(/active|foreground/) && nextAppState === 'background') {
        // App is going to background - DETECTED!
        const newViolationCount = violationCount + 1;
        setViolationCount(newViolationCount);
        
        if (newViolationCount === 1) {
          // First violation - warning
          Alert.alert(
            "SECURITY WARNING",
            "App switching detected! This is your first warning.\n\nReturn to the quiz immediately or it will be auto-submitted.",
            [
              {
                text: "RETURN TO QUIZ",
                onPress: () => {
                  // User acknowledged, reset violation count after delay
                  setTimeout(() => setViolationCount(0), 5000);
                }
              }
            ],
            { cancelable: false }
          );
        } else if (newViolationCount >= 2) {
          // Second violation - IMMEDIATE AUTO-SUBMIT
          clearTimeout(violationTimer.current);
          Alert.alert(
            "QUIZ TERMINATED",
            "Multiple security violations detected! Your quiz has been automatically submitted.",
            [
              {
                text: "OK",
                onPress: () => {
                  forceSubmitQuizWithViolation();
                }
              }
            ],
            { cancelable: false }
          );
        }
        
        // Auto-submit after 5 seconds if they don't return
        clearTimeout(violationTimer.current);
        violationTimer.current = setTimeout(() => {
          if (quizStarted && !quizCompleted) {
            forceSubmitQuizWithViolation();
          }
        }, 5000);
      } else if (appState === 'background' && nextAppState === 'active') {
        // App came back to foreground - clear violation timer
        clearTimeout(violationTimer.current);
      }
    }
    setAppState(nextAppState);
  };

  // Force submit quiz when security violation detected
  const forceSubmitQuizWithViolation = () => {
    if (!currentQuiz || quizCompleted) return;
    
    console.log(`Security violation - Auto-submitting quiz. Current score: ${actualScoreRef.current}`);
    setQuizCompleted(true);
    setQuizStarted(false);
    setQuizInProgress(false);
    disableStrictMode();
    removeBackHandler();
    clearTimeout(violationTimer.current);
    handleQuizCompletionWithViolation();
  };

  const forceSubmitQuiz = () => {
    if (!currentQuiz || quizCompleted) return;
    
    console.log(`Auto-submitting quiz. Current score: ${actualScoreRef.current}`);
    setQuizCompleted(true);
    setQuizStarted(false);
    setQuizInProgress(false);
    disableStrictMode();
    removeBackHandler();
    clearTimeout(violationTimer.current);
    handleQuizCompletion();
  };

  // Handlers
  const handleBackPress = () => {
    if (quizStarted && !quizCompleted) {
      Alert.alert(
        "QUIZ LOCKED",
        "You cannot exit the quiz once started. All navigation is disabled.\n\nYou must complete the quiz to exit.",
        [{ text: "CONTINUE QUIZ" }],
        { cancelable: false }
      );
      return true;
    }
    return false;
  };

  const updateProgressBar = () => {
    Animated.timing(progress, {
      toValue: (currentQuiz.timePerQuestion - timeLeft) / currentQuiz.timePerQuestion,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const calculateMarks = () => {
    if (!currentQuiz) return 0;
    const finalScore = actualScoreRef.current;
    const calculatedMarks = finalScore * currentQuiz.marksPerQuestion;
    return calculatedMarks;
  };

  const handleQuizCodeSubmit = () => {
    const code = quizCodeInput.trim().toUpperCase();
    
    if (!code) {
      Alert.alert('Error', 'Please enter a quiz code');
      return;
    }

    const quizIndex = QUIZ_DATA.findIndex(quiz => quiz.quizCode === code);

    if (quizIndex === -1) {
      Alert.alert('Invalid Quiz Code', `No quiz found with code: ${code}`, [{ text: 'OK' }]);
      return;
    }

    const quiz = QUIZ_DATA[quizIndex];
    
    if (isQuizAttempted(quiz.quizCode)) {
      Alert.alert(
        "Quiz Already Attempted",
        "You have already attempted this quiz. You cannot take it again.",
        [{ text: "OK" }]
      );
      return;
    }

    setCurrentQuizIndex(quizIndex);
    setShowQuizDetails(true);
    setQuizCodeInput('');
  };

  const backToCodeInput = () => {
    if (quizStarted && !quizCompleted) {
      Alert.alert(
        "Quiz in Progress",
        "You cannot go back during the quiz. You must complete it.",
        [{ text: "OK" }]
      );
      return;
    }
    setShowQuizDetails(false);
    setCurrentQuizIndex(null);
    setQuizInProgress(false);
  };

  const handleQuizCompletion = async () => {
    if (!currentQuiz || isAttempted || savingResult) return;

    try {
      setSavingResult(true);
      const calculatedMarks = calculateMarks();
      
      const resultData = {
        quizCode: currentQuiz.quizCode,
        className: currentQuiz.className,
        subject: currentQuiz.subject,
        quizName: currentQuiz.quizName,
        obtainedMarks: calculatedMarks,
        totalMarks: currentQuiz.totalMarks,
        status: calculatedMarks >= currentQuiz.passingMarks ? 'PASSED' : 'FAILED',
        completed: true,
        securityViolation: false
      };

      console.log('Saving quiz result:', resultData);
      await quizResult(resultData);
      
    } catch (error) {
      console.log('Error saving quiz result:', error);
      Alert.alert('Sorry', 'Already attempted this quiz.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]);
    } finally {
      setSavingResult(false);
    }
  };

  const handleQuizCompletionWithViolation = async () => {
    if (!currentQuiz || isAttempted || savingResult) return;

    try {
      setSavingResult(true);
      const calculatedMarks = calculateMarks();
      
      const resultData = {
        quizCode: currentQuiz.quizCode,
        className: currentQuiz.className,
        subject: currentQuiz.subject,
        quizName: currentQuiz.quizName,
        obtainedMarks: calculatedMarks,
        totalMarks: currentQuiz.totalMarks,
        status: 'VIOLATION',
        completed: false,
        securityViolation: true,
        violationCount: violationCount
      };

      console.log('Saving quiz result with violation:', resultData);
      await quizResult(resultData);
      
    } catch (error) {
      console.log('Error saving quiz result:', error);
    } finally {
      setSavingResult(false);
    }
  };

  const startQuiz = () => {
    Alert.alert(
      "STRICT SECURITY MODE",
      `🚫 STRICT SECURITY FEATURES:\n\n• Back button will be DISABLED\n• App switching will be DETECTED\n• Multiple violations will AUTO-SUBMIT\n• You cannot exit until quiz completion\n\nYou have ${currentQuiz.timePerQuestion} seconds per question.\n\nAre you ready to begin?`,
      [
        { text: "CANCEL", style: "cancel" },
        { 
          text: "START SECURE QUIZ", 
          onPress: () => {
            setScore(0);
            actualScoreRef.current = 0;
            setCurrentQuestion(0);
            setSelectedOption(null);
            setQuizCompleted(false);
            setTimeLeft(currentQuiz.timePerQuestion);
            progress.setValue(0);
            setQuizStarted(true);
            setQuizInProgress(true);
            setViolationCount(0);
            
            // Enable strict security mode
            enableStrictMode();
          }
        }
      ]
    );
  };

  const handleTimeUp = () => {
    if (selectedOption !== null) return;
    handleNextQuestion();
  };

  const handleAnswer = (optionIndex) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(optionIndex);
    
    const isCorrect = optionIndex === currentQuiz.questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      actualScoreRef.current = newScore;
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(currentQuiz.timePerQuestion);
      setSelectedOption(null);
      progress.setValue(0);
    } else {
      setQuizCompleted(true);
      setQuizStarted(false);
      setQuizInProgress(false);
      disableStrictMode();
      removeBackHandler();
      clearTimeout(violationTimer.current);
      handleQuizCompletion();
    }
  };

  const getOptionStyle = (optionIndex) => {
    if (selectedOption === null) return styles.option;
    
    if (optionIndex === currentQuiz.questions[currentQuestion].correctAnswer) {
      return styles.correctOption;
    }
    
    if (optionIndex === selectedOption && optionIndex !== currentQuiz.questions[currentQuestion].correctAnswer) {
      return styles.wrongOption;
    }
    
    return styles.option;
  };

  const getOptionTextStyle = (optionIndex) => {
    if (selectedOption !== null && (
        optionIndex === currentQuiz.questions[currentQuestion].correctAnswer || 
        optionIndex === selectedOption
      )) {
      return styles.optionTextSelected;
    }
    return styles.optionText;
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const getStatusColor = (marks, passingMarks) => {
    return marks >= passingMarks ? '#4CAF50' : '#FF6B6B';
  };

  const getStatusText = (marks, passingMarks) => {
    return marks >= passingMarks ? 'PASSED' : 'FAILED';
  };

  // Render Methods
  const renderQuizCodeInput = () => (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Secure Quiz App</Text>
          <Text style={styles.subtitle}>Enter your quiz code to begin</Text>
        </View>
        
        <View style={styles.codeInputContainer}>
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Enter Quiz Code</Text>
            <TextInput
              style={styles.textInput}
              value={quizCodeInput}
              onChangeText={setQuizCodeInput}
              placeholder="Enter quiz code"
              placeholderTextColor="#999"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={10}
              textAlign="left"
            />
            
            <TouchableOpacity 
              style={[styles.submitButton, !quizCodeInput.trim() && styles.submitButtonDisabled]} 
              onPress={handleQuizCodeSubmit}
              disabled={!quizCodeInput.trim()}
            >
              <Text style={styles.submitButtonText}>Continue to Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.securityInfo}>
          <Text style={styles.securityTitle}>🚫 STRICT SECURITY MODE:</Text>
          <Text style={styles.securityText}>• Back button will be DISABLED during quiz</Text>
          <Text style={styles.securityText}>• App switching will be DETECTED immediately</Text>
          <Text style={styles.securityText}>• Multiple violations will AUTO-SUBMIT quiz</Text>
          <Text style={styles.securityText}>• You cannot exit until quiz completion</Text>
          <Text style={styles.securityText}>• One attempt only per student</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderQuizDetails = () => (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Quiz Details</Text>
          <Text style={styles.subtitle}>Review quiz information before starting</Text>
        </View>
        
        <View style={styles.quizDetailsCard}>
          <Text style={styles.quizName}>{currentQuiz.quizName}</Text>
          <Text style={styles.quizSubject}>Subject: {currentQuiz.subject}</Text>
          <Text style={styles.quizCode}>Code: {currentQuiz.quizCode}</Text>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Total Questions</Text>
              <Text style={styles.detailValue}>{currentQuiz.questions.length}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Time per Question</Text>
              <Text style={styles.detailValue}>{currentQuiz.timePerQuestion}s</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Marks per Question</Text>
              <Text style={styles.detailValue}>{currentQuiz.marksPerQuestion}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Total Marks</Text>
              <Text style={styles.detailValue}>{currentQuiz.totalMarks}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Passing Marks</Text>
              <Text style={styles.detailValue}>{currentQuiz.passingMarks}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>
                {currentQuiz.questions.length * currentQuiz.timePerQuestion}s
              </Text>
            </View>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ STRICT SECURITY ACTIVE:</Text>
            <Text style={styles.warningText}>• Back button will be DISABLED</Text>
            <Text style={styles.warningText}>• App switching will be DETECTED</Text>
            <Text style={styles.warningText}>• Multiple violations will AUTO-SUBMIT</Text>
            <Text style={styles.warningText}>• You cannot exit until completion</Text>
            <Text style={styles.warningText}>• One attempt only - no retakes</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={backToCodeInput}>
            <Text style={styles.backButtonText}>← Enter Different Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
            <Text style={styles.startButtonText}>Start Secure Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderActiveQuiz = () => (
    <ScrollView>
      <View style={styles.secureContainer}>
        <View style={styles.secureHeader}>
          <View style={styles.quizInfoSecure}>
            <Text style={styles.quizTitleSecure}>{currentQuiz.quizName}</Text>
            <Text style={styles.quizSubjectSecure}>{currentQuiz.subject}</Text>
          </View>
          <View style={styles.secureBadge}>
            <Text style={styles.secureBadgeText}>SECURE MODE</Text>
          </View>
        </View>

        <View style={styles.quizStatsSecure}>
          <View style={styles.timerContainerSecure}>
            <Text style={styles.timerText}>{timeLeft}s</Text>
            <View style={styles.timerBackground}>
              <Animated.View style={[styles.timerProgress, { width: progressWidth }]} />
            </View>
          </View>
          
          <View style={styles.scoreContainerSecure}>
            <Text style={styles.scoreText}>Q: {currentQuestion + 1}/{currentQuiz.questions.length}</Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>
        </View>

        <View style={styles.questionContainerSecure}>
          <Text style={styles.questionTextSecure}>
            {currentQuiz.questions[currentQuestion].question}
          </Text>
          <Text style={styles.marksIndicatorSecure}>Marks: {currentQuiz.marksPerQuestion}</Text>
        </View>

        <View style={styles.optionsContainerSecure}>
          {currentQuiz.questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(index)}
              onPress={() => handleAnswer(index)}
              disabled={selectedOption !== null}
            >
              <Text style={getOptionTextStyle(index)}>
                {String.fromCharCode(65 + index)}. {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.securityWarning}>
          <Text style={styles.securityWarningText}>
            🚫 BACK BUTTON DISABLED • APP SWITCHING DETECTED • AUTO-SUBMIT ON VIOLATIONS
          </Text>
          {violationCount > 0 && (
            <Text style={styles.violationText}>
              Security Warnings: {violationCount}/2
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );

  // ... (other render methods like renderCompletedQuiz, renderPreviousAttempt remain similar)

  const renderCompletedQuiz = () => {
    const finalMarks = calculateMarks();
    
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.completedContainer}>
            <Text style={styles.completedTitle}>Quiz Completed!</Text>
            <Text style={styles.quizName}>{currentQuiz.quizName}</Text>
            <Text style={styles.quizSubject}>Subject: {currentQuiz.subject}</Text>
            
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(finalMarks, currentQuiz.passingMarks) }]}>
              <Text style={styles.statusText}>{getStatusText(finalMarks, currentQuiz.passingMarks)}</Text>
            </View>
            
            <View style={styles.scoreCircle}>
              <Text style={styles.finalScore}>
                {finalMarks}/{currentQuiz.totalMarks}
              </Text>
              <Text style={styles.finalPercentage}>
                {((finalMarks / currentQuiz.totalMarks) * 100).toFixed(1)}%
              </Text>
            </View>
            
            <View style={styles.detailedResults}>
              <Text style={styles.detailedTitle}>Detailed Results:</Text>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Correct Answers:</Text>
                <Text style={styles.resultValue}>{score}/{currentQuiz.questions.length}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Marks per Question:</Text>
                <Text style={styles.resultValue}>{currentQuiz.marksPerQuestion}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Obtained:</Text>
                <Text style={styles.resultValue}>{finalMarks} marks</Text>
              </View>
            </View>
            
            <View style={styles.successMessage}>
              <Text style={styles.successText}>✅ Result saved to your profile!</Text>
            </View>
            
            <View style={styles.attemptNotice}>
              <Text style={styles.attemptNoticeText}>
                ✓ Navigation has been re-enabled
              </Text>
              <Text style={styles.attemptNoticeText}>
                ✓ This was your one and only attempt
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.goBackButton} 
              onPress={() => {
                setShowQuizDetails(false);
                setCurrentQuizIndex(null);
                setQuizCompleted(false);
              }}
            >
              <Text style={styles.goBackButtonText}>← Go Back to Quiz Codes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderPreviousAttempt = () => {
    const attempt = previousAttempt;
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Quiz Completed</Text>
          <Text style={styles.subtitle}>You have already attempted this quiz</Text>
        </View>
        
        <View style={styles.resultContainer}>
          <Text style={styles.quizName}>{currentQuiz.quizName}</Text>
          <Text style={styles.quizSubject}>Subject: {currentQuiz.subject}</Text>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(attempt.obtainedMarks, currentQuiz.passingMarks) }]}>
            <Text style={styles.statusText}>{getStatusText(attempt.obtainedMarks, currentQuiz.passingMarks)}</Text>
          </View>
          
          <View style={styles.marksContainer}>
            <View style={styles.marksRow}>
              <Text style={styles.marksLabel}>Obtained Marks:</Text>
              <Text style={styles.marksValue}>{attempt.obtainedMarks}/{currentQuiz.totalMarks}</Text>
            </View>
            <View style={styles.marksRow}>
              <Text style={styles.marksLabel}>Percentage:</Text>
              <Text style={styles.marksValue}>
                {((attempt.obtainedMarks / currentQuiz.totalMarks) * 100).toFixed(1)}%
              </Text>
            </View>
            <View style={styles.marksRow}>
              <Text style={styles.marksLabel}>Attempted On:</Text>
              <Text style={styles.marksValue}>
                {new Date(attempt.attemptedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          <View style={styles.attemptInfo}>
            <Text style={styles.attemptText}>✓ Quiz completed successfully</Text>
            <Text style={styles.attemptText}>✓ One attempt allowed per student</Text>
            <Text style={styles.attemptText}>✓ Result saved to your profile</Text>
          </View>

          <TouchableOpacity 
            style={styles.goBackButton} 
            onPress={backToCodeInput}
          >
            <Text style={styles.goBackButtonText}>← Try Another Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Main render logic
  if (!showQuizDetails && currentQuizIndex === null) {
    return renderQuizCodeInput();
  }

  if (showQuizDetails && !quizStarted && !quizCompleted) {
    if (isAttempted) {
      return renderPreviousAttempt();
    }
    return renderQuizDetails();
  }

  if (quizStarted && !quizCompleted) {
    return renderActiveQuiz();
  }

  if (quizCompleted && savingResult) {
    return (
      <View style={styles.container}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedTitle}>Saving Result...</Text>
          <Text style={styles.subtitle}>Please wait while we save your quiz result</Text>
        </View>
      </View>
    );
  }

  if (quizCompleted && !savingResult) {
    return renderCompletedQuiz();
  }

  return null;
};

const styles = StyleSheet.create({
   violationText: {
    color: '#ffeb3b',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  goBackButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  goBackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },

  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  codeInputContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  inputCard: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
 
  inputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 15,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#041E42',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#041E42',
    marginBottom: 20,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#041E42',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Security Info
  securityInfo: {
    backgroundColor: '#e8f4fd',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#041E42',
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 10,
  },
  securityText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  // Quiz Details
  quizDetailsCard: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  quizName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 10,
    textAlign: 'center',
  },
  quizSubject: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  quizCode: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#041E42',
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 4,
  },
  // Secure Quiz Styles
  secureContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  secureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#041E42',
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  quizInfoSecure: {
    flex: 1,
  },
  quizTitleSecure: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  quizSubjectSecure: {
    fontSize: 14,
    color: '#ccc',
  },
  secureBadge: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  secureBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  quizStatsSecure: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerContainerSecure: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 5,
  },
  timerBackground: {
    width: 100,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    backgroundColor: '#FF6B6B',
  },
  scoreContainerSecure: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 5,
  },
  questionContainerSecure: {
    backgroundColor: '#fff',
    padding: 25,
    margin: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  questionTextSecure: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 10,
  },
  marksIndicatorSecure: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  optionsContainerSecure: {
    padding: 15,
  },
  securityWarning: {
    backgroundColor: '#dc3545',
    padding: 10,
    margin: 15,
    borderRadius: 8,
  },
  securityWarningText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#041E42',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Options
  option: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#45a049',
  },
  wrongOption: {
    backgroundColor: '#FF6B6B',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ff5252',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  optionTextSelected: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  // Quiz Results
  quizNameHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#041E42',
    marginBottom: 8,
    textAlign: 'center',
  },
  quizInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  quizInfoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  marksContainer: {
    width: '100%',
    marginBottom: 20,
  },
  marksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  marksLabel: {
    fontSize: 16,
    color: '#666',
  },
  marksValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#041E42',
  },
  percentageCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#041E42',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  percentageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  attemptInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  attemptText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 30,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completedTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 10,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  finalScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  finalPercentage: {
    fontSize: 18,
    color: '#fff',
    marginTop: 5,
  },
  detailedResults: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#041E42',
  },
  attemptNotice: {
    marginTop: 20,
    alignItems: 'center',
  },
  attemptNoticeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  quizInfoBar: {
    backgroundColor: '#041E42',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  quizNameSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  marksInfo: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  questionContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 10,
  },
  marksIndicator: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  noticeContainer: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  noticeText: {
    color: '#856404',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  timerContainer: {
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  questionCount: {
    fontSize: 14,
    color: '#666',
  },
  optionsContainer: {
    marginBottom: 30,
  },
  progressContainer: {
    marginTop: 20,
  },
  progressBackground: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#041E42',
  },
  successMessage: {
    backgroundColor: '#d4edda',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  successText: {
    color: '#155724',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});



export default QuizApp;