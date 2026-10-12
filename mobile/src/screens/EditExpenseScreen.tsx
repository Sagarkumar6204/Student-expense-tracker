// mobile/src/screens/EditExpenseScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors, borderRadius } from '../theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Expense, Category, CATEGORIES } from '../types';

interface EditExpenseScreenProps {
  expense: Expense;
  onUpdateExpense: (
    id: string,
    data: {
      title: string;
      amount: number;
      category: Category;
      date: string;
    }
  ) => Promise<{ success: boolean; error?: string }>;
  onDeleteExpense: (expense: Expense) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

export const EditExpenseScreen: React.FC<EditExpenseScreenProps> = ({
  expense,
  onUpdateExpense,
  onDeleteExpense,
  onCancel,
}) => {
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(String(expense.amount));
  const [category, setCategory] = useState<Category>(expense.category);
  const [date, setDate] = useState(expense.date);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Expense title is required';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const parsed = parseFloat(amount);
      if (isNaN(parsed) || parsed <= 0) {
        newErrors.amount = 'Amount must be a positive number greater than 0';
      }
    }

    if (!date.trim()) {
      newErrors.date = 'Date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      newErrors.date = 'Use YYYY-MM-DD format (e.g. 2026-10-12)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    setApiError(null);
    if (!validate()) return;

    setLoading(true);
    const result = await onUpdateExpense(expense._id, {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date: date.trim(),
    });
    setLoading(false);

    if (!result.success && result.error) {
      setApiError(result.error);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${expense.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            const result = await onDeleteExpense(expense);
            setDeleting(false);
            if (!result.success && result.error) {
              setApiError(result.error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Edit Expense</Text>
            <Text style={styles.subtitle}>
              Update your expense details or remove this record
            </Text>
          </View>

          <Card style={styles.card}>
            {apiError ? (
              <View style={styles.apiErrorBox}>
                <Text style={styles.apiErrorText}>⚠️ {apiError}</Text>
              </View>
            ) : null}

            {/* Title */}
            <Input
              label="Expense Title"
              value={title}
              onChangeText={setTitle}
              error={errors.title}
            />

            {/* Amount */}
            <Input
              label="Amount in Indian Rupees (₹)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              error={errors.amount}
            />

            {/* Category */}
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryLabel}>Category</Text>
              <View style={styles.categoriesGrid}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  const theme = colors.categories[cat];
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.8}
                      style={[
                        styles.categoryOption,
                        {
                          backgroundColor: isSelected ? theme.bg : '#F9FAFB',
                          borderColor: isSelected ? theme.text : '#E5E7EB',
                          borderWidth: isSelected ? 2 : 1,
                        },
                      ]}
                    >
                      <Text style={styles.categoryIcon}>{theme.icon}</Text>
                      <Text
                        style={[
                          styles.categoryName,
                          {
                            color: isSelected ? theme.text : colors.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Date */}
            <Input
              label="Date (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
              error={errors.date}
            />

            {/* Action buttons */}
            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={onCancel}
                style={styles.cancelBtn}
              />
              <Button
                title="Save Changes"
                variant="primary"
                onPress={handleUpdate}
                loading={loading}
                style={styles.saveBtn}
              />
            </View>

            {/* Delete button */}
            <View style={styles.deleteSection}>
              <Button
                title="🗑️ Delete Expense"
                variant="danger"
                onPress={confirmDelete}
                loading={deleting}
              />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
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
  card: {
    padding: 20,
  },
  apiErrorBox: {
    backgroundColor: colors.dangerSoft,
    borderColor: '#FECACA',
    borderWidth: 1,
    padding: 12,
    borderRadius: borderRadius.md,
    marginBottom: 16,
  },
  apiErrorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryName: {
    fontSize: 13,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 2,
  },
  deleteSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
});
