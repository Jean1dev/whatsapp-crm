import axios from 'axios';

const API_BASE_URL = 'https://whatsapp-api-da7eccbe4a89.herokuapp.com';
//const API_BASE_URL = 'http://localhost:3333';
const API_KEY = '65ef4505c69af';

export interface WhatsAppMessage {
  phone: string;
  message: string;
}

export interface WhatsAppResponse {
  error: boolean;
  message: string;
  data?: any;
}

class WhatsAppAPI {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
  });

  async getQRCode(key: string): Promise<string> {
    try {
      const response = await this.api.get(`/instance/qr?key=${key}`, {
        headers: {
          'accept': 'text/html',
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to get QR code');
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async initSession(key: string): Promise<WhatsAppResponse> {
    try {
      const response = await this.api.get(`/instance/init?key=${key}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          error: true,
          message: error.response?.data?.message || 'Failed to initialize session',
        };
      }
      return {
        error: true,
        message: 'An unexpected error occurred',
      };
    }
  }

  async sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
    try {
      const response = await this.api.post('/send-message', message, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          error: true,
          message: error.response?.data?.message || 'Failed to send message',
        };
      }
      return {
        error: true,
        message: 'An unexpected error occurred',
      };
    }
  }

  async sendBulkMessages(messages: WhatsAppMessage[]): Promise<WhatsAppResponse> {
    try {
      const response = await this.api.post('/send-bulk-messages', { messages }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          error: true,
          message: error.response?.data?.message || 'Failed to send bulk messages',
        };
      }
      return {
        error: true,
        message: 'An unexpected error occurred',
      };
    }
  }

  async getMessageStatus(messageId: string): Promise<WhatsAppResponse> {
    try {
      const response = await this.api.get(`/message-status/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          error: true,
          message: error.response?.data?.message || 'Failed to get message status',
        };
      }
      return {
        error: true,
        message: 'An unexpected error occurred',
      };
    }
  }
}

export const whatsappAPI = new WhatsAppAPI(); 