import { Router } from "express";
import { TodoController } from "../controllers/Todo.controller";
import { RouterLabel, RouterPath } from "@/enums/router.enums";
import { Routes } from "@/interfaces/routes.interface";
import { authenticateUser } from "@/middlewares/authenticateUser";
import { authorizeRole } from "@/middlewares/authRole";
import { Role } from "@/types/role";
import { ValidationMiddleware } from "@/middlewares/validationmiddlewares";
import { CreateTodoDTO, DeleteTodoDTO, UpdateTodoDTO } from "@/DTO/todo-dto";

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
        this.router.post(`${this.path}${RouterPath.Todo}`, authenticateUser,authorizeRole([Role.ADMIN]),ValidationMiddleware(CreateTodoDTO), this.todoRoute.createTodoController.bind(this.todoRoute));
        this.router.patch(`${this.path}${RouterPath.UpdateTodo}`, authenticateUser, authorizeRole([Role.ADMIN]), ValidationMiddleware(UpdateTodoDTO),  this.todoRoute.updateCompletedController.bind(this.todoRoute));
        this.router.delete(`${this.path}${RouterPath.DeleteTodo}`,authenticateUser, authorizeRole([Role.ADMIN]), ValidationMiddleware(DeleteTodoDTO), this.todoRoute.deleteTodo.bind(this.todoRoute));
        this.router.get(`${this.path}${RouterPath.GetTodo}`, authenticateUser,  this.todoRoute.getTodosCont.bind(this.todoRoute));

    }


}