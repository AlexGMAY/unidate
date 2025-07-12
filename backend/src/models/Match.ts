import { Schema, model, Document } from 'mongoose';

interface IMatch extends Document {
  users: [Schema.Types.ObjectId, Schema.Types.ObjectId];
  status: 'pending' | 'matched' | 'rejected';
  matchScore: number;
  chatId?: Schema.Types.ObjectId;
}

const matchSchema = new Schema<IMatch>({
  users: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }],
  status: { 
    type: String, 
    enum: ['pending', 'matched', 'rejected'],
    default: 'pending'
  },
  matchScore: { type: Number, required: true },
  chatId: { type: Schema.Types.ObjectId, ref: 'Chat' }
}, { timestamps: true });

// Ensure each user pair is unique
matchSchema.index({ users: 1 }, { unique: true });

export const Match = model<IMatch>('Match', matchSchema);