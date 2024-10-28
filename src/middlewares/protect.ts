import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../models/user';

export async function authorize(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 1) Getting token and check of it's there
  let token: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new Error(' log in to get access.'));
  }

  // 2) Verify the jwt and get the user id.
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as jwt.JwtPayload;

  if (Date.now() < (decoded.exp as number)) {
    return next(new Error('Token expired. Please log in again.'));
  }
  // 3) Check if user still exists
  const currentUser = await User.findById((decoded as any).id);
  if (!currentUser) {
    return next(new Error('User no longer exists.'));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  (req as any).user = currentUser;
  res.locals.user = currentUser;
  next();
}

// {
//   "user": {
//     "email": "shoebilyas123@gmail.com",
//     "createdAt": "2024-10-28T13:41:07.065Z",
//     "_id": "671f94735065a8180fa0ede3"
//   },
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWY5NDczNTA2NWE4MTgwZmEwZWRlMyIsImlhdCI6MTczMDEyMzE4NSwiZXhwIjoxNzMwMzgyMzg1fQ.y8DnU-LNp-OGtYQhTg5LBplOWIJBBqt6CY2rkUyE6Lg"
// }
