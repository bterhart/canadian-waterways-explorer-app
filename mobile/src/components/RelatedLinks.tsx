// Chips for the explorer / waterway / location a record is linked to (decision 11,
// 2026-10-16). An explorer opens the explorer modal in place; a waterway or location
// opens the map with that record selected (app/(tabs)/index.tsx reads the params).
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Droplets, MapPin } from 'lucide-react-native';
import { useExplorerDetail } from '@/lib/api/waterways-api';
import ExplorerDetailModal from '@/components/ExplorerDetailModal';
import type { RelatedExplorerRef, RelatedWaterwayRef, RelatedLocationRef } from '@/lib/types/education';

interface Props {
  explorer?: RelatedExplorerRef | null;
  waterway?: RelatedWaterwayRef | null;
  location?: RelatedLocationRef | null;
  /** Called before leaving for the map, e.g. to close a modal that would sit over it. */
  onBeforeNavigate?: () => void;
  compact?: boolean;
}

export function openOnMap(
  router: ReturnType<typeof useRouter>,
  markerType: 'waterway' | 'location',
  markerId: string
) {
  router.push({ pathname: '/', params: { markerId, markerType } });
}

export function RelatedLinks({ explorer, waterway, location, onBeforeNavigate, compact }: Props) {
  const router = useRouter();
  const [explorerId, setExplorerId] = useState<string | null>(null);
  const { data: explorerDetail } = useExplorerDetail(explorerId);

  if (!explorer && !waterway && !location) return null;

  const go = (markerType: 'waterway' | 'location', id: string) => {
    onBeforeNavigate?.();
    openOnMap(router, markerType, id);
  };

  return (
    <>
      <View style={[styles.row, compact && styles.rowCompact]}>
        {explorer ? (
          <Pressable style={styles.chip} onPress={() => setExplorerId(explorer.id)}>
            <User size={14} color="#1D4ED8" />
            <Text style={styles.chipText} numberOfLines={1}>{explorer.name}</Text>
          </Pressable>
        ) : null}
        {waterway ? (
          <Pressable style={styles.chip} onPress={() => go('waterway', waterway.id)}>
            <Droplets size={14} color="#1D4ED8" />
            <Text style={styles.chipText} numberOfLines={1}>{waterway.name}</Text>
          </Pressable>
        ) : null}
        {location ? (
          <Pressable style={styles.chip} onPress={() => go('location', location.id)}>
            <MapPin size={14} color="#1D4ED8" />
            <Text style={styles.chipText} numberOfLines={1}>{location.name}</Text>
          </Pressable>
        ) : null}
      </View>
      {explorerId && explorerDetail ? (
        <ExplorerDetailModal explorer={explorerDetail} onClose={() => setExplorerId(null)} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  rowCompact: {
    marginTop: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: '100%',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D4ED8',
    flexShrink: 1,
  },
});

export default RelatedLinks;
