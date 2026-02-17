// Create New Class Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Users, GraduationCap, Calendar } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCreateClass } from '@/lib/api/education-api';
import { GRADE_LEVELS } from '@/lib/types/education';
import type { Teacher } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

const TEACHER_SESSION_KEY = '@waterways_teacher_session';

export default function NewClassScreen() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [schoolYear, setSchoolYear] = useState('');

  const createClass = useCreateClass();

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
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter a class name.');
      return;
    }
    if (!gradeLevel) {
      Alert.alert('Grade Required', 'Please select a grade level.');
      return;
    }
    if (!teacher) {
      Alert.alert('Error', 'Teacher session not found.');
      return;
    }

    try {
      const newClass = await createClass.mutateAsync({
        name: name.trim(),
        gradeLevel,
        schoolYear: schoolYear.trim() || undefined,
        teacherId: teacher.id,
      });

      Alert.alert('Class Created', `Join code: ${newClass.joinCode}`, [
        {
          text: 'Go to Class',
          onPress: () => router.replace(`/teacher/class/${newClass.id}`),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Unable to create class. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: 'Create Class',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Users size={40} color={colors.forestGreen} />
          </View>
          <Text style={styles.title}>Create a New Class</Text>
          <Text style={styles.subtitle}>
            Set up a class for your students to join
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Class Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Class Name *</Text>
            <View style={styles.inputWrapper}>
              <Users size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Period 1 Social Studies"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Grade Level */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Grade Level *</Text>
            <View style={styles.gradeGrid}>
              {GRADE_LEVELS.map((grade) => (
                <Pressable
                  key={grade}
                  style={[
                    styles.gradeButton,
                    gradeLevel === grade && styles.gradeButtonActive,
                  ]}
                  onPress={() => setGradeLevel(grade)}
                >
                  <Text
                    style={[
                      styles.gradeButtonText,
                      gradeLevel === grade && styles.gradeButtonTextActive,
                    ]}
                  >
                    {grade === 'K' ? 'K' : grade}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* School Year */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>School Year (optional)</Text>
            <View style={styles.inputWrapper}>
              <Calendar size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={schoolYear}
                onChangeText={setSchoolYear}
                placeholder="e.g., 2024-2025"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <Pressable
            style={[
              styles.createButton,
              createClass.isPending && styles.buttonDisabled,
            ]}
            onPress={handleCreate}
            disabled={createClass.isPending}
          >
            {createClass.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.createButtonText}>Create Class</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputGroup: {},
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  inputIcon: {
    marginLeft: 14,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: '#374151',
  },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gradeButton: {
    width: 50,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeButtonActive: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
  },
  gradeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  gradeButtonTextActive: {
    color: 'white',
  },
  createButton: {
    backgroundColor: colors.forestGreen,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
