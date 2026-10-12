// mobile/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, borderRadius } from './src/theme';
import { User, Expense, Category } from './src/types';
import { storageService, authApi, expenseApi } from './src/services/api';
import { SignupScreen } from './src/screens/SignupScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { AddExpenseScreen } from './src/screens/AddExpenseScreen';
import { EditExpenseScreen } from './src/screens/EditExpenseScreen';
import { ExpenseHistoryScreen } from './src/screens/ExpenseHistoryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

type Tab = 'dashboard' | 'add' | 'history' | 'profile';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  // Navigation state
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Expense data state
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load expenses from API
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await expenseApi.getExpenses();
      if (res && Array.isArray(res.expenses)) {
        setExpenses(res.expenses);
      }
    } catch (err: any) {
      console.log('fetchExpenses notice:', err.message);
      // We do not break the UI if network is offline; keep existing state
    } finally {
      setLoading(false);
    }
  }, []);

  // Check saved session on launch
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await storageService.getToken();
        const savedUser = await storageService.getUser();

        if (token && savedUser) {
          setUser(savedUser);
          await fetchExpenses();
        }
      } catch (e) {
        console.log('Session check error:', e);
      } finally {
        setInitializing(false);
      }
    };

    checkAuth();
  }, [fetchExpenses]);

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  };

  // -------------------------------------------------------------
  // Authentication Handlers
  // -------------------------------------------------------------
  const handleLogin = async (email: string, pass: string) => {
    try {
      const res = await authApi.login(email, pass);
      setUser(res.user);
      setActiveTab('dashboard');
      await fetchExpenses();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const handleSignup = async (name: string, email: string, pass: string) => {
    try {
      const res = await authApi.signup(name, email, pass);
      setUser(res.user);
      setActiveTab('dashboard');
      await fetchExpenses();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const handleLogout = async () => {
    await storageService.clearSession();
    setUser(null);
    setExpenses([]);
    setAuthView('login');
    setActiveTab('dashboard');
  };

  // -------------------------------------------------------------
  // Expense CRUD Handlers
  // -------------------------------------------------------------
  const handleAddExpense = async (data: {
    title: string;
    amount: number;
    category: Category;
    date: string;
  }) => {
    try {
      const res = await expenseApi.createExpense(data);
      if (res && res.expense) {
        setExpenses((prev) => [res.expense, ...prev]);
        setActiveTab('dashboard');
        return { success: true };
      }
      return { success: false, error: 'Unexpected response from server' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const handleUpdateExpense = async (
    id: string,
    data: {
      title: string;
      amount: number;
      category: Category;
      date: string;
    }
  ) => {
    try {
      const res = await expenseApi.updateExpense(id, data);
      if (res && res.expense) {
        setExpenses((prev) =>
          prev.map((item) => (item._id === id ? res.expense : item))
        );
        setEditingExpense(null);
        return { success: true };
      }
      return { success: false, error: 'Unexpected response from server' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const handleDeleteExpense = async (expense: Expense) => {
    try {
      await expenseApi.deleteExpense(expense._id);
      setExpenses((prev) => prev.filter((item) => item._id !== expense._id));
      if (editingExpense?._id === expense._id) {
        setEditingExpense(null);
      }
      return { success: true };
    } catch (err: any) {
      Alert.alert('Delete Failed', err.message);
      return { success: false, error: err.message };
    }
  };

  // -------------------------------------------------------------
  // Render Loading Splash
  // -------------------------------------------------------------
  if (initializing) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFDF9" />
        <Text style={styles.splashEmoji}>🎓💸</Text>
        <Text style={styles.splashTitle}>Student Expense Tracker</Text>
        <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      </SafeAreaView>
    );
  }

  // -------------------------------------------------------------
  // Render Edit Screen
  // -------------------------------------------------------------
  if (user && editingExpense) {
    return (
      <EditExpenseScreen
        expense={editingExpense}
        onUpdateExpense={handleUpdateExpense}
        onDeleteExpense={handleDeleteExpense}
        onCancel={() => setEditingExpense(null)}
      />
    );
  }

  // -------------------------------------------------------------
  // Render Authentication Screens
  // -------------------------------------------------------------
  if (!user) {
    if (authView === 'signup') {
      return (
        <SignupScreen
          onSignup={handleSignup}
          onNavigateToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <LoginScreen
        onLogin={handleLogin}
        onNavigateToSignup={() => setAuthView('signup')}
      />
    );
  }

  // -------------------------------------------------------------
  // Render Main Tab Navigation Screens
  // -------------------------------------------------------------
  return (
    <SafeAreaView style={styles.rootContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF9" />

      {/* Screen View */}
      <View style={styles.screenWrapper}>
        {activeTab === 'dashboard' && (
          <DashboardScreen
            user={user}
            expenses={expenses}
            loading={loading}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onNavigateToAdd={() => setActiveTab('add')}
            onNavigateToHistory={() => setActiveTab('history')}
            onEditExpense={(exp) => setEditingExpense(exp)}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {activeTab === 'add' && (
          <AddExpenseScreen
            onAddExpense={handleAddExpense}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'history' && (
          <ExpenseHistoryScreen
            expenses={expenses}
            loading={loading}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onEditExpense={(exp) => setEditingExpense(exp)}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            user={user}
            expenses={expenses}
            onLogout={handleLogout}
          />
        )}
      </View>

      {/* Soft Pastel Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'dashboard' && styles.navItemActive]}
          onPress={() => setActiveTab('dashboard')}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>📊</Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'dashboard' && styles.navLabelActive,
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'add' && styles.navItemActive]}
          onPress={() => setActiveTab('add')}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>➕</Text>
          <Text
            style={[styles.navLabel, activeTab === 'add' && styles.navLabelActive]}
          >
            Add
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'history' && styles.navItemActive]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>📜</Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'history' && styles.navLabelActive,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'profile' && styles.navItemActive]}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'profile' && styles.navLabelActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashEmoji: {
    fontSize: 54,
    marginBottom: 12,
  },
  splashTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  spinner: {
    marginTop: 24,
  },
  screenWrapper: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
  },
  navItemActive: {
    backgroundColor: colors.lavender,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  navLabelActive: {
    color: '#6D28D9',
    fontWeight: '700',
  },
});
