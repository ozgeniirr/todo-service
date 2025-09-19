import { AppDataSource } from "@/config/data-source";
import dotenv from 'dotenv'
import { User } from "@/api/entities/user/User.entity";
import { Role } from "@/types/role";
import { AppError } from "@/errors/App.error";
import bcrypt  from "bcrypt";
dotenv.config();

export async function seedAdmin (){
    const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "";
    if(!email || !password){throw new AppError(400, "INVALID_PASS")}

    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(User);
    const existing = await repo.findOne({where:{email}})
    
    
    if (!existing) {
        const hashed = await bcrypt.hash(password, 11);
        const admin = repo.create({ email, password: hashed, role: Role.ADMIN, isVerified: true });
        await repo.save(admin);
        console.log(`Admin oluşturuldu: ${email}`);
    
    } else if (existing.role !== Role.ADMIN) {
        existing.role = Role.ADMIN;
        await repo.save(existing);
        console.log(`Mevcut kullanıcı ADMIN yapıldı: ${email}`);
    } else {
        console.log(`Zaten ADMIN: ${email}`);
    }
    
    await AppDataSource.destroy();

}


if (require.main === module) {
    seedAdmin().catch((e) => { console.error("Seed hata:", e); process.exit(1); });

}

