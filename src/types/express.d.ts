import "express";


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