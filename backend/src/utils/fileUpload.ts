import multer from 'multer';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request, 
  file: Express.Multer.File, 
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export const generateFileName = (originalname: string) => 
  `${uuidv4()}-${originalname}`;