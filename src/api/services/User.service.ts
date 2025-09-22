import { AppDataSource } from "@/config/data-source";
import { User } from "../entities/user/User.entity";
import { Role } from "@/enums/types/role";
import { AppError } from "@/errors/App.error";
import { toUserDto } from "../mappers/user.mapper";




type UpdateUserRoleInput = { actorId: string; targetUserId: string; role: Role };

export class UserService{
    private userRepo = AppDataSource.getRepository(User)


    async changeRole ({actorId, targetUserId, role}: UpdateUserRoleInput){
        return AppDataSource.manager.transaction(async(tx)=>{
            const repo = tx.getRepository(User);


            const target = await this.userRepo.findOne({where: { id:targetUserId}})
            if(!target){throw new AppError(404, "USER_NOT_FOUND")};

            if(target.role=== role){
                throw new AppError(409, "ROLE_ALREADY_SET")
            }

            if (role === Role.USER && target.role === Role.ADMIN){
                const adminCount = await repo.count({where: {role: Role.ADMIN}})
                if(adminCount<=1){
                    throw new AppError(400, "CANNOT_DEMOTE_LAST_ADMIN")
                }

                if(actorId===targetUserId){
                    throw new AppError(400, "CANOT_SELF_DEMOTE")
                }
            }
            target.role=role;


            await repo.save(target);
            return toUserDto(target);

        });
    
    }
}