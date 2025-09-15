import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Todo } from "../todos/Todo.entity";
import { Role } from "@/types/role";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 150, unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "enum", enum: Role, default: Role.USER })
  role!: string;

  @Column({ length: 100, nullable: true })
  firstName?: string;

  @Column({ length: 100, nullable: true })
  lastName?: string;

  @Column({ type: "int", nullable: true })
  age?: number;

  @Column({ default: false })
  isVerified!: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos!: Todo[];
}
