import { Request, Response } from "express";
import { OtpService } from "../services/Otp.service";

export class OtpController {
  private otpService = new OtpService()

  sendOtp = async (req: Request, res: Response) => {
    const { email } = req.body as { email?: string };
    if (!email) return res.status(400).json({ message: "email gerekli" });

    try {
      const { ttl } = await this.otpService.sendOtpToEmail(email);
      return res.status(200).json({ message: "OTP gönderildi", ttlSeconds: ttl });
    } catch (e) {
      return res.status(500).json({ message: "Sunucu hatası" });
    }
  };

  verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body as { email?: string; otp?: string };
    if (!email || !otp) return res.status(400).json({ message: "email ve otp gerekli" });

    try {
      const result = await this.otpService.verifyOtp(email, otp);
      if (!result.ok) {
        const code = result.reason === "INVALID" ? 400 : 410; 
        return res.status(code).json({ message: result.reason });
      }
      return res.status(200).json({ message: "Doğrulama başarılı" });
    } catch {
      return res.status(500).json({ message: "Sunucu hatası" });
    }
  };
}
