import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  BookOpen,
  Map,
  FileText,
  FileStack,
  GraduationCap,
  ChevronRight,
} from 'lucide-react-native';

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  waterBlue: '#3B82A3',
  earthBrown: '#8B5A2B',
  creamWhite: '#FFFEF7',
  white: '#FFFFFF',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray500: '#6B7280',
  gray700: '#374151',
  red500: '#EF4444',
  red600: '#DC2626',
  green500: '#22C55E',
  green600: '#16A34A',
  gold: '#C9A227',
};

interface ContentCategoryProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
  onPress: () => void;
}

function ContentCategory({ icon, title, count, color, onPress }: ContentCategoryProps) {
  return (
    <Pressable style={styles.categoryCard} onPress={onPress}>
      <View style={[styles.categoryIcon, { backgroundColor: `${color}15` }]}>
        {icon}
      </View>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{title}</Text>
        <Text style={styles.categoryCount}>
          {count} item{count !== 1 ? 's' : ''}
        </Text>
      </View>
      <ChevronRight size={20} color={colors.gray500} />
    </Pressable>
  );
}

export default function AdminMyContentScreen() {
  const router = useRouter();

  // TODO: Fetch admin's own content counts
  // For now using placeholder data
  const [isLoading] = useState<boolean>(false);

  const handleNavigateToCategory = (category: string) => {
    // Navigate to the respective admin screen with filter for current user's content
    switch (category) {
      case 'lesson-plans':
        router.push('/admin/lesson-plans');
        break;
      case 'field-trips':
        router.push('/admin/field-trips');
        break;
      case 'documents':
        router.push('/admin/documents');
        break;
      case 'printables':
        router.push('/admin/printables');
        break;
      case 'quizzes':
        router.push('/admin/quizzes');
        break;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'My Content',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Loading your content...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My Content',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* Header section */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Content Created by You</Text>
        <Text style={styles.headerSubtitle}>
          View and manage all content you have created
        </Text>
      </View>

      {/* Content categories */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <ContentCategory
          icon={<BookOpen size={28} color={colors.forestGreen} />}
          title="Lesson Plans"
          count={0}
          color={colors.forestGreen}
          onPress={() => handleNavigateToCategory('lesson-plans')}
        />

        <ContentCategory
          icon={<Map size={28} color={colors.waterBlue} />}
          title="Virtual Field Trips"
          count={0}
          color={colors.waterBlue}
          onPress={() => handleNavigateToCategory('field-trips')}
        />

        <ContentCategory
          icon={<FileText size={28} color={colors.earthBrown} />}
          title="Primary Source Documents"
          count={0}
          color={colors.earthBrown}
          onPress={() => handleNavigateToCategory('documents')}
        />

        <ContentCategory
          icon={<FileStack size={28} color={colors.green600} />}
          title="Printable Resources"
          count={0}
          color={colors.green600}
          onPress={() => handleNavigateToCategory('printables')}
        />

        <ContentCategory
          icon={<GraduationCap size={28} color={colors.forestGreen} />}
          title="Quizzes"
          count={0}
          color={colors.forestGreen}
          onPress={() => handleNavigateToCategory('quizzes')}
        />

        {/* Info box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>About My Content</Text>
          <Text style={styles.infoText}>
            This section shows all educational content you have created. You can edit, update, or delete your content at any time.
          </Text>
          <Text style={styles.infoText}>
            Published content is visible to all app users. Draft content is only visible to you until you publish it.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },

  // Header section
  headerSection: {
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.forestGreen,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.gray500,
  },

  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: colors.gray500,
    marginTop: 12,
  },

  // List
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Category card
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: colors.gray500,
  },

  // Info box
  infoBox: {
    backgroundColor: `${colors.waterBlue}10`,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.waterBlue,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray500,
    lineHeight: 20,
    marginBottom: 8,
  },
});
