// Learn Hub - Educational content hub for Canadian Interactive Waterways Initiative
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  BookOpen,
  Clock,
  Map,
  FileText,
  GitCompare,
  Volume2,
  BookMarked,
  GraduationCap,
  Printer,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
  gold: '#C9A962',
  lightGreen: '#E8F5E9',
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientColors: readonly [string, string];
  onPress: () => void;
  isLarge?: boolean;
}

function FeatureCard({
  title,
  description,
  icon,
  gradientColors,
  onPress,
  isLarge = false,
}: FeatureCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isLarge ? styles.cardLarge : styles.cardSmall,
        pressed && styles.cardPressed,
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.cardGradient, isLarge ? styles.cardLarge : styles.cardSmall]}
      >
        <View style={styles.cardIconContainer}>{icon}</View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.cardArrow}>
          <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

interface QuickLinkProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  color: string;
}

function QuickLink({ title, icon, onPress, color }: QuickLinkProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickLink,
        pressed && styles.quickLinkPressed,
      ]}
    >
      <View style={[styles.quickLinkIcon, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <Text style={styles.quickLinkText}>{title}</Text>
      <ChevronRight size={16} color="#9CA3AF" />
    </Pressable>
  );
}

export default function LearnHubScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Explore and Learn</Text>
        <Text style={styles.heroSubtitle}>
          Discover Canada's rich waterway history through interactive lessons,
          timelines, and virtual experiences
        </Text>
      </View>

      {/* Main Feature Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Resources</Text>
        <View style={styles.cardsGrid}>
          <FeatureCard
            title="Lesson Plans"
            description="Curriculum-aligned lessons for K-12"
            icon={<BookOpen size={28} color="white" />}
            gradientColors={['#2D5A3D', '#1A3A24'] as const}
            onPress={() => router.push('/lessons')}
          />
          <FeatureCard
            title="Timeline"
            description="Interactive Canadian history timeline"
            icon={<Clock size={28} color="white" />}
            gradientColors={['#3B82F6', '#1D4ED8'] as const}
            onPress={() => router.push('/timeline')}
          />
          <FeatureCard
            title="Field Trips"
            description="Virtual exploration adventures"
            icon={<Map size={28} color="white" />}
            gradientColors={['#10B981', '#047857'] as const}
            onPress={() => router.push('/field-trips')}
          />
          <FeatureCard
            title="Documents"
            description="Primary source materials"
            icon={<FileText size={28} color="white" />}
            gradientColors={['#8B5CF6', '#6D28D9'] as const}
            onPress={() => router.push('/documents')}
          />
        </View>
      </View>

      {/* Tools Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Tools</Text>
        <View style={styles.cardsGrid}>
          <FeatureCard
            title="Compare"
            description="Compare explorers, forts, and more"
            icon={<GitCompare size={28} color="white" />}
            gradientColors={['#F97316', '#C2410C'] as const}
            onPress={() => router.push('/comparisons')}
          />
          <FeatureCard
            title="Pronunciations"
            description="Indigenous language guide"
            icon={<Volume2 size={28} color="white" />}
            gradientColors={['#EC4899', '#BE185D'] as const}
            onPress={() => router.push('/pronunciations')}
          />
        </View>
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickLinksContainer}>
          <QuickLink
            title="My Journal"
            icon={<BookMarked size={20} color={colors.forestGreen} />}
            color={colors.forestGreen}
            onPress={() => router.push('/journal')}
          />
          <QuickLink
            title="Teacher Portal"
            icon={<GraduationCap size={20} color="#3B82F6" />}
            color="#3B82F6"
            onPress={() => router.push('/teacher/login')}
          />
          <QuickLink
            title="Printable Resources"
            icon={<Printer size={20} color="#8B5CF6" />}
            color="#8B5CF6"
            onPress={() => router.push('/printables')}
          />
        </View>
      </View>

      {/* RCGS Attribution */}
      <View style={styles.attributionSection}>
        <Text style={styles.attributionText}>
          Part of the Royal Canadian Geographic Society's educational initiative
        </Text>
        <Text style={styles.attributionSubtext}>
          Supporting 25,000+ educators across Canada
        </Text>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  heroSection: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.forestGreen,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 12,
    paddingLeft: 4,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardSmall: {
    width: CARD_WIDTH,
    height: 150,
  },
  cardLarge: {
    width: '100%',
    height: 160,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
  },
  cardArrow: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  quickLinksContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  quickLinkPressed: {
    backgroundColor: '#F9FAFB',
  },
  quickLinkIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickLinkText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  attributionSection: {
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  attributionText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  attributionSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
  bottomSpacer: {
    height: 32,
  },
});
