import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";
import { sendOtpController, verifyOtpController } from "../controllers/otp.controller";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.registerController.bind(authController));
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/login", authController.loginController.bind(authController))

export default router;
