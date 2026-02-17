// Voyageur Journey Play Screen - Interactive storytelling adventure
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Dimensions,
  Image,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import {
  MapPin,
  Star,
  ChevronRight,
  Info,
  Music,
  ArrowLeft,
  RefreshCw,
  Trophy,
  Compass,
  Ship,
  BookOpen,
  X,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import {
  useVoyageurJourney,
  useStartJourney,
  useMakeJourneyChoice,
  useJourneyProgress,
} from '@/lib/api/education-api';
import type { JourneyNode, JourneyChoice, JourneyProgress } from '@/lib/types/education';

const { width, height } = Dimensions.get('window');
const USER_ID_KEY = '@waterways_user_id';

// Theme colors
const colors = {
  deepWater: '#1E3A5F',
  forestGreen: '#2D5A3D',
  sunsetOrange: '#D97706',
  creamWhite: '#FFFEF7',
  birchBark: '#F5F0E6',
  darkPine: '#1A3A24',
  goldAccent: '#C9A962',
  riverBlue: '#3B82F6',
};

// Generate or retrieve a persistent user ID
async function getUserId(): Promise<string> {
  try {
    const existingId = await AsyncStorage.getItem(USER_ID_KEY);
    if (existingId) return existingId;

    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await AsyncStorage.setItem(USER_ID_KEY, newId);
    return newId;
  } catch {
    return `user_${Date.now()}`;
  }
}

interface HistoricalFactModalProps {
  visible: boolean;
  fact: string;
  onClose: () => void;
}

function HistoricalFactModal({ visible, fact, onClose }: HistoricalFactModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.factModalContent}>
          <View style={styles.factModalHeader}>
            <View style={styles.factIconContainer}>
              <BookOpen size={24} color={colors.forestGreen} />
            </View>
            <Text style={styles.factModalTitle}>Historical Fact</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </Pressable>
          </View>
          <Text style={styles.factText}>{fact}</Text>
        </View>
      </View>
    </Modal>
  );
}

interface SongModalProps {
  visible: boolean;
  songTitle: string | null;
  lyrics: string | null;
  onClose: () => void;
}

function SongModal({ visible, songTitle, lyrics, onClose }: SongModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.songModalContent}>
          <View style={styles.songModalHeader}>
            <View style={styles.songIconContainer}>
              <Music size={24} color="white" />
            </View>
            <Text style={styles.songModalTitle}>{songTitle || 'Voyageur Song'}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="white" />
            </Pressable>
          </View>
          <ScrollView style={styles.lyricsContainer}>
            <Text style={styles.lyricsText}>{lyrics}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

interface CompletionScreenProps {
  score: number;
  choicesMade: string[];
  onPlayAgain: () => void;
  onBackToList: () => void;
  endingType: string | null;
}

