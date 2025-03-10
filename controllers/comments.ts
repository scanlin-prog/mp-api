import { NextFunction, Request, Response } from 'express';
import prisma from 'prisma/prisma-client';

import BadRequestError from '@errors/bad-request';
import ForbiddenError from '@errors/forbidden';
import NotFoundError from '@errors/not-found';

import { 
    handleError,
    handleRequestUserId,
} from '@utils/utils';

const CommentController = {
    createComment: async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<any> => {
        try {
            const { postId, content } = req.body;

            if (!postId || !content) {
                throw new BadRequestError('Все поля обязательные!');
            }

            const userId = handleRequestUserId(req);

            if (!userId) {
                throw new NotFoundError('Не удалось найти пользователя');
            };
      
            const comment = await prisma.comment.create({
              data: {
                postId,
                userId,
                content
              },
            });
      
            res.status(201).json(comment);
        } catch (error) {
            handleError(error, next)
        }
    },
    deleteComment: async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<any> => {
        try {
            const { id } = req.params;
            const userId = handleRequestUserId(req);

            // Проверка существования id пользователя
            if (!userId) {
                throw new NotFoundError('Не удалось найти пользователя');
            };
      
            const comment = await prisma.comment.findUnique({ where: { id } });

            // Проверка на существование комментария
            if (!comment) {
                throw new NotFoundError('Комментарий не найден');
            }
      
            // Проверка, является ли пользователь владельцем комментария
            if (comment.userId !== userId) {
                throw new ForbiddenError(
                    'Недостаточно прав для данной операции'
                );
            }

            await prisma.comment.delete({ where: { id } });
      
            res.status(204).json(comment);
        } catch (error) {
            handleError(error, next)
        }
    }
}

export default CommentController