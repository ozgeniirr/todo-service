import jwt, { decode } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { verifyRefreshToken, signAccessToken } from '../utils/jwt'


export function authenticateUser ( req:Request, res:Response, next:NextFunction){
    const autHeader = req.headers.authorization;

    if(!autHeader){
        return res.status(400).json({message:"Yetkisiz işlem"})
    }

    const token = autHeader.split(" ")[1];

    try{

        const decoded= verifyRefreshToken(token);
        (req as any).user = decoded;

        next();

    }catch(error:any){
        return res.status(403).json({message:"Geçersiz veya süresi dolmuş token."})
    }

}
