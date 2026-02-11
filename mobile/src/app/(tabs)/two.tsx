// Explorer Directory Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useExplorers, useExplorerDetail } from '@/lib/api/waterways-api';
import ExplorerDetailModal from '@/components/ExplorerDetailModal';
import type { Explorer } from '@/lib/types/waterways';

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  waterBlue: '#3B82A3',
  earthBrown: '#8B5A2B',
  creamWhite: '#FFFEF7',
  gold: '#C9A227',
};

export default function ExplorersScreen() {
  const { data: explorers, isLoading, isError, refetch, isRefetching } = useExplorers();
  const [selectedExplorerId, setSelectedExplorerId] = useState<string | null>(null);

  // Fetch selected explorer details
  const { data: selectedExplorerDetail, isLoading: detailLoading } =
    useExplorerDetail(selectedExplorerId);

  const handleExplorerPress = (explorerId: string) => {
    setSelectedExplorerId(explorerId);
  };

  const handleCloseModal = () => {
    setSelectedExplorerId(null);
  };

  const renderExplorerCard = ({ item }: { item: Explorer }) => (
    <Pressable
      style={({ pressed }) => [styles.explorerCard, pressed && styles.cardPressed]}
      onPress={() => handleExplorerPress(item.id)}
    >
      <View style={styles.cardContent}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.portrait} />
        ) : (
          <View style={styles.portraitPlaceholder}>
            <Text style={styles.portraitInitial}>{item.name.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.explorerInfo}>
          <Text style={styles.explorerName}>{item.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.nationality}>{item.nationality}</Text>
            {item.birthYear && item.deathYear ? (
              <Text style={styles.years}>
                {item.birthYear} - {item.deathYear}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      <View style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsText}>View Details</Text>
      </View>
    </Pressable>
  );

  const ListHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Explorers of Canada</Text>
      <Text style={styles.subtitle}>
        Discover the brave men and women who mapped the Canadian wilderness
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.forestGreen} />
        <Text style={styles.loadingText}>Loading explorers...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Unable to Load Explorers</Text>
        <Text style={styles.errorText}>
          Please check your connection and try again.
        </Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={explorers}
        keyExtractor={(item) => item.id}
        renderItem={renderExplorerCard}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.forestGreen}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No explorers found</Text>
          </View>
        }
      />

      {/* Explorer Detail Modal */}
      {selectedExplorerId && selectedExplorerDetail && !detailLoading ? (
        <ExplorerDetailModal
          explorer={selectedExplorerDetail}
          onClose={handleCloseModal}
        />
      ) : null}

      {/* Loading overlay when fetching detail */}
      {selectedExplorerId && detailLoading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : null}
    </View>
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
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.forestGreen,
    fontWeight: '500',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.forestGreen,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },
  explorerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  portrait: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.forestGreen,
  },
  portraitPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.forestGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portraitInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  explorerInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  explorerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.forestGreen,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  nationality: {
    fontSize: 14,
    color: colors.earthBrown,
    fontWeight: '500',
  },
  years: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 8,
  },
  viewDetailsButton: {
    backgroundColor: colors.forestGreen,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});
