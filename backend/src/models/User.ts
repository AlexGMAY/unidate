import { Schema, model, Document } from 'mongoose';

interface IProfile {
  name: string;
  bio?: string;
  interests: string[];
  pronouns?: string;
  photos: string[];
}

interface IUser extends Document {
  email: string;
  university: string;
  campus: string;
  major: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  profile: IProfile;
  matches: Schema.Types.ObjectId[];
  matchPreferences: {
    maxDistance: number;
    ageRange: [number, number];
  };
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, match: /\.(edu|ac\.fr)$/ },
  university: { type: String, required: true },
  campus: { type: String, required: true },
  major: { type: String, required: true },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  profile: {
    name: { type: String, required: true },
    bio: { type: String, maxlength: 500 },
    interests: { type: [String], default: [] },
    pronouns: { type: String },
    photos: { type: [String], default: [] }
  },
  matches: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  matchPreferences: {
    maxDistance: { type: Number, default: 50 }, // km
    ageRange: { type: [Number], default: [18, 30] }
  }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);