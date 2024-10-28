import { Request, Response } from 'express';
import User from '../models/user';
import { AuthFormSchema, SignInSchema } from '../lib/zod';
import { signAuthToken } from '../lib/auth';

export async function login(req: Request, res: Response) {
  try {
    const validatedFields = SignInSchema.safeParse({
      email: req.body.email,
      password: req.body.password,
    });

    if (!validatedFields.success) {
      res.status(400).json({
        errors: { ...validatedFields.error.flatten().fieldErrors, auth: [] },
        message: 'Cannot login user.',
      });
      return;
    }

    const { email, password } = validatedFields.data;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (!(await (user as any).isCorrectPassword(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = signAuthToken(user._id);
    const res_user = {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      _id: user._id,
    };
    res.status(200).json({ user: res_user, token });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: [error],
      message: 'Something went wrong',
    });
    return;
  }
}
export async function register(req: Request, res: Response) {
  const validatedFields = AuthFormSchema.safeParse({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  });

  if (!validatedFields.success) {
    res.status(400).json({
      errors: { ...validatedFields.error.flatten().fieldErrors, auth: [] },
      message: 'Cannot register user.',
    });
    return;
  }

  try {
    const { email, password, name } = validatedFields.data;

    if (!!(await User.findOne({ email }))) {
      res.status(400).json({
        errors: { auth: ['Email already exists!'] },
        message: 'Cannot register user',
      });
      return;
    }

    const newUser = await User.create({ email, password, name });
    const token = signAuthToken(newUser.id);

    res.status(201).json({ user: newUser, token });
    return;
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: [error],
      message: 'Internal Server Error',
    });
    return;
  }
}
