import { TodoService } from "../services/Todo.service";
import { Request,Response, NextFunction } from "express";


export class TodoController{
  
  private todoService = new TodoService();
  async createTodoController(req: Request, res: Response, next:NextFunction) {
    const userId =
    (req as any)?.user?.userId ??
    (req as any)?.userId ??
    req.body?.userId ?? null;
    const { email, title, completed } = req.body ?? {};
    
    try {
      if (!userId && !email) {
        return res.status(401).json({ message: "Kullanıcı kimliği (userId) veya email gerekli" });
      }
      
      if (!title || !String(title).trim()) {
        return res.status(400).json({ message: "title gerekli" });
      }
      
      const todo = await this.todoService.createTodo(
        userId ?? "",
        email ?? "",
        String(title),
        Boolean(completed)
      
      );
      return res.status(201).json({ message: "Yapılacak iş eklendi", todo });
    
    }catch (e) {
      return next(e); 
    }
  }


async updateCompletedController(req: Request, res: Response, next:NextFunction) {
    const authUser = (req as any)?.user; 
    const userId = authUser?.userId as string | undefined
    const emailFromToken = authUser?.email;  
    const { title, completed } = req.body ?? {};
    
    const completedBool =
      completed === true ||
      completed === "true" ||
      completed === 1 ||
      completed === "1";

    try {
      if (!userId) {  
        return res.status(401).json({ message: "Yetkilendirme gerekli" });
      }

      if (!title || !String(title).trim()) {
        return res.status(400).json({ message: "title gerekli" });
      }
      if (completed === undefined) {
        return res.status(400).json({ message: "completed gerekli" });
      }

      const todo = await this.todoService.updateCompleted(
        userId,
        String(emailFromToken),
        String(title).trim(),
        completedBool
      );

      return res.status(200).json({ message: "Güncellendi", todo });
    }catch (e) {
      return next(e); 
    }
  
  }



  async deleteTodo (req:Request, res:Response, next:NextFunction){
    const authUser = (req as any)?.user; 
    const userId = authUser?.userId as string | undefined
    const title = String(req.body?.title ?? "").trim();
    
    try{
      if (!userId) {
        return res.status(401).json({ message: "Yetkilendirme gerekli" });
      }
      
      const sanitizedTitle = String(title ?? "").trim();
      if (!sanitizedTitle) {
        return res.status(400).json({ message: "title gerekli" });
      
      }

      const deletTodo = await this.todoService.delete(userId, title);
      
      return res.status(200).json({message:"Görev silindi.", deletTodo})

    }catch (e) {
      return next(e); 
    }
  
  }

  async getTodosCont(req:Request, res:Response, next:NextFunction){
    const authUser = (req as any)?.user;
    const userId = authUser?.userId as string | undefined
    try{
      if(!userId){
        return res.status(401).json({message:"Yetkilendirme gerekli"})
      }

      const todoslist = await this.todoService.getTodos(userId)
      return res.status(200).json({message:"Görevleriniz: ", todoslist})
    }catch (e) {
      return next(e); 
    
    }
  
  }  
}  