function CompletionScreen({ score, choicesMade, onPlayAgain, onBackToList, endingType }: CompletionScreenProps) {
  const isGoodEnding = endingType === 'success' || endingType === 'good';

  return (
    <View style={styles.completionContainer}>
      <LinearGradient
        colors={isGoodEnding ? ['#10B981', '#047857'] : ['#F59E0B', '#D97706']}
        style={styles.completionGradient}
      >
        <View style={styles.completionIconContainer}>
          <Trophy size={48} color="white" />
        </View>
        <Text style={styles.completionTitle}>
          {isGoodEnding ? 'Journey Complete!' : 'Journey Ended'}
        </Text>
        <Text style={styles.completionSubtitle}>
          {isGoodEnding
            ? 'You successfully completed your voyage!'
            : 'Your journey has come to an end.'}
        </Text>
      </LinearGradient>

      <View style={styles.completionStats}>
        <View style={styles.statCard}>
          <Star size={28} color={colors.goldAccent} />
          <Text style={styles.statValue}>{score}</Text>
          <Text style={styles.statLabel}>Points Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Compass size={28} color={colors.forestGreen} />
          <Text style={styles.statValue}>{choicesMade.length}</Text>
          <Text style={styles.statLabel}>Choices Made</Text>
        </View>
      </View>

      <View style={styles.completionActions}>
        <Pressable style={styles.playAgainButton} onPress={onPlayAgain}>
          <RefreshCw size={20} color="white" />
          <Text style={styles.playAgainText}>Play Again</Text>
        </Pressable>
        <Pressable style={styles.backToListButton} onPress={onBackToList}>
          <ArrowLeft size={20} color={colors.forestGreen} />
          <Text style={styles.backToListText}>Back to Adventures</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function VoyageurJourneyPlayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<JourneyNode | null>(null);
  const [progress, setProgress] = useState<JourneyProgress | null>(null);
  const [showFactModal, setShowFactModal] = useState(false);
  const [showSongModal, setShowSongModal] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const { data: journey, isLoading: journeyLoading } = useVoyageurJourney(id ?? null);
  const startJourneyMutation = useStartJourney();
  const makeChoiceMutation = useMakeJourneyChoice();
  const { data: existingProgress, isLoading: progressLoading } = useJourneyProgress(id ?? null, userId);

  // Initialize user ID
  useEffect(() => {
    getUserId().then(setUserId);
  }, []);

  // Check for existing progress or start journey
  useEffect(() => {
    if (!userId || !id || !journey || isStarting) return;

    if (existingProgress?.hasProgress && existingProgress.progress && existingProgress.currentNode) {
      setProgress(existingProgress.progress);
      setCurrentNode(existingProgress.currentNode);
    } else if (!progressLoading && !existingProgress?.hasProgress) {
      // Start a new journey
      setIsStarting(true);
      startJourneyMutation.mutate(
        { journeyId: id, userId },
        {
          onSuccess: (data) => {
            setProgress(data.progress);
            setCurrentNode(data.currentNode);
            setIsStarting(false);
          },
          onError: () => {
            setIsStarting(false);
          },
        }
      );
    }
  }, [userId, id, journey, existingProgress, progressLoading, isStarting, startJourneyMutation]);

  const handleChoice = useCallback((choice: JourneyChoice) => {
    if (!userId || !id || !currentNode) return;

    makeChoiceMutation.mutate(
      {
        journeyId: id,
        payload: {
          userId,
          nodeId: currentNode.id,
          choiceId: choice.id,
        },
      },
      {
        onSuccess: (data) => {
          setProgress(data.progress);
          setCurrentNode(data.currentNode);
        },
      }
    );
  }, [userId, id, currentNode, makeChoiceMutation]);

  const handlePlayAgain = useCallback(() => {
    if (!userId || !id) return;
    setIsStarting(true);
    setProgress(null);
    setCurrentNode(null);

    startJourneyMutation.mutate(
      { journeyId: id, userId },
      {
        onSuccess: (data) => {
          setProgress(data.progress);
          setCurrentNode(data.currentNode);
          setIsStarting(false);
        },
        onError: () => {
          setIsStarting(false);
        },
      }
    );
  }, [userId, id, startJourneyMutation]);

  const handleBackToList = useCallback(() => {
    router.push('/voyageur-journey' as Href);
  }, [router]);

  // Loading state
  if (journeyLoading || progressLoading || isStarting || !currentNode) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Loading...',
            headerStyle: { backgroundColor: colors.creamWhite },
            headerTintColor: colors.darkPine,
          }}
        />
        <View style={styles.loadingContainer}>
          <Ship size={48} color={colors.forestGreen} />
          <ActivityIndicator size="large" color={colors.forestGreen} style={{ marginTop: 16 }} />
          <Text style={styles.loadingText}>Preparing your journey...</Text>
        </View>
      </>
    );
  }

  // Completion state
  if (currentNode.isEnding && progress) {
    return (
      <>
        <Stack.Screen
          options={{
            title: journey?.title || 'Journey Complete',
            headerStyle: { backgroundColor: colors.creamWhite },
            headerTintColor: colors.darkPine,
          }}
        />
        <CompletionScreen
          score={progress.score}
          choicesMade={progress.choicesMade}
          endingType={currentNode.endingType}
          onPlayAgain={handlePlayAgain}
          onBackToList={handleBackToList}
        />
      </>
    );
  }

  const totalNodes = journey?.nodes?.length || 1;
  const currentIndex = currentNode.orderIndex + 1;
  const progressPercent = (currentIndex / totalNodes) * 100;

  return (
    <>
      <Stack.Screen
        options={{
          title: journey?.title || 'Voyageur Journey',
          headerStyle: { backgroundColor: colors.creamWhite },
          headerTintColor: colors.darkPine,
          headerTitleStyle: { fontWeight: '600' },
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Stop {currentIndex} of {totalNodes}
          </Text>
        </View>

        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <Star size={18} color={colors.goldAccent} />
          <Text style={styles.scoreText}>{progress?.score || 0} points</Text>
        </View>

        {/* Location Map (if coordinates available) */}
        {currentNode.latitude !== null && currentNode.longitude !== null ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: currentNode.latitude,
                longitude: currentNode.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: currentNode.latitude,
                  longitude: currentNode.longitude,
                }}
                title={currentNode.title}
              />
            </MapView>
            <View style={styles.locationBadge}>
              <MapPin size={14} color="white" />
              <Text style={styles.locationBadgeText}>
                {currentNode.title || 'Current Location'}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Cover Image */}
        {currentNode.imageUrl ? (
          <Image
            source={{ uri: currentNode.imageUrl }}
            style={styles.nodeImage}
            resizeMode="cover"
          />
        ) : null}

        {/* Narrative Card */}
        <View style={styles.narrativeCard}>
          {currentNode.title ? (
            <Text style={styles.nodeTitle}>{currentNode.title}</Text>
          ) : null}
          <Text style={styles.narrativeText}>{currentNode.narrative}</Text>
        </View>

        {/* Historical Fact Button */}
        {currentNode.historicalFact ? (
          <Pressable
            style={styles.factButton}
            onPress={() => setShowFactModal(true)}
          >
            <Info size={20} color={colors.forestGreen} />
            <Text style={styles.factButtonText}>View Historical Fact</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>
        ) : null}

        {/* Song Button */}
        {currentNode.songLyrics ? (
          <Pressable
            style={styles.songButton}
            onPress={() => setShowSongModal(true)}
          >
            <Music size={20} color={colors.sunsetOrange} />
            <Text style={styles.songButtonText}>
              {currentNode.voyageurSong || 'Listen to Voyageur Song'}
            </Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>
        ) : null}

        {/* Choices */}
        {currentNode.choices && currentNode.choices.length > 0 ? (
          <View style={styles.choicesContainer}>
            <Text style={styles.choicesTitle}>What do you do?</Text>
            {currentNode.choices.map((choice) => (
              <Pressable
                key={choice.id}
                style={({ pressed }) => [
                  styles.choiceButton,
                  pressed && styles.choiceButtonPressed,
                ]}
                onPress={() => handleChoice(choice)}
                disabled={makeChoiceMutation.isPending}
              >
                <Text style={styles.choiceText}>{choice.text}</Text>
                <ChevronRight size={20} color={colors.forestGreen} />
              </Pressable>
            ))}
          </View>
        ) : null}

        {/* Loading indicator for choice mutation */}
        {makeChoiceMutation.isPending ? (
          <View style={styles.choiceLoadingContainer}>
            <ActivityIndicator size="small" color={colors.forestGreen} />
            <Text style={styles.choiceLoadingText}>Processing your choice...</Text>
          </View>
        ) : null}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modals */}
      <HistoricalFactModal
        visible={showFactModal}
        fact={currentNode.historicalFact || ''}
        onClose={() => setShowFactModal(false)}
      />
      <SongModal
        visible={showSongModal}
        songTitle={currentNode.voyageurSong}
        lyrics={currentNode.songLyrics}
        onClose={() => setShowSongModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.creamWhite,
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  progressBarContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.forestGreen,
    borderRadius: 4,
  },
  progressText: {
    marginTop: 6,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'right',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkPine,
  },
  mapContainer: {
    height: 180,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  locationBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  locationBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  nodeImage: {
    width: width - 32,
    height: 200,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  narrativeCard: {
    margin: 16,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  nodeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkPine,
    marginBottom: 12,
  },
  narrativeText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#374151',
  },
  factButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    backgroundColor: colors.birchBark,
    borderRadius: 12,
    gap: 12,
  },
  factButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.forestGreen,
  },
  songButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    gap: 12,
  },
  songButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.sunsetOrange,
  },
  choicesContainer: {
    margin: 16,
    marginTop: 8,
  },
  choicesTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.darkPine,
    marginBottom: 12,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.forestGreen,
  },
  choiceButtonPressed: {
    backgroundColor: colors.forestGreen + '10',
  },
  choiceText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.darkPine,
    lineHeight: 22,
  },
  choiceLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  choiceLoadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  factModalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  factModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  factIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  factModalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkPine,
  },
  closeButton: {
    padding: 4,
  },
  factText: {
    padding: 20,
    fontSize: 16,
    lineHeight: 26,
    color: '#374151',
  },
  songModalContent: {
    width: '100%',
    maxHeight: height * 0.7,
    backgroundColor: colors.deepWater,
    borderRadius: 20,
    overflow: 'hidden',
  },
  songModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  songIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  songModalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  lyricsContainer: {
    padding: 20,
  },
  lyricsText: {
    fontSize: 16,
    lineHeight: 28,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
  },
  // Completion screen styles
  completionContainer: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  completionGradient: {
    padding: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  completionIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  completionStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 24,
    paddingHorizontal: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.darkPine,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  completionActions: {
    padding: 20,
    marginTop: 24,
    gap: 12,
  },
  playAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.forestGreen,
    borderRadius: 12,
    gap: 8,
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  backToListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.forestGreen,
    gap: 8,
  },
  backToListText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.forestGreen,
  },
  bottomSpacer: {
    height: 40,
  },
});
