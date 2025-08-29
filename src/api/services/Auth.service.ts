import { AppDataSource } from "../../config/data-source";
import { User } from "../user/User.entity";
import { sendMailSimple } from "../../lib/mailer";
import bcrypt from "bcrypt"


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
            `<p>Merhaba <b>${firstName}</b>, kaydın başarıyla tamamlandı. 🎉</p>`
        );
        

        return user;



    }
}