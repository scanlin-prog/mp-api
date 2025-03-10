import { Router } from 'express';
import PostController from '@controllers/posts';

const postsRouter = Router();

postsRouter.post('/posts', PostController.createPost)
postsRouter.get('/posts', PostController.getPosts)
postsRouter.get('/posts/:id', PostController.getPostById)
postsRouter.delete('/posts/:id', PostController.deletePost)

export default postsRouter;