import express from 'express';
import * as folderController from '../controllers/folder.controller';
import { authorize } from '../middlewares/protect';

const router = express.Router();

router.get('/all', authorize, folderController.getAll);
router.get('/:id', authorize, folderController.getOne);
router.post('/create', authorize, folderController.createNew);
router.post('/delete', authorize, folderController.deleteOne);
router.post('/article/add', authorize, folderController.addNewArticle);

export default router;
