// Settings Screen
import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Globe, Info, ChevronRight, Settings as SettingsIcon, BookOpen, HelpCircle, Play } from 'lucide-react-native';
import { useTranslation } from '@/lib/i18n';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  iconBgColor: string;
}

function SettingsItem({ icon, title, subtitle, onPress, iconBgColor }: SettingsItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingsItem,
        pressed && styles.settingsItemPressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        {icon}
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle ? <Text style={styles.itemSubtitle}>{subtitle}</Text> : null}
      </View>
      <ChevronRight size={20} color="#9CA3AF" />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { t, language } = useTranslation();

  const currentLanguageName = language === 'fr' ? 'Francais' : 'English';

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t('settingsTitle'),
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <SettingsIcon size={32} color={colors.forestGreen} />
          </View>
          <Text style={styles.headerTitle}>{t('settingsTitle')}</Text>
        </View>

        {/* Settings Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={<BookOpen size={22} color="white" />}
              title="User Guide"
              subtitle="Complete guide to using the app"
              onPress={() => router.push('../user-guide')}
              iconBgColor="#2D5A3D"
            />
            <SettingsItem
              icon={<HelpCircle size={22} color="white" />}
              title="FAQ"
              subtitle="Frequently asked questions"
              onPress={() => router.push('../faq')}
              iconBgColor="#8B5CF6"
            />
            <SettingsItem
              icon={<Play size={22} color="white" />}
              title="Tutorial"
              subtitle="Replay the onboarding tutorial"
              onPress={() => router.push('/onboarding')}
              iconBgColor="#10B981"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('language')}</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={<Globe size={22} color="white" />}
              title={t('languageSettings')}
              subtitle={currentLanguageName}
              onPress={() => router.push('./language')}
              iconBgColor="#3B82F6"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about')}</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={<Info size={22} color="white" />}
              title={t('aboutApp')}
              subtitle="Credits, acknowledgments, and contact"
              onPress={() => router.push('../about')}
              iconBgColor="#F97316"
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Canadian Interactive Waterways Initiative
          </Text>
          <Text style={styles.footerSubtext}>
            {language === 'fr'
              ? 'Initiative canadienne des voies navigables interactives'
              : 'Part of the Royal Canadian Geographic Society'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingLeft: 4,
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsItemPressed: {
    backgroundColor: '#F9FAFB',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  aboutCard: {
    padding: 16,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  aboutInfo: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
});
