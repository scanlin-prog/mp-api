import { Router } from 'express';
import FollowController from '@controllers/follows';

const followsRouter = Router();

followsRouter.post('/follow', FollowController.followUser)
followsRouter.delete('/follow/:id', FollowController.unfollowUser)

export default followsRouter;