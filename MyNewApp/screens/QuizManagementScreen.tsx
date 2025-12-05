import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import quizStore from '../store/quizStore.ts';
import userStore from '../store/userStore.ts';

const QuizManagementScreen = () => {
  const { 
    quizzes, 
    loading, 
    getAllQuizzes, 
    createQuiz, 
    updateQuiz, 
    deleteQuiz,
    clearError 
  } = quizStore();
  const {user} = userStore()

  const userQuizzes = quizzes.filter((q) => q.userId === user._id)
  console.log(userQuizzes)

  const [modalVisible, setModalVisible] = useState(false);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [quizToDuplicate, setQuizToDuplicate] = useState(null);
  
  const [formData, setFormData] = useState({
    quizCode: '',
    quizName: '',
    totalMarks: '',
    passingMarks: '',
    timePerQuestion: '',
    marksPerQuestion: '',
    className: '',
    subject: '',
    questions: [],
  });

  const [duplicateFormData, setDuplicateFormData] = useState({
    quizCode: '',
    quizName: '',
    className: '',
    subject: '',
  });

  const [questionForm, setQuestionForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  });

  // Generate random quiz code
  const generateQuizCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    // Generate 4 random letters and 4 random numbers
    const randomLetters = Array.from({ length: 4 }, () => 
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join('');

    const randomNumbers = Array.from({ length: 4 }, () => 
      numbers.charAt(Math.floor(Math.random() * numbers.length))
    ).join('');
    
    return `${randomLetters}${randomNumbers}`;
  };

  useEffect(() => {
    console.log('Fetching quizzes...');
    getAllQuizzes();
  }, []);

  useEffect(() => {
    if (editingQuiz) {
      setFormData({
        quizCode: editingQuiz.quizCode,
        quizName: editingQuiz.quizName,
        totalMarks: editingQuiz.totalMarks.toString(),
        passingMarks: editingQuiz.passingMarks.toString(),
        timePerQuestion: editingQuiz.timePerQuestion.toString(),
        marksPerQuestion: editingQuiz.marksPerQuestion.toString(),
        className: editingQuiz.className,
        subject: editingQuiz.subject,
        questions: editingQuiz.questions || [],
      });
    } else {
      // Generate new code when opening add modal (not editing)
      setFormData(prev => ({
        ...prev,
        quizCode: generateQuizCode()
      }));
    }
  }, [editingQuiz]);

  const resetForm = () => {
    setFormData({
      quizCode: generateQuizCode(),
      quizName: '',
      totalMarks: '',
      passingMarks: '',
      timePerQuestion: '',
      marksPerQuestion: '',
      className: '',
      subject: '',
      questions: [],
    });
    setEditingQuiz(null);
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    });
    setCurrentQuestion(null);
    setQuestionIndex(-1);
  };

  // Duplicate Quiz Functions
  const openDuplicateModal = (quiz) => {
    setQuizToDuplicate(quiz);
    setDuplicateFormData({
      quizCode: generateQuizCode(),
      quizName: `${quiz.quizName} - Copy`,
      className: quiz.className,
      subject: quiz.subject,
    });
    setDuplicateModalVisible(true);
  };

  const handleDuplicateQuiz = async () => {
    if (!duplicateFormData.quizCode || !duplicateFormData.quizName || !duplicateFormData.subject || !duplicateFormData.className) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const quizData = {
      ...duplicateFormData,
      totalMarks: quizToDuplicate.totalMarks,
      passingMarks: quizToDuplicate.passingMarks,
      timePerQuestion: quizToDuplicate.timePerQuestion,
      marksPerQuestion: quizToDuplicate.marksPerQuestion,
      questions: [...quizToDuplicate.questions], // Copy all questions
    };

    try {
      await createQuiz(quizData);
      setDuplicateModalVisible(false);
      setQuizToDuplicate(null);
      Alert.alert('Success', 'Quiz duplicated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to duplicate quiz');
    }
  };

  const handleRegenerateDuplicateCode = () => {
    setDuplicateFormData({
      ...duplicateFormData,
      quizCode: generateQuizCode()
    });
  };

  const handleSubmit = async () => {
    if (!formData.quizCode || !formData.quizName || !formData.subject || !formData.className) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const quizData = {
      ...formData,
      totalMarks: parseInt(formData.totalMarks) || 100,
      passingMarks: parseInt(formData.passingMarks) || 40,
      timePerQuestion: parseInt(formData.timePerQuestion) || 30,
      marksPerQuestion: parseInt(formData.marksPerQuestion) || 5,
      questions: formData.questions,
    };

    try {
      if (editingQuiz) {
        await updateQuiz(editingQuiz._id, quizData);
      } else {
        await createQuiz(quizData);
      }
      setModalVisible(false);
      resetForm();
    } catch (error) {
      // Error handled in store
    }
  };

  // Regenerate quiz code
  const handleRegenerateCode = () => {
    setFormData({
      ...formData,
      quizCode: generateQuizCode()
    });
  };

  // Question Management Functions
  const openAddQuestionModal = (quiz) => {
    setSelectedQuiz(quiz);
    resetQuestionForm();
    setQuestionModalVisible(true);
  };

  const openEditQuestionModal = (quiz, question, index) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(question);
    setQuestionIndex(index);
    setQuestionForm({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
    });
    setQuestionModalVisible(true);
  };

  const handleQuestionSubmit = () => {
    // Validate question form
    if (!questionForm.question.trim()) {
      Alert.alert('Error', 'Please enter the question');
      return;
    }

    if (questionForm.options.some(opt => !opt.trim())) {
      Alert.alert('Error', 'Please fill all options');
      return;
    }

    if (questionForm.options.length < 2) {
      Alert.alert('Error', 'Please add at least 2 options');
      return;
    }

    const newQuestion = {
      question: questionForm.question,
      options: questionForm.options,
      correctAnswer: questionForm.correctAnswer,
    };

    const updatedQuestions = [...selectedQuiz.questions];
    
    if (questionIndex > -1) {
      // Editing existing question
      updatedQuestions[questionIndex] = newQuestion;
    } else {
      // Adding new question
      updatedQuestions.push(newQuestion);
    }

    // Update the quiz with new questions
    const updatedQuiz = {
      ...selectedQuiz,
      questions: updatedQuestions,
    };

    updateQuiz(selectedQuiz._id, updatedQuiz);
    setQuestionModalVisible(false);
    resetQuestionForm();
  };

  const handleDeleteQuestion = (quiz, index) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
            const updatedQuiz = {
              ...quiz,
              questions: updatedQuestions,
            };
            updateQuiz(quiz._id, updatedQuiz);
          }
        },
      ]
    );
  };

  const handleOptionChange = (text, index) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = text;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const handleDelete = (quiz) => {
    Alert.alert(
      'Delete Quiz',
      `Are you sure you want to delete "${quiz.quizName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteQuiz(quiz._id)
        },
      ]
    );
  };

  const openEditModal = (quiz) => {
    setEditingQuiz(quiz);
    setModalVisible(true);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const QuestionItem = ({ question, index, quiz }) => (
    <View style={styles.questionItem}>
      <View style={styles.questionHeader}>
        <View>
          <Text style={styles.questionText}>
            {index + 1}. {question.question}
          </Text>
        </View>
      </View>
      <Text style={styles.optionsText}>
        Options: {question.options.join(', ')}
      </Text>
      <Text style={styles.correctAnswerText}>
        Correct: Option {question.correctAnswer + 1} - "{question.options[question.correctAnswer]}"
      </Text>
      <View style={styles.questionActions}>
        <TouchableOpacity 
          style={styles.editQButton}
          onPress={() => openEditQuestionModal(quiz, question, index)}
        >
          <Ionicons name="create-outline" size={18} color="#4199c7" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteQButton}
          onPress={() => handleDeleteQuestion(quiz, index)}
        >
          <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );


  const QuizCard = ({ quiz }) => {
  const copyQuizCode = async () => {
    try {
      await Clipboard.setString(quiz.quizCode);
      Alert.alert('Copied!', `Quiz code "${quiz.quizCode}" copied to clipboard`);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy quiz code');
    }
  };

  return (
    <View style={styles.quizCard}>
      <View style={styles.quizHeader}>
        <View style={styles.quizInfo}>
          <Text style={styles.quizName}>{quiz.quizName}</Text>
          
          {/* Make quiz code copyable on long press */}
          <TouchableOpacity 
            onLongPress={copyQuizCode}
            delayLongPress={500}
          >
            <Text style={styles.quizCode}>Code: {quiz.quizCode}</Text>
          </TouchableOpacity>
          
          <Text style={styles.quizDetails}>
            {quiz.subject} • {quiz.className}
          </Text>
          <Text style={styles.quizStats}>
            {quiz.questions?.length || 0} Questions • {quiz.totalMarks} Marks
          </Text>
        </View>
        <View style={styles.quizActions}>

          <TouchableOpacity 
            style={styles.duplicateButton}
            onPress={() => openDuplicateModal(quiz)}
          >
            <Ionicons name="copy-outline" size={20} color="#9C27B0" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addQButton}
            onPress={() => openAddQuestionModal(quiz)}
          >
            <Ionicons name="add-circle-outline" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => openEditModal(quiz)}
          >
            <Ionicons name="create-outline" size={20} color="#4199c7" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDelete(quiz)}
          >
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
      
      {quiz.questions && quiz.questions.length > 0 ? (
        <View style={styles.questionsPreview}>
          <Text style={styles.questionsTitle}>Questions ({quiz.questions.length}):</Text>
          <FlatList
            data={quiz.questions}
            renderItem={({ item, index }) => (
              <QuestionItem question={item} index={index} quiz={quiz} />
            )}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </View>
      ) : (
        <View style={styles.noQuestions}>
          <Text style={styles.noQuestionsText}>No questions added yet</Text>
          <TouchableOpacity 
            style={styles.addFirstQButton}
            onPress={() => openAddQuestionModal(quiz)}
          >
            <Text style={styles.addFirstQText}>Add First Question</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )};

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quiz Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={24} color="#FFF" />
          <Text style={styles.addButtonText}>Add Quiz</Text>
        </TouchableOpacity>
      </View>

      {/* Quiz List */}
      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#4199c7" style={styles.loader} />
        ) : (
          <>
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Overview</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{userQuizzes.length}</Text>
                  <Text style={styles.statLabel}>Total Quizzes</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {[...new Set(userQuizzes.map(q => q.subject))].length}
                  </Text>
                  <Text style={styles.statLabel}>Subjects</Text>
                </View>
               <View style={styles.statItem}>
  <Text style={styles.statNumber}>
    {[...new Set(userQuizzes.map(q => q.className.toLowerCase()))].length}
  </Text>
  <Text style={styles.statLabel}>Classes</Text>
</View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              All Quizzes ({userQuizzes.length})
            </Text>

            {userQuizzes.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={64} color="#CCC" />
                <Text style={styles.emptyStateText}>No quizzes found</Text>
                <Text style={styles.emptyStateSubtext}>
                  Create your first quiz to get started
                </Text>
              </View>
            ) : (
              userQuizzes.map((quiz) => (
                <QuizCard key={quiz._id} quiz={quiz} />
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* Add/Edit Quiz Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form}>
              {/* Quiz Code Field with Regenerate Button */}
              <View style={styles.inputGroup}>
                <View style={styles.codeHeader}>
                  <Text style={styles.label}>Quiz Code *</Text>
                  {!editingQuiz && (
                    <TouchableOpacity 
                      style={styles.regenerateButton}
                      onPress={handleRegenerateCode}
                    >
                      <Ionicons name="refresh" size={16} color="#4199c7" />
                      <Text style={styles.regenerateText}>Regenerate</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.codeInputContainer}>
                  <TextInput
                    style={[styles.input, styles.codeInput]}
                    value={formData.quizCode}
                    onChangeText={(text) => setFormData({...formData, quizCode: text.toUpperCase()})}
                    placeholder="e.g., ABC12"
                    editable={!editingQuiz}
                  />
                  {!editingQuiz && (
                    <Text style={styles.autoGenerateText}>Auto-generated</Text>
                  )}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Quiz Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.quizName}
                  onChangeText={(text) => setFormData({...formData, quizName: text})}
                  placeholder="e.g., General Knowledge Test"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Subject *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.subject}
                    onChangeText={(text) => setFormData({...formData, subject: text})}
                    placeholder="e.g., Mathematics"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Class *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.className}
                    onChangeText={(text) => setFormData({...formData, className: text})}
                    placeholder="e.g., SS1"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Total Marks</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.totalMarks}
                    onChangeText={(text) => setFormData({...formData, totalMarks: text})}
                    placeholder="100"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Passing Marks</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.passingMarks}
                    onChangeText={(text) => setFormData({...formData, passingMarks: text})}
                    placeholder="40"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Time per Question (sec)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.timePerQuestion}
                    onChangeText={(text) => setFormData({...formData, timePerQuestion: text})}
                    placeholder="30"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Marks per Question</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.marksPerQuestion}
                    onChangeText={(text) => setFormData({...formData, marksPerQuestion: text})}
                    placeholder="5"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.notes}>
                * Required fields{'\n'}
                You can add questions after creating the quiz
              </Text>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Duplicate Quiz Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={duplicateModalVisible}
        onRequestClose={() => setDuplicateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Duplicate Quiz
                {quizToDuplicate && ` - ${quizToDuplicate.quizName}`}
              </Text>
              <TouchableOpacity 
                onPress={() => setDuplicateModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form}>
              <View style={styles.duplicateInfo}>
                <Ionicons name="information-circle" size={20} color="#9C27B0" />
                <Text style={styles.duplicateInfoText}>
                  This will create a new quiz with the same questions but different code and class details.
                </Text>
              </View>

              {/* Quiz Code Field */}
              <View style={styles.inputGroup}>
                <View style={styles.codeHeader}>
                  <Text style={styles.label}>New Quiz Code *</Text>
                  <TouchableOpacity 
                    style={styles.regenerateButton}
                    onPress={handleRegenerateDuplicateCode}
                  >
                    <Ionicons name="refresh" size={16} color="#4199c7" />
                    <Text style={styles.regenerateText}>Regenerate</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.codeInputContainer}>
                  <TextInput
                    style={[styles.input, styles.codeInput]}
                    value={duplicateFormData.quizCode}
                    onChangeText={(text) => setDuplicateFormData({...duplicateFormData, quizCode: text.toUpperCase()})}
                    placeholder="e.g., ABC12"
                  />
                  <Text style={styles.autoGenerateText}>Auto-generated</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Quiz Name *</Text>
                <TextInput
                  style={styles.input}
                  value={duplicateFormData.quizName}
                  onChangeText={(text) => setDuplicateFormData({...duplicateFormData, quizName: text})}
                  placeholder="e.g., General Knowledge Test"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Subject *</Text>
                  <TextInput
                    style={styles.input}
                    value={duplicateFormData.subject}
                    onChangeText={(text) => setDuplicateFormData({...duplicateFormData, subject: text})}
                    placeholder="e.g., Mathematics"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Class *</Text>
                  <TextInput
                    style={styles.input}
                    value={duplicateFormData.className}
                    onChangeText={(text) => setDuplicateFormData({...duplicateFormData, className: text})}
                    placeholder="e.g., SS1"
                  />
                </View>
              </View>

              {quizToDuplicate && (
                <View style={styles.originalQuizInfo}>
                  <Text style={styles.originalQuizTitle}>Original Quiz Details:</Text>
                  <Text style={styles.originalQuizText}>Name: {quizToDuplicate.quizName}</Text>
                  <Text style={styles.originalQuizText}>Code: {quizToDuplicate.quizCode}</Text>
                  <Text style={styles.originalQuizText}>Subject: {quizToDuplicate.subject}</Text>
                  <Text style={styles.originalQuizText}>Class: {quizToDuplicate.className}</Text>
                  <Text style={styles.originalQuizText}>Questions: {quizToDuplicate.questions?.length || 0}</Text>
                </View>
              )}

              <Text style={styles.notes}>
                * Required fields{'\n'}
                All questions from the original quiz will be copied
              </Text>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setDuplicateModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.submitButton, { backgroundColor: '#9C27B0' }]}
                onPress={handleDuplicateQuiz}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    Duplicate Quiz
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add/Edit Question Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={questionModalVisible}
        onRequestClose={() => setQuestionModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {currentQuestion ? 'Edit Question' : 'Add New Question'}
                {selectedQuiz && ` - ${selectedQuiz.quizName}`}
              </Text>
              <TouchableOpacity 
                onPress={() => setQuestionModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Question *</Text>
                <TextInput
                  style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                  value={questionForm.question}
                  onChangeText={(text) => setQuestionForm({ ...questionForm, question: text })}
                  placeholder="Enter your question here..."
                  multiline
                />
              </View>

              <Text style={styles.label}>Options *</Text>
              {[0, 1, 2, 3].map((index) => (
                <View key={index} style={styles.optionRow}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      questionForm.correctAnswer === index && styles.radioButtonSelected
                    ]}
                    onPress={() => setQuestionForm({ ...questionForm, correctAnswer: index })}
                  >
                    <Text style={
                      questionForm.correctAnswer === index 
                        ? styles.radioTextSelected 
                        : styles.radioText
                    }>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={questionForm.options[index]}
                    onChangeText={(text) => handleOptionChange(text, index)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  />
                </View>
              ))}

              <View style={styles.correctAnswerInfo}>
                <Ionicons name="information-circle" size={16} color="#4199c7" />
                <Text style={styles.correctAnswerInfoText}>
                  Selected correct answer: Option {String.fromCharCode(65 + questionForm.correctAnswer)}
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setQuestionModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleQuestionSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {currentQuestion ? 'Update Question' : 'Add Question'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (all your existing styles remain the same)

  // Add these new styles for duplicate feature:
  duplicateButton: {
    padding: 8,
    backgroundColor: '#F3E5F5',
    borderRadius: 6,
  },
  duplicateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  duplicateInfoText: {
    fontSize: 14,
    color: '#9C27B0',
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
  },
  originalQuizInfo: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  originalQuizTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 8,
  },
  originalQuizText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F0F7FF',
    borderRadius: 6,
  },
  regenerateText: {
    fontSize: 12,
    color: '#4199c7',
    fontWeight: '500',
    marginLeft: 4,
  },
  codeInputContainer: {
    position: 'relative',
  },
  codeInput: {
    fontWeight: '600',
    color: '#4199c7',
    letterSpacing: 1,
  },
  autoGenerateText: {
    position: 'absolute',
    right: 12,
    top: 12,
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
      addQButton: {
    padding: 8,
    backgroundColor: '#F0F9F0',
    borderRadius: 6,
  },
  editQButton: {
    padding: 6,
    backgroundColor: '#F0F7FF',
    borderRadius: 4,
    marginRight: 4,
  },
  deleteQButton: {
    padding: 6,
    backgroundColor: '#FFF5F5',
    borderRadius: 4,
  },
  questionHeader: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  questionActions: {
    flexDirection: 'row',
  },
  noQuestions: {
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  noQuestionsText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  addFirstQButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addFirstQText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: '#4199c7',
    backgroundColor: '#4199c7',
  },
  radioText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  radioTextSelected: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  correctAnswerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  correctAnswerInfoText: {
    fontSize: 13,
    color: '#4199c7',
    marginLeft: 8,
    fontWeight: '500',
  }, 
 container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#041E42',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4199c7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
},
addButtonText: {
      fontSize: 11,
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loader: {
    marginTop: 50,
  },
  statsCard: {
    backgroundColor: '#FFF',
    padding: 10,
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
    fontSize: 17,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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
    alignItems: 'flex-start',
  },
  quizInfo: {
    flex: 1,
  },
  quizName: {
    fontSize: 18,
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
    marginBottom: 4,
  },
  quizStats: {
    fontSize: 12,
    color: '#999',
  },
  quizActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#F0F7FF',
    borderRadius: 6,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 6,
  },
  questionsPreview: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  questionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#041E42',
    marginBottom: 8,

  },
  questionItem: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#041E42',
    marginBottom: 4,

  },
  optionsText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,

  },
  correctAnswerText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  moreQuestions: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 0,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#041E42',
    flexWrap: 'wrap',
    maxWidth: '83%',

  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#041E42',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
  },
  notes: {
    fontSize: 12,
    color: '#666',
    marginTop: 16,
    lineHeight: 16,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#4199c7',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    
  },
});


export default QuizManagementScreen;