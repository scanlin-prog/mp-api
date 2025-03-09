import { Router } from 'express';
import PostController from '@controllers/posts';

const postRoutes = Router();

postRoutes.post('/posts', PostController.createPost)
postRoutes.get('/posts', PostController.getPosts)
postRoutes.get('/posts/:id', PostController.getPostById)
postRoutes.delete('/posts/:id', PostController.deletePost)

export default postRoutes;