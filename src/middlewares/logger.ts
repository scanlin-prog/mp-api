import winston from 'winston';
import expressWinston from 'express-winston';

// Логгер для записи информации об HTTP-запросах
const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'logs/request.log' })],
  format: winston.format.json(),
});

// Логгер для записи информации об ошибках
const errorLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'logs/error.log' })],
  format: winston.format.json(),
});

export { requestLogger, errorLogger };
