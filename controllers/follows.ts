import { NextFunction, Request, Response } from 'express';
import prisma from 'prisma/prisma-client';

import BadRequestError from '@errors/bad-request';
import ForbiddenError from '@errors/forbidden';
import NotFoundError from '@errors/not-found';

import { 
    handleError,
    handleRequestUserId
} from '@utils/utils';

const FollowController = {
    followUser: async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<any> => {
        try {
            const { followingId } = req.body;
            const userId = handleRequestUserId(req);

            // Проверка на подписчика и подписку
            if (followingId === userId) {
                throw new ForbiddenError(
                    'Вы не можете быть подписанным на самого себя'
                );
            }

            // Проверка существования id пользователя
            if (!userId) {
                throw new NotFoundError('Не удалось найти пользователя');
            };

            const subscription = await prisma.follows.findFirst({
                where: {
                    AND: [
                        { followerId: userId },
                        { followingId }
                    ]
                }
            })

            // Проверка на существование подписки
            if (subscription) {
                throw new BadRequestError('Подписка уже существует');
            }

            await prisma.follows.create({
                data: {
                    follower: { connect: { id: userId } },
                    following: { connect: { id: followingId } },
                },
            });

            res.status(201).json({ message: 'Подписка успешно создана' });
        } catch (error) {
            handleError(error, next)
        }
    },
    unfollowUser: async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<any> => {
        try {
            const { followingId } = req.body;
            const userId = handleRequestUserId(req);

            // Проверка существования id пользователя
            if (!userId) {
                throw new NotFoundError('Не удалось найти пользователя');
            };

            // Проверка на подписчика и подписку
            if (followingId === userId) {
                throw new ForbiddenError(
                    'Вы не можете быть подписанным на самого себя'
                );
            }
            
            const subscription = await prisma.follows.findFirst({
                where: {
                    AND: [
                        { followerId: userId }, 
                        { followingId }
                    ]
                },
            });

            // Проверка на существование подписки
            if (!subscription) {
                throw new NotFoundError('Подписка не найдена');
            }

            await prisma.follows.delete({
                where: { id: subscription.id },
            });

            res.status(204).json({ message: 'Отписка успешно выполнена' });
        } catch (error) {
            handleError(error, next)
        }
    },
}

export default FollowController;