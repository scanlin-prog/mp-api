import { NextFunction, Request } from 'express';

import BadRequestError from '@errors/bad-request';

import type { IRequestUser } from 'types/user';

// Обработчик пользователя из запроса
const handleRequestUserId = (req: Request) => {
  if (!req.user) {
    console.log('Отсутствует пользователь в запросе');
    return null;
  }
  return (req.user as IRequestUser).userId;
};

// Обработчик стандартных ошибок
const handleError = (error: unknown, next: NextFunction) => {
  const err = error as Error;
  if (err.name === 'ValidationError') {
    throw new BadRequestError('Переданы некорректные данные');
  }

  console.error(err);
  next(error);
};

export { handleRequestUserId, handleError };
