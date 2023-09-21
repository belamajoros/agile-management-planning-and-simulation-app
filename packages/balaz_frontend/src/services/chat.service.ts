import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3232/messages/';

class ChatService {
    async getMessages(chatId : string) {
        const response = axios.get(API_URL + "getMessages/" + chatId, { headers: authHeader() });
        return response;
    }

    sendMessage(chatId: string, msg: string, userName: string, id: string) {
        const response = axios.post(API_URL + "sendMessage", {
            chatId,
            msg,
            userName,
            id
          });
          return response;
    }

    createGroupChat(chatId: string) {
        const response = axios.post(API_URL + "createGroupChat", {
          chatId
        });
        return response;
    }
}

export default new ChatService();