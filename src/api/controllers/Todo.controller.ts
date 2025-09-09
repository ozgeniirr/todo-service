import { TodoService } from "../services/Todo.service";
import { Request,Response } from "express";


export class TodoController{
    private todoService = new TodoService();

    async createTodoController(req: Request, res: Response) {
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
  } catch (error: any) {
    if (error?.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
    return res.status(500).json({ message: "Sunucu hatası" });
  }
}
}