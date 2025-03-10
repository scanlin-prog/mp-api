import { NextFunction, Request } from 'express';

import BadRequestError from '@errors/bad-request';
import UnauthorizedError from '@errors/unauthorized';

import type { IRequestUser } from 'types/user';

// Обработчик ошибки авторизации
const handleUnauthorizedError = (value: any) => {
    if (!value) {
        throw new UnauthorizedError('Неверный логин или пароль');
    }
}

// Обработчик пользователя из запроса
const handleRequestUserId = (req: Request) => {
    if (!req.user) {
        console.log('Отсутствует пользователь в запросе');
        return null;
    }
    return (req.user as IRequestUser).userId;
}

// Обработчик стандартных ошибок
const handleError = (error: any, next: NextFunction) => {
    const err = error as Error
    if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
    }

    console.error(err)
    next(error);
};

export {
    handleUnauthorizedError,
    handleRequestUserId,
    handleError
}