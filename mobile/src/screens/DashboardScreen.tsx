// mobile/src/screens/DashboardScreen.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors, borderRadius } from '../theme';
import { Card } from '../components/Card';
import { ExpenseCard } from '../components/ExpenseCard';
import { Expense, User } from '../types';

interface DashboardScreenProps {
  user: User | null;
  expenses: Expense[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onNavigateToAdd: () => void;
  onNavigateToHistory: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  expenses,
  loading,
  refreshing,
  onRefresh,
  onNavigateToAdd,
  onNavigateToHistory,
  onEditExpense,
  onDeleteExpense,
}) => {
  // Current month & year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-indexed
  const currentYear = currentDate.getFullYear();
  const currentMonthName = currentDate.toLocaleString('en-IN', { month: 'long' });

  // Calculate current month's expenses (timezone-safe comparison)
  const currentMonthExpenses = expenses.filter((item) => {
    try {
      if (typeof item.date === 'string' && item.date.includes('-')) {
        const parts = item.date.split('-');
        if (parts.length === 3) {
          const itemYear = parseInt(parts[0], 10);
          const itemMonth = parseInt(parts[1], 10) - 1; // 0-indexed
          return itemMonth === currentMonth && itemYear === currentYear;
        }
      }
      const d = new Date(item.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    } catch {
      return false;
    }
  });

  const totalCurrentMonth = currentMonthExpenses.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0
  );

  // Take the 4 most recent expenses
  const recentExpenses = expenses.slice(0, 4);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {/* Top Student Welcome Bar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Hello, {user?.name || 'Student'} 👋</Text>
            <Text style={styles.subGreetingText}>College Expense Overview</Text>
          </View>
        </View>

        {/* Current Month Highlight Card (Pastel Mint/Cream) */}
        <Card style={styles.summaryCard} backgroundColor={colors.mintGreen}>
          <View style={styles.summaryTop}>
            <Text style={styles.summaryBadge}>📅 {currentMonthName} {currentYear}</Text>
            <Text style={styles.expenseCountBadge}>
              {currentMonthExpenses.length} {currentMonthExpenses.length === 1 ? 'expense' : 'expenses'}
            </Text>
          </View>

          <Text style={styles.summaryLabel}>Total Monthly Spent</Text>
          <Text style={styles.totalAmountText}>
            ₹{totalCurrentMonth.toLocaleString('en-IN')}
          </Text>

          <Text style={styles.summaryHint}>
            Keep your monthly campus budget under control
          </Text>
        </Card>

        {/* Quick Action Buttons */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.addActionButton]}
            onPress={onNavigateToAdd}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.historyActionButton]}
            onPress={onNavigateToHistory}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>📜</Text>
            <Text style={styles.actionText}>View History</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Expenses Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          {expenses.length > 0 && (
            <TouchableOpacity onPress={onNavigateToHistory}>
              <Text style={styles.seeAllText}>See all ({expenses.length})</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading expenses...</Text>
          </View>
        ) : recentExpenses.length === 0 ? (
          <Card style={styles.emptyCard} backgroundColor={colors.lightBlue}>
            <Text style={styles.emptyEmoji}>🍃</Text>
            <Text style={styles.emptyTitle}>No Expenses Recorded Yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the "+ Add Expense" button above to log your first college expense!
            </Text>
          </Card>
        ) : (
          recentExpenses.map((expense) => (
            <ExpenseCard
              key={expense._id}
              expense={expense}
              onEdit={onEditExpense}
              onDelete={onDeleteExpense}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subGreetingText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  summaryCard: {
    borderRadius: borderRadius.xl,
    padding: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
    textTransform: 'uppercase',
  },
  expenseCountBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '600',
  },
  totalAmountText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#064E3B',
    marginVertical: 4,
  },
  summaryHint: {
    fontSize: 12,
    color: '#047857',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  addActionButton: {
    backgroundColor: colors.lavender,
    borderColor: '#DDD6FE',
  },
  historyActionButton: {
    backgroundColor: colors.warmCream,
    borderColor: '#FED7AA',
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 10,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    borderColor: '#BFDBFE',
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
