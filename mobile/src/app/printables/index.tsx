// Printable Resources Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Printer,
  Download,
  Filter,
  FileText,
  Eye,
} from 'lucide-react-native';
import {
  usePrintables,
  usePrintableTypes,
  usePrintableTopics,
} from '@/lib/api/education-api';
import {
  getGradeLevelRangeColor,
  getGradeLevelRangeLabel,
  GRADE_LEVEL_RANGES,
} from '@/lib/types/education';
import type { PrintableResource } from '@/lib/types/education';
import { useDeviceId } from '@/lib/identity';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

// Keys match the live `resourceType` values (worksheet, map, timeline,
// activity_sheet, quiz_printable) plus a few plausible future ones.
const resourceTypeColors: Record<string, string> = {
  worksheet: '#3B82F6',
  map: '#10B981',
  poster: '#EC4899',
  flashcard: '#F97316',
  timeline: '#8B5CF6',
  activity: '#06B6D4',
  activity_sheet: '#06B6D4',
  quiz_printable: '#EF4444',
};

const formatResourceType = (type: string) => type.replace(/_/g, ' ');

export default function PrintablesScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>();

  const userId = useDeviceId() ?? undefined; // class content scope (spec 10.27)
  const { data: printables, isLoading, isError } = usePrintables({
    type: selectedType,
    topic: selectedTopic,
    gradeLevel: selectedGrade,
    userId,
  });
  const { data: resourceTypes } = usePrintableTypes();
  const { data: topics } = usePrintableTopics();

  const handleOpenFile = (fileUrl: string | null) => {
    if (fileUrl) {
      Linking.openURL(fileUrl);
    }
  };

  const renderPrintableCard = ({ item }: { item: PrintableResource }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {item.previewImageUrl ? (
          <Image
            source={{ uri: item.previewImageUrl }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.previewImage, styles.previewPlaceholder]}>
            <FileText size={32} color="#D1D5DB" />
          </View>
        )}

        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.typeBadge,
                {
                  backgroundColor:
                    (resourceTypeColors[item.resourceType.toLowerCase()] ||
                      '#6B7280') + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.typeText,
                  {
                    color:
                      resourceTypeColors[item.resourceType.toLowerCase()] ||
                      '#6B7280',
                  },
                ]}
              >
                {formatResourceType(item.resourceType)}
              </Text>
            </View>
            {item.gradeLevel ? (
              <View
                style={[
                  styles.gradeBadge,
                  { backgroundColor: getGradeLevelRangeColor(item.gradeLevel) },
                ]}
              >
                <Text style={styles.gradeBadgeText}>
                  {getGradeLevelRangeLabel(item.gradeLevel)}
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>

          {item.description ? (
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}

          <View style={styles.cardFooter}>
            <View style={styles.topicBadge}>
              <Text style={styles.topicText}>{item.topic}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => router.push(`/printables/${item.id}`)}
        >
          <Eye size={18} color="white" />
          <Text style={styles.actionText}>View Resource</Text>
        </Pressable>
        {item.fileUrl ? (
          <Pressable
            style={[styles.actionButton, styles.downloadButton]}
            onPress={() => handleOpenFile(item.fileUrl)}
          >
            <Download size={18} color={colors.forestGreen} />
            <Text style={[styles.actionText, styles.downloadText]}>Download</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Printable Resources',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      {/* Filters */}
      <View style={styles.filtersSection}>
        <View style={styles.filterRow}>
          <Filter size={16} color="#6B7280" />
          <Text style={styles.filterLabel}>Type:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.filterChips}
          >
            <Pressable
              style={[
                styles.filterChip,
                !selectedType && styles.filterChipActive,
              ]}
              onPress={() => setSelectedType(undefined)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  !selectedType && styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>
            {resourceTypes?.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.filterChip,
                  selectedType === type && styles.filterChipActive,
                ]}
                onPress={() =>
                  setSelectedType(selectedType === type ? undefined : type)
                }
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedType === type && styles.filterChipTextActive,
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterRow}>
          <Printer size={16} color="#6B7280" />
          <Text style={styles.filterLabel}>Grade:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.filterChips}
          >
            <Pressable
              style={[
                styles.filterChip,
                !selectedGrade && styles.filterChipActive,
              ]}
              onPress={() => setSelectedGrade(undefined)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  !selectedGrade && styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>
            {GRADE_LEVEL_RANGES.map((grade) => (
              <Pressable
                key={grade}
                style={[
                  styles.filterChip,
                  selectedGrade === grade && styles.filterChipActive,
                ]}
                onPress={() =>
                  setSelectedGrade(selectedGrade === grade ? undefined : grade)
                }
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedGrade === grade && styles.filterChipTextActive,
                  ]}
                >
                  {grade}
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
          <Text style={styles.loadingText}>Loading resources...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Unable to load resources</Text>
        </View>
      ) : printables && printables.length > 0 ? (
        <FlatList
          data={printables}
          renderItem={renderPrintableCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Printer size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No resources found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
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
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  previewImage: {
    width: 100,
    height: 130,
    borderRadius: 8,
  },
  previewPlaceholder: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  gradeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  cardFooter: {
    marginTop: 'auto',
  },
  topicBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  topicText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  actionRow: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
  },
  viewButton: {
    backgroundColor: colors.forestGreen,
  },
  downloadButton: {
    backgroundColor: colors.forestGreen + '15',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  downloadText: {
    color: colors.forestGreen,
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
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
