import { Request,Response, NextFunction } from "express";


export async function requireExistingUser (req:Request, res:Response, next:NextFunction){
    const user = (req as any).userbyemail;
    if(!user){return res.status(404).json({message:'Kullanıcı bulunamadı.'})}
    if(user.isVerified){return res.status(400).json({message:'Bu kullanıcı zaten doğrulanmış.'})}
    return next();
}
