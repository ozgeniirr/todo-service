import { IsEnum } from "class-validator";
import { Role } from "@/enums/types/role";
import { IsUUID } from "class-validator";

export class RoleUpdateDTO {
  @IsEnum(Role)
  role!: Role;
}


export class IdParamDTO {
  @IsUUID()
  id!: string;
}
