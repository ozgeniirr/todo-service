import { DataSource } from 'typeorm';
import { User } from '../api/entities/user/User.entity';
import 'dotenv/config';
import { Todo} from '@/api/entities/todos/Todo.entity';

console.log('DB HOST', process.env.DB_HOST, 'DB', process.env.DB_NAME, 'SCHEMA', process.env.DB_SCHEMA);

export const AppDataSource = new DataSource({
  
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Todo],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  synchronize: true,
  logging: false,
});

console.log("DB HOST", process.env.DB_HOST);

