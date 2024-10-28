import { UserType } from './src/models/user';

declare global {
  namespace Express {
    export interface Request {
      user?: Omit<UserType, 'password'>;
    }
  }
}
