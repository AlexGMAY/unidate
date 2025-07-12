import { Schema, model, Document } from 'mongoose';

interface IMessage extends Document {
  chat: Schema.Types.ObjectId;
  sender: Schema.Types.ObjectId;
  content: string;
  read: boolean;
}

interface IChat extends Document {
  participants: Schema.Types.ObjectId[];
  messages: Schema.Types.ObjectId[];
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

const chatSchema = new Schema<IChat>({
  participants: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
}, { timestamps: true });

// Index for faster message retrieval
chatSchema.index({ participants: 1, createdAt: -1 });

export const Message = model<IMessage>('Message', messageSchema);
export const Chat = model<IChat>('Chat', chatSchema);