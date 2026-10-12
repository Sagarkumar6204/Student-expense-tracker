// mobile/src/types.ts
// Data types and interfaces for Student Expense Tracker

export type Category = 'Food' | 'Travel' | 'Education' | 'Shopping' | 'Other';

export const CATEGORIES: Category[] = [
  'Food',
  'Travel',
  'Education',
  'Shopping',
  'Other',
];

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Expense {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  category: Category;
  date: string; // YYYY-MM-DD
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseFormData {
  title: string;
  amount: string; // string in input, parsed to number
  category: Category;
  date: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface MonthlySummary {
  currentMonthName: string;
  currentYear: number;
  totalAmount: number;
  count: number;
}
