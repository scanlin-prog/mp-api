import { Router } from 'express';
import CommentController from '@controllers/comments';

const commentsRouter = Router();

commentsRouter.post('/comments', CommentController.createComment);
commentsRouter.delete('/comments/:id', CommentController.deleteComment);

export default commentsRouter;