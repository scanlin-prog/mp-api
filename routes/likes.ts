import { Router } from 'express';
import LikeController from '@controllers/likes';

const likesRouter = Router();

likesRouter.post('/likes', LikeController.likePost);
likesRouter.delete('/likes/:id', LikeController.unlikePost);

export default likesRouter;