import { AppDataSource } from "@/config/data-source";
import { User } from "../entities/user/User.entity";
import { Todo } from "../entities/todos/Todo.entity";


export class TodoService{
    private todoRepo = AppDataSource.getRepository(Todo)
    private userRepo = AppDataSource.getRepository(User)

    async createTodo(userId:string,email:string, title:string, completed:boolean){

        const user = await this.userRepo.findOneBy({email})
        if(!user){
            throw new Error("USER_NOT_FOUND")
        }
        
        
        title = title.trim();
        completed = !!completed;

        const todo = this.todoRepo.create({
            title,
            completed,
            user: user,
        })

        await this.todoRepo.save(todo);

        return {
            userId: user.id,
            email: user.email,
            title: todo.title,
            completed: todo.completed,
        };
    }


}