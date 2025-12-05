import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { UserService } from "../services/UserService.js";
import { sendToken } from "../utils/sendToken.js";

export class AuthController {
  constructor() {
    this.userService = new UserService();

    // Bind all methods with error handler
    this.register = catchAsyncError(this.register.bind(this));
    this.verifyEmail = catchAsyncError(this.verifyEmail.bind(this));
    this.login = catchAsyncError(this.login.bind(this));
    this.getUser = catchAsyncError(this.getUser.bind(this));
    this.logout = catchAsyncError(this.logout.bind(this));
    this.forgotPassword = catchAsyncError(this.forgotPassword.bind(this));
    this.verifyForgotToken = catchAsyncError(this.verifyForgotToken.bind(this));
    this.resetPassword = catchAsyncError(this.resetPassword.bind(this));
    this.quizResult = catchAsyncError(this.quizResult.bind(this));
    this.updateProfile = catchAsyncError(this.updateProfile.bind(this));
    this.getAllUsers = catchAsyncError(this.getAllUsers.bind(this));
  }

  async register(req, res) {
    const result = await this.userService.registerUser(req.body);
    res.status(201).json(result);
  }

  async verifyEmail(req, res) {
    const { code } = req.body;
    const user = await this.userService.verifyEmail(code);
    sendToken(user, 200, "Email verified successfully.", res);
  }

  async login(req, res) {
    const user = await this.userService.loginUser(req.body);
    sendToken(user, 200, "User logged in successfully.", res);
  }

  async getUser(req, res) {
    const user = req.user;
    res.status(200).json({ success: true, user });
  }

  async logout(req, res) {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "Lax",
      })
      .json({ success: true, message: "Logout successfully" });
  }

  async forgotPassword(req, res) {
    const { email } = req.body;
    const result = await this.userService.initiatePasswordReset(email);
    res.status(201).json(result);
  }

  async verifyForgotToken(req, res) {
    const { code } = req.body;
    await this.userService.verifyPasswordResetToken(code);
    res.status(200).json({ success: true, message: "Email verified successfully" });
  }

  async resetPassword(req, res) {
    const { password, code } = req.body;
    const user = await this.userService.resetPassword(code, password);
    sendToken(user, 200, "Password changed successfully.", res);
  }

  async quizResult(req, res) {
    const userId = req.user._id;
    const quizData = req.body;
    const result = await this.userService.saveQuizResult(userId, quizData);
    res.status(200).json({ success: true, message: "Quiz result saved successfully", result });
  }

  async updateProfile(req, res) {
    const userId = req.user._id;
    const user = await this.userService.updateUserProfile(userId, req.body);
    res.status(200).json({ success: true, message: "Profile updated successfully", user });
  }

  async getAllUsers(req, res) {
    const users = await this.userService.getAllUsers();
    res.status(200).json({ success: true, users });
  }
}
