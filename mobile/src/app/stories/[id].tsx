// Indigenous Story reader (decision 10, 2026-10-16). Opened from the story cards on the
// Indigenous Languages screen; reads GET /api/indigenous-language/stories/:id.
import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Feather, BookOpen, Languages } from 'lucide-react-native';
import { useIndigenousStory } from '@/lib/api/education-api';
import { getGradeLevelRangeColor, getGradeLevelRangeLabel } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
  warmBrown: '#8B4513',
};

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: story, isLoading, isError } = useIndigenousStory(id ?? null);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
      </View>
    );
  }

  if (isError || !story) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Story' }} />
        <Text style={styles.errorText}>Unable to load this story</Text>
      </View>
    );
  }

  // Stories are stored as plain text with blank-line paragraph breaks.
  const paragraphs = story.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: story.title,
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Feather size={28} color={colors.forestGreen} />
        </View>
        <Text style={styles.title}>{story.title}</Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{story.nation}</Text>
          </View>
          {story.language ? (
            <View style={styles.badge}>
              <Languages size={12} color={colors.darkGreen} />
              <Text style={styles.badgeText}>{story.language}</Text>
            </View>
          ) : null}
          {story.theme ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{story.theme}</Text>
            </View>
          ) : null}
          {story.gradeLevel ? (
            <View style={[styles.badge, { backgroundColor: getGradeLevelRangeColor(story.gradeLevel) }]}>
              <Text style={[styles.badgeText, { color: 'white' }]}>{getGradeLevelRangeLabel(story.gradeLevel)}</Text>
            </View>
          ) : null}
        </View>
        {story.summary ? <Text style={styles.summary}>{story.summary}</Text> : null}
      </View>

      <View style={styles.body}>
        <View style={styles.bodyHeader}>
          <BookOpen size={18} color={colors.warmBrown} />
          <Text style={styles.bodyHeading}>The Story</Text>
        </View>
        {paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  content: { paddingBottom: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.creamWhite },
  errorText: { fontSize: 16, color: '#6B7280' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#E8E4D8' },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.darkGreen, marginBottom: 10 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8E4D8',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: colors.darkGreen },
  summary: { fontSize: 15, color: '#4B5563', lineHeight: 22, fontStyle: 'italic' },
  body: { padding: 20 },
  bodyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  bodyHeading: { fontSize: 16, fontWeight: '700', color: colors.warmBrown },
  paragraph: { fontSize: 16, lineHeight: 26, color: '#1F2937', marginBottom: 14 },
});
