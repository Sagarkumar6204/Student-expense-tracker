// mobile/src/screens/ExpenseHistoryScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { colors, borderRadius } from '../theme';
import { Card } from '../components/Card';
import { ExpenseCard } from '../components/ExpenseCard';
import { Expense, Category, CATEGORIES } from '../types';

interface ExpenseHistoryScreenProps {
  expenses: Expense[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
}

export const ExpenseHistoryScreen: React.FC<ExpenseHistoryScreenProps> = ({
  expenses,
  loading,
  refreshing,
  onRefresh,
  onEditExpense,
  onDeleteExpense,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  // Filter expenses based on selected category tab
  const filteredExpenses = expenses.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const totalFilteredAmount = filteredExpenses.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0
  );

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Expense History</Text>
          <Text style={styles.subtitle}>
            All student expense transactions & logs
          </Text>
        </View>

        {/* Filter Summary Card */}
        <Card style={styles.statsCard} backgroundColor={colors.lightBlue}>
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statsLabel}>Total Filtered</Text>
              <Text style={styles.statsAmount}>
                ₹{totalFilteredAmount.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {filteredExpenses.length} {filteredExpenses.length === 1 ? 'record' : 'records'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory('All')}
            style={[
              styles.filterPill,
              selectedCategory === 'All' ? styles.filterPillActive : styles.filterPillInactive,
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                selectedCategory === 'All' && styles.filterPillTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const theme = colors.categories[cat];
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.filterPill,
                  isSelected
                    ? { backgroundColor: theme.bg, borderColor: theme.text, borderWidth: 1.5 }
                    : styles.filterPillInactive,
                ]}
              >
                <Text style={styles.pillIcon}>{theme.icon}</Text>
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected ? { color: theme.text, fontWeight: '700' } : null,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Expense List */}
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading history...</Text>
          </View>
        ) : filteredExpenses.length === 0 ? (
          <Card style={styles.emptyCard} backgroundColor={colors.warmCream}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No Expenses Found</Text>
            <Text style={styles.emptySubtitle}>
              {selectedCategory === 'All'
                ? 'You have not recorded any expenses yet.'
                : `No expenses found in the "${selectedCategory}" category.`}
            </Text>
          </Card>
        ) : (
          filteredExpenses.map((expense) => (
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
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsCard: {
    borderRadius: borderRadius.lg,
    padding: 18,
    marginBottom: 16,
    borderColor: '#BFDBFE',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
    textTransform: 'uppercase',
  },
  statsAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E40AF',
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  filterScroll: {
    paddingBottom: 16,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
  },
  pillIcon: {
    fontSize: 13,
    marginRight: 5,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
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
    borderColor: '#FED7AA',
    marginTop: 12,
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
