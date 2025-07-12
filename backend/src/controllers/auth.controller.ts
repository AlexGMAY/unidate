import { Request, Response } from 'express';
import AuthService from '@services/auth.service';
import { User } from '@models/User';
import { firebaseAuth } from '@config/firebase';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, university } = req.body;
    
    await AuthService.validateUniversityEmail(email);
    const firebaseUser = await firebaseAuth.createUser({ email, password });
    
    const user = await User.create({
      email,
      university,
      authId: firebaseUser.uid
    });

    const token = AuthService.generateToken(user._id);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyStudent = async (req: Request, res: Response) => {
  try {
    const { scanReference } = req.body;
    const success = await AuthService.verifyStudent(req.user.id, scanReference);
    
    if (success) {
      res.json({ message: 'Verification successful' });
    } else {
      res.status(400).json({ message: 'Verification failed' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};