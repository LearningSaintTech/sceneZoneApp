import io from 'socket.io-client';
import { API_BASE_URL } from '../Config/env';

// Use the same base as API, but strip '/api' if present
const SOCKET_URL = API_BASE_URL.replace(/\/api$/, '');

// Initialize Socket.IO connection
const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: false,
});

const ChatService = {
  connect: (userId) => {
    console.log('[ChatService] connect called with userId:', userId);
    return new Promise((resolve, reject) => {
      socket.connect();

      socket.on('connect', () => {
        console.log('[ChatService] Socket.IO connected, emitting join for userId:', userId);
        socket.emit('join', userId);
        resolve();
      });

      socket.on('connect_error', (error) => {
        console.error('[ChatService] Socket.IO connection error:', error);
        reject(error);
      });
    });
  },

  onNewMessage: (callback) => {
    socket.on('newMessage', (chat) => {
      console.log('New message received:', chat);
      callback(chat);
    });
  },

  onNewChat: (callback) => {
    socket.on('newChat', (chat) => {
      console.log('New chat received:', chat);
      callback(chat);
    });
  },

  onPriceApproved: (callback) => {
    socket.on('priceApproved', (chat) => {
      console.log('Price approved:', chat);
      callback(chat);
    });
  },

  disconnect: () => {
    socket.disconnect();
    console.log('Disconnected from Socket.IO server');
  },
};

export default ChatService;