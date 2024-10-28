import { Request, Response } from 'express';
import Folder from '../models/folder';
import { Article, Folder as FolderType } from '../types/folder';
import { AddNewArticleSchema, FolderPayloadSchema } from '../lib/zod';
import { UserType } from '../models/user';
import * as cheerio from 'cheerio';

export async function createNew(req: Request, res: Response) {
  const validatedFields = FolderPayloadSchema.safeParse({
    name: req.body.name,
  });

  if (!validatedFields.success) {
    res.status(400).json({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Cannot create folder.',
    });
    return;
  }

  const { name } = validatedFields.data;

  const folderPayload: Partial<Omit<FolderType, 'user'> & { user: string }> = {
    name: name,
    articles: [],
    user: (req as any).user?._id,
  };

  try {
    const folder_doc = await Folder.findOne({ name: folderPayload.name });

    if (folder_doc && folder_doc._id) {
      res.status(400).json({
        errors: { name: ['Folder already exists.'] },
        message: 'Cannot create folder.',
      });
      return;
    }

    const newFolder = await Folder.create(folderPayload);
    res.status(201).json({ folder: newFolder });
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
export async function deleteOne(req: Request, res: Response) {}
export async function getAll(req: Request, res: Response) {
  const { search } = req.query;
  const folders = await Folder.find({
    user: (req as any).user?._id,
    ...(search && { name: new RegExp(`${search}`, 'g') }),
  }).populate('user', 'name email _id');

  const folders_transformed: Array<
    Omit<FolderType, 'articles'> & { articles: number }
  > = folders.map((f) => ({
    _id: f._id,
    name: f.name,
    user: (f as any).user as UserType,
    articles: f.articles.length as number,
  }));

  res.status(200).json({ folders: folders_transformed });
  return;
}
export async function getOne(req: Request, res: Response) {
  const { id } = req.params;

  const folder = await Folder.findOne({
    _id: id,
    user: (req as any).user?._id,
  }).populate('user', 'email name _id');

  res.status(200).json({ folder });
  return;
}

export async function addNewArticle(req: Request, res: Response) {
  try {
    const validatedFields = AddNewArticleSchema.safeParse({
      url: req.body['url'],
    });

    if (!validatedFields.success) {
      res.status(400).json({
        error: 'Incorrect URL..',
      });
      return;
    }

    if (!req.body.folderId) {
      res.status(400).json({
        error: 'Folder not specified.',
      });

      return;
    }

    const { url } = validatedFields.data;

    const $ = await cheerio.fromURL(url);
    const title = $('title').text();

    const article_payload = { url: url, title };

    const folder = await Folder.findOne({ _id: req.body.folderId });

    if ((req as any).user._id.toString() !== folder.user.toString()) {
      res.status(401).json({ errors: ['Cannot add article.'] });
      return;
    }

    if (!folder.articles.some((art: Article) => art.url === url)) {
      folder.articles = [...folder.articles, { ...article_payload }];
    } else {
      res.status(200).json({ message: 'Bookmark already exists.' });
      return;
    }

    await folder.save();
    res.status(200).json({ message: 'Bookmark added to folder' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: [error],
      message: 'Something went wrong',
    });
    return;
  }
}

// {
//   "folderId": "671f9694681d9f82e0dea721",
//    "url":"https://netflix.com"
//   }
// {
//   "folder": {
//     "name": "my folder",
//     "articles": [],
//     "user": "671f94735065a8180fa0ede3",
//     "_id": "671f9694681d9f82e0dea721",
//     "createdAt": "2024-10-28T13:50:12.293Z",
//     "updatedAt": "2024-10-28T13:50:12.293Z",
//     "__v": 0
//   }
// }
