// Bottom sheet component for displaying waterway and location details
import React, { useCallback, useMemo, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Image, Pressable, Linking, ScrollView, Modal, Dimensions, Platform } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Plus, MessageSquare, Camera, BookOpen, History, Compass, Globe, Play, X, ImageIcon, ChevronLeft, MapPin } from 'lucide-react-native';
import { useWaterwayDetail, useLocationDetail, useWaterwayContributions, useLocationContributions, useExplorerDetail } from '@/lib/api/waterways-api';
import ContributeModal from './ContributeModal';
import ExplorerDetailModal from './ExplorerDetailModal';
import type { MarkerType, WaterwayDetail, LocationDetail, UserContribution, ArchaeologicalDiscovery } from '@/lib/types/waterways';
import { ReadingGuideList } from './ReadingGuideList';
import { SourcesList } from './SourcesList';
import { FollowTheWater } from './FollowTheWater';
import { VoiceCard } from './VoiceCard';
import { useVoices } from '@/lib/api/voices-api';
import { decadeOf } from '@/lib/types/connections';
import { useExploration } from '@/lib/exploration';
import { useRouter } from 'expo-router';

// Generate Google Earth Web URL
const getGoogleEarthUrl = (latitude: number, longitude: number, name?: string): string => {
  // Format: https://earth.google.com/web/@{lat},{lng},{altitude}a,{range}d,35y,0h,0t,0r
  // altitude 'a' is camera altitude in meters, range 'd' is distance from point of interest
  return `https://earth.google.com/web/@${latitude},${longitude},500a,5000d,35y,0h,45t,0r`;
};

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  waterBlue: '#3B82A3',
  earthBrown: '#8B5A2B',
  creamWhite: '#FFFEF7',
  skyBlue: '#87CEEB',
  gold: '#C9A227',
  indigenous: '#8B4513',
  section: '#F5F5DC',
};

// Marker colors by type (matching map icons)
const markerColors: Record<string, string> = {
  // Waterway types
  River: '#3B82F6', // Blue
  Lake: '#06B6D4', // Cyan
  Bay: '#10B981', // Green/Teal
  Strait: '#0EA5E9', // Sky blue
  // Location types
  Fort: '#EF4444', // Red
  'Trading Post': '#F97316', // Orange
  Portage: '#92400E', // Brown
  Settlement: '#8B5CF6', // Purple
  'Cultural Site': '#EC4899', // Pink
};

const getMarkerColor = (typeName: string): string => {
  return markerColors[typeName] || '#6B7280';
};

// Gallery image type
interface GalleryImage {
  url: string;
  caption?: string;
  credit?: string;
}

// Parse gallery images from JSON string
const parseGalleryImages = (galleryJson: string | null): GalleryImage[] => {
  if (!galleryJson) return [];
  try {
    const parsed = JSON.parse(galleryJson);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is GalleryImage =>
        typeof item === 'object' && item !== null && typeof item.url === 'string'
      );
    }
    return [];
  } catch {
    return [];
  }
};

// Extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Get YouTube thumbnail URL
const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

// Video item type
interface VideoItem {
  url: string;
  type?: 'youtube' | 'manual';
  thumbnailUrl?: string | null;
  caption?: string;
}

// Parse video data from JSON string or plain URL (backward compatible)
const parseVideoData = (videoUrlField: string | null): VideoItem[] => {
  if (!videoUrlField) return [];

  // Try parsing as JSON array
  try {
    const parsed = JSON.parse(videoUrlField);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is VideoItem =>
        typeof item === 'object' && item !== null && typeof item.url === 'string'
      );
    }
  } catch {
    // Not JSON, treat as plain URL string (backward compatibility)
  }

  // Plain URL string - determine type automatically
  const videoId = getYouTubeVideoId(videoUrlField);
  return [{
    url: videoUrlField,
    type: videoId ? 'youtube' : 'manual',
  }];
};

const { width: screenWidth } = Dimensions.get('window');


interface DetailBottomSheetProps {
  markerId: string | null;
  markerType: MarkerType | null;
  onClose: () => void;
  onReturnToMap?: () => void; // Called when user explicitly taps "Return to Map" button
  markerLatitude?: number;
  markerLongitude?: number;
}

export interface DetailBottomSheetRef {
  expand: () => void;
  close: () => void;
}

