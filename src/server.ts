import 'reflect-metadata'
import { AppDataSource } from './config/data-source'
import App from './App'
import dotenv from 'dotenv'
import { createServer, type RequestListener } from 'http'
import { logger } from './lib/logger' 

dotenv.config()


logger.initialization()
logger.client.info('Boot: starting app')

const application = new App()
const server = createServer(application.app)


AppDataSource.initialize()
  .then(async () => {
    logger.client.info('Boot: DB connected')

    await application.loadServer()
    const port = Number(process.env.PORT || 3000)

    server.listen(port, () => {
      logger.client.info('Boot: HTTP server listening', { port })  
    })
  })
  .catch((err) => {
    logger.client.error('Boot: DB connection failed', { error: err.message }) 
  })
