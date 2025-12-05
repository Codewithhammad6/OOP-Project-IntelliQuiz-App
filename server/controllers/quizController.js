// controllers/quizController.js
import { QuizService } from "../services/quizService.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

export class QuizController {
  constructor() {
    this.quizService = new QuizService();
  }

  // Create a new quiz
  createQuiz = catchAsyncError(async (req, res, next) => {
    const {
      quizCode,
      quizName,
      totalMarks,
      passingMarks,
      timePerQuestion,
      marksPerQuestion,
      className,
      subject,
      questions
    } = req.body;

    const quiz = await this.quizService.createQuiz({
      quizCode,
      quizName,
      totalMarks,
      passingMarks,
      timePerQuestion,
      marksPerQuestion,
      className,
      subject,
      questions
    }, req.user._id);

    res.status(201).json({
      success: true,
      quiz
    });
  });

  // Get all quizzes
  getAllQuizzes = catchAsyncError(async (req, res, next) => {
    const quizzes = await this.quizService.getAllQuizzes();
    
    res.status(200).json({
      success: true,
      quizzes
    });
  });

  // Get a single quiz by ID
  getQuizById = catchAsyncError(async (req, res, next) => {
    const quiz = await this.quizService.getQuizById(req.params.id);
    
    if (!quiz) {
      return next(new ErrorHandler("Quiz not found", 404));
    }
    
    res.status(200).json({
      success: true,
      quiz
    });
  });

  // Update a quiz by ID
  updateQuizById = catchAsyncError(async (req, res, next) => {
    const quiz = await this.quizService.getQuizById(req.params.id);
    
    if (!quiz) {
      return next(new ErrorHandler("Quiz not found", 404));
    }

    const updatedQuiz = await this.quizService.updateQuizById(req.params.id, req.body);

    res.status(200).json({
      success: true,
      quiz: updatedQuiz
    });
  });

  // Delete a quiz by ID
  deleteQuizById = catchAsyncError(async (req, res, next) => {
    const quiz = await this.quizService.getQuizById(req.params.id);
    
    if (!quiz) {
      return next(new ErrorHandler("Quiz not found", 404));
    }

    await this.quizService.deleteQuizById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully"
    });
  });
}

// Create instance and export functions directly
const quizController = new QuizController();

export const createQuiz = quizController.createQuiz;
export const getAllQuizzes = quizController.getAllQuizzes;
export const getQuizById = quizController.getQuizById;
export const updateQuizById = quizController.updateQuizById;
export const deleteQuizById = quizController.deleteQuizById;