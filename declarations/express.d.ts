import type { JwtPayload } from 'jsonwebtoken';
import type { IRequestUser } from 'types/user';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload | string | IRequestUser;
  }
}

export {};
