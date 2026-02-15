// Bottom sheet component for displaying waterway and location details
import React, { useCallback, useMemo, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Image, Pressable } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Plus, MessageSquare, Camera, BookOpen, History, Compass } from 'lucide-react-native';
import { useWaterwayDetail, useLocationDetail, useWaterwayContributions, useLocationContributions } from '@/lib/api/waterways-api';
import ContributeModal from './ContributeModal';
import type { MarkerType, WaterwayDetail, LocationDetail, UserContribution, ArchaeologicalDiscovery } from '@/lib/types/waterways';

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

interface DetailBottomSheetProps {
  markerId: string | null;
  markerType: MarkerType | null;
  onClose: () => void;
}

export interface DetailBottomSheetRef {
  expand: () => void;
  close: () => void;
}

const DetailBottomSheet = forwardRef<DetailBottomSheetRef, DetailBottomSheetProps>(
  ({ markerId, markerType, onClose }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '85%'], []);
    const [showContributeModal, setShowContributeModal] = useState(false);

    // Fetch data based on marker type
    const { data: waterwayData, isLoading: waterwayLoading } = useWaterwayDetail(
      markerType === 'waterway' ? markerId : null
    );
    const { data: locationData, isLoading: locationLoading } = useLocationDetail(
      markerType === 'location' ? markerId : null
    );

    // Fetch contributions
    const { data: waterwayContributions } = useWaterwayContributions(
      markerType === 'waterway' ? markerId : null
    );
    const { data: locationContributions } = useLocationContributions(
      markerType === 'location' ? markerId : null
    );

    const contributions = markerType === 'waterway' ? waterwayContributions : locationContributions;

    const isLoading = waterwayLoading || locationLoading;
    const data: WaterwayDetail | LocationDetail | undefined = markerType === 'waterway' ? waterwayData : locationData;

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
              {/* Header */}
              <View className="mb-4">
                {/* Image for location */}
                {markerType === 'location' && locationData?.imageUrl ? (
                  <Image
                    source={{ uri: locationData.imageUrl }}
                    className="w-full h-48 rounded-xl mb-4"
                    resizeMode="cover"
                  />
                ) : null}
                <View
                  className="px-3 py-1 rounded-full self-start mb-2"
                  style={{ backgroundColor: colors.forestGreen }}
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
                                <View
                                  className="px-2 py-1 rounded-lg mb-2"
                                  style={{ backgroundColor: colors.gold }}
                                >
                                  <Text className="text-white text-xs font-bold">
                                    {explorerWaterway.yearExplored}
                                  </Text>
                                </View>
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
                            <View className="flex-1 flex-row items-start">
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
                              </View>
                            </View>
                          </View>
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

              {/* Contribute Button */}
              <Pressable
                className="flex-row items-center justify-center py-4 rounded-xl mt-2"
                style={{ backgroundColor: colors.forestGreen }}
                onPress={() => setShowContributeModal(true)}
              >
                <Plus size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  Add Your Contribution
                </Text>
              </Pressable>
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
      </BottomSheet>
    );
  }
);

DetailBottomSheet.displayName = 'DetailBottomSheet';

export default DetailBottomSheet;
