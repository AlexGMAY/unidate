import { Schema, model, Document } from 'mongoose';

interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  campus: string;
  organizer: Schema.Types.ObjectId;
  participants: Schema.Types.ObjectId[];
  tags: string[];
}

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  campus: { type: String, required: true },
  organizer: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  participants: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  tags: { type: [String], default: [] }
}, { timestamps: true });

// Indexes for efficient querying
eventSchema.index({ campus: 1, date: 1 });
eventSchema.index({ tags: 1 });

export const Event = model<IEvent>('Event', eventSchema);