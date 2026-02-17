// Primary Source Documents List Screen
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
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { FileText, Calendar, User, ChevronRight, Filter } from 'lucide-react-native';
import { useDocuments, useDocumentTypes } from '@/lib/api/education-api';
import type { DocumentSummary } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

const documentTypeIcons: Record<string, string> = {
  map: '#3B82F6',
  journal: '#10B981',
  letter: '#8B5CF6',
  treaty: '#EF4444',
  photograph: '#F97316',
  artwork: '#EC4899',
  newspaper: '#6B7280',
};

export default function DocumentsScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | undefined>();

  const { data: documents, isLoading, isError } = useDocuments({
    type: selectedType,
  });
  const { data: documentTypes } = useDocumentTypes();

  const renderDocumentCard = ({ item }: { item: DocumentSummary }) => (
    <Pressable
      style={({ pressed }) => [styles.docCard, pressed && styles.cardPressed]}
      onPress={() => router.push(`/documents/${item.id}`)}
    >
      <View style={styles.docCardContent}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.docThumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.docThumbnail, styles.docThumbnailPlaceholder]}>
            <FileText size={24} color="#D1D5DB" />
          </View>
        )}

        <View style={styles.docInfo}>
          <View style={styles.docHeader}>
            <View
              style={[
                styles.typeBadge,
                {
                  backgroundColor:
                    (documentTypeIcons[item.documentType.toLowerCase()] || '#6B7280') + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.typeText,
                  {
                    color:
                      documentTypeIcons[item.documentType.toLowerCase()] || '#6B7280',
                  },
                ]}
              >
                {item.documentType}
              </Text>
            </View>
          </View>

          <Text style={styles.docTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.docMeta}>
            {item.author ? (
              <View style={styles.metaItem}>
                <User size={12} color="#6B7280" />
                <Text style={styles.metaText} numberOfLines={1}>
                  {item.author}
                </Text>
              </View>
            ) : null}
            {item.originalYear ? (
              <View style={styles.metaItem}>
                <Calendar size={12} color="#6B7280" />
                <Text style={styles.metaText}>{item.originalYear}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Primary Sources',
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
            {documentTypes?.map((type) => (
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

      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Loading documents...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Unable to load documents</Text>
        </View>
      ) : documents && documents.length > 0 ? (
        <FlatList
          data={documents}
          renderItem={renderDocumentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <FileText size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No documents found</Text>
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
    gap: 12,
  },
  docCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.9,
  },
  docCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  docThumbnail: {
    width: 70,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  docThumbnailPlaceholder: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docInfo: {
    flex: 1,
  },
  docHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
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
  docTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.darkGreen,
    marginBottom: 6,
  },
  docMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    maxWidth: 100,
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
