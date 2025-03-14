import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  checkIdValidation,
  createCommentValidation,
} from '@middlewares/validation';

import CommentController from '@controllers/comments';

const commentsRouter = Router();

commentsRouter.post(
  '/comments',
  celebrate(createCommentValidation),
  CommentController.createComment,
);
commentsRouter.delete(
  '/comments/:id',
  celebrate(checkIdValidation),
  CommentController.deleteComment,
);

export default commentsRouter;
