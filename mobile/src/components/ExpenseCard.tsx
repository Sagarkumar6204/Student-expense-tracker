// mobile/src/components/ExpenseCard.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors, borderRadius } from '../theme';
import { Expense } from '../types';
import { CategoryBadge } from './CategoryBadge';

interface ExpenseCardProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onEdit,
  onDelete,
}) => {
  // Format display date: YYYY-MM-DD -> e.g. Oct 12, 2026 or 12 Oct 2026
  const formatDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <CategoryBadge category={expense.category} size="small" />
        <Text style={styles.dateText}>{formatDisplayDate(expense.date)}</Text>
      </View>

      <View style={styles.mainRow}>
        <Text style={styles.titleText} numberOfLines={1}>
          {expense.title}
        </Text>
        <Text style={styles.amountText}>₹{expense.amount.toLocaleString('en-IN')}</Text>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              onPress={() => onEdit(expense)}
              style={[styles.actionBtn, styles.editBtn]}
              activeOpacity={0.7}
            >
              <Text style={styles.editBtnText}>✏️ Edit</Text>
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(expense)}
              style={[styles.actionBtn, styles.deleteBtn]}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  bottomRow: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
  },
  editBtn: {
    backgroundColor: colors.lavender,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B21B6',
  },
  deleteBtn: {
    backgroundColor: colors.dangerSoft,
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.danger,
  },
});
