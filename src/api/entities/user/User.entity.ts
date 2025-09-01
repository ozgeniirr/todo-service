import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 150, unique: true, type: "varchar" })
  email!: string;

  @Column({ type: "varchar" })
  password!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  firstName!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  lastName!: string | null;

  @Column({ type: "int", nullable: true })
  age!: number | null;

  @Column({ type: "boolean", default: false })
  isVerified!: boolean;

  @Column({ type: "varchar", length: 256, nullable: true })
  emailVerificationTokenHash!: string | null;

  @Column({ type: "timestamptz", nullable: true })
  emailVerificationTokenExpires!: Date | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}
