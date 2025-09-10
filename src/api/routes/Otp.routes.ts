import { Router } from "express";
import { Routes } from "@/interfaces/routes.interface";
import { RouterLabel, RouterPath } from "@/enums/router.enums";
import { OtpController } from "../controllers/Otp.controller";
import { requireExistingUser } from "@/middlewares/requireExistingUser";
import { loadUserEmail } from "@/middlewares/loadUserByEmail";



export class OtpRoute implements Routes{
    private static instance : OtpRoute
    private path = "/";
    public label = RouterLabel.Otp
    public router: Router
    private otpRoute : OtpController

    constructor(){
        this.router = Router()
        this.otpRoute = new OtpController()
        this.initializeRoutes()

    }

    public static triggerUser(): OtpRoute{
        if(!OtpRoute.instance){
            OtpRoute.instance = new OtpRoute()
        }
        return OtpRoute.instance
    }

    private initializeRoutes(){
        this.router.post(`${this.path}${RouterPath.SendOtp}`,loadUserEmail,requireExistingUser, this.otpRoute.sendOtp.bind(OtpRoute))
        this.router.post(`${this.path}${RouterPath.VerifyOtp}`, loadUserEmail, requireExistingUser, this.otpRoute.verifyOtp.bind(OtpRoute))
    }
}