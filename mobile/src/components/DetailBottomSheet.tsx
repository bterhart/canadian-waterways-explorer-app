// Bottom sheet component for displaying waterway and location details
import React, { useCallback, useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useWaterwayDetail, useLocationDetail } from '@/lib/api/waterways-api';
import type { MarkerType, WaterwayType, LocationType } from '@/lib/types/waterways';

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

    // Fetch data based on marker type
    const { data: waterwayData, isLoading: waterwayLoading } = useWaterwayDetail(
      markerType === 'waterway' ? markerId : null
    );
    const { data: locationData, isLoading: locationLoading } = useLocationDetail(
      markerType === 'location' ? markerId : null
    );

    const isLoading = waterwayLoading || locationLoading;
    const data = markerType === 'waterway' ? waterwayData : locationData;

    useImperativeHandle(ref, () => ({
      expand: () => bottomSheetRef.current?.expand(),
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

    const getTypeLabel = (type: WaterwayType | LocationType): string => {
      const labels: Record<string, string> = {
        river: 'River',
        lake: 'Lake',
        bay: 'Bay',
        fort: 'Historic Fort',
        trading_post: 'Fur Trading Post',
        portage: 'Historic Portage',
        settlement: 'Settlement',
      };
      return labels[type] || type;
    };

    const getTypeIcon = (type: WaterwayType | LocationType): string => {
      const icons: Record<string, string> = {
        river: 'water',
        lake: 'water',
        bay: 'water',
        fort: 'castle',
        trading_post: 'store',
        portage: 'route',
        settlement: 'home',
      };
      return icons[type] || 'map-pin';
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
                <View
                  className="px-3 py-1 rounded-full self-start mb-2"
                  style={{ backgroundColor: colors.forestGreen }}
                >
                  <Text className="text-white text-xs font-semibold">
                    {getTypeLabel(data.type as WaterwayType | LocationType)}
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
              {data.indigenousName || ('indigenousNation' in data && data.indigenousNation) ? (
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
                    {'indigenousNation' in data && data.indigenousNation ? (
                      <View>
                        <Text className="text-sm font-semibold" style={{ color: colors.indigenous }}>
                          Traditional Territory
                        </Text>
                        <Text className="text-base" style={{ color: '#333' }}>
                          {data.indigenousNation}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}

              {/* Waterway-specific sections */}
              {markerType === 'waterway' && waterwayData ? (
                <>
                  {/* Explorers Section */}
                  {waterwayData.explorers && waterwayData.explorers.length > 0 ? (
                    <View className="mb-4">
                      <Text
                        className="text-lg font-bold mb-2"
                        style={{ color: colors.waterBlue }}
                      >
                        Explorers Who Visited
                      </Text>
                      <View className="p-4 rounded-xl" style={{ backgroundColor: '#E6F3F8' }}>
                        {waterwayData.explorers.map((explorer) => (
                          <View key={explorer.id} className="flex-row items-center mb-3 last:mb-0">
                            {explorer.imageUrl ? (
                              <Image
                                source={{ uri: explorer.imageUrl }}
                                className="w-12 h-12 rounded-full mr-3"
                              />
                            ) : (
                              <View
                                className="w-12 h-12 rounded-full mr-3 items-center justify-center"
                                style={{ backgroundColor: colors.waterBlue }}
                              >
                                <Text className="text-white font-bold text-lg">
                                  {explorer.name.charAt(0)}
                                </Text>
                              </View>
                            )}
                            <View className="flex-1">
                              <Text className="font-semibold" style={{ color: '#333' }}>
                                {explorer.name}
                              </Text>
                              <Text className="text-sm text-gray-600">
                                {explorer.nationality}
                                {explorer.birthYear && explorer.deathYear
                                  ? ` (${explorer.birthYear}-${explorer.deathYear})`
                                  : null}
                              </Text>
                            </View>
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
                        <View className="mb-2">
                          <Text className="text-sm font-semibold" style={{ color: colors.earthBrown }}>
                            Trading Company
                          </Text>
                          <Text className="text-base" style={{ color: '#333' }}>
                            {waterwayData.furTradeInfo.company}
                          </Text>
                        </View>
                        <View className="mb-2">
                          <Text className="text-sm font-semibold" style={{ color: colors.earthBrown }}>
                            Trading Period
                          </Text>
                          <Text className="text-base" style={{ color: '#333' }}>
                            {waterwayData.furTradeInfo.tradingPeriod}
                          </Text>
                        </View>
                        {waterwayData.furTradeInfo.primaryGoods.length > 0 ? (
                          <View className="mb-2">
                            <Text className="text-sm font-semibold" style={{ color: colors.earthBrown }}>
                              Primary Goods Traded
                            </Text>
                            <Text className="text-base" style={{ color: '#333' }}>
                              {waterwayData.furTradeInfo.primaryGoods.join(', ')}
                            </Text>
                          </View>
                        ) : null}
                        <View>
                          <Text className="text-sm font-semibold" style={{ color: colors.earthBrown }}>
                            Trade Significance
                          </Text>
                          <Text className="text-base" style={{ color: '#333' }}>
                            {waterwayData.furTradeInfo.significance}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : null}

                  {/* Waterway Length */}
                  {waterwayData.length ? (
                    <View className="mb-4 p-4 rounded-xl flex-row items-center" style={{ backgroundColor: colors.section }}>
                      <Text className="text-sm font-semibold mr-2" style={{ color: colors.forestGreen }}>
                        Length:
                      </Text>
                      <Text className="text-base" style={{ color: '#333' }}>
                        {waterwayData.length.toLocaleString()} km
                      </Text>
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
                          {locationData.cartographer}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Related Waterway */}
                  {locationData.relatedWaterway ? (
                    <View className="mb-4">
                      <Text
                        className="text-lg font-bold mb-2"
                        style={{ color: colors.waterBlue }}
                      >
                        Connected Waterway
                      </Text>
                      <View className="p-4 rounded-xl" style={{ backgroundColor: '#E6F3F8' }}>
                        <Text className="font-semibold text-base" style={{ color: '#333' }}>
                          {locationData.relatedWaterway.name}
                        </Text>
                        {locationData.relatedWaterway.indigenousName ? (
                          <Text className="italic text-sm" style={{ color: colors.indigenous }}>
                            "{locationData.relatedWaterway.indigenousName}"
                          </Text>
                        ) : null}
                        <Text className="text-sm mt-1 text-gray-600">
                          {locationData.relatedWaterway.description}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                </>
              ) : null}
            </>
          ) : (
            <View className="py-20 items-center">
              <Text className="text-gray-500">No details available</Text>
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

DetailBottomSheet.displayName = 'DetailBottomSheet';

export default DetailBottomSheet;
