import User from '../models/userModel.js';
import { EmailService } from './EmailService.js';

import { sendToken } from '../utils/sendToken.js';
import ErrorHandler from '../middleware/error.js';

export class UserService {
  constructor() {
    this.emailService = new EmailService();
  }

  validateEmail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }

  async registerUser(userData) {
    const { name, rollNumber, role, email, password } = userData;

    // Validation
    if (!name || !role || !email || !password) {
      throw new ErrorHandler("All fields required", 400);
    }

    if (!this.validateEmail(email)) {
      throw new ErrorHandler("Invalid email format", 400);
    }

    // Check existing user
    let existingUser = await User.findOne({ email });

    // Handle existing user scenarios
    if (existingUser && existingUser.verified) {
      throw new ErrorHandler("Email is already used.", 400);
    }

    if (existingUser && !existingUser.verified) {
      return this.handleResendVerification(existingUser, userData);
    }

    // Create new user
    return this.createNewUser(userData);
  }

  async handleResendVerification(existingUser, userData) {
    existingUser.name = userData.name;
    existingUser.password = userData.password;
    existingUser.rollNumber = userData.rollNumber;
    existingUser.role = userData.role;
    
    const verificationToken = existingUser.generateCode();
    await existingUser.save();
    
    await this.emailService.sendVerificationEmail(existingUser.email, verificationToken);
    
    return {
      success: true,
      message: "Verification code resent to your email."
    };
  }

  async createNewUser(userData) {
    const { name, rollNumber, role, email, password } = userData;
    
    const newUser = new User({ name, rollNumber, role, email, password });
    const verificationToken = newUser.generateCode();
    
    await newUser.save();
    await this.emailService.sendVerificationEmail(newUser.email, verificationToken);
    
    return {
      success: true,
      message: "User registered successfully. Please check your email for verification."
    };
  }

  async verifyEmail(code) {
    const user = await User.findOne({ verificationToken: code });

    if (!user || user.verificationToken !== code) {
      throw new ErrorHandler("Invalid verification token", 400);
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    return user;
  }

  async loginUser(credentials) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new ErrorHandler("All fields required", 400);
    }

    if (!this.validateEmail(email)) {
      throw new ErrorHandler("Invalid email format", 400);
    }

    const user = await User.findOne({ email, verified: true }).select("+password");

    if (!user) {
      throw new ErrorHandler("Invalid credentials or email not verified", 400);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ErrorHandler("Invalid password", 400);
    }

    return user;
  }

  async initiatePasswordReset(email) {
    if (!email) {
      throw new ErrorHandler("Email required", 400);
    }

    if (!this.validateEmail(email)) {
      throw new ErrorHandler("Invalid email format", 400);
    }

    const user = await User.findOne({ email, verified: true });

    if (!user) {
      throw new ErrorHandler("User not found.", 400);
    }

    const verificationToken = user.generateCode();
    user.verificationToken = verificationToken;
    await user.save();

    await this.emailService.sendVerificationEmail(user.email, verificationToken, 'forgot');

    return {
      success: true,
      message: "Please check your email for verification."
    };
  }

  async verifyPasswordResetToken(code) {
    const user = await User.findOne({ verificationToken: code });

    if (!user || user.verificationToken !== code) {
      throw new ErrorHandler("Invalid verification token", 400);
    }

    return user;
  }

  async resetPassword(code, newPassword) {
    const user = await User.findOne({ verificationToken: code });

    if (!user) {
      throw new ErrorHandler("Invalid verification token", 400);
    }

    user.password = newPassword;
    user.verificationToken = undefined;
    await user.save();

    return user;
  }

  async saveQuizResult(userId, quizData) {
    const { quizName, obtainedMarks, totalMarks, status, quizCode, className, subject } = quizData;

    if (!userId || !quizName || obtainedMarks === undefined || !totalMarks || !status || !quizCode || !className || !subject) {
      throw new ErrorHandler("All fields required", 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    // Check duplicate quiz attempt
    const existingQuiz = user.quizzes.find(quiz => 
      quiz.quizName === quizName && 
      quiz.quizCode === quizCode && 
      quiz.className === className && 
      quiz.subject === subject
    );

    if (existingQuiz) {
      throw new ErrorHandler("You have already attempted this quiz", 400);
    }

    const newQuizResult = {
      quizCode,
      className,
      subject,
      quizName,
      obtainedMarks,
      totalMarks,
      status,
      attemptedAt: new Date()
    };

    user.quizzes.push(newQuizResult);
    await user.save();

    return newQuizResult;
  }

  async updateUserProfile(userId, updateData) {
    const { name, rollNumber } = updateData;
    const user = await User.findById(userId);

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    if (name) user.name = name;
    if (rollNumber) user.rollNumber = rollNumber;

    await user.save();
    return user;
  }

  async getAllUsers() {
    return await User.find().select("-password -verificationToken");
  }

  async getUserById(userId) {
    return await User.findById(userId);
  }
}