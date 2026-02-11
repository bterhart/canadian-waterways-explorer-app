// Interactive Timeline Screen
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { Calendar, Filter, MapPin, User, Droplets } from 'lucide-react-native';
import { useTimelineEvents, useTimelineThemes } from '@/lib/api/education-api';
import type { TimelineEvent } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

const themeColors: Record<string, string> = {
  exploration: '#3B82F6',
  fur_trade: '#F97316',
  indigenous: '#EC4899',
  confederation: '#8B5CF6',
  maritime: '#06B6D4',
  general: '#6B7280',
};

const importanceColors: Record<string, string> = {
  major: '#EF4444',
  moderate: '#F59E0B',
  minor: '#10B981',
};

function getThemeColor(theme: string): string {
  return themeColors[theme.toLowerCase()] || themeColors.general;
}

function formatDate(event: TimelineEvent): string {
  const parts: string[] = [];
  if (event.month) {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    parts.push(monthNames[event.month - 1]);
  }
  if (event.day) {
    parts.push(String(event.day));
  }
  parts.push(String(event.year));

  let dateStr = parts.join(' ');
  if (event.isApproximate) {
    dateStr = `c. ${dateStr}`;
  }
  if (event.endYear && event.endYear !== event.year) {
    dateStr += ` - ${event.endYear}`;
  }
  return dateStr;
}

export default function TimelineScreen() {
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>();
  const [selectedImportance, setSelectedImportance] = useState<string | undefined>();

  const { data: events, isLoading, isError } = useTimelineEvents({
    theme: selectedTheme,
    importance: selectedImportance,
  });
  const { data: themes } = useTimelineThemes();

  // Group events by era (century)
  const groupedEvents = useMemo(() => {
    if (!events) return [];

    const groups: { era: string; events: TimelineEvent[] }[] = [];
    let currentEra = '';

    events.forEach((event) => {
      const century = Math.floor(event.year / 100) + 1;
      const era = `${century}${century === 1 ? 'st' : century === 2 ? 'nd' : century === 3 ? 'rd' : 'th'} Century`;

      if (era !== currentEra) {
        groups.push({ era, events: [] });
        currentEra = era;
      }
      groups[groups.length - 1].events.push(event);
    });

    return groups;
  }, [events]);

  const renderEventCard = (event: TimelineEvent, isLast: boolean) => (
    <View key={event.id} style={styles.eventWrapper}>
      {/* Timeline connector */}
      <View style={styles.timelineConnector}>
        <View
          style={[
            styles.timelineDot,
            { backgroundColor: getThemeColor(event.theme) },
          ]}
        />
        {!isLast ? <View style={styles.timelineLine} /> : null}
      </View>

      {/* Event card */}
      <View style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventDate}>{formatDate(event)}</Text>
          <View
            style={[
              styles.importanceBadge,
              {
                backgroundColor:
                  importanceColors[event.importance] + '20',
              },
            ]}
          >
            <View
              style={[
                styles.importanceDot,
                { backgroundColor: importanceColors[event.importance] },
              ]}
            />
            <Text
              style={[
                styles.importanceText,
                { color: importanceColors[event.importance] },
              ]}
            >
              {event.importance}
            </Text>
          </View>
        </View>

        <Text style={styles.eventTitle}>{event.title}</Text>
        {event.description ? (
          <Text style={styles.eventDescription} numberOfLines={3}>
            {event.description}
          </Text>
        ) : null}

        <View style={styles.eventMeta}>
          <View
            style={[
              styles.themeBadge,
              { backgroundColor: getThemeColor(event.theme) + '20' },
            ]}
          >
            <Text
              style={[
                styles.themeText,
                { color: getThemeColor(event.theme) },
              ]}
            >
              {event.theme.replace('_', ' ')}
            </Text>
          </View>
          {event.explorerId ? (
            <View style={styles.metaItem}>
              <User size={12} color="#6B7280" />
              <Text style={styles.metaText}>Explorer</Text>
            </View>
          ) : null}
          {event.waterwayId ? (
            <View style={styles.metaItem}>
              <Droplets size={12} color="#6B7280" />
              <Text style={styles.metaText}>Waterway</Text>
            </View>
          ) : null}
          {event.locationId ? (
            <View style={styles.metaItem}>
              <MapPin size={12} color="#6B7280" />
              <Text style={styles.metaText}>Location</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Timeline',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      {/* Filters */}
      <View style={styles.filtersSection}>
        <View style={styles.filterRow}>
          <Filter size={16} color="#6B7280" />
          <Text style={styles.filterLabel}>Theme:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.filterChips}
          >
            <Pressable
              style={[
                styles.filterChip,
                !selectedTheme && styles.filterChipActive,
              ]}
              onPress={() => setSelectedTheme(undefined)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  !selectedTheme && styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>
            {themes?.map((theme) => (
              <Pressable
                key={theme}
                style={[
                  styles.filterChip,
                  selectedTheme === theme && styles.filterChipActive,
                  selectedTheme === theme && {
                    backgroundColor: getThemeColor(theme),
                  },
                ]}
                onPress={() =>
                  setSelectedTheme(selectedTheme === theme ? undefined : theme)
                }
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedTheme === theme && styles.filterChipTextActive,
                  ]}
                >
                  {theme.replace('_', ' ')}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterRow}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.filterLabel}>Importance:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.filterChips}
          >
            <Pressable
              style={[
                styles.filterChip,
                !selectedImportance && styles.filterChipActive,
              ]}
              onPress={() => setSelectedImportance(undefined)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  !selectedImportance && styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>
            {['major', 'moderate', 'minor'].map((imp) => (
              <Pressable
                key={imp}
                style={[
                  styles.filterChip,
                  selectedImportance === imp && styles.filterChipActive,
                  selectedImportance === imp && {
                    backgroundColor: importanceColors[imp],
                  },
                ]}
                onPress={() =>
                  setSelectedImportance(
                    selectedImportance === imp ? undefined : imp
                  )
                }
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedImportance === imp && styles.filterChipTextActive,
                  ]}
                >
                  {imp}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Loading timeline...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Unable to load timeline</Text>
        </View>
      ) : groupedEvents.length > 0 ? (
        <FlatList
          data={groupedEvents}
          keyExtractor={(item) => item.era}
          renderItem={({ item }) => (
            <View style={styles.eraSection}>
              <View style={styles.eraHeader}>
                <Text style={styles.eraTitle}>{item.era}</Text>
                <Text style={styles.eraCount}>
                  {item.events.length} event{item.events.length !== 1 ? 's' : ''}
                </Text>
              </View>
              {item.events.map((event, index) =>
                renderEventCard(event, index === item.events.length - 1)
              )}
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Calendar size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No events found</Text>
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
  filtersSection: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 8,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: {
    backgroundColor: colors.forestGreen,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  filterChipTextActive: {
    color: 'white',
  },
  listContent: {
    padding: 16,
  },
  eraSection: {
    marginBottom: 24,
  },
  eraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 32,
  },
  eraTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.darkGreen,
  },
  eraCount: {
    fontSize: 13,
    color: '#6B7280',
  },
  eventWrapper: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  timelineConnector: {
    width: 32,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E5E7EB',
    marginTop: -2,
    marginBottom: -2,
  },
  eventCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.forestGreen,
  },
  importanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  importanceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  importanceText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 10,
  },
  eventMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  themeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#6B7280',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
});
