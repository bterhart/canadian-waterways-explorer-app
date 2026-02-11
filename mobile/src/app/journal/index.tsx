// Student Journal Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  BookMarked,
  Plus,
  Calendar,
  Tag,
  ChevronRight,
  User,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useJournalByIdentifier,
  useCreateOrGetJournal,
  useCreateJournalEntry,
} from '@/lib/api/education-api';
import type { JournalEntry } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

const JOURNAL_IDENTIFIER_KEY = '@waterways_journal_identifier';

export default function JournalScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');

  const {
    data: journal,
    isLoading: journalLoading,
    refetch,
  } = useJournalByIdentifier(identifier);
  const createJournal = useCreateOrGetJournal();

  useEffect(() => {
    loadIdentifier();
  }, []);

  const loadIdentifier = async () => {
    try {
      const stored = await AsyncStorage.getItem(JOURNAL_IDENTIFIER_KEY);
      if (stored) {
        setIdentifier(stored);
      } else {
        setShowSetup(true);
      }
    } catch {
      setShowSetup(true);
    }
  };

  const handleCreateJournal = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name to create a journal.');
      return;
    }

    const newIdentifier = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      await createJournal.mutateAsync({
        studentIdentifier: newIdentifier,
        studentName: name.trim(),
        schoolName: school.trim() || undefined,
        gradeLevel: grade.trim() || undefined,
      });

      await AsyncStorage.setItem(JOURNAL_IDENTIFIER_KEY, newIdentifier);
      setIdentifier(newIdentifier);
      setShowSetup(false);
      refetch();
    } catch (error) {
      Alert.alert('Error', 'Unable to create journal. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderEntryCard = ({ item }: { item: JournalEntry }) => (
    <Pressable
      style={({ pressed }) => [styles.entryCard, pressed && styles.cardPressed]}
      onPress={() => router.push(`/journal/entry/${item.id}`)}
    >
      <View style={styles.entryHeader}>
        <Calendar size={14} color="#6B7280" />
        <Text style={styles.entryDate}>{formatDate(item.createdAt)}</Text>
      </View>
      {item.title ? (
        <Text style={styles.entryTitle}>{item.title}</Text>
      ) : null}
      <Text style={styles.entryContent} numberOfLines={3}>
        {item.content}
      </Text>
      {item.tags && item.tags.length > 0 ? (
        <View style={styles.tagsRow}>
          <Tag size={12} color="#6B7280" />
          <Text style={styles.tagsText}>{item.tags.join(', ')}</Text>
        </View>
      ) : null}
      <ChevronRight
        size={20}
        color="#9CA3AF"
        style={styles.entryArrow}
      />
    </Pressable>
  );

  if (showSetup) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'My Journal',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: 'white',
          }}
        />
        <View style={styles.setupContainer}>
          <View style={styles.setupIcon}>
            <BookMarked size={48} color={colors.forestGreen} />
          </View>
          <Text style={styles.setupTitle}>Create Your Journal</Text>
          <Text style={styles.setupSubtitle}>
            Keep track of your learning journey through Canadian waterways
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Your Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>School (optional)</Text>
            <TextInput
              style={styles.input}
              value={school}
              onChangeText={setSchool}
              placeholder="Enter your school"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Grade (optional)</Text>
            <TextInput
              style={styles.input}
              value={grade}
              onChangeText={setGrade}
              placeholder="e.g., 5, 7, 10"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <Pressable
            style={[
              styles.createButton,
              createJournal.isPending && styles.buttonDisabled,
            ]}
            onPress={handleCreateJournal}
            disabled={createJournal.isPending}
          >
            {createJournal.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.createButtonText}>Create Journal</Text>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  if (journalLoading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen
          options={{
            title: 'My Journal',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: 'white',
          }}
        />
        <ActivityIndicator size="large" color={colors.forestGreen} />
        <Text style={styles.loadingText}>Loading your journal...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My Journal',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      {/* Journal Header */}
      {journal ? (
        <View style={styles.journalHeader}>
          <View style={styles.avatarContainer}>
            <User size={24} color="white" />
          </View>
          <View style={styles.journalInfo}>
            <Text style={styles.journalName}>
              {journal.studentName || 'My Journal'}
            </Text>
            {journal.schoolName ? (
              <Text style={styles.journalSchool}>{journal.schoolName}</Text>
            ) : null}
          </View>
          <View style={styles.entryCount}>
            <Text style={styles.entryCountNumber}>
              {journal.entries?.length || 0}
            </Text>
            <Text style={styles.entryCountLabel}>Entries</Text>
          </View>
        </View>
      ) : null}

      {/* Entries List */}
      {journal?.entries && journal.entries.length > 0 ? (
        <FlatList
          data={journal.entries}
          renderItem={renderEntryCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <BookMarked size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No entries yet</Text>
          <Text style={styles.emptySubtext}>
            Start documenting your learning journey
          </Text>
        </View>
      )}

      {/* Add Entry FAB */}
      <Pressable
        style={styles.fab}
        onPress={() =>
          journal && router.push(`/journal/entry/new?journalId=${journal.id}`)
        }
      >
        <Plus size={24} color="white" />
      </Pressable>
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
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
  },
  setupContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  setupIcon: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  setupTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.darkGreen,
    textAlign: 'center',
    marginBottom: 8,
  },
  setupSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#374151',
  },
  createButton: {
    backgroundColor: colors.forestGreen,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  journalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.forestGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  journalInfo: {
    flex: 1,
  },
  journalName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  journalSchool: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  entryCount: {
    alignItems: 'center',
  },
  entryCountNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.forestGreen,
  },
  entryCountLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  entryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
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
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 6,
  },
  entryContent: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  tagsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  entryArrow: {
    position: 'absolute',
    right: 16,
    top: '50%',
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.forestGreen,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
