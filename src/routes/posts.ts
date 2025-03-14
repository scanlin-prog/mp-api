import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  createPostValidation,
  checkIdValidation,
} from '@middlewares/validation';

import PostController from '@controllers/posts';

const postsRouter = Router();

postsRouter.post(
  '/posts',
  celebrate(createPostValidation),
  PostController.createPost,
);
postsRouter.get('/posts', PostController.getPosts);
postsRouter.get(
  '/posts/:id',
  celebrate(checkIdValidation),
  PostController.getPostById,
);
postsRouter.delete(
  '/posts/:id',
  celebrate(checkIdValidation),
  PostController.deletePost,
);

export default postsRouter;
