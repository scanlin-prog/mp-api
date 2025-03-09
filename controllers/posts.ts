import { NextFunction, Request, Response } from 'express';
import prisma from 'prisma/prisma-client';

import BadRequestError from '@errors/bad-request';
import ForbiddenError from '@errors/forbidden';
import NotFoundError from '@errors/not-found';

import { 
    handleError,
    handleRequestUserId
} from '@utils/utils';

const PostController = {
    createPost: async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<any> => {
        const { content } = req.body;

        try {
            const authorId = handleRequestUserId(req);

            // Проверка существования id пользователя
            if (!authorId) {
                throw new NotFoundError('Не удалось найти пользователя');
            };

            if (!content) {
                throw new BadRequestError('Все поля обязательные!');
            }

            const post = await prisma.post.create({
                data: {
                  content,
                  authorId
                },
            });

            res.status(200).json(post);
        } catch (error) {
            handleError(error, next)
        }
    },
    getPosts: async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<any> => {
        try {
            const userId = handleRequestUserId(req);

            // Проверка существования id пользователя
            if (!userId) {
                throw new NotFoundError('Не удалось найти пользователя');
            };

            const posts = await prisma.post.findMany({
              include: {
                likes: true,
                author: true,
                comments: true
              },
              orderBy: {
                createdAt: 'desc' // сортировка по убыванию
              }
            });

            const postsWithLikeInfo = posts.map(post => ({
              ...post,
              likedByUser: post.likes.some(like => like.userId === userId)
            }));

            res.status(200).json(postsWithLikeInfo);
        } catch (error) {
            handleError(error, next)
        }
    },
    getPostById: async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<any> => {
        const { id } = req.params;

        try {
            const userId = handleRequestUserId(req);

            // Проверка существования id пользователя
            if (!userId) {
                throw new NotFoundError('Не удалось найти пользователя');
            };

            const post = await prisma.post.findUnique({
                where: { id },
                include: {
                    comments: {
                        include: {
                            user: true,
                        }
                    },
                    likes: true,
                    author: true
                },
            });

            // Проверка на существование поста
            if (!post) {
                throw new BadRequestError('Пост не найден');
            }

            const postWithLikeInfo = {
                ...post,
                likedByUser: post.likes.some(like => like.userId === userId)
            };

            res.status(200).json(postWithLikeInfo);
        } catch (error) {
            handleError(error, next)
        }
    },
    deletePost: async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<any> => {
        const { id } = req.params;

        try {
            const userId = handleRequestUserId(req);

            // Проверка существования id пользователя
            if (!userId) {
                throw new NotFoundError('Не удалось найти пользователя');
            };

            const post = await prisma.post.findUnique(
                { where: { id } }
            );

            // Проверка на существование поста
            if (!post) {
                throw new BadRequestError('Пост не найден');
            }

            if (post.authorId !== userId) {
                throw new ForbiddenError('Доступ запрещен');
            }

            const transaction = await prisma.$transaction([
                prisma.comment.deleteMany({ where: { postId: id } }),
                prisma.like.deleteMany({ where: { postId: id } }),
                prisma.post.delete({ where: { id } }),
            ]);

            res.status(204).json(transaction);
        } catch (error) {
            handleError(error, next)
        }
    },
}

export default PostController