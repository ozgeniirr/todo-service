import { DataSource } from 'typeorm';
import { User } from '../api/user/User.entity';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  synchronize: true,
  logging: false,
});

console.log("DB HOST", process.env.DB_HOST);

