import { Request } from 'express';
import { User } from '@models/User';

export async function contentModeration(text: string): Promise<boolean> {
  // Implement actual content moderation (could use Perspective API)
  const bannedTerms = ['hate', 'harassment', 'discrimination'];
  return !bannedTerms.some(term => text.includes(term));
}

export async function verifyUserSafety(req: Request): Promise<void> {
  const user = await User.findById(req.user.id);
  
  if (user.verificationStatus !== 'verified') {
    throw new Error('Profile must be verified for this action');
  }

  if (user.reports && user.reports.length >= 3) {
    throw new Error('Account restricted due to multiple reports');
  }
}