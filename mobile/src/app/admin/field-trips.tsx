import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  FileEdit,
  Trash2,
  Eye,
  EyeOff,
  Map,
  Clock,
  GraduationCap,
  MapPin,
} from 'lucide-react-native';
import {
  useAdminFieldTrips,
  useDeleteFieldTrip,
  adminFieldTripsKeys,
  type AdminFieldTrip,
} from '@/lib/api/admin-api';

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  waterBlue: '#3B82A3',
  earthBrown: '#8B5A2B',
  creamWhite: '#FFFEF7',
  white: '#FFFFFF',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray500: '#6B7280',
  gray700: '#374151',
  red500: '#EF4444',
  red600: '#DC2626',
  green500: '#22C55E',
  green600: '#16A34A',
  gold: '#C9A227',
};

// Theme colors
const themeColors: Record<string, string> = {
  'Explorers Journey': colors.waterBlue,
  'Fur Trade Routes': colors.earthBrown,
  'Indigenous Territories': '#8B5CF6',
  'Geographic Features': colors.forestGreen,
  'Maritime Routes': '#0EA5E9',
};

interface FieldTripCardProps {
  fieldTrip: AdminFieldTrip;
  onEdit: () => void;
  onDelete: () => void;
}

function FieldTripCard({ fieldTrip, onEdit, onDelete }: FieldTripCardProps) {
  const themeColor = themeColors[fieldTrip.theme] ?? colors.waterBlue;

  return (
    <View style={styles.tripCard}>
      {/* Cover image */}
      {fieldTrip.coverImageUrl ? (
        <Image
          source={{ uri: fieldTrip.coverImageUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.coverImagePlaceholder, { backgroundColor: `${themeColor}20` }]}>
          <Map size={32} color={themeColor} />
        </View>
      )}

      <View style={styles.cardContent}>
        {/* Status and badges row */}
        <View style={styles.badgesRow}>
          {/* Published status */}
          <View style={[
            styles.statusBadge,
            fieldTrip.isPublished ? styles.publishedBadge : styles.draftBadge
          ]}>
            {fieldTrip.isPublished ? (
              <Eye size={12} color={colors.green600} />
            ) : (
              <EyeOff size={12} color={colors.gray500} />
            )}
            <Text style={[
              styles.statusText,
              { color: fieldTrip.isPublished ? colors.green600 : colors.gray500 }
            ]}>
              {fieldTrip.isPublished ? 'Published' : 'Draft'}
            </Text>
          </View>

          {/* Theme badge */}
          <View style={[styles.themeBadge, { backgroundColor: `${themeColor}20` }]}>
            <Text style={[styles.themeText, { color: themeColor }]}>
              {fieldTrip.theme}
            </Text>
          </View>
        </View>

        {/* Title and description */}
        <Text style={styles.tripTitle} numberOfLines={2}>
          {fieldTrip.title}
        </Text>
        {fieldTrip.description ? (
          <Text style={styles.tripDescription} numberOfLines={2}>
            {fieldTrip.description}
          </Text>
        ) : null}

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MapPin size={16} color={colors.gray500} />
            <Text style={styles.statText}>
              {fieldTrip.stopCount} stop{fieldTrip.stopCount !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.statItem}>
            <GraduationCap size={16} color={colors.gray500} />
            <Text style={styles.statText}>
              Grade {fieldTrip.gradeLevel}
            </Text>
          </View>
          {fieldTrip.estimatedMinutes ? (
            <View style={styles.statItem}>
              <Clock size={16} color={colors.gray500} />
              <Text style={styles.statText}>
                {fieldTrip.estimatedMinutes} min
              </Text>
            </View>
          ) : null}
        </View>

        {/* Actions row */}
        <View style={styles.actionsRow}>
          <Pressable style={styles.editButton} onPress={onEdit}>
            <FileEdit size={18} color={colors.forestGreen} />
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={onDelete}>
            <Trash2 size={18} color={colors.red600} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function AdminFieldTripsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: fieldTrips, isLoading, error, refetch } = useAdminFieldTrips();
  const deleteMutation = useDeleteFieldTrip();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateFieldTrip = () => {
    // TODO: Create field trip editor route
    Alert.alert('Coming Soon', 'Field trip editor is under development');
  };

  const handleEditFieldTrip = (fieldTripId: string) => {
    // TODO: Navigate to field trip editor
    Alert.alert('Coming Soon', 'Field trip editor is under development');
  };

  const handleDeleteFieldTrip = (fieldTrip: AdminFieldTrip) => {
    Alert.alert(
      'Delete Field Trip',
      `Are you sure you want to delete "${fieldTrip.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(fieldTrip.id);
            try {
              await deleteMutation.mutateAsync(fieldTrip.id);
              queryClient.invalidateQueries({ queryKey: adminFieldTripsKeys.list() });
            } catch (err) {
              Alert.alert('Error', 'Failed to delete field trip. Please try again.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Manage Field Trips',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Loading field trips...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Manage Field Trips',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Field Trips</Text>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'An error occurred'}
          </Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Manage Field Trips',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* Create button */}
      <View style={styles.headerSection}>
        <Pressable style={styles.createButton} onPress={handleCreateFieldTrip}>
          <Plus size={20} color={colors.white} />
          <Text style={styles.createButtonText}>Create New Field Trip</Text>
        </Pressable>
        <Text style={styles.itemCount}>
          {fieldTrips?.length ?? 0} field trip{(fieldTrips?.length ?? 0) !== 1 ? 's' : ''} total
        </Text>
      </View>

      {/* Field trip list */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {fieldTrips && fieldTrips.length > 0 ? (
          fieldTrips.map((fieldTrip) => (
            <View key={fieldTrip.id} style={deletingId === fieldTrip.id ? styles.deletingCard : undefined}>
              {deletingId === fieldTrip.id ? (
                <View style={styles.deletingOverlay}>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.deletingText}>Deleting...</Text>
                </View>
              ) : null}
              <FieldTripCard
                fieldTrip={fieldTrip}
                onEdit={() => handleEditFieldTrip(fieldTrip.id)}
                onDelete={() => handleDeleteFieldTrip(fieldTrip)}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Map size={48} color={colors.gray200} />
            <Text style={styles.emptyTitle}>No Field Trips Yet</Text>
            <Text style={styles.emptyText}>
              Create your first virtual field trip to get started
            </Text>
            <Pressable style={styles.createEmptyButton} onPress={handleCreateFieldTrip}>
              <Plus size={18} color={colors.white} />
              <Text style={styles.createEmptyButtonText}>Create Field Trip</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },

  // Header section
  headerSection: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.forestGreen,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  itemCount: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 12,
    textAlign: 'center',
  },

  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: colors.gray500,
    marginTop: 12,
  },

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // List
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Field trip card
  tripCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  coverImage: {
    width: '100%',
    height: 160,
  },
  coverImagePlaceholder: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
  },

  // Badges row
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  publishedBadge: {
    backgroundColor: '#D1FAE5',
  },
  draftBadge: {
    backgroundColor: colors.gray100,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  themeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  themeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Trip info
  tripTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray700,
    marginBottom: 6,
  },
  tripDescription: {
    fontSize: 14,
    color: colors.gray500,
    lineHeight: 20,
    marginBottom: 12,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: colors.gray500,
  },

  // Actions row
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingTop: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: `${colors.forestGreen}10`,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.forestGreen,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: `${colors.red600}10`,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.red600,
  },

  // Deleting state
  deletingCard: {
    opacity: 0.5,
    position: 'relative',
  },
  deletingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  deletingText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray700,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    marginBottom: 24,
  },
  createEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  createEmptyButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
