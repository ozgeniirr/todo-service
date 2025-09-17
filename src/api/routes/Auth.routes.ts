import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";
import { authenticateUser } from "../..//middlewares/authenticateUser";
import { loadUserEmail } from "@/middlewares/loadUserByEmail";
import { RouterLabel, RouterPath } from "@/enums/router.enums";
import { ValidationMiddleware } from "@/middlewares/validationmiddlewares";
import { AuthLoginDTO, AuthRegisterDTO } from "@/DTO/Auth-dto";
import { Routes } from "@/interfaces/routes.interface";


export class AuthRoute implements Routes{
    private static instance: AuthRoute
    private path = "/";
    public label = RouterLabel.Auth
    public router: Router
    private authRoute : AuthController

    constructor(){
        this.router = Router()
		this.authRoute = new AuthController()
        this.initializeRoutes()

    }

    public static triggerUser(): AuthRoute{
        if(!AuthRoute.instance){
            AuthRoute.instance = new AuthRoute()
        }

        return AuthRoute.instance
    }

    private initializeRoutes(){
        
        this.router.post(`${this.path}${RouterPath.RegisterEndpoint}`,  ValidationMiddleware(AuthRegisterDTO), this.authRoute.registerController.bind(this.authRoute))
        this.router.post(`${this.path}${RouterPath.Login}`, ValidationMiddleware(AuthLoginDTO), this.authRoute.loginController.bind(this.authRoute))
        this.router.get(`${this.path}${RouterPath.Profile}`,authenticateUser, this.authRoute.getProfileController.bind(this.authRoute))

             
    }
}


