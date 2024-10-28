import * as jwt from 'jsonwebtoken';

export const signAuthToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (encryptedToken: string) => {
  return jwt.verify(encryptedToken, process.env.JWT_SECRET as string);
};
