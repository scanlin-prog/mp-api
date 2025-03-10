import { Router } from 'express';
import CommentController from '@controllers/comments';

const commentsRoutes = Router();

commentsRoutes.post('/comments', CommentController.createComment);
commentsRoutes.delete('/comments/:id', CommentController.deleteComment);

export default commentsRoutes;