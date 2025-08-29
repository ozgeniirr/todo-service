import { AppDataSource } from "../../config/data-source";
import { AuthService } from "../services/Auth.service";
import { User } from "../user/User.entity";
import { Request, Response } from "express";
import { AuthRegisterDTO } from "../../middlewares/validate-dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";




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
}