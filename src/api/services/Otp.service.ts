
import crypto from "crypto";
import NodemailerHelper from "nodemailer-otp";
import Redis, { Redis as RedisClient } from "ioredis";
import { mailQueue } from "../../jobs/queue";
import { logger } from "../../lib/logger";
import { User } from "../entities/user/User.entity";
import { AppDataSource } from "../../config/data-source";

export interface OtpServiceOptions {
  redisHost?: string;
  redisPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  ttlSeconds?: number; 
}

export class OtpService {
  private readonly redis: RedisClient;
  private readonly helper: NodemailerHelper;
  private readonly OTP_TTL_SECONDS: number;

  constructor(opts: OtpServiceOptions = {}) {
    const {
      redisHost = process.env.REDIS_HOST || "127.0.0.1",
      redisPort = Number(process.env.REDIS_PORT || 6379),
      smtpUser = process.env.SMTP_USER as string,
      smtpPass = process.env.SMTP_PASS as string,
      ttlSeconds = 60 * 5,
    } = opts;

    this.redis = new Redis({ host: redisHost, port: redisPort });
    this.helper = new NodemailerHelper(smtpUser, smtpPass);
    this.OTP_TTL_SECONDS = ttlSeconds;
  }

  private hashOtp(otp: string) {
    return crypto.createHash("sha256").update(otp).digest("hex");
  }

  private keyFor(email: string) {
    return `otp:${email.trim().toLowerCase()}`;
  }

  async sendOtpToEmail(email: string) {
    const emailLower = email.trim().toLowerCase();
    const otp = this.helper.generateOtp(6);
    const otpHash = this.hashOtp(otp);
    const key = this.keyFor(emailLower);

    await this.redis.del(key);
    await this.redis.set(key, otpHash, "EX", this.OTP_TTL_SECONDS);

    await mailQueue.add("send-otp", {
      to: emailLower,
      subject: "Doğrulama kodunuz.",
      text: `${otp}\nBu kod ${this.OTP_TTL_SECONDS / 60} dakika geçerlidir.`,
    });

    return { ttl: this.OTP_TTL_SECONDS };
  }


  async verifyOtp(email: string, providedOtp: string) {
    const emailLower = email.trim().toLowerCase();
    const key = this.keyFor(emailLower);
  

    const savedHash = await this.redis.get(key);
    if (!savedHash) return { ok: false, reason: "EXPIRED_OR_NOT_FOUND" };

    const incomingHash = this.hashOtp(providedOtp);
    if (incomingHash !== savedHash) return { ok: false, reason: "INVALID" };

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email: emailLower } });
    if (!user) return { ok: false, reason: "USER_NOT_FOUND" };

    if (!user.isVerified) {
      user.isVerified = true;
      await userRepo.save(user);
    }

    await this.redis.del(key);

    logger.client.info("user.verified", {
      email: emailLower,
      at: new Date().toISOString(),
    });

    return { ok: true };
  }
}
