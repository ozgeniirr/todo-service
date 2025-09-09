import { Router } from "express";
import { Routes } from "@/interfaces/routes.interface";
import { RouterLabel, RouterPath } from "@/enums/router.enums";
import { OtpController } from "../controllers/Otp.controller";



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
        this.router.post(`${this.path}${RouterPath.SendOtp}`, this.otpRoute.sendOtp.bind(OtpRoute))
        this.router.post(`${this.path}${RouterPath.VerifyOtp}`, this.otpRoute.verifyOtp.bind(OtpRoute))
    }
}