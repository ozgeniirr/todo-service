import { Request, Response } from "express";
import { sendOtpToEmail, verifyOtp } from "../services/otp.service";

export async function sendOtpController(req: Request, res: Response) {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ message: "email gerekli" });

  try {
    const { ttl } = await sendOtpToEmail(email);
    return res.json({ message: "OTP gönderildi", ttlSeconds: ttl });
  } catch (e) {
    return res.status(500).json({ message: "Sunucu hatası" });
  }
}

export async function verifyOtpController(req: Request, res: Response) {
  const { email, otp } = req.body as { email?: string; otp?: string };
  if (!email || !otp) return res.status(400).json({ message: "email ve otp gerekli" });

  try {
    const result = await verifyOtp(email, otp);
    if (!result.ok) {
      const code = result.reason === "INVALID" ? 400 : 410; 
      return res.status(code).json({ message: result.reason });
    }
    return res.json({ message: "Doğrulama başarılı" });
  } catch {
    return res.status(500).json({ message: "Sunucu hatası" });
  }
}
