// Primary Source Document Detail Screen
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import {
  FileText,
  Calendar,
  User,
  MessageCircle,
  BookOpen,
  GraduationCap,
  MapPin,
} from 'lucide-react-native';
import { Pressable } from 'react-native';
import { ReadAloudButton } from '@/components/ReadAloudButton';
import { NarratorToggle } from '@/components/NarratorToggle';
import { useDocument } from '@/lib/api/education-api';
import { SourcesList } from '@/components/SourcesList';
import { getGradeLevelColor, getGradeLevelLabel } from '@/lib/types/education';
import { RelatedLinks } from '@/components/RelatedLinks';
import { useExploration } from '@/lib/exploration';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  /** Sits at the right of the heading (Read aloud, roadmap item 5). */
  action?: React.ReactNode;
}

function Section({ title, icon, children, action }: SectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={[styles.sectionTitle, { flex: 1 }]}>{title}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: document, isLoading, isError } = useDocument(id ?? null);

  // Opening a document counts as reading it: 5 points once per device (decision 9)
  useExploration('document_read', id, !!document);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
      </View>
    );
  }

  if (isError || !document) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>Unable to load document</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: 'Document',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      {/* Document Image */}
      {document.imageUrl ? (
        <Image
          source={{ uri: document.imageUrl }}
          style={styles.documentImage}
          resizeMode="contain"
        />
      ) : null}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadges}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{document.documentType}</Text>
          </View>
          {document.gradeLevel ? (
            <View
              style={[
                styles.gradeBadge,
                { backgroundColor: getGradeLevelColor(document.gradeLevel) },
              ]}
            >
              <Text style={styles.gradeBadgeText}>
                {getGradeLevelLabel(document.gradeLevel)}
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.title}>{document.title}</Text>

        <View style={styles.metaRow}>
          {document.author ? (
            <View style={styles.metaItem}>
              <User size={14} color="#6B7280" />
              <Text style={styles.metaText}>{document.author}</Text>
            </View>
          ) : null}
          {document.originalDate || document.originalYear ? (
            <View style={styles.metaItem}>
              <Calendar size={14} color="#6B7280" />
              <Text style={styles.metaText}>
                {document.originalDate || document.originalYear}
              </Text>
            </View>
          ) : null}
        </View>
        <RelatedLinks explorer={document.explorer} waterway={document.waterway} location={document.location} />
        {/* Where the words were written or spoken, and the way to that spot (roadmap item 5) */}
        {document.spotName && document.spotLatitude !== null ? (
          <View style={styles.spotRow}>
            <MapPin size={14} color="#7C2D12" />
            <View style={{ flex: 1 }}>
              <Text style={styles.spotLabel}>Where these words were written</Text>
              <Text style={styles.spotName}>{document.spotName}</Text>
              <Pressable onPress={() => router.push({ pathname: '/', params: { voiceId: document.id } })} hitSlop={6} accessibilityRole="link">
                <Text style={styles.spotLink}>Show on the map</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>

      {/* Sources (Citation table, roadmap item 14) */}
      <View style={styles.section}>
        <SourcesList targetType="document" targetId={document.id} titleColor={colors.forestGreen} />
      </View>

      {/* Historical Context (present on all 48 live documents) */}
      {document.historicalContext ? (
        <Section
          title="Historical Context"
          icon={<BookOpen size={20} color={colors.forestGreen} />}
        >
          <Text style={styles.bodyText}>{document.historicalContext}</Text>
        </Section>
      ) : null}

      {/* Original Text (period spelling, where recorded) */}
      {document.originalText ? (
        <Section
          title="Original Text"
          icon={<FileText size={20} color={colors.forestGreen} />}
        >
          <View style={styles.transcriptionCard}>
            <Text style={styles.transcriptionText}>{document.originalText}</Text>
          </View>
        </Section>
      ) : null}

      {/* Transcription */}
      {document.transcription ? (
        <Section
          title={document.originalText ? 'Modern Transcription' : 'Transcription'}
          icon={<FileText size={20} color={colors.forestGreen} />}
          action={<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><NarratorToggle color={colors.forestGreen} compact /><ReadAloudButton text={document.transcription} documentId={document.id} color={colors.forestGreen} compact /></View>}
        >
          <View style={styles.transcriptionCard}>
            <Text style={styles.transcriptionText}>
              {document.transcription}
            </Text>
          </View>
        </Section>
      ) : null}

      {/* Grade-level annotations */}
      {document.annotations && document.annotations.length > 0 ? (
        <Section
          title="Reading Notes by Grade"
          icon={<GraduationCap size={20} color={colors.forestGreen} />}
        >
          {document.annotations.map((note, index) => (
            <View key={index} style={styles.significanceCard}>
              <Text style={styles.significanceLabel}>Grades {note.gradeLevel}</Text>
              <Text style={styles.significanceText}>{note.annotation}</Text>
            </View>
          ))}
        </Section>
      ) : null}

      {/* Vocabulary */}
      {document.vocabulary && document.vocabulary.length > 0 ? (
        <Section
          title="Key Vocabulary"
          icon={<BookOpen size={20} color={colors.forestGreen} />}
        >
          {document.vocabulary.map((item, index) => (
            <View key={index} style={styles.vocabItem}>
              <Text style={styles.vocabTerm}>{item.word}</Text>
              {item.definition ? (
                <Text style={styles.vocabDefinition}>{item.definition}</Text>
              ) : null}
            </View>
          ))}
        </Section>
      ) : null}

      {/* Discussion Questions */}
      {document.discussionQuestions && document.discussionQuestions.length > 0 ? (
        <Section
          title="Discussion Questions"
          icon={<MessageCircle size={20} color={colors.forestGreen} />}
        >
          {document.discussionQuestions.map((question, index) => (
            <View key={index} style={styles.questionCard}>
              <Text style={styles.questionNumber}>Q{index + 1}</Text>
              <Text style={styles.questionText}>{question}</Text>
            </View>
          ))}
        </Section>
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
  documentImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#F3F4F6',
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
    backgroundColor: '#8B5CF6' + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B5CF6',
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
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 12,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  bodyText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  significanceCard: {
    backgroundColor: '#FEF3C7',
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
  },
  significanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  significanceText: {
    fontSize: 15,
    color: '#78350F',
    lineHeight: 22,
  },
  transcriptionCard: {
    backgroundColor: '#FFFEF7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  transcriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  vocabItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  vocabTerm: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 4,
  },
  vocabDefinition: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  questionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.forestGreen,
    marginRight: 10,
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 32,
  },
  spotRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 14, padding: 12, backgroundColor: '#FFFBF5', borderRadius: 12, borderLeftWidth: 3, borderLeftColor: '#7C2D12' },
  spotLabel: { fontSize: 11, fontWeight: '800', color: '#7C2D12', letterSpacing: 0.5, textTransform: 'uppercase' },
  spotName: { fontSize: 14, color: '#374151', marginTop: 2 },
  spotLink: { fontSize: 13, fontWeight: '600', color: '#3B82A3', textDecorationLine: 'underline', marginTop: 6 },
});
