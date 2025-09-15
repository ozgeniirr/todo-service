import winston from "winston";

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    winston.format.printf((info) => {
      const meta = info.metadata && Object.keys(info.metadata).length
        ? ' ' + JSON.stringify(info.metadata)
        : ''
      return `${info.timestamp} ${info.level}: ${info.message}${meta}`
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/email-server.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "logs/email-server-error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/email-server-warn.log",
      level: "warn",
    }),

  ],
});


