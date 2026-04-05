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
  Languages,
  Settings,
  Pencil,
  MapPin,
  Trophy,
  Flame,
  Users,
  HelpCircle,
  Info,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@/lib/i18n';

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
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroTitle}>{t('exploreAndLearn')}</Text>
          <Pressable
            onPress={() => router.push('/settings')}
            style={styles.settingsButton}
          >
            <Settings size={24} color={colors.forestGreen} />
          </Pressable>
        </View>
        <Text style={styles.heroSubtitle}>
          {t('exploreSubtitle')}
        </Text>
      </View>

      {/* My Progress Card */}
      <Pressable
        onPress={() => router.push('/achievements')}
        style={({ pressed }) => [
          styles.progressCard,
          pressed && styles.progressCardPressed,
        ]}
      >
        <LinearGradient
          colors={['#C9A962', '#8B7355'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressCardGradient}
        >
          <View style={styles.progressCardContent}>
            <View style={styles.progressCardIconContainer}>
              <Trophy size={28} color="white" />
            </View>
            <View style={styles.progressCardTextContainer}>
              <Text style={styles.progressCardTitle}>My Progress</Text>
              <Text style={styles.progressCardSubtitle}>
                Track achievements and daily challenges
              </Text>
            </View>
            <View style={styles.progressCardStreakBadge}>
              <Flame size={16} color="#FCD34D" />
              <ChevronRight size={20} color="rgba(255,255,255,0.8)" />
            </View>
          </View>
        </LinearGradient>
      </Pressable>

      {/* Main Feature Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('learningResources')}</Text>
        <View style={styles.cardsGrid}>
          <FeatureCard
            title={t('deepDives')}
            description={t('deepDivesDesc')}
            icon={<BookOpen size={28} color="white" />}
            gradientColors={['#2D5A3D', '#1A3A24'] as const}
            onPress={() => router.push('/lessons')}
          />
          <FeatureCard
            title={t('timeline')}
            description={t('timelineDesc')}
            icon={<Clock size={28} color="white" />}
            gradientColors={['#3B82F6', '#1D4ED8'] as const}
            onPress={() => router.push('/timeline')}
          />
          <FeatureCard
            title={t('fieldTrips')}
            description={t('fieldTripsDesc')}
            icon={<Map size={28} color="white" />}
            gradientColors={['#10B981', '#047857'] as const}
            onPress={() => router.push('/field-trips')}
          />
          <FeatureCard
            title={t('documents')}
            description={t('documentsDesc')}
            icon={<FileText size={28} color="white" />}
            gradientColors={['#8B5CF6', '#6D28D9'] as const}
            onPress={() => router.push('/documents')}
          />
        </View>
      </View>

      {/* Discovery Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Discovery</Text>
        <View style={styles.cardsGrid}>
          <FeatureCard
            title="What Happened Here?"
            description="Discover historical events near your location"
            icon={<MapPin size={28} color="white" />}
            gradientColors={['#DC2626', '#991B1B'] as const}
            onPress={() => router.push('/nearby-history')}
            isLarge
          />
        </View>
      </View>

      {/* Notable Figures Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>People in History</Text>
        <View style={styles.cardsGrid}>
          <FeatureCard
            title="Notable Figures"
            description="Traders, guides, interpreters, Indigenous leaders, women, and others who shaped Canadian history"
            icon={<Users size={28} color="white" />}
            gradientColors={['#8B5CF6', '#6D28D9'] as const}
            onPress={() => router.push('/notable-figures')}
            isLarge
          />
        </View>
      </View>

      {/* Tools Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('learningTools')}</Text>
        <View style={styles.cardsGrid}>
          <FeatureCard
            title={t('myMaps')}
            description="Draw routes and add pins"
            icon={<Pencil size={28} color="white" />}
            gradientColors={['#0EA5E9', '#0284C7'] as const}
            onPress={() => router.push('/my-maps')}
          />
          <FeatureCard
            title={t('indigenousLanguages')}
            description={t('indigenousLanguagesDesc')}
            icon={<Languages size={28} color="white" />}
            gradientColors={['#059669', '#047857'] as const}
            onPress={() => router.push('/indigenous-languages')}
          />
          <FeatureCard
            title={t('compare')}
            description={t('compareDesc')}
            icon={<GitCompare size={28} color="white" />}
            gradientColors={['#F97316', '#C2410C'] as const}
            onPress={() => router.push('/comparisons')}
          />
          <FeatureCard
            title={t('pronunciations')}
            description={t('pronunciationsDesc')}
            icon={<Volume2 size={28} color="white" />}
            gradientColors={['#EC4899', '#BE185D'] as const}
            onPress={() => router.push('/pronunciations')}
          />
        </View>
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('quickAccess')}</Text>
        <View style={styles.quickLinksContainer}>
          <QuickLink
            title={t('myJournal')}
            icon={<BookMarked size={20} color={colors.forestGreen} />}
            color={colors.forestGreen}
            onPress={() => router.push('/journal')}
          />
          <QuickLink
            title={t('teacherPortal')}
            icon={<GraduationCap size={20} color="#3B82F6" />}
            color="#3B82F6"
            onPress={() => router.push('/teacher/login')}
          />
          <QuickLink
            title={t('printableResources')}
            icon={<Printer size={20} color="#8B5CF6" />}
            color="#8B5CF6"
            onPress={() => router.push('/printables')}
          />
          <QuickLink
            title="User Guide"
            icon={<BookOpen size={20} color="#10B981" />}
            color="#10B981"
            onPress={() => router.push('/user-guide')}
          />
          <QuickLink
            title="FAQ"
            icon={<HelpCircle size={20} color="#F97316" />}
            color="#F97316"
            onPress={() => router.push('/faq')}
          />
          <QuickLink
            title="About"
            icon={<Info size={20} color="#EC4899" />}
            color="#EC4899"
            onPress={() => router.push('/about')}
          />
          <QuickLink
            title={t('settings')}
            icon={<Settings size={20} color="#6B7280" />}
            color="#6B7280"
            onPress={() => router.push('/settings')}
          />
        </View>
      </View>

      {/* RCGS Attribution */}
      <View style={styles.attributionSection}>
        <Text style={styles.attributionText}>
          {t('rcgsAttribution')}
        </Text>
        <Text style={styles.attributionSubtext}>
          {t('supportingEducators')}
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
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
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
  progressCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  progressCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  progressCardGradient: {
    padding: 16,
  },
  progressCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCardIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCardTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  progressCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  progressCardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  progressCardStreakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
