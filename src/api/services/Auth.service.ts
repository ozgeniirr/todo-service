import { AppDataSource } from "../../config/data-source";
import { User } from "../entities/user/User.entity";
import { sendMailSimple } from "../../lib/mailer";
import bcrypt from "bcrypt"
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { randomUUID } from "crypto";
import { ensureRedisConnection, getRedis } from "../../lib/redis";



export class AuthService{
    private userRepo = AppDataSource.getRepository(User)

    async register(email:string, password:string, firstName:string, lastName:string, age:number){

        const existUser = await this.userRepo.findOneBy({email})
        if(existUser){
            throw new Error("USER_EXISTS")
        }

        const hashedPassword = await bcrypt.hash(password, 11);

        const user = await this.userRepo.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            age,
        })

        await this.userRepo.save(user);
        void sendMailSimple(
            user.email,
            "Hoş geldin!",
            `Merhaba ${firstName}, kaydın başarıyla tamamlandı.`,
            `<p>Merhaba <b>${firstName}</b>, kaydın başarıyla tamamlandı. </p>`
        );
        

        return user;

    }
    
    
    async login(email: string, password: string) {
        const user = await this.userRepo.findOneBy({ email });
        if (!user) {
    
            throw new Error("USER_NOT_FOUND");
  
        }
        if (!user.isVerified) {
            throw new Error("NOT_ALLOWED");
        }

        const isPass = await bcrypt.compare(password, user.password);
        if (!isPass) {
            throw new Error("INVALID_PASS");
        }
        const userId = String(user.id);
        const accessToken = signAccessToken(userId, { email: user.email});
        const tokenId = randomUUID();
        const refreshToken = signRefreshToken(userId, tokenId);
        await ensureRedisConnection();
  
        await getRedis().set(`refresh:${userId}:${tokenId}`, "1", "EX", 60 * 60 * 24 * 7 + 60);
        return {
            user: { id: userId, email: user.email },
            tokens: { accessToken, refreshToken },
        };
    }


    async getProfile(userId:string){
        const user = await this.userRepo.findOne({where: {id:userId},
        select:[
            "id",
            "email",
            "firstName",
            "lastName",
            "age",
            "isVerified",
        ]
        
        })
        if(!user){
            throw new Error("USER_NOT_FOUND")
        }

        return user;

        
    }
}