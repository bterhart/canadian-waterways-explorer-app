// Comparison Detail Screen
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { GitCompare, HelpCircle } from 'lucide-react-native';
import { useComparison } from '@/lib/api/education-api';
import { getGradeLevelColor, getGradeLevelLabel } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

export default function ComparisonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: comparison, isLoading, isError } = useComparison(id ?? null);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
      </View>
    );
  }

  if (isError || !comparison) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>Unable to load comparison</Text>
      </View>
    );
  }

  const items = comparison.items || [];
  const criteria = comparison.criteria || [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: 'Comparison',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadges}>
          <View style={styles.typeBadge}>
            <GitCompare size={14} color={colors.forestGreen} />
            <Text style={styles.typeText}>
              {comparison.comparisonType.replace('_', ' ')}
            </Text>
          </View>
          {comparison.gradeLevel ? (
            <View
              style={[
                styles.gradeBadge,
                { backgroundColor: getGradeLevelColor(comparison.gradeLevel) },
              ]}
            >
              <Text style={styles.gradeBadgeText}>
                {getGradeLevelLabel(comparison.gradeLevel)}
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.title}>{comparison.title}</Text>
        {comparison.description ? (
          <Text style={styles.description}>{comparison.description}</Text>
        ) : null}
      </View>

      {/* Items being compared */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items Being Compared</Text>
        <View style={styles.itemsGrid}>
          {items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemNumber}>
                <Text style={styles.itemNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.itemName}>
                {(item as Record<string, unknown>).name as string || `Item ${index + 1}`}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Comparison Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comparison Details</Text>
        {criteria.map((criterion, criterionIndex) => (
          <View key={criterionIndex} style={styles.criterionSection}>
            <View style={styles.criterionHeader}>
              <Text style={styles.criterionTitle}>{criterion.criterion}</Text>
              {criterion.description ? (
                <Text style={styles.criterionDescription}>
                  {criterion.description}
                </Text>
              ) : null}
            </View>
            <View style={styles.comparisonRow}>
              {items.map((item, itemIndex) => {
                const itemData = item as Record<string, unknown>;
                const value =
                  itemData[criterion.criterion.toLowerCase().replace(/ /g, '')] ||
                  itemData[criterion.criterion.toLowerCase()] ||
                  'N/A';
                return (
                  <View key={itemIndex} style={styles.comparisonCell}>
                    <Text style={styles.cellLabel}>
                      {(itemData.name as string) || `Item ${itemIndex + 1}`}
                    </Text>
                    <Text style={styles.cellValue}>
                      {typeof value === 'object'
                        ? JSON.stringify(value)
                        : String(value)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      {/* Analysis Prompts */}
      {comparison.analysisPrompts && comparison.analysisPrompts.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.promptsHeader}>
            <HelpCircle size={20} color={colors.forestGreen} />
            <Text style={styles.sectionTitle}>Think About It</Text>
          </View>
          {comparison.analysisPrompts.map((prompt, index) => (
            <View key={index} style={styles.promptCard}>
              <Text style={styles.promptNumber}>{index + 1}</Text>
              <Text style={styles.promptText}>{prompt}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.creamWhite,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.forestGreen + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.forestGreen,
    textTransform: 'capitalize',
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  gradeBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 16,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 10,
  },
  itemNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.forestGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  criterionSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  criterionHeader: {
    marginBottom: 12,
  },
  criterionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  criterionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  comparisonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  comparisonCell: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 10,
  },
  cellLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  cellValue: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  promptsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  promptCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  promptNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.forestGreen,
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  promptText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 32,
  },
});
