// Onboarding/Tutorial Flow - First launch tutorial
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Map,
  BookOpen,
  Trophy,
  Languages,
  Users,
  ChevronRight,
  X,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

const ONBOARDING_KEY = '@waterways_onboarding_completed';

interface OnboardingSlide {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradientColors: readonly [string, string];
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 'welcome',
    icon: <Map size={64} color="white" />,
    title: 'Welcome to Canadian Waterways',
    description:
      'Explore Canada\'s rivers, lakes, and historic locations. Discover the waterways that shaped our nation\'s history.',
    gradientColors: ['#2D5A3D', '#1A3A24'] as const,
  },
  {
    id: 'learn',
    icon: <BookOpen size={64} color="white" />,
    title: 'Learn & Discover',
    description:
      'Access lesson plans, quizzes, primary source documents, and virtual field trips. Complete with RCGS educational quizzes.',
    gradientColors: ['#3B82F6', '#1D4ED8'] as const,
  },
  {
    id: 'gamification',
    icon: <Trophy size={64} color="white" />,
    title: 'Earn Achievements',
    description:
      'Track your progress, earn badges, and climb explorer ranks. Complete daily challenges and maintain streaks.',
    gradientColors: ['#C9A962', '#8B7355'] as const,
  },
  {
    id: 'indigenous',
    icon: <Languages size={64} color="white" />,
    title: 'Indigenous Languages',
    description:
      'Learn 298 words from 8 Indigenous languages. Discover traditional place names and their meanings.',
    gradientColors: ['#059669', '#047857'] as const,
  },
  {
    id: 'notable',
    icon: <Users size={64} color="white" />,
    title: 'Notable Figures',
    description:
      'Meet the women and Indigenous leaders who shaped Canadian history. Learn perspectives often overlooked in traditional histories.',
    gradientColors: ['#8B5CF6', '#6D28D9'] as const,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = async () => {
    await handleComplete();
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      // Navigate back to main app
      router.replace('/');
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
      router.replace('/');
    }
  };

  const slide = SLIDES[currentSlide];
  const isLastSlide = currentSlide === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={slide.gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Skip Button */}
        {!isLastSlide ? (
          <Pressable style={styles.skipButton} onPress={handleSkip}>
            <X size={24} color="white" />
          </Pressable>
        ) : null}

        {/* Content */}
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>{slide.icon}</View>

          {/* Title */}
          <Text style={styles.title}>{slide.title}</Text>

          {/* Description */}
          <Text style={styles.description}>{slide.description}</Text>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentSlide && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Next/Get Started Button */}
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              pressed && styles.nextButtonPressed,
            ]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {isLastSlide ? 'Get Started' : 'Next'}
            </Text>
            <ChevronRight size={20} color={colors.darkGreen} />
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  skipButton: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 40,
  },
  description: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 48,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    width: 24,
    backgroundColor: 'white',
  },
  footer: {
    padding: 24,
    paddingBottom: 48,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  nextButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
  },
});
