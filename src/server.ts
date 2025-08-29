import 'reflect-metadata';   
import { AppDataSource } from './config/data-source';
import app from './app';
import dotenv from 'dotenv';
import { createServer } from 'http';
dotenv.config();

const server = createServer(app);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    server.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
