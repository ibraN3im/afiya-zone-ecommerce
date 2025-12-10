/// <reference types="vite/client" />

// Use environment variable for API_URL, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to handle API errors
const handleResponse = async (response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    newsletter: boolean;
  }) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  },


  // Request password reset
  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return handleResponse(response);
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    return handleResponse(response);
  },

  getProfile: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  updateProfile: async (userData: {
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    return handleResponse(response);
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });

    return handleResponse(response);
  },

  updateNotifications: async (notificationsData: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  }) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/auth/notifications`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(notificationsData),
    });

    return handleResponse(response);
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },
};

// Products API
export const productsAPI = {
  getAll: async (filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    search?: string;
    sortBy?: string;
    isFeatured?: string; // Add this line
  }) => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const url = `${API_URL}/products${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url);

    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return handleResponse(response);
  },

  create: async (productData: any) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    return handleResponse(response);
  },

  rateProduct: async (productId: string, rating: number, userId?: string) => {
    const response = await fetch(`${API_URL}/products/${productId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating, userId }),
    });

    return handleResponse(response);
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData: {
    items: Array<{
      productId: any;
      name: { en: string; ar: string };
      quantity: number;
      price: number;
      image?: string;
    }>;
    shippingAddress: any;
    paymentMethod: string;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    notes?: string;
  }) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    return handleResponse(response);
  },

  getMyOrders: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/orders/my-orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  getById: async (id: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  getUnreadCount: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  markAsRead: async (notificationId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  markAllAsRead: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },
};

// Admin API
export const adminAPI = {
  // Statistics
  getStatistics: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/statistics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // User Management
  getAllUsers: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateUser: async (userId: string, userData: any) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  deleteUser: async (userId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Product Management
  getAllProducts: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  createProduct: async (productData: any) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  updateProduct: async (productId: string, productData: any) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  deleteProduct: async (productId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Order Management
  getAllOrders: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  deleteOrder: async (orderId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Messages API
export const messagesAPI = {
  send: async (messageData: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }) => {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    return handleResponse(response);
  },
};

export default {
  auth: authAPI,
  products: productsAPI,
  orders: ordersAPI,
  notifications: notificationsAPI,
  admin: adminAPI,
  messages: messagesAPI,
};
