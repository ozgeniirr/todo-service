import winston from 'winston'
const { createLogger, format, transports } = winston

class CustomLogger {
  private _logger!: winston.Logger

  public initialization(): void {
    try {
      this._logger = createLogger({
        level: 'info',
        transports: [
          new transports.Console({
            format: format.combine(
              format.colorize({ all: true }),
              format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
              format.ms(),
              format.printf(({ level, message, timestamp, ms }) => {
                return `${timestamp} ${level}: ${message} : ${ms}`
              })
            ),
          }),

          new transports.File({
            filename: 'app.log',
            format: format.combine(
              format.timestamp(),
              format.errors({ stack: true }),
              format.json()
            ),
          }),
        ],
      })

      this.client.info('Logger initialized')
    } catch (error: any) {
      this.client.error(error.message)
    }
  }

  get client() {
    return this._logger
  }
}

export const logger = new CustomLogger()
