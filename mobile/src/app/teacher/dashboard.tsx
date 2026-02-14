// Teacher Dashboard Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  GraduationCap,
  Users,
  ClipboardList,
  Plus,
  ChevronRight,
  LogOut,
  Settings,
  BookOpen,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTeacherClasses } from '@/lib/api/education-api';
import type { ClassSummary, Teacher } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

const TEACHER_SESSION_KEY = '@waterways_teacher_session';

export default function TeacherDashboardScreen() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: classes, isLoading: classesLoading } = useTeacherClasses(
    teacher?.id ?? null
  );

  useEffect(() => {
    loadTeacher();
  }, []);

  const loadTeacher = async () => {
    try {
      const stored = await AsyncStorage.getItem(TEACHER_SESSION_KEY);
      if (stored) {
        setTeacher(JSON.parse(stored));
      } else {
        router.replace('/teacher/login');
      }
    } catch {
      router.replace('/teacher/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem(TEACHER_SESSION_KEY);
          router.replace('/teacher/login');
        },
      },
    ]);
  };

  const renderClassCard = ({ item }: { item: ClassSummary }) => (
    <Pressable
      style={({ pressed }) => [styles.classCard, pressed && styles.cardPressed]}
      onPress={() => router.push(`/teacher/class/${item.id}`)}
    >
      <View style={styles.classHeader}>
        <View style={styles.classIcon}>
          <Users size={20} color={colors.forestGreen} />
        </View>
        <View style={styles.classInfo}>
          <Text style={styles.className}>{item.name}</Text>
          <Text style={styles.classGrade}>Grade {item.gradeLevel}</Text>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
      </View>

      <View style={styles.classStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{item.studentCount}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{item.assignmentCount}</Text>
          <Text style={styles.statLabel}>Assignments</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.isActive ? '#10B981' : '#6B7280' },
            ]}
          >
            <Text style={styles.statusText}>
              {item.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </View>

      {item.joinCode ? (
        <View style={styles.joinCodeRow}>
          <Text style={styles.joinCodeLabel}>Join Code:</Text>
          <Text style={styles.joinCode}>{item.joinCode}</Text>
        </View>
      ) : null}
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Dashboard',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
          headerRight: () => (
            <Pressable onPress={handleLogout} style={styles.headerButton}>
              <LogOut size={22} color="white" />
            </Pressable>
          ),
        }}
      />

      {/* Teacher Info */}
      {teacher ? (
        <View style={styles.teacherHeader}>
          <View style={styles.avatarContainer}>
            <GraduationCap size={28} color="white" />
          </View>
          <View style={styles.teacherInfo}>
            <Text style={styles.teacherName}>{teacher.name}</Text>
            {teacher.schoolName ? (
              <Text style={styles.teacherSchool}>{teacher.schoolName}</Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {/* Stats Overview */}
      <View style={styles.statsOverview}>
        <View style={styles.overviewCard}>
          <Users size={24} color={colors.forestGreen} />
          <Text style={styles.overviewNumber}>{classes?.length || 0}</Text>
          <Text style={styles.overviewLabel}>Classes</Text>
        </View>
        <View style={styles.overviewCard}>
          <ClipboardList size={24} color="#3B82F6" />
          <Text style={styles.overviewNumber}>
            {classes?.reduce((sum, c) => sum + c.assignmentCount, 0) || 0}
          </Text>
          <Text style={styles.overviewLabel}>Assignments</Text>
        </View>
      </View>

      {/* Lesson Plans Card */}
      <Pressable
        style={({ pressed }) => [styles.lessonPlansCard, pressed && styles.cardPressed]}
        onPress={() => router.push('/teacher/lesson-plans')}
      >
        <View style={styles.lessonPlansIcon}>
          <BookOpen size={24} color={colors.forestGreen} />
        </View>
        <View style={styles.lessonPlansInfo}>
          <Text style={styles.lessonPlansTitle}>Lesson Plans</Text>
          <Text style={styles.lessonPlansSubtitle}>
            Curriculum-aligned lessons for K-12
          </Text>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
      </Pressable>

      {/* Classes Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Classes</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/teacher/class/new')}
        >
          <Plus size={18} color="white" />
          <Text style={styles.addButtonText}>New Class</Text>
        </Pressable>
      </View>

      {classesLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
        </View>
      ) : classes && classes.length > 0 ? (
        <FlatList
          data={classes}
          renderItem={renderClassCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Users size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No classes yet</Text>
          <Text style={styles.emptySubtext}>
            Create your first class to get started
          </Text>
        </View>
      )}
    </View>
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
  headerButton: {
    padding: 8,
  },
  teacherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.forestGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  teacherSchool: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statsOverview: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.darkGreen,
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.forestGreen,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  classCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.9,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  classIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  classGrade: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  classStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  joinCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  joinCodeLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginRight: 8,
  },
  joinCode: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.forestGreen,
    letterSpacing: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  lessonPlansCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  lessonPlansIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  lessonPlansInfo: {
    flex: 1,
  },
  lessonPlansTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  lessonPlansSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});
