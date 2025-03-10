import { NextFunction, Request, Response } from 'express';
import prisma from 'prisma/prisma-client';

import BadRequestError from '@errors/bad-request';
import ForbiddenError from '@errors/forbidden';
import NotFoundError from '@errors/not-found';

import { 
    handleError,
    handleRequestUserId
} from '@utils/utils';

const LikeController = {
    likePost: async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<any> => {
        try {
            const { postId } = req.body;
            const userId = handleRequestUserId(req);
    
            if (!postId) {
                throw new BadRequestError('Все поля обязательные!');
            }

            // Проверка существования id пользователя
            if (!userId) {
                throw new NotFoundError('Не удалось найти пользователя');
            };

            const existingLike = await prisma.like.findFirst({
                where: { postId, userId },
            });
        
            if(existingLike) {
                throw new BadRequestError(
                    'Вы уже поставили лайк этому посту'
                );
            }
        
            const like = await prisma.like.create({ 
                data: { postId, userId },
            });
        
            res.status(201).json(like);
        } catch (error) {
            handleError(error, next)
        }
    },
    unlikePost: async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<any> => {
        try {
            const { id } = req.params; // id поста
            const userId = handleRequestUserId(req);

            // Проверка существования id пользователя
            if (!userId) {
                throw new NotFoundError('Не удалось найти пользователя');
            };

            const existingLike = await prisma.like.findFirst({
                where: { postId: id, userId },
            });

            // Проверка на существование лайка
            if(!existingLike) {
                throw new BadRequestError('Лайк не найден');
            }

            if (existingLike.userId !== userId) {
                throw new ForbiddenError('Доступ к удалению лайка запрещен');
            }

            const like = await prisma.like.deleteMany({
                where: { postId: id, userId },
            });

            res.status(204).json(like);
        } catch (error) {
            handleError(error, next)
        }
    }
}

export default LikeController;