// mobile/src/screens/ProfileScreen.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { colors, borderRadius } from '../theme';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, Expense } from '../types';

interface ProfileScreenProps {
  user: User | null;
  expenses: Expense[];
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  expenses,
  onLogout,
}) => {
  const totalAmount = expenses.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0
  );

  const confirmLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of Student Expense Tracker?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: onLogout,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Student Profile</Text>
          <Text style={styles.subtitle}>Account details and overview</Text>
        </View>

        {/* User Info Card */}
        <Card style={styles.profileCard} backgroundColor={colors.lavender}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </Text>
          </View>

          <Text style={styles.userName}>{user?.name || 'Student'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'student@college.edu'}</Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>🎓 Verified Student Account</Text>
          </View>
        </Card>

        {/* Lifetime Activity Stats */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionHeader}>Spending Summary</Text>

          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: colors.lightBlue }]}>
              <Text style={styles.statLabel}>Total Transactions</Text>
              <Text style={styles.statValue}>{expenses.length}</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: colors.warmCream }]}>
              <Text style={styles.statLabel}>Total Spent</Text>
              <Text style={styles.statValue}>
                ₹{totalAmount.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </Card>

        {/* About App Card */}
        <Card style={styles.aboutCard} backgroundColor="#F9FAFB">
          <Text style={styles.aboutTitle}>Student Expense Tracker</Text>
          <Text style={styles.aboutDesc}>
           Built By Sagar & Roshan.
          </Text>
        </Card>

        {/* Logout Action */}
        <View style={styles.logoutContainer}>
          <Button
            title="Log Out"
            variant="danger"
            onPress={confirmLogout}
          />
        </View>
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
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: borderRadius.xl,
    borderColor: '#DDD6FE',
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#C4B5FD',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#6D28D9',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4C1D95',
  },
  userEmail: {
    fontSize: 13,
    color: '#6D28D9',
    marginTop: 2,
  },
  roleBadge: {
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B21B6',
  },
  statsCard: {
    padding: 18,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 14,
    borderRadius: borderRadius.md,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  aboutCard: {
    padding: 16,
    marginBottom: 24,
  },
  aboutTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  aboutDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  logoutContainer: {
    marginTop: 8,
  },
});
