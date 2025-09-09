import 'reflect-metadata';   
import { AppDataSource } from './config/data-source';
import App from './App';
import dotenv from 'dotenv';
import { createServer, type RequestListener } from 'http';

dotenv.config();

const application = new App();
const server = createServer(application.app);

AppDataSource.initialize()
  .then(async () => {
    console.log('Database connected');
    await application.loadServer(); // route’ları mount et
    server.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
