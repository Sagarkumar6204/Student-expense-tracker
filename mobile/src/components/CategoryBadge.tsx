// mobile/src/components/CategoryBadge.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, borderRadius } from '../theme';
import { Category } from '../types';

interface CategoryBadgeProps {
  category: Category;
  size?: 'small' | 'medium';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'medium',
}) => {
  const theme = colors.categories[category] || colors.categories.Other;
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.bg,
          borderColor: theme.border,
          paddingVertical: isSmall ? 3 : 5,
          paddingHorizontal: isSmall ? 8 : 10,
        },
      ]}
    >
      <Text style={[styles.icon, isSmall && styles.iconSmall]}>{theme.icon}</Text>
      <Text
        style={[
          styles.text,
          { color: theme.text },
          isSmall && styles.textSmall,
        ]}
      >
        {category}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    fontSize: 14,
    marginRight: 5,
  },
  iconSmall: {
    fontSize: 12,
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
  textSmall: {
    fontSize: 11,
  },
});
