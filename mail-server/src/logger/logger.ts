import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
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
    new winston.transports.File({
      filename: "logs/email-server-debug.log",
      level: "debug",
    }),
  ],
});

export const client = logger;
