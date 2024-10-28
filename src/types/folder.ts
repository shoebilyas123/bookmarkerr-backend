import { UserType } from '../models/user';
import { DBDoc } from './db';

export interface Article {
  title: string;
  url: string;
}

export interface Folder extends DBDoc {
  name: string;
  articles: Article[];
  user: Partial<UserType>;
}
