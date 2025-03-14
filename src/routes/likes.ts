import { Router } from 'express';
import { celebrate } from 'celebrate';

import { checkIdValidation, likePostValidation } from '@middlewares/validation';

import LikeController from '@controllers/likes';

const likesRouter = Router();

likesRouter.post(
  '/likes',
  celebrate(likePostValidation),
  LikeController.likePost,
);
likesRouter.delete(
  '/likes/:id',
  celebrate(checkIdValidation),
  LikeController.unlikePost,
);

export default likesRouter;
