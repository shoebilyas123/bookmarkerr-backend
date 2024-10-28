import { DBDoc } from '../types/db';
import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserType extends DBDoc {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
}

const UserSchema = new Schema<UserType>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email is invalid',
      ],
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [4, 'Name must be 4 characters long'],
    },
    avatar: String,
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified(this.password) && !this.isNew) next();

  this.password = await bcrypt.hash(this.password as string, 15);

  next();
});

UserSchema.methods.isCorrectPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = model<UserType>('User', UserSchema);

export default User;
