import { AppDataSource } from "../../config/data-source";
import { AuthService } from "../services/Auth.service";
import { Request, Response } from "express";
import { AuthLoginDTO, AuthRegisterDTO } from "../../middlewares/validate-dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { logger } from "../../lib/logger";




export class AuthController{
    private authService = new AuthService();

    async registerController(req:Request, res:Response){

        const dto = plainToInstance(AuthRegisterDTO, req.body);
        const errors = await validate(dto);

        if(errors.length>0){
            return res.status(400).json({
                message:"Lütfen geçerli veri giriniz.",
                errors,
            });
        }
        const {email, password, firstName, lastName, age } = dto;
        try{
            const user = await this.authService.register(email, password, firstName, lastName, age );
            const {password: _, ...safeUser } = user;
            return res.status(201).json({message:"Kayıt başarıyla tamamlandı.", user: safeUser});

        }catch(error:any){
            if(error.message==="USER_EXISTS"){return res.status(403).json({message:"Bu kullanıcı zaten mevcut."})}

            return res.status(500).json({message:"Sunucu hatası."})
        }

    }

    async loginController(req:Request, res:Response){

        const dto = plainToInstance(AuthLoginDTO, req.body);
        const errors = await validate(dto);

        if(errors.length>0){
            return res.status(400).json({message: "Lütfen geçerli veri giriniz.",
                errors,
            });
        }

        const {email, password} = dto;

        try{
            const lUser = await this.authService.login(email, password);
            const { user:{id} , tokens } = lUser;
         
            return res.status(200).json({message:"Giriş yapıldı.", 
                user:{user:{id}, email, tokens}
            });


        }catch(error:any){
            if(error.message==="USER_NOT_FOUND"){return res.status(404).json({message:"Kullanıcı bulunamadı."})};
            if(error.message==="NOT_ALLOWED"){return res.status(403).json({message:"Kullanıcı henüz doğrulanmamış."})};
           
            if(error.message==="INVALID_PASS"){
            logger.warn('login.failed', {
                email,
                reason: error?.message,
                at: new Date().toISOString(),
           });
           return res.status(401).json({message:"Yanlış şifre."})
        }
           return res.status(500).json({message:"Sunucu hatası."})
        }

    }


    async getProfileController(req:Request, res:Response){
        const userId = (req as any ).user!.userId;

        try{
            const profile = await this.authService.getProfile(userId)
            return res.status(200).json({message:'Profiliniz: ', profile})
        }catch(error:any){
            if(error.message==="USER_NOT_FOUND"){
                return res.status(404).json({message:'Kullanıcı bulunamadı.'})
            }

            return res.status(500).json({message:"Sunucu hatası."})
        }

    }
}