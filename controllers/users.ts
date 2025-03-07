import { NextFunction, Request, Response } from 'express';
import prisma from 'prisma/prisma-client';
import path from 'path';
import fs from 'fs'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Jdenticon from 'jdenticon'

import BadRequestError from '@errors/bad-request';
import UnauthorizedError from '@errors/unauthorized';
import NotFoundError from '@errors/not-found';
import ConflictError from '@errors/conflict';
import ForbiddenError from '@errors/forbidden';

import type { IRequestUser } from 'types/user';

const { NODE_ENV, JWT_SECRET } = process.env;

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
    next(error);
};

const UserController = {
    register: async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<any> => {
        const { email, password, name } = req.body
        
        try {
            // Проверка обязательных полей
            if (!email || !password || !name) {
                throw new BadRequestError('Все поля обязательные!');
            }

            // Проверка существующего пользователя
            const existingUser = await prisma.user.findUnique(
                ({ 
                    where: { email }
                })
            )

            if (existingUser) {
                throw new ConflictError('Пользователь уже существует')
            }

            // Хеширование пароля
            const hashedPassword = await bcrypt.hash(password, 10);

            // Генерация аватара
            const png = Jdenticon.toPng(name, 100);
            const avatarName =  `${name}_${Date.now()}.png`
            const avatarPath = path.join('uploads/', avatarName)
            fs.writeFileSync(avatarPath, png)

            // Создание нового пользователя
            const user = await prisma.user.create(
                {
                    data: {
                        email,
                        password: hashedPassword,
                        name,
                        avatarUrl: `${avatarPath}`
                    }
                }
            )

            res.status(201).json(user)
        } catch (error) {
            handleError(error, next)
        }
    },
    login: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> => {
        const { email, password } = req.body;

        try {
            // Проверка обязательных полей
            if (!email || !password) {
                throw new BadRequestError('Все поля обязательные!');
            }

            // Поиск пользователя
            const user = await prisma.user.findUnique(
                ({ 
                    where: { email }
                })
            )

            // Оставляем такой код, потому что TS ругается
            // на отсутствие пользователя даже при работе обработчика
            if (!user) {
                throw new UnauthorizedError('Неверный логин или пароль');
            }

            // Проверка пароля
            const valid = await bcrypt.compare(password, user.password);

            handleUnauthorizedError(valid);

            // Проверка переменной окружения
            if (!JWT_SECRET) {
                console.log('Отсутствует секретный ключ')
                return
            }

            // Получение токена авторизации 
            // и запись id пользователя в userId запроса пользователя
            const token = jwt.sign(
                { userId: user.id },
                NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
                { expiresIn: '7d' }
            );

            res.status(200).json({ token });
        } catch (error) {
            handleError(error, next)
        }
    },
    getUserById: async (
        req: Request, 
        res: Response,
        next: NextFunction
    ): Promise<any> => {
        const { id } = req.params;
        const userId = handleRequestUserId(req);
    
        // Проверка существования id пользователя
        if (!userId) return;
        
        try {
            const user = await prisma.user.findUnique({
                where: { id },
                include: { 
                    followers: true,
                    following: true
                }
            })

            handleUnauthorizedError(user);

            // Проверяем, подписан ли текущий пользователь на пользователя
            const isFollowing = await prisma.follows.findFirst({
                where: {
                    AND: [
                        { followerId: userId },
                        { followingId: id }
                    ]
                }
            });

            res.status(200).json({ ...user, isFollowing: Boolean(isFollowing) });
        } catch (error) {
            handleError(error, next)
        }
    },
    updateUser: async (
        req: Request, 
        res: Response,
        next: NextFunction
    ): Promise<any> => {
        const { id } = req.params;
        const { email, name, dateOfBirth, bio, location } = req.body;
        const userId = handleRequestUserId(req);
    
        // Проверка существования id пользователя
        if (!userId) return;

        let filePath;

        // Проверка на наличие файла и пути к файлу в запросе
        if (req.file && req.file.path) {
            filePath =  req.file.path;
        }

        try {
            // Проверка, что пользователь обновляет свою информацию
            if (id !== userId) {
                throw new ForbiddenError('Доступ запрещен');
            }

            if (email) {
                const existingUser = await prisma.user.findFirst({
                    where: { email: email },
                });
            
                if (existingUser && existingUser.id !== id) {
                    throw new BadRequestError('Почта уже используется');
                }
            }

            // Обновляем данные пользователя
            const user = await prisma.user.update({
                where: { id },
                data: {
                  email: email || undefined,
                  name: name || undefined,
                  avatarUrl: filePath ? `/${filePath}` : undefined,
                  dateOfBirth: dateOfBirth || undefined,
                  bio: bio || undefined,
                  location: location || undefined,
                },
            });

            res.status(200).json(user);
        } catch (error) {
            handleError(error, next)
        }
    },
    getCurrentUser: async (
        req: Request, 
        res: Response,
        next: NextFunction
    ): Promise<any> => {
        try {
            const userId = handleRequestUserId(req);
    
            // Проверка существования id пользователя
            if (!userId) return;

            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    followers: {
                        include: {
                            follower: true
                        }
                    },
                    following: {
                        include: {
                            following: true
                        }
                    }
                }
            });

            // Проверка существующего пользователя
            if (!user) {
                throw new NotFoundError('Не удалось найти пользователя');
            }

            res.status(200).json(user)
        } catch (error) {
            handleError(error, next)
        }
    },
};

export default UserController;