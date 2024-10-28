import { Request, Response, Application } from 'express';
import dotenv from 'dotenv';

// Local imports
import app from './app';
import mongoose from 'mongoose';

//For env File
dotenv.config();

const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

mongoose
  .connect(
    process.env.MONGO_URI || 'mongodb://localhost:27017/bookmarker-store'
  )
  .then(() => {
    console.log('Connected to Database!');
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  });

// register
// {
//   "name": "Shoeb Ilyas",
//   "password":"1231233",
//   "email":"shoebilyas123@gmail.com",
// }
