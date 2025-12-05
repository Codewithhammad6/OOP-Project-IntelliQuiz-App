// services/quizService.js
import Quiz from "../models/quizModal.js";

export class QuizService {
  constructor() {
    this.Quiz = Quiz;
  }

  async createQuiz(quizData, userId) {
    try {
      const quiz = await this.Quiz.create({
        ...quizData,
        userId
      });
      return quiz;
    } catch (error) {
      throw new Error(`Failed to create quiz: ${error.message}`);
    }
  }

  async getAllQuizzes() {
    try {
      const quizzes = await this.Quiz.find();
      return quizzes;
    } catch (error) {
      throw new Error(`Failed to fetch quizzes: ${error.message}`);
    }
  }

  async getQuizById(quizId) {
    try {
      const quiz = await this.Quiz.findById(quizId);
      return quiz;
    } catch (error) {
      throw new Error(`Failed to fetch quiz: ${error.message}`);
    }
  }

  async updateQuizById(quizId, updateData) {
    try {
      const quiz = await this.Quiz.findByIdAndUpdate(
        quizId, 
        updateData, 
        {
          new: true,
          runValidators: true
        }
      );
      return quiz;
    } catch (error) {
      throw new Error(`Failed to update quiz: ${error.message}`);
    }
  }

  async deleteQuizById(quizId) {
    try {
      await this.Quiz.findByIdAndDelete(quizId);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete quiz: ${error.message}`);
    }
  }
}