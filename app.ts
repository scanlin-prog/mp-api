import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

import { HttpError } from 'http-errors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import cors from 'cors';
import { errors } from 'celebrate';

import { requestLogger, errorLogger } from '@middlewares/logger';

import router from '@routes/index';

// Загрузка переменных окружения с .env в приложение
dotenv.config();

const app: Express = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Подключение обработчика логирования запросов
app.use(requestLogger);

// Раздача статических файлов
app.use('/uploads', express.static('uploads'));

// Подключение маршрутов
app.use('/api', router);

// Подключение обработчика логирования ошибок
app.use(errorLogger);

// Обработка ошибок библиотеки celebrate
app.use(errors());

// Создает папку uploads, если ее нет
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Обработчик ошибок
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

export default app;