const DetailBottomSheet = forwardRef<DetailBottomSheetRef, DetailBottomSheetProps>(
  ({ markerId, markerType, onClose, onReturnToMap, markerLatitude, markerLongitude }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '85%'], []);
    const [showContributeModal, setShowContributeModal] = useState(false);
    const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryImage | null>(null);
    const [selectedExplorerId, setSelectedExplorerId] = useState<string | null>(null);
    const router = useRouter();

    // Fetch data based on marker type
    const { data: waterwayData, isLoading: waterwayLoading } = useWaterwayDetail(
      markerType === 'waterway' ? markerId : null
    );
    const { data: locationData, isLoading: locationLoading } = useLocationDetail(
      markerType === 'location' ? markerId : null
    );
    // The sources written on this water or at this place, in their own words (roadmap item 5)
    const { data: allVoices } = useVoices(!!markerId);
    const voicesHere = useMemo(
      () => (allVoices ?? []).filter((v) => (markerType === 'waterway' ? v.waterway?.id === markerId : v.location?.id === markerId)),
      [allVoices, markerType, markerId]
    );

    // Fetch contributions
    const { data: waterwayContributions } = useWaterwayContributions(
      markerType === 'waterway' ? markerId : null
    );
    const { data: locationContributions } = useLocationContributions(
      markerType === 'location' ? markerId : null
    );

    const contributions = markerType === 'waterway' ? waterwayContributions : locationContributions;

    // Fetch selected explorer detail for bio modal
    const { data: selectedExplorerDetail, isLoading: explorerDetailLoading } = useExplorerDetail(selectedExplorerId);

    const isLoading = waterwayLoading || locationLoading;
    const data: WaterwayDetail | LocationDetail | undefined = markerType === 'waterway' ? waterwayData : locationData;

    // The decades this waterway saw explorers, with the number of visits in each (roadmap item 1)
    const visitDecades = useMemo(() => {
      const counts = new Map<number, number>();
      (waterwayData?.explorers ?? []).forEach((e) => {
        if (e.yearExplored) counts.set(decadeOf(e.yearExplored), (counts.get(decadeOf(e.yearExplored)) ?? 0) + 1);
      });
      return [...counts.entries()].sort((a, b) => a[0] - b[0]).map(([decade, count]) => ({ decade, count }));
    }, [waterwayData?.explorers]);

    // Opening the sheet counts as exploring the record: points once per device (decision 9)
    useExploration('waterway_explored', markerType === 'waterway' ? markerId : null, !!waterwayData);
    useExploration('location_visited', markerType === 'location' ? markerId : null, !!locationData);

    // Get icon for contribution type
    const getContributionIcon = (type: string) => {
      switch (type) {
        case 'photo':
          return <Camera size={16} color={colors.waterBlue} />;
        case 'description':
          return <MessageSquare size={16} color={colors.waterBlue} />;
        case 'historical_fact':
          return <History size={16} color={colors.waterBlue} />;
        case 'story':
          return <BookOpen size={16} color={colors.waterBlue} />;
        default:
          return <MessageSquare size={16} color={colors.waterBlue} />;
      }
    };

    useImperativeHandle(ref, () => ({
      expand: () => bottomSheetRef.current?.snapToIndex(0),
      close: () => bottomSheetRef.current?.close(),
    }));

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          onClose();
        }
      },
      [onClose]
    );

    const getTypeLabel = (typeName: string): string => {
      return typeName || 'Unknown';
    };

    if (!markerId || !markerType) return null;

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.creamWhite }}
        handleIndicatorStyle={{ backgroundColor: colors.forestGreen }}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          {isLoading ? (
            <View className="py-20 items-center">
              <ActivityIndicator size="large" color={colors.forestGreen} />
              <Text className="mt-4 text-gray-600">Loading details...</Text>
            </View>
          ) : data ? (
            <>
              {/* Navigation Header - Return to Map */}
              <View className="flex-row items-center justify-between mb-4 -mx-2 px-2 py-3 border-b" style={{ borderBottomColor: '#E5E7EB' }}>
                {/* Left group: Back to Map Button + Type Badge */}
                <View className="flex-row items-center" style={{ gap: 10 }}>
                  <Pressable
                    onPress={onReturnToMap ?? onClose}
                    className="flex-row items-center py-2 px-3 rounded-lg active:opacity-70"
                    style={{ backgroundColor: `${colors.forestGreen}15` }}
                  >
                    <ChevronLeft size={20} color={colors.forestGreen} strokeWidth={2.5} />
                    <Text className="ml-1 font-semibold text-sm" style={{ color: colors.forestGreen }}>
                      Map
                    </Text>
                  </Pressable>

                  {/* Type Badge */}
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: getMarkerColor(
                      markerType === 'waterway' && waterwayData?.type?.name
                        ? waterwayData.type.name
                        : markerType === 'location' && locationData?.locationType
                        ? locationData.locationType
                        : ''
                    ) }}
                  >
                    <Text className="text-white text-xs font-semibold">
                      {markerType === 'waterway' && waterwayData?.type?.name
                        ? getTypeLabel(waterwayData.type.name)
                        : markerType === 'location' && locationData?.locationType
                        ? getTypeLabel(locationData.locationType)
                        : 'Location'}
                    </Text>
                  </View>
                </View>

                {/* Right: Mini-Map Thumbnail */}
                {markerLatitude && markerLongitude ? (
                  <Pressable
                    onPress={onReturnToMap ?? onClose}
                    className="rounded-xl overflow-hidden shadow-sm"
                    style={{
                      width: 72,
                      height: 52,
                      borderWidth: 2,
                      borderColor: colors.forestGreen,
                    }}
                  >
                    <MapView
                      style={{ width: '100%', height: '100%' }}
                      provider={PROVIDER_DEFAULT}
                      initialRegion={{
                        latitude: markerLatitude,
                        longitude: markerLongitude,
                        latitudeDelta: 2,
                        longitudeDelta: 2,
                      }}
                      scrollEnabled={false}
                      zoomEnabled={false}
                      rotateEnabled={false}
                      pitchEnabled={false}
                      pointerEvents="none"
                      liteMode={Platform.OS === 'android'}
                    >
                      <Marker
                        coordinate={{
                          latitude: markerLatitude,
                          longitude: markerLongitude,
                        }}
                        pinColor={markerType === 'waterway' ? colors.waterBlue : colors.earthBrown}
                      />
                    </MapView>
                    {/* Tap indicator overlay */}
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        backgroundColor: 'rgba(45, 90, 61, 0.9)',
                        borderRadius: 4,
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                      }}
                    >
                      <MapPin size={10} color="white" />
                    </View>
                  </Pressable>
                ) : (
                  <View
                    className="rounded-xl items-center justify-center"
                    style={{
                      width: 72,
                      height: 52,
                      backgroundColor: `${colors.forestGreen}10`,
                      borderWidth: 2,
                      borderColor: colors.forestGreen,
                      borderStyle: 'dashed',
                    }}
                  >
                    <MapPin size={20} color={colors.forestGreen} />
                  </View>
                )}
              </View>

              {/* Content Header */}
              <View className="mb-4">
                {/* Image for waterway or location */}
                {(markerType === 'waterway' && waterwayData?.imageUrl) || (markerType === 'location' && locationData?.imageUrl) ? (
                  <Image
                    source={{ uri: markerType === 'waterway' ? waterwayData?.imageUrl! : locationData?.imageUrl! }}
                    style={{ width: '100%', height: 192, borderRadius: 12, marginBottom: 16 }}
                    resizeMode="cover"
                  />
                ) : null}
                <View
                  className="px-3 py-1 rounded-full self-start mb-2"
                  style={{ backgroundColor: getMarkerColor(
                    markerType === 'waterway' && 'type' in data
                      ? (data as WaterwayDetail).type?.name || ''
                      : 'locationType' in data
                      ? (data as LocationDetail).locationType
                      : ''
                  ) }}
                >
                  <Text className="text-white text-xs font-semibold">
                    {markerType === 'waterway' && 'type' in data
                      ? getTypeLabel((data as WaterwayDetail).type?.name || '')
                      : 'locationType' in data
                      ? getTypeLabel((data as LocationDetail).locationType)
                      : 'Location'}
                  </Text>
                </View>
                <Text
                  className="text-2xl font-bold mb-1"
                  style={{ color: colors.forestGreen }}
                >
                  {data.name}
                </Text>
                {data.indigenousName ? (
                  <Text
                    className="text-lg italic"
                    style={{ color: colors.indigenous }}
                  >
                    "{data.indigenousName}"
                  </Text>
                ) : null}
              </View>

              {/* Description */}
              <View className="mb-4 p-4 rounded-xl" style={{ backgroundColor: colors.section }}>
                <Text className="text-base leading-6" style={{ color: '#333' }}>
                  {data.description}
                </Text>
              </View>

              {/* Historical Significance */}
              {'historicalSignificance' in data && data.historicalSignificance ? (
                <View className="mb-4">
                  <Text
                    className="text-lg font-bold mb-2"
                    style={{ color: colors.earthBrown }}
                  >
                    Historical Significance
                  </Text>
                  <View className="p-4 rounded-xl border-l-4" style={{ backgroundColor: '#FFF8E7', borderLeftColor: colors.gold }}>
                    <Text className="text-base leading-6" style={{ color: '#333' }}>
                      {data.historicalSignificance}
                    </Text>
                  </View>
                </View>
              ) : null}

              {/* Indigenous Heritage Section */}
              {data.indigenousName || data.indigenousLanguage ? (
                <View className="mb-4">
                  <Text
                    className="text-lg font-bold mb-2"
                    style={{ color: colors.indigenous }}
                  >
                    Indigenous Heritage
                  </Text>
                  <View className="p-4 rounded-xl" style={{ backgroundColor: '#FDF5E6' }}>
                    {data.indigenousName ? (
                      <View className="mb-2">
                        <Text className="text-sm font-semibold" style={{ color: colors.indigenous }}>
                          Indigenous Name
                        </Text>
                        <Text className="text-base italic" style={{ color: '#333' }}>
                          {data.indigenousName}
                        </Text>
                      </View>
                    ) : null}
                    {data.indigenousLanguage ? (
                      <View>
                        <Text className="text-sm font-semibold" style={{ color: colors.indigenous }}>
                          Language
                        </Text>
                        <Text className="text-base" style={{ color: '#333' }}>
                          {data.indigenousLanguage}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}

              {/* Media Gallery — images and videos combined */}
              {(() => {
                const galleryJson = markerType === 'waterway' ? waterwayData?.galleryImages : locationData?.galleryImages;
                const galleryImages = parseGalleryImages(galleryJson ?? null);
                const videoUrlField = markerType === 'waterway' ? waterwayData?.videoUrl : locationData?.videoUrl;
                const videos = parseVideoData(videoUrlField ?? null);
                if (galleryImages.length === 0 && videos.length === 0) return null;

                return (
                  <View className="mb-4">
                    <Text
                      className="text-lg font-bold mb-2"
                      style={{ color: colors.waterBlue }}
                    >
                      Media Gallery
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingRight: 16 }}
                      style={{ flexGrow: 0 }}
                    >
                      {galleryImages.map((image, index) => (
                        <Pressable
                          key={`gallery-${index}`}
                          onPress={() => setSelectedGalleryImage(image)}
                          className="mr-3"
                        >
                          <Image
                            source={{ uri: image.url }}
                            style={{ width: 200, height: 150, borderRadius: 12 }}
                            resizeMode="cover"
                          />
                          {image.caption ? (
                            <Text
                              className="text-xs mt-1 text-gray-600"
                              numberOfLines={2}
                              style={{ maxWidth: 200 }}
                            >
                              {image.caption}
                            </Text>
                          ) : null}
                        </Pressable>
                      ))}
                      {videos.map((video, index) => {
                        const videoId = getYouTubeVideoId(video.url);
                        const thumbnailUrl = videoId
                          ? getYouTubeThumbnail(videoId)
                          : video.thumbnailUrl || null;

                        return (
                          <Pressable
                            key={`video-${index}`}
                            onPress={() => Linking.openURL(video.url)}
                            className="mr-3 rounded-xl overflow-hidden"
                            style={{ backgroundColor: '#000', width: 280 }}
                          >
                            {thumbnailUrl ? (
                              <View style={{ position: 'relative' }}>
                                <Image
                                  source={{ uri: thumbnailUrl }}
                                  style={{ width: 280, height: 150 }}
                                  resizeMode="cover"
                                />
                                <View
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <View
                                    style={{
                                      width: 56,
                                      height: 56,
                                      borderRadius: 28,
                                      backgroundColor: colors.forestGreen,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Play size={28} color="white" fill="white" />
                                  </View>
                                </View>
                              </View>
                            ) : (
                              <View
                                style={{
                                  width: 280,
                                  height: 150,
                                  backgroundColor: colors.section,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Play size={40} color={colors.forestGreen} />
                                <Text className="mt-2 text-sm" style={{ color: colors.forestGreen }}>
                                  Watch Video
                                </Text>
                              </View>
                            )}
                            {video.caption ? (
                              <View style={{ padding: 8, backgroundColor: '#1a1a1a' }}>
                                <Text
                                  className="text-xs text-white"
                                  numberOfLines={1}
                                >
                                  {video.caption}
                                </Text>
                              </View>
                            ) : null}
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </View>
                );
              })()}

              {/* Waterway-specific sections */}
              {markerType === 'waterway' && waterwayData ? (
                <>
                  {/* Explorers Section with Timeline */}
                  {waterwayData.explorers && waterwayData.explorers.length > 0 ? (
                    <View className="mb-4">
                      <Text
                        className="text-lg font-bold mb-2"
                        style={{ color: colors.forestGreen }}
                      >
                        Explorers Who Visited
                      </Text>
                      <View className="p-4 rounded-xl" style={{ backgroundColor: '#E6F3F8' }}>
                        {waterwayData.explorers.map((explorerWaterway, index) => (
                          <View key={explorerWaterway.id} className="flex-row mb-4 last:mb-0">
                            {/* Timeline indicator */}
                            <View className="items-center mr-3">
                              {/* Year badge */}
                              {explorerWaterway.yearExplored ? (
                                // The year opens "who was here in this decade" (roadmap item 1)
                                <Pressable
                                  className="px-2 py-1 rounded-lg mb-2"
                                  style={({ pressed }) => ({ backgroundColor: colors.gold, opacity: pressed ? 0.7 : 1 })}
                                  onPress={() => router.push(`/decades/${decadeOf(explorerWaterway.yearExplored!)}`)}
                                  accessibilityRole="button"
                                  accessibilityLabel={`Who else was here in the ${decadeOf(explorerWaterway.yearExplored)}s`}
                                >
                                  <Text className="text-white text-xs font-bold">
                                    {explorerWaterway.yearExplored}
                                  </Text>
                                </Pressable>
                              ) : (
                                <View
                                  className="px-2 py-1 rounded-lg mb-2"
                                  style={{ backgroundColor: colors.earthBrown }}
                                >
                                  <Text className="text-white text-xs font-bold">
                                    N/A
                                  </Text>
                                </View>
                              )}
                              {/* Timeline line */}
                              {index < waterwayData.explorers.length - 1 ? (
                                <View
                                  className="w-0.5 flex-1"
                                  style={{ backgroundColor: colors.forestGreen, minHeight: 40 }}
                                />
                              ) : null}
                            </View>
                            {/* Explorer info */}
                            <Pressable
                              className="flex-1 flex-row items-start"
                              onPress={() => setSelectedExplorerId(explorerWaterway.explorer?.id ?? null)}
                              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                            >
                              {explorerWaterway.explorer?.imageUrl ? (
                                <Image
                                  source={{ uri: explorerWaterway.explorer.imageUrl }}
                                  className="w-12 h-12 rounded-full mr-3"
                                />
                              ) : (
                                <View
                                  className="w-12 h-12 rounded-full mr-3 items-center justify-center"
                                  style={{ backgroundColor: colors.waterBlue }}
                                >
                                  <Text className="text-white font-bold text-lg">
                                    {explorerWaterway.explorer?.name?.charAt(0) || '?'}
                                  </Text>
                                </View>
                              )}
                              <View className="flex-1">
                                <Text className="font-semibold" style={{ color: '#333' }}>
                                  {explorerWaterway.explorer?.name || 'Unknown Explorer'}
                                </Text>
                                <Text className="text-sm text-gray-600">
                                  {explorerWaterway.explorer?.nationality || ''}
                                  {explorerWaterway.explorer?.birthYear && explorerWaterway.explorer?.deathYear
                                    ? ` (${explorerWaterway.explorer.birthYear}-${explorerWaterway.explorer.deathYear})`
                                    : ''}
                                </Text>
                                {explorerWaterway.expeditionNotes ? (
                                  <Text className="text-xs italic text-gray-500 mt-1">
                                    {explorerWaterway.expeditionNotes}
                                  </Text>
                                ) : null}
                                <Text className="text-xs mt-1" style={{ color: colors.waterBlue }}>
                                  Tap for biography
                                </Text>
                              </View>
                            </Pressable>
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : null}

                  {/* Follow the Water (roadmap item 1, 2026-10-19): the downstream chain, tributaries,
                      arms and joined bodies from WaterwayConnection; each opens on the map, and the
                      footer draws the whole system. Replaces the flat Connected Waterways list. */}
                  <FollowTheWater waterwayId={waterwayData.id} />

                  {/* Who was here when: the decades this water saw explorers, each opening the decade view */}
                  {visitDecades.length > 0 ? (
                    <View className="mb-4">
                      <Text className="text-lg font-bold mb-2" style={{ color: colors.earthBrown }}>
                        Who Was Here When
                      </Text>
                      <View className="p-4 rounded-xl flex-row flex-wrap" style={{ backgroundColor: '#FDF6EC', gap: 8 }}>
                        {visitDecades.map(({ decade, count }) => (
                          <Pressable
                            key={decade}
                            onPress={() => router.push(`/decades/${decade}`)}
                            accessibilityRole="button"
                            accessibilityLabel={`Who was here in the ${decade}s`}
                            style={({ pressed }) => ({
                              flexDirection: 'row', alignItems: 'center', gap: 6,
                              backgroundColor: 'white', borderWidth: 1, borderColor: '#E7D9C4',
                              borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6, opacity: pressed ? 0.7 : 1,
                            })}
                          >
                            <History size={13} color={colors.earthBrown} />
                            <Text style={{ color: colors.earthBrown, fontWeight: '700', fontSize: 13 }}>{decade}s</Text>
                            <Text style={{ color: '#9CA3AF', fontSize: 11 }}>{count}</Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  ) : null}

                  {/* Notable Figures Connected to This Waterway */}
                  {waterwayData.notableFigures && waterwayData.notableFigures.length > 0 ? (
                    <View className="mb-4">
                      <Text
                        className="text-lg font-bold mb-2"
                        style={{ color: colors.forestGreen }}
                      >
                        Notable Figures Connected to This Waterway
                      </Text>
                      <View className="p-4 rounded-xl" style={{ backgroundColor: '#F7F0FF' }}>
                        {[...waterwayData.notableFigures]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((figure) => (
                            <Pressable
                              key={figure.id}
                              className="flex-row items-start mb-4 last:mb-0 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                              onPress={() => router.push(`/notable-figures/${figure.id}`)}
                              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                            >
                              {figure.imageUrl ? (
                                <Image source={{ uri: figure.imageUrl }} className="w-12 h-12 rounded-full mr-3" />
                              ) : (
                                <View
                                  className="w-12 h-12 rounded-full mr-3 items-center justify-center"
                                  style={{ backgroundColor: '#A855F7' }}
                                >
                                  <Text className="text-white font-bold text-lg">
                                    {figure.name?.charAt(0) || '?'}
                                  </Text>
                                </View>
                              )}
                              <View className="flex-1">
                                <Text className="font-semibold" style={{ color: '#333' }}>
                                  {figure.name}
                                </Text>
                                <Text className="text-sm text-gray-600">
                                  {figure.role}
                                  {figure.birthYear && figure.deathYear
                                    ? ` (${figure.birthYear}-${figure.deathYear})`
                                    : ''}
                                </Text>
                                <Text className="text-xs mt-1" style={{ color: '#A855F7' }}>
                                  Tap for biography
                                </Text>
                              </View>
                            </Pressable>
                          ))}
                      </View>
                    </View>
                  ) : null}                 

                  {/* Archaeological Discoveries Section */}
                  {waterwayData.discoveries && waterwayData.discoveries.length > 0 ? (
                    <View className="mb-4">
                      <Text
                        className="text-lg font-bold mb-2"
                        style={{ color: colors.forestGreen }}
                      >
                        Archaeological Discoveries
                      </Text>
                      <View className="p-4 rounded-xl" style={{ backgroundColor: '#FDF8F3' }}>
                        {waterwayData.discoveries.map((discovery: ArchaeologicalDiscovery) => (
                          <View key={discovery.id} className="mb-4 last:mb-0 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                            {/* Discovery header with name and year */}
                            <View className="flex-row items-center mb-2">
                              <Compass size={18} color={colors.forestGreen} />
                              <Text className="ml-2 font-semibold flex-1" style={{ color: '#333' }}>
                                {discovery.name}
                              </Text>
                              <View
                                className="px-2 py-1 rounded-lg"
                                style={{ backgroundColor: colors.gold }}
                              >
                                <Text className="text-white text-xs font-bold">
                                  {discovery.discoveryYear}
                                </Text>
                              </View>
                            </View>

                            {/* Description */}
                            <Text className="text-sm text-gray-700 leading-5 mb-2">
                              {discovery.description}
                            </Text>

                            {/* Related expedition and explorer */}
                            {(discovery.relatedExpedition || discovery.relatedExplorerName) ? (
                              <View
                                className="p-2 rounded-lg mb-2"
                                style={{ backgroundColor: '#FFF8E7' }}
                              >
                                <Text className="text-xs font-semibold" style={{ color: colors.earthBrown }}>
                                  Historical Context
                                </Text>
                                {discovery.relatedExpedition ? (
                                  <Text className="text-sm" style={{ color: '#555' }}>
                                    Expedition: {discovery.relatedExpedition}
                                    {discovery.expeditionYear ? ` (${discovery.expeditionYear})` : ''}
                                  </Text>
                                ) : null}
                                {discovery.relatedExplorerName ? (
                                  <Text className="text-sm" style={{ color: '#555' }}>
                                    Explorer: {discovery.relatedExplorerName}
                                  </Text>
                                ) : null}
                              </View>
                            ) : null}

                            {/* Significance */}
                            <View className="mb-2">
                              <Text className="text-xs font-semibold" style={{ color: colors.forestGreen }}>
                                Significance
                              </Text>
                              <Text className="text-sm" style={{ color: '#333' }}>
                                {discovery.significance}
                              </Text>
                            </View>

                            {/* Sources */}
                            {discovery.sources ? (
                              <View>
                                <Text className="text-xs font-semibold text-gray-500">
                                  Sources
                                </Text>
                                <Text className="text-xs italic text-gray-500">
                                  {discovery.sources}
                                </Text>
                              </View>
                            ) : null}
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : null}

                  {/* Fur Trade Section */}
                  {waterwayData.furTradeInfo ? (
                    <View className="mb-4">
                      <Text
                        className="text-lg font-bold mb-2"
                        style={{ color: colors.earthBrown }}
                      >
                        Fur Trade History
                      </Text>
                      <View className="p-4 rounded-xl" style={{ backgroundColor: '#F5EBE0' }}>
                        {waterwayData.furTradeInfo.tradingCompany ? (
                          <View className="mb-2">
                            <Text className="text-sm font-semibold" style={{ color: colors.earthBrown }}>
                              Trading Company
                            </Text>
                            <Text className="text-base" style={{ color: '#333' }}>
                              {waterwayData.furTradeInfo.tradingCompany}
                            </Text>
                          </View>
                        ) : null}
                        {waterwayData.furTradeInfo.peakTradePeriod ? (
                          <View className="mb-2">
                            <Text className="text-sm font-semibold" style={{ color: colors.earthBrown }}>
                              Peak Trading Period
                            </Text>
                            <Text className="text-base" style={{ color: '#333' }}>
                              {waterwayData.furTradeInfo.peakTradePeriod}
                            </Text>
                          </View>
                        ) : null}
                        {waterwayData.furTradeInfo.primaryFurs ? (
                          <View className="mb-2">
                            <Text className="text-sm font-semibold" style={{ color: colors.earthBrown }}>
                              Primary Furs Traded
                            </Text>
                            <Text className="text-base" style={{ color: '#333' }}>
                              {waterwayData.furTradeInfo.primaryFurs}
                            </Text>
                          </View>
                        ) : null}
                        {waterwayData.furTradeInfo.tradeRouteNotes ? (
                          <View>
                            <Text className="text-sm font-semibold" style={{ color: colors.earthBrown }}>
                              Trade Route Notes
                            </Text>
                            <Text className="text-base" style={{ color: '#333' }}>
                              {waterwayData.furTradeInfo.tradeRouteNotes}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  ) : null}

                  {/* In their own words: checked transcriptions written on this water (roadmap item 5) */}
                  {voicesHere.length > 0 ? (
                    <View className="mb-4" style={{ gap: 10 }}>
                      {voicesHere.map((voice) => (
                        <VoiceCard key={voice.id} voice={voice} compact />
                      ))}
                    </View>
                  ) : null}

                  {/* Sources (Citation table, roadmap item 14) */}
                  <SourcesList targetType="waterway" targetId={waterwayData.id} titleColor={colors.earthBrown} linkColor={colors.waterBlue} />

                  {/* Additional Study (ReadingGuide table, decision 12) */}
                  <ReadingGuideList entries={waterwayData.readingGuide} titleColor={colors.earthBrown} linkColor={colors.waterBlue} />
                </>
              ) : null}

              {/* Location-specific sections */}
              {markerType === 'location' && locationData ? (
                <>
                  {/* Establishment Info */}
                  <View className="mb-4 p-4 rounded-xl" style={{ backgroundColor: '#FFF5E6' }}>
                    {locationData.yearEstablished ? (
                      <View className="flex-row items-center mb-2">
                        <Text className="text-sm font-semibold mr-2" style={{ color: colors.earthBrown }}>
                          Year Established:
                        </Text>
                        <Text className="text-base font-bold" style={{ color: '#333' }}>
                          {locationData.yearEstablished}
                        </Text>
                      </View>
                    ) : null}
                    {locationData.cartographer ? (
                      <View className="flex-row items-center">
                        <Text className="text-sm font-semibold mr-2" style={{ color: colors.earthBrown }}>
                          Mapped by:
                        </Text>
                        <Text className="text-base" style={{ color: '#333' }}>
                          {locationData.cartographer.name}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Historical Notes */}
                  {locationData.historicalNotes ? (
                    <View className="mb-4">
                      <Text
                        className="text-lg font-bold mb-2"
                        style={{ color: colors.earthBrown }}
                      >
                        Historical Notes
                      </Text>
                      <View className="p-4 rounded-xl" style={{ backgroundColor: '#FFF8E7' }}>
                        <Text className="text-base leading-6" style={{ color: '#333' }}>
                          {locationData.historicalNotes}
                        </Text>
                      </View>
                    </View>
                  ) : null}

                  {/* Explorers Who Visited (from parent waterway) */}
                  {locationData.waterway.explorers && locationData.waterway.explorers.length > 0 ? (
                    <View className="mb-4">
                      <Text
                        className="text-lg font-bold mb-2"
                        style={{ color: colors.forestGreen }}
                      >
                        Explorers Who Visited
                      </Text>
                      <View className="p-4 rounded-xl" style={{ backgroundColor: '#E6F3F8' }}>
                        {locationData.waterway.explorers.map((explorerWaterway, index) => (
                          <View key={explorerWaterway.id} className="flex-row mb-4 last:mb-0">
                            {/* Timeline indicator */}
                            <View className="items-center mr-3">
                              {explorerWaterway.yearExplored ? (
                                // The year opens "who was here in this decade" (roadmap item 1)
                                <Pressable
                                  className="px-2 py-1 rounded-lg mb-2"
                                  style={({ pressed }) => ({ backgroundColor: colors.gold, opacity: pressed ? 0.7 : 1 })}
                                  onPress={() => router.push(`/decades/${decadeOf(explorerWaterway.yearExplored!)}`)}
                                  accessibilityRole="button"
                                  accessibilityLabel={`Who else was here in the ${decadeOf(explorerWaterway.yearExplored)}s`}
                                >
                                  <Text className="text-white text-xs font-bold">
                                    {explorerWaterway.yearExplored}
                                  </Text>
                                </Pressable>
                              ) : (
                                <View
                                  className="px-2 py-1 rounded-lg mb-2"
                                  style={{ backgroundColor: colors.earthBrown }}
                                >
                                  <Text className="text-white text-xs font-bold">N/A</Text>
                                </View>
                              )}
                              {index < locationData.waterway.explorers.length - 1 ? (
                                <View
                                  className="w-0.5 flex-1"
                                  style={{ backgroundColor: colors.forestGreen, minHeight: 40 }}
                                />
                              ) : null}
                            </View>
                            {/* Explorer info — tappable */}
                            <Pressable
                              className="flex-1 flex-row items-start"
                              onPress={() => setSelectedExplorerId(explorerWaterway.explorer?.id ?? null)}
                              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                            >
                              {explorerWaterway.explorer?.imageUrl ? (
                                <Image
                                  source={{ uri: explorerWaterway.explorer.imageUrl }}
                                  className="w-12 h-12 rounded-full mr-3"
                                />
                              ) : (
                                <View
                                  className="w-12 h-12 rounded-full mr-3 items-center justify-center"
                                  style={{ backgroundColor: colors.waterBlue }}
                                >
                                  <Text className="text-white font-bold text-lg">
                                    {explorerWaterway.explorer?.name?.charAt(0) || '?'}
                                  </Text>
                                </View>
                              )}
                              <View className="flex-1">
                                <Text className="font-semibold" style={{ color: '#333' }}>
                                  {explorerWaterway.explorer?.name || 'Unknown Explorer'}
                                </Text>
                                <Text className="text-sm text-gray-600">
                                  {explorerWaterway.explorer?.nationality || ''}
                                  {explorerWaterway.explorer?.birthYear && explorerWaterway.explorer?.deathYear
                                    ? ` (${explorerWaterway.explorer.birthYear}-${explorerWaterway.explorer.deathYear})`
                                    : ''}
                                </Text>
                                {explorerWaterway.expeditionNotes ? (
                                  <Text className="text-xs italic text-gray-500 mt-1">
                                    {explorerWaterway.expeditionNotes}
                                  </Text>
                                ) : null}
                                <Text className="text-xs mt-1" style={{ color: colors.waterBlue }}>
                                  Tap for biography
                                </Text>
                              </View>
                            </Pressable>
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : null}

                  {/* Notable Figures Connected to This Waterway */}
                  {locationData.waterway.notableFigures && locationData.waterway.notableFigures.length > 0 ? (
                    <View className="mb-4">
                      <Text
                        className="text-lg font-bold mb-2"
                        style={{ color: colors.forestGreen }}
                      >
                        Notable Figures Connected to This Waterway
                      </Text>
                      <View className="p-4 rounded-xl" style={{ backgroundColor: '#F7F0FF' }}>
                        {[...locationData.waterway.notableFigures]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((figure) => (
                            <Pressable
                              key={figure.id}
                              className="flex-row items-start mb-4 last:mb-0 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                              onPress={() => router.push(`/notable-figures/${figure.id}`)}
                              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                            >
                              {figure.imageUrl ? (
                                <Image source={{ uri: figure.imageUrl }} className="w-12 h-12 rounded-full mr-3" />
                              ) : (
                                <View
                                  className="w-12 h-12 rounded-full mr-3 items-center justify-center"
                                  style={{ backgroundColor: '#A855F7' }}
                                >
                                  <Text className="text-white font-bold text-lg">
                                    {figure.name?.charAt(0) || '?'}
                                  </Text>
                                </View>
                              )}
                              <View className="flex-1">
                                <Text className="font-semibold" style={{ color: '#333' }}>
                                  {figure.name}
                                </Text>
                                <Text className="text-sm text-gray-600">
                                  {figure.role}
                                  {figure.birthYear && figure.deathYear
                                    ? ` (${figure.birthYear}-${figure.deathYear})`
                                    : ''}
                                </Text>
                                <Text className="text-xs mt-1" style={{ color: '#A855F7' }}>
                                  Tap for biography
                                </Text>
                              </View>
                            </Pressable>
                          ))}
                      </View>
                    </View>
                  ) : null}                

                  {/* Fur Trade History (from parent waterway) */}
                  {locationData.waterway.furTradeInfo ? (
                    <View className="mb-4">
                      <Text
                        className="text-lg font-bold mb-2"
                        style={{ color: colors.earthBrown }}
                      >
                        Fur Trade History
                      </Text>
                      <View className="p-4 rounded-xl" style={{ backgroundColor: '#F5EBE0' }}>
                        {locationData.waterway.furTradeInfo.tradingCompany ? (
                          <View className="mb-2">
                            <Text className="text-sm font-semibold" style={{ color: colors.earthBrown }}>
                              Trading Company
                            </Text>
                            <Text className="text-base" style={{ color: '#333' }}>
                              {locationData.waterway.furTradeInfo.tradingCompany}
                            </Text>
                          </View>
                        ) : null}
                        {locationData.waterway.furTradeInfo.peakTradePeriod ? (
                          <View className="mb-2">
                            <Text className="text-sm font-semibold" style={{ color: colors.earthBrown }}>
                              Peak Trading Period
                            </Text>
                            <Text className="text-base" style={{ color: '#333' }}>
                              {locationData.waterway.furTradeInfo.peakTradePeriod}
                            </Text>
                          </View>
                        ) : null}
                        {locationData.waterway.furTradeInfo.primaryFurs ? (
                          <View className="mb-2">
                            <Text className="text-sm font-semibold" style={{ color: colors.earthBrown }}>
                              Primary Furs Traded
                            </Text>
                            <Text className="text-base" style={{ color: '#333' }}>
                              {locationData.waterway.furTradeInfo.primaryFurs}
                            </Text>
                          </View>
                        ) : null}
                        {locationData.waterway.furTradeInfo.tradeRouteNotes ? (
                          <View>
                            <Text className="text-sm font-semibold" style={{ color: colors.earthBrown }}>
                              Trade Route Notes
                            </Text>
                            <Text className="text-base" style={{ color: '#333' }}>
                              {locationData.waterway.furTradeInfo.tradeRouteNotes}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  ) : null}

                  {/* Related Waterway */}
                  {locationData.waterway ? (
                    <View className="mb-4">
                      <Text
                        className="text-lg font-bold mb-2"
                        style={{ color: colors.waterBlue }}
                      >
                        Connected Waterway
                      </Text>
                      <View className="p-4 rounded-xl" style={{ backgroundColor: '#E6F3F8' }}>
                        <Text className="font-semibold text-base" style={{ color: '#333' }}>
                          {locationData.waterway.name}
                        </Text>
                        <Text className="text-sm mt-1 text-gray-600">
                          {locationData.waterway.type?.name || 'Waterway'}
                        </Text>
                      </View>
                    </View>
                  ) : null}

                  {/* In their own words: checked transcriptions written at this place (roadmap item 5) */}
                  {voicesHere.length > 0 ? (
                    <View className="mb-4" style={{ gap: 10 }}>
                      {voicesHere.map((voice) => (
                        <VoiceCard key={voice.id} voice={voice} compact />
                      ))}
                    </View>
                  ) : null}

                  {/* Sources (Citation table, roadmap item 14) */}
                  <SourcesList targetType="location" targetId={locationData.id} titleColor={colors.earthBrown} linkColor={colors.waterBlue} />

                  {/* Additional Study (ReadingGuide table, decision 12) */}
                  <ReadingGuideList entries={locationData.readingGuide} titleColor={colors.earthBrown} linkColor={colors.waterBlue} />
                </>
              ) : null}

              {/* Community Contributions Section */}
              {contributions && contributions.length > 0 ? (
                <View className="mb-4">
                  <Text
                    className="text-lg font-bold mb-2"
                    style={{ color: colors.forestGreen }}
                  >
                    Community Contributions
                  </Text>
                  <View className="p-4 rounded-xl" style={{ backgroundColor: '#F0FDF4' }}>
                    {contributions.map((contribution: UserContribution) => (
                      <View key={contribution.id} className="mb-4 last:mb-0 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                        <View className="flex-row items-center mb-2">
                          {getContributionIcon(contribution.contributionType)}
                          <Text className="ml-2 font-semibold" style={{ color: '#333' }}>
                            {contribution.title}
                          </Text>
                        </View>
                        <Text className="text-sm text-gray-700 leading-5">
                          {contribution.content}
                        </Text>
                        {contribution.contributorName ? (
                          <Text className="text-xs text-gray-500 mt-2 italic">
                            — {contribution.contributorName}
                          </Text>
                        ) : null}
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {/* Action Buttons */}
              <View className="mt-4 gap-3">
                {/* Google Earth Button */}
                <Pressable
                  className="flex-row items-center justify-center py-4 rounded-xl"
                  style={{ backgroundColor: colors.waterBlue }}
                  onPress={() => {
                    const lat = markerType === 'waterway' && waterwayData
                      ? waterwayData.latitude
                      : markerType === 'location' && locationData
                        ? locationData.latitude
                        : null;
                    const lng = markerType === 'waterway' && waterwayData
                      ? waterwayData.longitude
                      : markerType === 'location' && locationData
                        ? locationData.longitude
                        : null;
                    if (lat && lng) {
                      const url = getGoogleEarthUrl(lat, lng, data?.name);
                      Linking.openURL(url);
                    }
                  }}
                >
                  <Globe size={20} color="white" />
                  <Text className="text-white font-semibold ml-2">
                    Explore in Google Earth
                  </Text>
                </Pressable>

                {/* Contribute Button */}
                <Pressable
                  className="flex-row items-center justify-center py-4 rounded-xl"
                  style={{ backgroundColor: colors.forestGreen }}
                  onPress={() => setShowContributeModal(true)}
                >
                  <Plus size={20} color="white" />
                  <Text className="text-white font-semibold ml-2">
                    Add Your Contribution
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <View className="py-20 items-center">
              <Text className="text-gray-500">No details available</Text>
            </View>
          )}
        </BottomSheetScrollView>

        {/* Contribute Modal */}
        <ContributeModal
          visible={showContributeModal}
          onClose={() => setShowContributeModal(false)}
          waterwayId={markerType === 'waterway' ? markerId || undefined : undefined}
          locationId={markerType === 'location' ? markerId || undefined : undefined}
          waterwayName={markerType === 'waterway' ? data?.name : undefined}
          locationName={markerType === 'location' ? data?.name : undefined}
        />

        {/* Explorer Bio Modal */}
        <Modal
          visible={selectedExplorerId !== null && selectedExplorerDetail !== undefined && !explorerDetailLoading}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedExplorerId(null)}
        >
          {selectedExplorerDetail ? (
            <ExplorerDetailModal
              explorer={selectedExplorerDetail}
              onClose={() => setSelectedExplorerId(null)}
            />
          ) : null}
        </Modal>

        {/* Gallery Image Modal */}
        <Modal
          visible={selectedGalleryImage !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedGalleryImage(null)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.9)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Close Button */}
            <Pressable
              onPress={() => setSelectedGalleryImage(null)}
              style={{
                position: 'absolute',
                top: 50,
                right: 20,
                zIndex: 10,
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={24} color="white" />
            </Pressable>

            {/* Image */}
            {selectedGalleryImage ? (
              <View style={{ width: screenWidth, alignItems: 'center', paddingHorizontal: 20 }}>
                <Image
                  source={{ uri: selectedGalleryImage.url }}
                  style={{
                    width: screenWidth - 40,
                    height: screenWidth - 40,
                    borderRadius: 12,
                  }}
                  resizeMode="contain"
                />
                {/* Caption and Credit */}
                {(selectedGalleryImage.caption || selectedGalleryImage.credit) ? (
                  <View style={{ marginTop: 16, paddingHorizontal: 20 }}>
                    {selectedGalleryImage.caption ? (
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                          textAlign: 'center',
                          marginBottom: 8,
                        }}
                      >
                        {selectedGalleryImage.caption}
                      </Text>
                    ) : null}
                    {selectedGalleryImage.credit ? (
                      <Text
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: 12,
                          textAlign: 'center',
                          fontStyle: 'italic',
                        }}
                      >
                        Credit: {selectedGalleryImage.credit}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        </Modal>
      </BottomSheet>
    );
  }
);

DetailBottomSheet.displayName = 'DetailBottomSheet';

export default DetailBottomSheet;
