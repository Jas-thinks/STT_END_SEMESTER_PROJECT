import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============= AUTH APIs =============
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// ============= QUIZ APIs =============
export const quizAPI = {
  getQuestions: async (category, difficulty, limit = 10) => {
    try {
      const response = await api.get('/quiz/questions', {
        params: { category, difficulty, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/quiz/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  submitAttempt: async (attemptData) => {
    try {
      const response = await api.post('/quiz/attempt', attemptData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAttemptHistory: async (limit = 10) => {
    try {
      const response = await api.get('/quiz/attempts', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAttemptById: async (attemptId) => {
    try {
      const response = await api.get(`/quiz/attempt/${attemptId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createCustomQuiz: async (quizData) => {
    try {
      const response = await api.post('/quiz/custom', quizData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ============= USER APIs =============
export const userAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteAccount: async () => {
    try {
      const response = await api.delete('/users/account');
      authAPI.logout();
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ============= ANALYTICS APIs =============
export const analyticsAPI = {
  getPerformance: async (timeRange = '30d') => {
    try {
      const response = await api.get('/analytics/performance', {
        params: { timeRange },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getCategoryStats: async () => {
    try {
      const response = await api.get('/analytics/category-stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getProgressOverTime: async (days = 30) => {
    try {
      const response = await api.get('/analytics/progress', {
        params: { days },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getLeaderboard: async (category = 'all', limit = 10) => {
    try {
      const response = await api.get('/analytics/leaderboard', {
        params: { category, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ============= CHATBOT APIs =============
export const chatbotAPI = {
  sendMessage: async (message, conversationId = null) => {
    try {
      const response = await api.post('/chatbot/message', {
        message,
        conversationId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getConversations: async () => {
    try {
      const response = await api.get('/chatbot/conversations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getConversationById: async (conversationId) => {
    try {
      const response = await api.get(`/chatbot/conversation/${conversationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteConversation: async (conversationId) => {
    try {
      const response = await api.delete(`/chatbot/conversation/${conversationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default api;
