// Journal Entry Detail/Edit Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Save, Trash2, Calendar, Tag } from 'lucide-react-native';
import {
  useJournal,
  useCreateJournalEntry,
  useUpdateJournalEntry,
  useDeleteJournalEntry,
} from '@/lib/api/education-api';
import type { JournalEntry } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

export default function JournalEntryScreen() {
  const { id, journalId } = useLocalSearchParams<{
    id: string;
    journalId?: string;
  }>();
  const router = useRouter();
  const isNew = id === 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const { data: journal, isLoading } = useJournal(journalId ?? null);
  const createEntry = useCreateJournalEntry();
  const updateEntry = useUpdateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();

  // Find existing entry
  const existingEntry: JournalEntry | undefined = !isNew && journal?.entries
    ? journal.entries.find((e) => e.id === id)
    : undefined;

  useEffect(() => {
    if (existingEntry) {
      setTitle(existingEntry.title || '');
      setContent(existingEntry.content);
      setTags(existingEntry.tags?.join(', ') || '');
    }
  }, [existingEntry]);

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Content Required', 'Please write something in your entry.');
      return;
    }

    const tagsArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      if (isNew && journalId) {
        await createEntry.mutateAsync({
          journalId,
          payload: {
            title: title.trim() || undefined,
            content: content.trim(),
            tags: tagsArray.length > 0 ? tagsArray : undefined,
          },
        });
      } else if (existingEntry && journal) {
        await updateEntry.mutateAsync({
          journalId: journal.id,
          entryId: existingEntry.id,
          payload: {
            title: title.trim() || undefined,
            content: content.trim(),
            tags: tagsArray.length > 0 ? tagsArray : undefined,
          },
        });
      }
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Unable to save entry. Please try again.');
    }
  };

  const handleDelete = () => {
    if (!existingEntry || !journal) return;

    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry.mutateAsync({
                journalId: journal.id,
                entryId: existingEntry.id,
              });
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Unable to delete entry. Please try again.');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isSaving = createEntry.isPending || updateEntry.isPending;

  if (isLoading && !isNew) {
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
          title: isNew ? 'New Entry' : 'Edit Entry',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
          headerRight: () => (
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              style={styles.headerButton}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Save size={22} color="white" />
              )}
            </Pressable>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Date */}
        <View style={styles.dateRow}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.dateText}>
            {existingEntry
              ? formatDate(existingEntry.createdAt)
              : formatDate(new Date().toISOString())}
          </Text>
        </View>

        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Title (optional)</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Give your entry a title..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Content Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Your Thoughts</Text>
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="Write about what you learned, discovered, or found interesting..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Tags Input */}
        <View style={styles.inputGroup}>
          <View style={styles.tagsLabelRow}>
            <Tag size={16} color={colors.darkGreen} />
            <Text style={styles.inputLabel}>Tags (optional)</Text>
          </View>
          <TextInput
            style={styles.tagsInput}
            value={tags}
            onChangeText={setTags}
            placeholder="exploration, fur trade, rivers..."
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.tagsHint}>Separate tags with commas</Text>
        </View>

        {/* Delete Button */}
        {!isNew && existingEntry ? (
          <Pressable
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={deleteEntry.isPending}
          >
            {deleteEntry.isPending ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <>
                <Trash2 size={18} color="#EF4444" />
                <Text style={styles.deleteButtonText}>Delete Entry</Text>
              </>
            )}
          </Pressable>
        ) : null}

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  inputGroup: {
    padding: 16,
    paddingBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  contentInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    minHeight: 200,
  },
  tagsLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tagsInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#374151',
  },
  tagsHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  bottomSpacer: {
    height: 32,
  },
});
