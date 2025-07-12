import express from 'express';
import * as bookhubController from '@controllers/bookhub.controller';
import { authenticate } from '@middlewares/auth.middleware';
import { upload } from '@utils/fileUpload';

const router = express.Router();

router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  bookhubController.uploadTextbook
);

router.get('/search', authenticate, bookhubController.searchBooks);

export default router;