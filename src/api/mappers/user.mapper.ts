import { Role } from "@/enums/types/role";
import { User } from "../entities/user/User.entity";

export type UserDTO={
    id:string;
    email:string;
    firstName?: string | null;
    lastName?: string | null;
    role: Role;
    isVerified: boolean;

}

export function toUserDto (u:User): UserDTO{
    return {
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        isVerified:u.isVerified
    }
}