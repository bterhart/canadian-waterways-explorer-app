// Primary Source Document Detail Screen
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Linking,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import {
  FileText,
  Calendar,
  User,
  MessageCircle,
  BookOpen,
  ExternalLink,
} from 'lucide-react-native';
import { useDocument } from '@/lib/api/education-api';
import { getGradeLevelColor, getGradeLevelLabel } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: document, isLoading, isError } = useDocument(id ?? null);

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
      </View>

      {/* Description */}
      {document.description ? (
        <Section
          title="About This Document"
          icon={<FileText size={20} color={colors.forestGreen} />}
        >
          <Text style={styles.bodyText}>{document.description}</Text>
        </Section>
      ) : null}

      {/* Historical Context */}
      {document.contextualBackground ? (
        <Section
          title="Historical Context"
          icon={<BookOpen size={20} color={colors.forestGreen} />}
        >
          <Text style={styles.bodyText}>{document.contextualBackground}</Text>
        </Section>
      ) : null}

      {/* Historical Significance */}
      {document.historicalSignificance ? (
        <View style={styles.significanceCard}>
          <Text style={styles.significanceLabel}>Historical Significance</Text>
          <Text style={styles.significanceText}>
            {document.historicalSignificance}
          </Text>
        </View>
      ) : null}

      {/* Transcription */}
      {document.transcription ? (
        <Section
          title="Transcription"
          icon={<FileText size={20} color={colors.forestGreen} />}
        >
          <View style={styles.transcriptionCard}>
            <Text style={styles.transcriptionText}>
              {document.transcription}
            </Text>
          </View>
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
              <Text style={styles.vocabTerm}>{item.term}</Text>
              <Text style={styles.vocabDefinition}>{item.definition}</Text>
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

      {/* Source Attribution */}
      {document.sourceAttribution || document.sourceUrl ? (
        <View style={styles.sourceSection}>
          <Text style={styles.sourceLabel}>Source</Text>
          {document.sourceAttribution ? (
            <Text style={styles.sourceText}>{document.sourceAttribution}</Text>
          ) : null}
          {document.sourceUrl ? (
            <View style={styles.sourceLink}>
              <ExternalLink size={14} color="#3B82F6" />
              <Text
                style={styles.sourceLinkText}
                onPress={() => document.sourceUrl && Linking.openURL(document.sourceUrl)}
              >
                View Original Source
              </Text>
            </View>
          ) : null}
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
    margin: 16,
    marginBottom: 0,
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
  sourceSection: {
    backgroundColor: '#F9FAFB',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sourceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sourceText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  sourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  sourceLinkText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 32,
  },
});
