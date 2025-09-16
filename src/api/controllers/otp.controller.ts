import { Request, Response, NextFunction } from "express";
import { OtpService } from "../services/Otp.service";

export class OtpController {
  private otpService = new OtpService()

  sendOtp = async (req: Request, res: Response, next:NextFunction) => {
    const { email } = req.body as { email?: string };
    if (!email) return res.status(400).json({ message: "email gerekli" });

    try {
      const { ttl } = await this.otpService.sendOtpToEmail(email);
      return res.status(200).json({ message: "OTP gönderildi", ttlSeconds: ttl });
    }catch (e) {
      return next(e); 
    }
  
  };

  verifyOtp = async (req: Request, res: Response, next:NextFunction) => {
    const { email, otp } = req.body as { email?: string; otp?: string };
    if (!email || !otp) return res.status(400).json({ message: "email ve otp gerekli" });

    try {
      const result = await this.otpService.verifyOtp(email, otp);
      return res.status(200).json({ message: "Doğrulama başarılı", result });
    }catch (e) {
      return next(e); 
    }
  };
}
