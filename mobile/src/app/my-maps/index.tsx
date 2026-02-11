// My Maps List Screen - View and manage user's saved map annotations
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  Map,
  MapPin,
  Route,
  StickyNote,
  Plus,
  Trash2,
  Share2,
  Lock,
  Globe,
  ChevronRight,
  Calendar,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserMapAnnotations, useDeleteMapAnnotation } from '@/lib/api/education-api';
import type { UserMapAnnotation } from '@/lib/types/education';

const { width } = Dimensions.get('window');

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
  gold: '#C9A962',
  lightGreen: '#E8F5E9',
  coral: '#FF6B6B',
  blue: '#3B82F6',
  purple: '#8B5CF6',
};

// Mock user ID - in production this would come from auth context
const MOCK_USER_ID = 'student-user-001';

interface MapCardProps {
  map: UserMapAnnotation;
  onPress: () => void;
  onDelete: () => void;
}

function MapCard({ map, onPress, onDelete }: MapCardProps) {
  const pinCount = map.pins?.length ?? 0;
  const routeCount = map.routes?.length ?? 0;
  const noteCount = map.notes?.length ?? 0;
  const totalAnnotations = pinCount + routeCount + noteCount;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleLongPress = () => {
    Alert.alert(
      'Delete Map',
      `Are you sure you want to delete "${map.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={handleLongPress}
      style={({ pressed }) => [
        styles.mapCard,
        pressed && styles.mapCardPressed,
      ]}
    >
      <LinearGradient
        colors={['#2D5A3D', '#1A3A24']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mapCardGradient}
      >
        <View style={styles.mapCardHeader}>
          <View style={styles.mapIconContainer}>
            <Map size={24} color="white" />
          </View>
          <View style={styles.mapStatusBadge}>
            {map.isPublic ? (
              <>
                <Globe size={12} color={colors.gold} />
                <Text style={styles.mapStatusText}>Public</Text>
              </>
            ) : (
              <>
                <Lock size={12} color="rgba(255,255,255,0.7)" />
                <Text style={[styles.mapStatusText, { color: 'rgba(255,255,255,0.7)' }]}>
                  Private
                </Text>
              </>
            )}
          </View>
        </View>

        <Text style={styles.mapTitle} numberOfLines={2}>
          {map.title}
        </Text>
        {map.description ? (
          <Text style={styles.mapDescription} numberOfLines={2}>
            {map.description}
          </Text>
        ) : null}

        <View style={styles.mapStats}>
          <View style={styles.statItem}>
            <MapPin size={14} color={colors.gold} />
            <Text style={styles.statText}>{pinCount}</Text>
          </View>
          <View style={styles.statItem}>
            <Route size={14} color={colors.gold} />
            <Text style={styles.statText}>{routeCount}</Text>
          </View>
          <View style={styles.statItem}>
            <StickyNote size={14} color={colors.gold} />
            <Text style={styles.statText}>{noteCount}</Text>
          </View>
        </View>

        <View style={styles.mapFooter}>
          <View style={styles.dateContainer}>
            <Calendar size={12} color="rgba(255,255,255,0.6)" />
            <Text style={styles.dateText}>{formatDate(map.createdAt)}</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.5)" />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function EmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Map size={64} color={colors.forestGreen} />
      </View>
      <Text style={styles.emptyTitle}>No Maps Yet</Text>
      <Text style={styles.emptyDescription}>
        Create your first map to start adding pins, drawing routes, and taking notes
        about Canadian waterways!
      </Text>
      <Pressable
        onPress={onCreateNew}
        style={({ pressed }) => [
          styles.emptyButton,
          pressed && styles.emptyButtonPressed,
        ]}
      >
        <Plus size={20} color="white" />
        <Text style={styles.emptyButtonText}>Create Your First Map</Text>
      </Pressable>
    </View>
  );
}

export default function MyMapsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { data: maps, isLoading, error, refetch } = useUserMapAnnotations(MOCK_USER_ID);
  const deleteMap = useDeleteMapAnnotation();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleCreateNew = () => {
    router.push('/my-maps/new');
  };

  const handleOpenMap = (mapId: string) => {
    router.push(`/my-maps/${mapId}`);
  };

  const handleDeleteMap = (map: UserMapAnnotation) => {
    deleteMap.mutate(
      { id: map.id, userId: MOCK_USER_ID },
      {
        onSuccess: () => {
          refetch();
        },
        onError: () => {
          Alert.alert('Error', 'Failed to delete map. Please try again.');
        },
      }
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'My Maps',
          headerStyle: { backgroundColor: colors.creamWhite },
          headerTitleStyle: {
            color: colors.forestGreen,
            fontWeight: '700',
          },
        }}
      />
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.forestGreen} />
            <Text style={styles.loadingText}>Loading your maps...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Unable to load maps</Text>
            <Pressable onPress={() => refetch()} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : !maps || maps.length === 0 ? (
          <EmptyState onCreateNew={handleCreateNew} />
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.forestGreen}
              />
            }
          >
            <View style={styles.headerSection}>
              <Text style={styles.headerTitle}>Your Map Collection</Text>
              <Text style={styles.headerSubtitle}>
                {maps.length} {maps.length === 1 ? 'map' : 'maps'} created
              </Text>
            </View>

            <View style={styles.mapsGrid}>
              {maps.map((map) => (
                <MapCard
                  key={map.id}
                  map={map}
                  onPress={() => handleOpenMap(map.id)}
                  onDelete={() => handleDeleteMap(map)}
                />
              ))}
            </View>

            <View style={styles.tipSection}>
              <Text style={styles.tipTitle}>Tip</Text>
              <Text style={styles.tipText}>
                Long press on a map card to delete it
              </Text>
            </View>
          </ScrollView>
        )}

        {/* Floating Create Button */}
        {maps && maps.length > 0 ? (
          <Pressable
            onPress={handleCreateNew}
            style={({ pressed }) => [
              styles.floatingButton,
              pressed && styles.floatingButtonPressed,
            ]}
          >
            <LinearGradient
              colors={[colors.forestGreen, colors.darkGreen]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.floatingButtonGradient}
            >
              <Plus size={28} color="white" />
            </LinearGradient>
          </Pressable>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.forestGreen,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.forestGreen,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  headerSection: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.darkGreen,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  mapsGrid: {
    gap: 16,
  },
  mapCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  mapCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  mapCardGradient: {
    padding: 16,
    minHeight: 160,
  },
  mapCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mapStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gold,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  mapDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 18,
    marginBottom: 12,
  },
  mapStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  mapFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  tipSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.lightGreen,
    borderRadius: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.forestGreen,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: colors.darkGreen,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 280,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
  floatingButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
