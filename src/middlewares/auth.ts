import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';

import UnauthorizedError from '@errors/unauthorized';
import ForbiddenError from '@errors/forbidden';

const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Получаем токен из заголовка Authorization
  const authHeader = req.headers['authorization'];

  // Проверям, есть ли токен
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = extractBearerToken(authHeader);

  // Если нет ключа, вывести ошибку и прервать функцию
  if (!JWT_SECRET) {
    console.log('Отсутствует секретный ключ');
    return;
  }

  let payload;
  // Проверяем токен
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );

    req.user = payload;

    if (!req.user) {
      throw new ForbiddenError('Отказано в доступе');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticateToken;
