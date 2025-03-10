import { Router } from 'express';
import PostController from '@controllers/posts';

const postsRoutes = Router();

postsRoutes.post('/posts', PostController.createPost)
postsRoutes.get('/posts', PostController.getPosts)
postsRoutes.get('/posts/:id', PostController.getPostById)
postsRoutes.delete('/posts/:id', PostController.deletePost)

export default postsRoutes;