import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1756466368841 implements MigrationInterface {
    name = 'Init1756466368841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(150) NOT NULL, "password" character varying NOT NULL, "firstName" character varying(100), "lastName" character varying(100), "age" integer, "isVerified" boolean NOT NULL DEFAULT false, "emailVerificationTokenHash" character varying(256), "emailVerificationTokenExpires" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
