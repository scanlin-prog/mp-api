import { Router } from 'express';
import { celebrate } from 'celebrate';

import { followValidation, unfollowValidation } from '@middlewares/validation';

import FollowController from '@controllers/follows';

const followsRouter = Router();

followsRouter.post(
  '/follows',
  celebrate(followValidation),
  FollowController.followUser,
);
followsRouter.delete(
  '/follows/:id',
  celebrate(unfollowValidation),
  FollowController.unfollowUser,
);

export default followsRouter;
