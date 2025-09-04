import { Request, Response, NextFunction } from "express";
import { User } from "@/api/entities/user/User.entity";
import { AppDataSource } from "@/config/data-source";


export async function loadUserEmail (req:Request, res:Response, next:NextFunction) {
    const email = (req.body?.email ) as string | undefined
    if(!email){return res.status(400).json({message:"Email girilmesi zorunludur."})}

    const user = await AppDataSource.getRepository(User).findOne({where:{email}})

    if(!user){return res.status(400).json({message:'Kullanıcı bulunamadı.'})}

    (req as any).userbyemail= user;

    return next();


}



