import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();
const authController = new AuthController();

// Auth & User Routes
router.post("/register", authController.register);
router.post("/verifyEmail", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/forgot", authController.forgotPassword);
router.post("/verifyForgotToken", authController.verifyForgotToken);
router.post("/resetPassword", authController.resetPassword);

router.get("/me", isAuthenticated, authController.getUser);
router.put("/update", isAuthenticated, authController.updateProfile);
router.get("/logout", isAuthenticated, authController.logout);

router.post("/quizResult", isAuthenticated, authController.quizResult);
router.get("/users", isAuthenticated, authController.getAllUsers);

export default router;
