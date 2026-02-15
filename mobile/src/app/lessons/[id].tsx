// Deep Dive Detail Screen - General User Version
// Shows narrative content with images, no teacher-focused sections
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Clock, Calendar, User, MapPin } from 'lucide-react-native';
import { useLessonPlan } from '@/lib/api/education-api';
import { getGradeLevelRangeColor, getGradeLevelRangeLabel } from '@/lib/types/education';

const { width: screenWidth } = Dimensions.get('window');

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
  gold: '#C9A227',
  indigenous: '#8B4513',
};

interface DeepDiveImage {
  url: string;
  caption: string;
  credit?: string;
}

interface KeyFigure {
  name: string;
  role: string;
  years?: string;
  description: string;
  imageUrl?: string;
}

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
}

export default function DeepDiveDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: lesson, isLoading, isError } = useLessonPlan(id ?? null);

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

  const images: DeepDiveImage[] = lesson.images || [];
  const keyFigures: KeyFigure[] = lesson.keyFigures || [];
  const timeline: TimelineEvent[] = lesson.timeline || [];

  return (
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
          <MapPin size={48} color={colors.forestGreen} />
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadges}>
          <View
            style={[
              styles.gradeBadge,
              { backgroundColor: getGradeLevelRangeColor(lesson.gradeLevel) },
            ]}
          >
            <Text style={styles.gradeBadgeText}>
              {getGradeLevelRangeLabel(lesson.gradeLevel)}
            </Text>
          </View>
          {lesson.readingTimeMinutes ? (
            <View style={styles.readingTimeBadge}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.readingTimeText}>
                {lesson.readingTimeMinutes} min read
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.title}>{lesson.title}</Text>
        <View style={styles.topicBadge}>
          <Text style={styles.topicText}>{lesson.topic}</Text>
        </View>
      </View>

      {/* Main Narrative Content */}
      {lesson.narrativeContent ? (
        <View style={styles.narrativeSection}>
          <Text style={styles.narrativeText}>{lesson.narrativeContent}</Text>
        </View>
      ) : lesson.mainContent ? (
        <View style={styles.narrativeSection}>
          <Text style={styles.narrativeText}>{lesson.mainContent}</Text>
        </View>
      ) : lesson.description ? (
        <View style={styles.narrativeSection}>
          <Text style={styles.narrativeText}>{lesson.description}</Text>
        </View>
      ) : null}

      {/* Image Gallery */}
      {images.length > 0 ? (
        <View style={styles.gallerySection}>
          <Text style={styles.sectionTitle}>Images</Text>
          {images.map((image, index) => (
            <View key={index} style={styles.galleryItem}>
              <Image
                source={{ uri: image.url }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
              {image.caption ? (
                <Text style={styles.imageCaption}>{image.caption}</Text>
              ) : null}
              {image.credit ? (
                <Text style={styles.imageCredit}>{image.credit}</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* Key Historical Figures */}
      {keyFigures.length > 0 ? (
        <View style={styles.figuresSection}>
          <View style={styles.sectionHeader}>
            <User size={20} color={colors.forestGreen} />
            <Text style={styles.sectionTitle}>Key Figures</Text>
          </View>
          {keyFigures.map((figure, index) => (
            <View key={index} style={styles.figureCard}>
              {figure.imageUrl ? (
                <Image
                  source={{ uri: figure.imageUrl }}
                  style={styles.figureImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.figureImagePlaceholder}>
                  <User size={24} color={colors.forestGreen} />
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
            </View>
          ))}
        </View>
      ) : null}

      {/* Timeline */}
      {timeline.length > 0 ? (
        <View style={styles.timelineSection}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={colors.forestGreen} />
            <Text style={styles.sectionTitle}>Timeline</Text>
          </View>
          {timeline.map((event, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={styles.timelineDot} />
                {index < timeline.length - 1 ? (
                  <View style={styles.timelineLine} />
                ) : null}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineYear}>{event.year}</Text>
                <Text style={styles.timelineTitle}>{event.title}</Text>
                <Text style={styles.timelineDescription}>{event.description}</Text>
              </View>
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
  heroImage: {
    width: screenWidth,
    height: 220,
  },
  heroPlaceholder: {
    width: screenWidth,
    height: 160,
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
  readingTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  readingTimeText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.darkGreen,
    marginBottom: 12,
    lineHeight: 32,
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
  narrativeText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
  },
  gallerySection: {
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
    marginBottom: 16,
  },
  galleryItem: {
    marginBottom: 20,
  },
  galleryImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imageCaption: {
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
    fontStyle: 'italic',
  },
  imageCredit: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  figuresSection: {
    backgroundColor: 'white',
    marginTop: 12,
    padding: 20,
  },
  figureCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  figureImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 14,
  },
  figureImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.forestGreen + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  figureInfo: {
    flex: 1,
  },
  figureName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  figureRole: {
    fontSize: 14,
    color: colors.forestGreen,
    fontWeight: '500',
    marginTop: 2,
  },
  figureYears: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  figureDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginTop: 6,
  },
  timelineSection: {
    backgroundColor: 'white',
    marginTop: 12,
    padding: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 4,
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
    width: 2,
    flex: 1,
    backgroundColor: colors.forestGreen + '40',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineYear: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gold,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.darkGreen,
    marginTop: 2,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginTop: 4,
  },
  bottomSpacer: {
    height: 32,
  },
});
