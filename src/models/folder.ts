import mongoose, { Schema, model } from 'mongoose';
import { Folder as FolderType } from '../types/folder';

interface FolderSchemaType extends Omit<FolderType, 'user'> {
  user: mongoose.Schema.Types.ObjectId;
}

const FolderSchema = new Schema<FolderSchemaType>(
  {
    name: String,
    articles: [
      {
        title: String,
        url: { type: String },
        id: { type: String },
      },
    ],

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const Folder = model<FolderSchemaType>('Folder', FolderSchema);

export default Folder;
