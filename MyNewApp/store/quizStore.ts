import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance.ts';
import { Alert } from 'react-native';

const quizStore = create((set, get) => ({
  quizzes: [],
  currentQuiz: null,
  loading: false,
  error: null,

  // Get all quizzes
  getAllQuizzes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/quiz/quizzes');
      console.log(response)
      set({ 
        quizzes: response.data.quizzes || response.data.data || [],
        loading: false 
      });
      return response.data.quizzes || response.data.data || [];
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch quizzes';
      set({ error: errorMessage, loading: false });
    //   Alert.alert('Error', errorMessage);
      throw error;
    }
  },

  // Get quiz by ID
  getQuizById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/quiz/quizzes/${id}`);
      set({ 
        currentQuiz: response.data.quiz || response.data.data,
        loading: false 
      });
      return response.data.quiz || response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch quiz';
      set({ error: errorMessage, loading: false });
      Alert.alert('Error', errorMessage);
      throw error;
    }
  },



  // Create new quiz
  createQuiz: async (quizData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/quiz/quizzes', quizData);
      const newQuiz = response.data.quiz || response.data.data;
      
      // Add to local state
      set(state => ({
        quizzes: [...state.quizzes, newQuiz],
        loading: false
      }));
      
      Alert.alert('Success', 'Quiz created successfully!');
      return newQuiz;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create quiz';
      set({ error: errorMessage, loading: false });
      Alert.alert('Error', errorMessage);
      throw error;
    }
  },

  // Update quiz
  updateQuiz: async (id, quizData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/quiz/quizzes/${id}`, quizData);
      const updatedQuiz = response.data.quiz || response.data.data;
      
      // Update in local state
      set(state => ({
        quizzes: state.quizzes.map(quiz => 
          quiz._id === id ? updatedQuiz : quiz
        ),
        currentQuiz: state.currentQuiz?._id === id ? updatedQuiz : state.currentQuiz,
        loading: false
      }));
      
      Alert.alert('Success', 'Quiz updated successfully!');
      return updatedQuiz;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update quiz';
      set({ error: errorMessage, loading: false });
      Alert.alert('Error', errorMessage);
      throw error;
    }
  },

  // Delete quiz
  deleteQuiz: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/quiz/quizzes/${id}`);
      
      // Remove from local state
      set(state => ({
        quizzes: state.quizzes.filter(quiz => quiz._id !== id),
        currentQuiz: state.currentQuiz?._id === id ? null : state.currentQuiz,
        loading: false
      }));
      
      Alert.alert('Success', 'Quiz deleted successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete quiz';
      set({ error: errorMessage, loading: false });
      Alert.alert('Error', errorMessage);
      throw error;
    }
  },

  // Clear current quiz
  clearCurrentQuiz: () => {
    set({ currentQuiz: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Reset store
  reset: () => {
    set({
      quizzes: [],
      currentQuiz: null,
      loading: false,
      error: null
    });
  }
}));

export default quizStore;