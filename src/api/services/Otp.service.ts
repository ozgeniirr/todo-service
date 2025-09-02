import crypto from "crypto"
import NodemailerHelper from "nodemailer-otp"
import Redis from "ioredis"
import { mailQueue } from "@/jobs/queue"
import { logger } from "@/lib/logger"
import { User } from "../entities/user/User.entity"
import { AppDataSource } from "@/config/data-source"



const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),

});


const helper = new NodemailerHelper(
    process.env.SMTP_USER as string,
    process.env.SMTP_PASS as string
);


const OTP_TTL_SECONDS = 60 * 5;

function hashOtp(otp:string) {
    return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function sendOtpToEmail(email:string){
    const otp = helper.generateOtp(6);
    const otpHash = hashOtp(otp);
    const key = `otp:${email.toLowerCase()}`;

    await redis.del(key);
    await redis.set(key, otpHash, "EX", OTP_TTL_SECONDS);

    await mailQueue.add('send-otp', {
        to:email,
        subject: 'Doğrulama kodunuz.',
        text: `${otp}\nBu kod ${OTP_TTL_SECONDS/60} dakika geçerlidir.`
    })

    return { ttl: OTP_TTL_SECONDS};
}


export async function verifyOtp(email:string, providedOtp:string ) {
    const emailLower = email.trim().toLowerCase();
    const key = `otp:${emailLower}`;

    const savedHash= await redis.get(key);
    if(!savedHash) return {ok: false, reason: "EXPIRED_OR_NOT_FOUND"};

    const incomingHash = hashOtp(providedOtp);
    if(incomingHash !== savedHash) return { ok:false, reason:" INVALID"};


    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({where: {email:emailLower}})

    if(!user) return {ok:false, reason:"USER_NOT_FOUND"}

    if(!user.isVerified){
        user.isVerified=true;
        await userRepo.save(user);
    }
    
    await redis.del(key);


    logger.info('user.verified', {
        email,
        at: new Date().toISOString(),

    });

    return { ok:true,
    
     };
}

