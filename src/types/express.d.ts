import "express";
import { Role } from "@/types/role";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email?: string; role?: Role };
    }
  }
}



declare module "express-serve-static-core"{
    interface user{
        id:string,
        email:string,
        password:string,
        firstName:string,
        lastName:string,
        age:number,
        isVerified:boolean,

    }
}