// Deep Dive Detail Screen - General User View
// Shows narrative content, key figures, timeline, and images (NOT teacher materials)
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  Pressable,
  Modal,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import {
  BookOpen,
  Clock,
  Users,
  Calendar,
  ImageIcon,
  X,
} from 'lucide-react-native';
import { useLessonPlan, useTimelineEvent } from '@/lib/api/education-api';
import { useExplorerDetail } from '@/lib/api/waterways-api';
import { getGradeLevelColor, getGradeLevelLabel } from '@/lib/types/education';
import type { KeyFigure, DeepDiveTimelineEvent, DeepDiveImage } from '@/lib/types/education';
import { MarkdownContent } from '@/components/MarkdownContent';
import ExplorerDetailModal from '@/components/ExplorerDetailModal';

const { width: screenWidth, height: SCREEN_HEIGHT } = Dimensions.get('window');

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
  warmBrown: '#8B7355',
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

export default function DeepDiveDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: lesson, isLoading, isError } = useLessonPlan(id ?? null);
  const [selectedExplorerId, setSelectedExplorerId] = useState<string | null>(null);
  const [selectedTimelineEventId, setSelectedTimelineEventId] = useState<string | null>(null);

  const { data: selectedExplorerDetail } = useExplorerDetail(selectedExplorerId);
  const { data: selectedTimelineEventDetail } = useTimelineEvent(selectedTimelineEventId);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
      </View>
    );
  }

  if (isError || !lesson) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>Unable to load content</Text>
      </View>
    );
  }

  const keyFigures = lesson.keyFigures as KeyFigure[] | null;
  const timeline = lesson.timeline as DeepDiveTimelineEvent[] | null;
  const images = lesson.images as DeepDiveImage[] | null;

  return (
    <>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: 'Deep Dive',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      {/* Hero Image */}
      {lesson.heroImageUrl ? (
        <Image
          source={{ uri: lesson.heroImageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.heroPlaceholder}>
          <BookOpen size={48} color={colors.forestGreen} />
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadges}>
          {lesson.gradeLevel ? (
            <View
              style={[
                styles.gradeBadge,
                { backgroundColor: getGradeLevelColor(lesson.gradeLevel) },
              ]}
            >
              <Text style={styles.gradeBadgeText}>
                {getGradeLevelLabel(lesson.gradeLevel)}
              </Text>
            </View>
          ) : null}
          {lesson.readingTimeMinutes ? (
            <View style={styles.durationBadge}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.durationText}>
                {lesson.readingTimeMinutes} min read
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.title}>{lesson.title}</Text>
        {lesson.description ? (
          <Text style={styles.description}>{lesson.description}</Text>
        ) : null}
        <View style={styles.topicBadge}>
          <Text style={styles.topicText}>{lesson.topic}</Text>
        </View>
      </View>

      {/* Narrative Content (Story) */}
      {lesson.narrativeContent ? (
        <View style={styles.narrativeSection}>
          <MarkdownContent
            content={lesson.narrativeContent}
            accentColor={colors.forestGreen}
          />
        </View>
      ) : null}

      {/* Key Figures */}
      {keyFigures && keyFigures.length > 0 ? (
        <Section
          title="Key Figures"
          icon={<Users size={20} color={colors.forestGreen} />}
        >
          {keyFigures.map((figure, index) => {
            const explorerId = (figure as any).explorerId;
            const CardWrapper = explorerId ? Pressable : View;
            const cardProps = explorerId
              ? {
                  onPress: () => setSelectedExplorerId(explorerId),
                  style: ({ pressed }: { pressed: boolean }) => [
                    styles.figureCard,
                    pressed && styles.figureCardPressed,
                  ],
                }
              : { style: styles.figureCard };

            return (
              <CardWrapper key={index} {...cardProps}>
                {figure.imageUrl ? (
                  <Image
                    source={{ uri: figure.imageUrl }}
                    style={styles.figureImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.figureImagePlaceholder}>
                    <Users size={24} color={colors.forestGreen} />
                  </View>
                )}
                <View style={styles.figureInfo}>
                  <Text style={styles.figureName}>{figure.name}</Text>
                  <Text style={styles.figureRole}>{figure.role}</Text>
                  {figure.years ? (
                    <Text style={styles.figureYears}>{figure.years}</Text>
                  ) : null}
                  <Text style={styles.figureDescription}>{figure.description}</Text>
                </View>
              </CardWrapper>
            );
          })}
        </Section>
      ) : null}

      {/* Timeline */}
      {timeline && timeline.length > 0 ? (
        <Section
          title="Timeline"
          icon={<Calendar size={20} color={colors.forestGreen} />}
        >
          <View style={styles.timeline}>
            {timeline.map((event, index) => {
              const eventId = (event as any).eventId;
              const ContentWrapper = Pressable;
              const contentProps = {
                onPress: () => setSelectedTimelineEventId(eventId || null),
                style: ({ pressed }: { pressed: boolean }) => [
                  styles.timelineContent,
                  pressed && styles.timelineContentPressed,
                ],
              };

              return (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={styles.timelineDot} />
                    {index < timeline.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>
                  <ContentWrapper {...contentProps}>
                    <Text style={styles.timelineYear}>{event.year}</Text>
                    <Text style={styles.timelineTitle}>{event.title}</Text>
                    <Text style={styles.timelineDescription}>
                      {event.description}
                    </Text>
                  </ContentWrapper>
                </View>
              );
            })}
          </View>
        </Section>
      ) : null}

      {/* Image Gallery */}
      {images && images.length > 0 ? (
        <Section
          title="Gallery"
          icon={<ImageIcon size={20} color={colors.forestGreen} />}
        >
          {images.map((image, index) => (
            <View key={index} style={styles.galleryItem}>
              <Image
                source={{ uri: image.url }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
              {image.caption ? (
                <Text style={styles.galleryCaption}>{image.caption}</Text>
              ) : null}
              {image.credit ? (
                <Text style={styles.galleryCredit}>{image.credit}</Text>
              ) : null}
            </View>
          ))}
        </Section>
      ) : null}

      <View style={styles.bottomSpacer} />
    </ScrollView>

    {/* Explorer Detail Modal */}
    {selectedExplorerId && selectedExplorerDetail ? (
      <ExplorerDetailModal
        explorer={selectedExplorerDetail}
        onClose={() => setSelectedExplorerId(null)}
      />
    ) : null}

    {/* Timeline Event Detail Modal */}
    <Modal
      visible={selectedTimelineEventId !== null && !!selectedTimelineEventDetail}
      animationType="slide"
      transparent
      onRequestClose={() => setSelectedTimelineEventId(null)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setSelectedTimelineEventId(null)}
        />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={2}>
              {selectedTimelineEventDetail?.title}
            </Text>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setSelectedTimelineEventId(null)}
            >
              <X size={20} color="#6B7280" />
            </Pressable>
          </View>
          <ScrollView
            style={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {selectedTimelineEventDetail ? (
              <>
                <Text style={styles.modalDate}>
                  {selectedTimelineEventDetail.year}
                  {selectedTimelineEventDetail.month && selectedTimelineEventDetail.day
                    ? ` (${selectedTimelineEventDetail.month}/${selectedTimelineEventDetail.day})`
                    : ''}
                </Text>
                {selectedTimelineEventDetail.description ? (
                  <Text style={styles.modalDescription}>
                    {selectedTimelineEventDetail.description}
                  </Text>
                ) : null}
              </>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  </>
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
  heroImage: {
    width: screenWidth,
    height: 220,
  },
  heroPlaceholder: {
    width: screenWidth,
    height: 180,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
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
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.darkGreen,
    marginBottom: 8,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 12,
  },
  topicBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.forestGreen + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  topicText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.forestGreen,
  },
  narrativeSection: {
    backgroundColor: 'white',
    marginTop: 12,
    padding: 20,
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  // Key Figures styles
  figureCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  figureCardPressed: {
    backgroundColor: '#E5E7EB',
    opacity: 0.8,
  },
  figureImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  figureImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.forestGreen + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  figureInfo: {
    flex: 1,
    marginLeft: 14,
  },
  figureName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 2,
  },
  figureRole: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.forestGreen,
    marginBottom: 2,
  },
  figureYears: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  figureDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  // Timeline styles
  timeline: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.forestGreen,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.forestGreen + '30',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 4,
  },
  timelineContentPressed: {
    opacity: 0.6,
  },
  timelineYear: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.forestGreen,
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGreen,
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  // Gallery styles
  galleryItem: {
    marginBottom: 16,
  },
  galleryImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  galleryCaption: {
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
    lineHeight: 20,
  },
  galleryCredit: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: 32,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.85,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
    flex: 1,
    marginRight: 8,
  },
  modalScrollContent: {
    padding: 16,
  },
  modalDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.forestGreen,
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: '#374151',
  },
});
