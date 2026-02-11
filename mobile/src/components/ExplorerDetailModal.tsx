// Explorer Detail Modal Component
import React from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import type { ExplorerDetail } from '@/lib/types/waterways';

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  waterBlue: '#3B82A3',
  earthBrown: '#8B5A2B',
  creamWhite: '#FFFEF7',
  gold: '#C9A227',
};

interface ExplorerDetailModalProps {
  explorer: ExplorerDetail;
  onClose: () => void;
}

export default function ExplorerDetailModal({ explorer, onClose }: ExplorerDetailModalProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        {/* Close Button */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <X size={24} color={colors.forestGreen} />
        </Pressable>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Explorer Header */}
          <View style={styles.header}>
            {explorer.imageUrl ? (
              <Image source={{ uri: explorer.imageUrl }} style={styles.portrait} />
            ) : (
              <View style={styles.portraitPlaceholder}>
                <Text style={styles.portraitInitial}>{explorer.name.charAt(0)}</Text>
              </View>
            )}
            <Text style={styles.name}>{explorer.name}</Text>
            <Text style={styles.nationality}>{explorer.nationality}</Text>
            {explorer.birthYear && explorer.deathYear ? (
              <Text style={styles.years}>
                {explorer.birthYear} - {explorer.deathYear}
              </Text>
            ) : null}
          </View>

          {/* Biography */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Biography</Text>
            <View style={styles.sectionContent}>
              <Text style={styles.biography}>{explorer.biography}</Text>
            </View>
          </View>

          {/* Achievements */}
          {explorer.achievements && explorer.achievements.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.gold }]}>Achievements</Text>
              <View style={[styles.sectionContent, { backgroundColor: '#FFF8E7' }]}>
                {explorer.achievements.map((achievement, index) => (
                  <View key={index} style={styles.achievementItem}>
                    <View style={styles.achievementBullet} />
                    <Text style={styles.achievementText}>{achievement}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* Waterways Explored */}
          {explorer.waterwaysExplored && explorer.waterwaysExplored.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.waterBlue }]}>
                Waterways Explored
              </Text>
              <View style={[styles.sectionContent, { backgroundColor: '#E6F3F8' }]}>
                {explorer.waterwaysExplored.map((waterway) => (
                  <View key={waterway.id} style={styles.waterwayItem}>
                    <View style={styles.waterwayHeader}>
                      <Text style={styles.waterwayName}>{waterway.name}</Text>
                      <View
                        style={[
                          styles.typeBadge,
                          {
                            backgroundColor:
                              waterway.type === 'river'
                                ? '#3B82F6'
                                : waterway.type === 'lake'
                                ? '#06B6D4'
                                : '#10B981',
                          },
                        ]}
                      >
                        <Text style={styles.typeBadgeText}>
                          {waterway.type === 'river'
                            ? 'River'
                            : waterway.type === 'lake'
                            ? 'Lake'
                            : 'Bay'}
                        </Text>
                      </View>
                    </View>
                    {waterway.indigenousName ? (
                      <Text style={styles.waterwayIndigenous}>
                        "{waterway.indigenousName}"
                      </Text>
                    ) : null}
                    <Text style={styles.waterwayDescription} numberOfLines={2}>
                      {waterway.description}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modal: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: colors.creamWhite,
    borderRadius: 20,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  portrait: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: colors.forestGreen,
  },
  portraitPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: colors.forestGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portraitInitial: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.forestGreen,
    textAlign: 'center',
    marginBottom: 4,
  },
  nationality: {
    fontSize: 16,
    color: colors.earthBrown,
    marginBottom: 4,
  },
  years: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.forestGreen,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#F5F5DC',
    borderRadius: 12,
    padding: 16,
  },
  biography: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
  },
  achievementItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  achievementBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
    marginTop: 6,
    marginRight: 12,
  },
  achievementText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  waterwayItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 163, 0.2)',
  },
  waterwayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  waterwayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  waterwayIndigenous: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#8B4513',
    marginBottom: 4,
  },
  waterwayDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});
