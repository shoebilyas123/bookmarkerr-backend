import express, { Application } from 'express';
import routerAuth from './routes/auth.route';
import routerFolder from './routes/folder.auth';
import bodyParser from 'body-parser';

const app: Application = express();
app.use(bodyParser.json());

app.use('/api/v1/auth', routerAuth);
app.use('/api/v1/folder', routerFolder);

export default app;
