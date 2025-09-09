import { Router } from "express";
import { TodoController } from "../controllers/Todo.controller";
import { RouterLabel, RouterPath } from "@/enums/router.enums";
import { Routes } from "@/interfaces/routes.interface";

export class TodoRoute implements Routes{
    private static instance :TodoRoute
    private path = "/";
    public label = RouterLabel.Todo
    public router: Router
    private todoRoute : TodoController

    constructor(){
        this.router = Router()
        this.todoRoute = new TodoController()
        this.initializeRoutes()

    }

    public static triggerTodo(): TodoRoute{
        if(!TodoRoute.instance){
            TodoRoute.instance = new TodoRoute()
        }

        return TodoRoute.instance
    }

    private initializeRoutes(){
        this.router.post(`${this.path}${RouterPath.Todo}`, this.todoRoute.createTodoController.bind(this.todoRoute))
    }


}