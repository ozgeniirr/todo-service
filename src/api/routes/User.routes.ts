import { Router } from "express";
import { UserController } from "../controllers/User.controller";
import {authenticateUser} from "@/middlewares/authenticateUser"
import {authorizeRole} from "@/middlewares/authRole"
import { RouterLabel, RouterPath } from "@/enums/router.enums";
import { ValidationMiddleware } from "@/middlewares/validationmiddlewares";
import { Routes } from "@/interfaces/routes.interface";
import { Role } from "@/enums/types/role";
import { IdParamDTO, RoleUpdateDTO } from "@/DTO/Role.update-dto";
import { ValidateParams } from "@/middlewares/validateParams";


export class UserRoute implements Routes{
    private static instance: UserRoute
    private path= "/";
    public label= RouterLabel.User
    public router : Router
    private userRoute : UserController

    constructor(){
        this.router=Router()
        this.userRoute = new UserController()
        this.initializeRoutes()

    }

    public static triggerUser(): UserRoute{
        if(!UserRoute.instance){
            UserRoute.instance = new UserRoute()
        }

        return UserRoute.instance

    }

    private initializeRoutes(){

        this.router.patch(`${this.path}${RouterPath.UpdateRole}${this.path}:id`,authenticateUser,authorizeRole(Role.ADMIN),ValidateParams(IdParamDTO),ValidationMiddleware(RoleUpdateDTO), this.userRoute.updateRole.bind(this.userRoute))



    }
    
}