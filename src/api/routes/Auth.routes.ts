import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";
import { sendOtpController, verifyOtpController } from "../controllers/otp.controller";
import { authenticateUser } from "../..//middlewares/authenticateUser";
import { loadUserEmail } from "@/middlewares/loadUserByEmail";
import { requireExistingUser } from "@/middlewares/requireExistingUser";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.registerController.bind(authController));
router.post("/send-otp", loadUserEmail, requireExistingUser, sendOtpController);
router.post("/verify-otp", loadUserEmail, requireExistingUser, verifyOtpController);
router.post("/login", authController.loginController.bind(authController));
router.get("/profile",  authenticateUser, authController.getProfileController.bind(authController))

export default router;
