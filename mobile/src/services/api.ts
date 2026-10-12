// mobile/src/services/api.ts
// Centralized API Client and Secure Storage Service

import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, AUTH_TOKEN_KEY, USER_INFO_KEY } from '../config';
import { User, Expense, Category, AuthResponse } from '../types';

// =============================================================
// Token & Session Storage (using expo-secure-store)
// =============================================================
export const storageService = {
  async saveToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    } catch (err) {
      console.warn('SecureStore saveToken error:', err);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    } catch (err) {
      console.warn('SecureStore getToken error:', err);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    } catch (err) {
      console.warn('SecureStore removeToken error:', err);
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(user));
    } catch (err) {
      console.warn('SecureStore saveUser error:', err);
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const data = await SecureStore.getItemAsync(USER_INFO_KEY);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.warn('SecureStore getUser error:', err);
      return null;
    }
  },

  async clearSession(): Promise<void> {
    await this.removeToken();
    try {
      await SecureStore.deleteItemAsync(USER_INFO_KEY);
    } catch (err) {
      console.warn('SecureStore clearSession error:', err);
    }
  },
};

// =============================================================
// Helper: HTTP Request with Timeout & Error Handling
// =============================================================
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  requiresAuth?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, requiresAuth = true } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = await storageService.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;

  // Controller with 8-second timeout for beginner network friendliness
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Handle session expiry
      if (response.status === 401 && requiresAuth) {
        await storageService.clearSession();
        throw new Error(data?.message || 'Your session has expired. Please log in again.');
      }

      // Handle MongoDB not connected
      if (response.status === 503) {
        throw new Error(
          data?.message || 'Database is not yet connected. Add your MongoDB Atlas connection string in backend/.env.'
        );
      }

      throw new Error(data?.message || `Request failed with status ${response.status}`);
    }

    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error(
        `Connection timed out. Check that backend server is running and your phone is on the same Wi-Fi network (URL: ${API_BASE_URL}).`
      );
    }

    if (error.message?.includes('Network request failed') || error.message?.includes('Failed to fetch')) {
      throw new Error(
        `Unable to reach backend at ${API_BASE_URL}. Ensure the backend server is running and your IP address in src/config.ts is correct.`
      );
    }

    throw error;
  }
}

// =============================================================
// Auth API Endpoints
// =============================================================
export const authApi = {
  async signup(name: string, email: string, pass: string): Promise<AuthResponse> {
    const data = await request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: { name, email, password: pass },
      requiresAuth: false,
    });
    if (data.token) {
      await storageService.saveToken(data.token);
      await storageService.saveUser(data.user);
    }
    return data;
  },

  async login(email: string, pass: string): Promise<AuthResponse> {
    const data = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password: pass },
      requiresAuth: false,
    });
    if (data.token) {
      await storageService.saveToken(data.token);
      await storageService.saveUser(data.user);
    }
    return data;
  },

  async getProfile(): Promise<{ success: boolean; user: User }> {
    return request<{ success: boolean; user: User }>('/auth/me');
  },
};

// =============================================================
// Expense API Endpoints
// =============================================================
export const expenseApi = {
  async getExpenses(category?: Category): Promise<{ success: boolean; count: number; expenses: Expense[] }> {
    const query = category ? `?category=${category}` : '';
    return request<{ success: boolean; count: number; expenses: Expense[] }>(`/expenses${query}`);
  },

  async getSummary(): Promise<{
    success: boolean;
    summary: {
      currentMonthName: string;
      currentYear: number;
      totalAmount: number;
      count: number;
    };
  }> {
    return request<{
      success: boolean;
      summary: {
        currentMonthName: string;
        currentYear: number;
        totalAmount: number;
        count: number;
      };
    }>('/expenses/summary');
  },

  async createExpense(data: {
    title: string;
    amount: number;
    category: Category;
    date: string;
  }): Promise<{ success: boolean; message: string; expense: Expense }> {
    return request<{ success: boolean; message: string; expense: Expense }>('/expenses', {
      method: 'POST',
      body: data,
    });
  },

  async updateExpense(
    id: string,
    data: {
      title: string;
      amount: number;
      category: Category;
      date: string;
    }
  ): Promise<{ success: boolean; message: string; expense: Expense }> {
    return request<{ success: boolean; message: string; expense: Expense }>(`/expenses/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  async deleteExpense(id: string): Promise<{ success: boolean; message: string; id: string }> {
    return request<{ success: boolean; message: string; id: string }>(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },
};
