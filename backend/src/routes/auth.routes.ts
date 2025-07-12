import express from 'express';
import * as authController from '@controllers/auth.controller';
import { validate } from '@middlewares/validation.middleware';
import { registerSchema } from '@validators/auth.validator';

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/verify', authController.verifyStudent);
router.post('/login', authController.login);

export default router;