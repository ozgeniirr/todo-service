import crypto from "crypto";
import NodemailerHelper from "nodemailer-otp";
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
});

const helper = new NodemailerHelper(
  process.env.SMTP_USER as string,
  process.env.SMTP_PASS as string
);

const OTP_TTL_SECONDS = 60 * 5;

function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function sendOtpToEmail(email: string) {
  const otp = helper.generateOtp(6);
  const otpHash = hashOtp(otp);
  const key = `otp:${email.toLowerCase()}`;

  await redis.del(key);
  await redis.set(key, otpHash, "EX", OTP_TTL_SECONDS);

  await helper.sendEmail(
    email,
    "E-posta Doğrulama Kodu",
    `Doğrulama kodun: ${otp}\nBu kod ${OTP_TTL_SECONDS/60} dakika geçerlidir.`,
    otp
  );

  return { ttl: OTP_TTL_SECONDS };
}

export async function verifyOtp(email: string, providedOtp: string) {
  const key = `otp:${email.toLowerCase()}`;
  const savedHash = await redis.get(key);
  if (!savedHash) return { ok: false, reason: "EXPIRED_OR_NOT_FOUND" };

  const incomingHash = hashOtp(providedOtp);
  if (incomingHash !== savedHash) return { ok: false, reason: "INVALID" };

  await redis.del(key); 
  return { ok: true };
}
