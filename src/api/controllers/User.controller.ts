import { UserService } from "../services/User.service";
import { Request, Response, NextFunction } from "express";
import { IdParamDTO, RoleUpdateDTO } from "@/DTO/Role.update-dto";


export class UserController{
    constructor(private svc = new UserService()){}

    updateRole = async (req:Request, res:Response, next:NextFunction)=>{
        try{


            const { id } = ((req as any).validatedParams ?? req.params) as IdParamDTO;

            const { role } = ((req as any).validated ?? req.body) as RoleUpdateDTO;

            const actorId = (req as any).user.userId;
            
            
            const results = await this.svc.changeRole({actorId, targetUserId: id, role });
            return res.status(200).json({message:"Kullanıcı rolü güncellendi.", data: results});

            
        }catch(e){
            return next(e)
        }

    }
}
