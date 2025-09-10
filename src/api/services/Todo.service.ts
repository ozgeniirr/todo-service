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


    async updateCompleted(userId: string, email: string, title: string, completed: boolean) {
        const user = userId
        ? await this.userRepo.findOne({ where: { id: userId } })
        : await this.userRepo.findOne({ where: { email } });

        if (!user) throw new Error("USER_NOT_FOUND");
        const todo = await this.todoRepo.findOne({
            where: { title, user: { id: user.id } }, 
            relations: { user: true },                
        });
        if (!todo) throw new Error("TODO_NOT_FOUND");
        todo.completed = !!completed;
        await this.todoRepo.save(todo);
        return {
            userId: todo.user.id,
            email: todo.user.email,
            title: todo.title,
            completed: todo.completed,
        };
    }
    
    async delete (userId: string, title:string){
        const todo = await this.todoRepo.findOne({
            where:{
                title,
                user:{
                    id:userId
                }
            },
            relations:{
                user:true
            },
        });

        if(!todo){
            throw new Error("TODO_NOT_FOUND")
        }

        await this.todoRepo.delete({id: todo.id})

        return {
            userId: todo.user.id,
            title: todo.title,
            completed: todo.completed,
        }
    }


    async getTodos(userId:string){
        const todos = await this.todoRepo.find({
            where:{user:{id:userId}},
            order:{ createdAt: "DESC"}
        });

        return todos.map( t => ({
            userId,
            title: t.title,
            completed: t.completed
        }));
    }
}