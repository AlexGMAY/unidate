import { Request, Response } from 'express';
import { User } from '@models/User';
import { calculateMatchScore } from '@utils/matchingAlgorithms';

export const getProfile = async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id)
    .select('-__v -createdAt -updatedAt');
  res.json(user);
};

export const updateProfile = async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['profile', 'matchPreferences'];
  
  if (!updates.every(update => allowedUpdates.includes(update))) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.json(user);
};

export const getPotentialMatches = async (req: Request, res: Response) => {
  const currentUser = await User.findById(req.user.id);
  const users = await User.find({
    _id: { $ne: req.user.id },
    verificationStatus: 'verified'
  });

  const matches = users.map(user => ({
    user,
    score: calculateMatchScore(currentUser, user)
  })).sort((a, b) => b.score - a.score);

  res.json(matches.slice(0, 20));
};