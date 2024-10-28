import { z } from 'zod';

export const AuthFormSchema = z.object({
  email: z
    .string({
      message: 'Please enter your email.',
    })
    .email({
      message: 'Please enter a valid email.',
    }),
  name: z
    .string({ message: 'Please enter your name' })
    .min(4, { message: 'Name must be 4 characters long' }),
  password: z
    .string({
      message: 'Please create a password',
    })
    .min(6, { message: 'Password must be 6 characters long' }),
});
export const SignInSchema = AuthFormSchema.omit({ name: true });

export const AddNewArticleSchema = z.object({
  url: z
    .string({
      required_error: 'Please enter URL',
      message: 'Please enter a URL',
      invalid_type_error: 'Please enter a valid URL',
    })
    .min(8),
});

export const FolderPayloadSchema = z.object({
  name: z
    .string({
      required_error: 'Folder name is required.',
      invalid_type_error:
        'Folder cannot not be numbers or special characters only.',
    })
    .min(1, { message: 'Name cannot be empty.' }),
});
