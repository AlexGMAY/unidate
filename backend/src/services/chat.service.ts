import { Chat, Message } from '@models/Chat';
import { User } from '@models/User';
import { Socket } from 'socket.io';

class ChatService {
  private activeSockets = new Map<string, Socket>();

  registerSocket(userId: string, socket: Socket) {
    this.activeSockets.set(userId, socket);
    socket.on('disconnect', () => this.activeSockets.delete(userId));
  }

  async sendMessage(senderId: string, chatId: string, content: string) {
    const chat = await Chat.findById(chatId);
    if (!chat?.participants.includes(senderId)) throw new Error('Not in chat');

    const message = await Message.create({
      chat: chatId,
      sender: senderId,
      content
    });

    // Real-time delivery
    chat.participants.forEach(userId => {
      this.activeSockets.get(userId)?.emit('newMessage', message);
    });

    return message;
  }

  async getChatHistory(userId: string, chatId: string) {
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    }).populate('messages');
    
    return chat?.messages || [];
  }
}

export default new ChatService();