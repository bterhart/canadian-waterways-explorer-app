// Web fallback for Map Screen - shows list view since Google Maps requires API key
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useWaterways, useLocations, useWaterwayDetail, useLocationDetail } from '@/lib/api/waterways-api';
import type { Waterway, Location } from '@/lib/types/waterways';
import { MapPin, Droplets, Mountain, Anchor, Building, Route } from 'lucide-react-native';

// Marker colors based on type
const markerColors: Record<string, string> = {
  River: '#3B82F6',
  Lake: '#06B6D4',
  Bay: '#10B981',
  Strait: '#0EA5E9',
  Fort: '#EF4444',
  'Trading Post': '#F97316',
  Portage: '#92400E',
  Settlement: '#8B5CF6',
};

type SelectedItem = {
  id: string;
  type: 'waterway' | 'location';
} | null;

export default function MapScreenWeb() {
  const { data: waterways, isLoading: waterwaysLoading } = useWaterways();
  const { data: locations, isLoading: locationsLoading } = useLocations();
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [activeTab, setActiveTab] = useState<'waterways' | 'locations'>('waterways');

  const { data: waterwayDetail } = useWaterwayDetail(
    selectedItem?.type === 'waterway' ? selectedItem.id : ''
  );
  const { data: locationDetail } = useLocationDetail(
    selectedItem?.type === 'location' ? selectedItem.id : ''
  );

  const isLoading = waterwaysLoading || locationsLoading;

  const getWaterwayIcon = (typeName: string) => {
    switch (typeName) {
      case 'River':
        return <Droplets size={18} color={markerColors.River} />;
      case 'Lake':
        return <Mountain size={18} color={markerColors.Lake} />;
      case 'Bay':
        return <Anchor size={18} color={markerColors.Bay} />;
      default:
        return <MapPin size={18} color="#6B7280" />;
    }
  };

  const getLocationIcon = (locationType: string) => {
    switch (locationType) {
      case 'Fort':
        return <Building size={18} color={markerColors.Fort} />;
      case 'Trading Post':
        return <Building size={18} color={markerColors['Trading Post']} />;
      case 'Portage':
        return <Route size={18} color={markerColors.Portage} />;
      default:
        return <MapPin size={18} color={markerColors.Settlement} />;
    }
  };

  const renderWaterwayCard = (waterway: Waterway) => {
    const isSelected = selectedItem?.id === waterway.id && selectedItem?.type === 'waterway';
    const typeName = waterway.type?.name || 'River';
    return (
      <Pressable
        key={waterway.id}
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => setSelectedItem({ id: waterway.id, type: 'waterway' })}
      >
        <View style={styles.cardHeader}>
          {getWaterwayIcon(typeName)}
          <View style={[styles.typeBadge, { backgroundColor: markerColors[typeName] || '#6B7280' }]}>
            <Text style={styles.typeBadgeText}>{typeName}</Text>
          </View>
        </View>
        <Text style={styles.cardTitle}>{waterway.name}</Text>
        {waterway.indigenousName ? (
          <Text style={styles.cardIndigenous}>"{waterway.indigenousName}"</Text>
        ) : null}
        <Text style={styles.cardRegion}>{waterway.regionName}</Text>
      </Pressable>
    );
  };

  const renderLocationCard = (location: Location) => {
    const isSelected = selectedItem?.id === location.id && selectedItem?.type === 'location';
    const locationType = location.locationType || 'Settlement';
    return (
      <Pressable
        key={location.id}
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => setSelectedItem({ id: location.id, type: 'location' })}
      >
        <View style={styles.cardHeader}>
          {getLocationIcon(locationType)}
          <View style={[styles.typeBadge, { backgroundColor: markerColors[locationType] || markerColors.Settlement }]}>
            <Text style={styles.typeBadgeText}>{locationType}</Text>
          </View>
        </View>
        <Text style={styles.cardTitle}>{location.name}</Text>
        {location.indigenousName ? (
          <Text style={styles.cardIndigenous}>"{location.indigenousName}"</Text>
        ) : null}
        {location.waterway?.name ? (
          <Text style={styles.cardRegion}>On: {location.waterway.name}</Text>
        ) : null}
      </Pressable>
    );
  };

  const renderDetailPanel = () => {
    if (!selectedItem) {
      return (
        <View style={styles.detailPlaceholder}>
          <MapPin size={48} color="#CBD5E1" />
          <Text style={styles.placeholderTitle}>Select a Location</Text>
          <Text style={styles.placeholderText}>
            Tap on a waterway or historic location to view details about its history, Indigenous heritage, and connection to early exploration.
          </Text>
        </View>
      );
    }

    if (selectedItem.type === 'waterway' && waterwayDetail) {
      return (
        <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.detailTitle}>{waterwayDetail.name}</Text>
          {waterwayDetail.indigenousName ? (
            <View style={styles.indigenousSection}>
              <Text style={styles.sectionLabel}>Indigenous Name</Text>
              <Text style={styles.indigenousName}>"{waterwayDetail.indigenousName}"</Text>
              {waterwayDetail.indigenousLanguage ? (
                <Text style={styles.languageText}>({waterwayDetail.indigenousLanguage})</Text>
              ) : null}
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.descriptionText}>{waterwayDetail.description}</Text>
          </View>

          {waterwayDetail.historicalSignificance ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Historical Significance</Text>
              <Text style={styles.descriptionText}>{waterwayDetail.historicalSignificance}</Text>
            </View>
          ) : null}

          {waterwayDetail.explorers && waterwayDetail.explorers.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Explorers</Text>
              {waterwayDetail.explorers.map((exp) => (
                <View key={exp.id} style={styles.explorerItem}>
                  <Text style={styles.explorerName}>{exp.explorer?.name || 'Unknown'}</Text>
                  {exp.yearExplored ? (
                    <Text style={styles.explorerYear}>Explored: {exp.yearExplored}</Text>
                  ) : null}
                  {exp.expeditionNotes ? (
                    <Text style={styles.explorerNotes}>{exp.expeditionNotes}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}

          {waterwayDetail.furTradeInfo ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Fur Trade History</Text>
              {waterwayDetail.furTradeInfo.tradingCompany ? (
                <Text style={styles.furTradeText}>
                  <Text style={styles.boldText}>Company: </Text>
                  {waterwayDetail.furTradeInfo.tradingCompany}
                </Text>
              ) : null}
              {waterwayDetail.furTradeInfo.peakTradePeriod ? (
                <Text style={styles.furTradeText}>
                  <Text style={styles.boldText}>Peak Period: </Text>
                  {waterwayDetail.furTradeInfo.peakTradePeriod}
                </Text>
              ) : null}
              {waterwayDetail.furTradeInfo.primaryFurs ? (
                <Text style={styles.furTradeText}>
                  <Text style={styles.boldText}>Primary Furs: </Text>
                  {waterwayDetail.furTradeInfo.primaryFurs}
                </Text>
              ) : null}
              {waterwayDetail.furTradeInfo.tradeRouteNotes ? (
                <Text style={styles.furTradeText}>{waterwayDetail.furTradeInfo.tradeRouteNotes}</Text>
              ) : null}
            </View>
          ) : null}
        </ScrollView>
      );
    }

    if (selectedItem.type === 'location' && locationDetail) {
      return (
        <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.detailTitle}>{locationDetail.name}</Text>
          {locationDetail.indigenousName ? (
            <View style={styles.indigenousSection}>
              <Text style={styles.sectionLabel}>Indigenous Name</Text>
              <Text style={styles.indigenousName}>"{locationDetail.indigenousName}"</Text>
              {locationDetail.indigenousLanguage ? (
                <Text style={styles.languageText}>({locationDetail.indigenousLanguage})</Text>
              ) : null}
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.descriptionText}>{locationDetail.description}</Text>
          </View>

          {locationDetail.yearEstablished ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Year Established</Text>
              <Text style={styles.yearText}>{locationDetail.yearEstablished}</Text>
            </View>
          ) : null}

          {locationDetail.historicalNotes ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Historical Notes</Text>
              <Text style={styles.descriptionText}>{locationDetail.historicalNotes}</Text>
            </View>
          ) : null}

          {locationDetail.waterway ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Located On</Text>
              <Text style={styles.waterwayLink}>{locationDetail.waterway.name}</Text>
            </View>
          ) : null}

          {locationDetail.cartographer ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Mapped By</Text>
              <Text style={styles.cartographerText}>{locationDetail.cartographer.name}</Text>
            </View>
          ) : null}
        </ScrollView>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Canadian waterways...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Canada's Waterways</Text>
        <Text style={styles.headerSubtitle}>An Educational Journey Through History</Text>
      </View>

      <View style={styles.mainContent}>
        {/* Left Panel - List */}
        <View style={styles.listPanel}>
          {/* Tabs */}
          <View style={styles.tabs}>
            <Pressable
              style={[styles.tab, activeTab === 'waterways' && styles.tabActive]}
              onPress={() => setActiveTab('waterways')}
            >
              <Droplets size={16} color={activeTab === 'waterways' ? '#2D5A3D' : '#6B7280'} />
              <Text style={[styles.tabText, activeTab === 'waterways' && styles.tabTextActive]}>
                Waterways ({waterways?.length || 0})
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'locations' && styles.tabActive]}
              onPress={() => setActiveTab('locations')}
            >
              <Building size={16} color={activeTab === 'locations' ? '#2D5A3D' : '#6B7280'} />
              <Text style={[styles.tabText, activeTab === 'locations' && styles.tabTextActive]}>
                Historic Sites ({locations?.length || 0})
              </Text>
            </Pressable>
          </View>

          {/* List */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {activeTab === 'waterways'
              ? waterways?.map(renderWaterwayCard)
              : locations?.map(renderLocationCard)}
          </ScrollView>
        </View>

        {/* Right Panel - Details */}
        <View style={styles.detailPanel}>
          {renderDetailPanel()}
        </View>
      </View>

      {/* Web notice */}
      <View style={styles.webNotice}>
        <Text style={styles.webNoticeText}>
          For the full interactive map experience, view this app on your iPhone
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAF5',
  },
  loadingText: {
    fontSize: 16,
    color: '#2D5A3D',
  },
  header: {
    backgroundColor: '#2D5A3D',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A7C4A0',
    marginTop: 4,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  listPanel: {
    width: 320,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#2D5A3D',
  },
  tabText: {
    fontSize: 13,
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#2D5A3D',
    fontWeight: '600',
  },
  list: {
    flex: 1,
    padding: 12,
  },
  card: {
    backgroundColor: '#FFFEF7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardSelected: {
    borderColor: '#2D5A3D',
    borderWidth: 2,
    backgroundColor: '#F0FDF4',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  cardIndigenous: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#8B4513',
    marginTop: 2,
  },
  cardRegion: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  detailPanel: {
    flex: 1,
    backgroundColor: 'white',
  },
  detailPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 300,
    lineHeight: 20,
  },
  detailContent: {
    flex: 1,
    padding: 24,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D5A3D',
    marginBottom: 8,
  },
  indigenousSection: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  indigenousName: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#92400E',
    fontWeight: '500',
  },
  languageText: {
    fontSize: 13,
    color: '#B45309',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  explorerItem: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  explorerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  explorerYear: {
    fontSize: 13,
    color: '#2D5A3D',
    marginTop: 2,
  },
  explorerNotes: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  furTradeText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '600',
  },
  yearText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5A3D',
  },
  waterwayLink: {
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '500',
  },
  cartographerText: {
    fontSize: 15,
    color: '#374151',
  },
  webNotice: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  webNoticeText: {
    fontSize: 13,
    color: '#92400E',
  },
});
