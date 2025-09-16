import { AuthService } from "../services/Auth.service";
import { Request, Response, NextFunction } from "express";
import { AuthLoginDTO, AuthRegisterDTO } from "../../DTO/Auth-dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { logger } from "../../lib/logger";




export class AuthController{
    private authService = new AuthService();

    async registerController(req:Request, res:Response, next:NextFunction){

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
        
        }catch (e) {
            return next(e); 
        }
    }


    async loginController(req: Request, res: Response, next:NextFunction) {
        const dto = plainToInstance(AuthLoginDTO, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) {
            return res.status(400).json({
                message: "Lütfen geçerli veri giriniz.",
                errors,
            });
        }
        
        const { email, password } = dto;
        
        try {
            const lUser = await this.authService.login(email, password);
            const {
                user: { id, email: userEmail, role },
                tokens: { accessToken, refreshToken },
            } = lUser;
            
            return res.status(200).json({
                message: "Giriş yapıldı.",
                user: { id, email: userEmail,role},
                tokens: { accessToken },
                rToken: {refreshToken}
            
            });
        
        }catch (e) {
            return next(e); 
        }
    
    }


    async getProfileController(req:Request, res:Response, next:NextFunction){
        const userId = (req as any ).user!.userId;

        try{
            const profile = await this.authService.getProfile(userId)
            return res.status(200).json({message:'Profiliniz: ', profile})
        }catch (e) {
            return next(e); 
        }

    }
}
