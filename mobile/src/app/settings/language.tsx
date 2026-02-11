// Language Settings Screen
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Check, Globe } from 'lucide-react-native';
import { useTranslation, Language, languageNames, availableLanguages, TranslationKey } from '@/lib/i18n';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

interface LanguageOptionProps {
  lang: Language;
  isSelected: boolean;
  onSelect: () => void;
  t: (key: TranslationKey) => string;
}

function LanguageOption({ lang, isSelected, onSelect, t }: LanguageOptionProps) {
  const langInfo = languageNames[lang];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.languageOption,
        isSelected && styles.languageOptionSelected,
        pressed && styles.languageOptionPressed,
      ]}
      onPress={onSelect}
    >
      <View style={styles.languageInfo}>
        <Text style={[styles.languageNative, isSelected && styles.textSelected]}>
          {langInfo.native}
        </Text>
        <Text style={styles.languageEnglish}>
          {lang === 'en' ? t('english') : t('french')}
        </Text>
      </View>
      {isSelected ? (
        <View style={styles.checkContainer}>
          <Check size={20} color={colors.forestGreen} strokeWidth={3} />
        </View>
      ) : null}
    </Pressable>
  );
}

export default function LanguageSettingsScreen() {
  const { language, setLanguage, t } = useTranslation();

  const handleLanguageSelect = async (lang: Language) => {
    await setLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t('languageSettings'),
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Globe size={32} color={colors.forestGreen} />
        </View>
        <Text style={styles.headerTitle}>{t('selectLanguage')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('currentLanguage')}: {languageNames[language].native}
        </Text>
      </View>

      {/* Language Options */}
      <View style={styles.optionsContainer}>
        {availableLanguages.map((lang) => (
          <LanguageOption
            key={lang}
            lang={lang}
            isSelected={language === lang}
            onSelect={() => handleLanguageSelect(lang)}
            t={t}
          />
        ))}
      </View>

      {/* Preview Section */}
      <View style={styles.previewSection}>
        <Text style={styles.previewTitle}>{t('language')} Preview</Text>
        <View style={styles.previewCard}>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>{t('map')}</Text>
            <Text style={styles.previewLabel}>{t('learn')}</Text>
            <Text style={styles.previewLabel}>{t('quizzes')}</Text>
          </View>
          <View style={styles.previewDivider} />
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>{t('lessonPlans')}</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>{t('timeline')}</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>{t('teacherPortal')}</Text>
          </View>
        </View>
      </View>

      {/* Info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          {language === 'fr'
            ? 'Cette application prend en charge les deux langues officielles du Canada.'
            : 'This app supports both official languages of Canada.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  iconContainer: {
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  optionsContainer: {
    padding: 16,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  languageOptionSelected: {
    borderColor: colors.forestGreen,
    backgroundColor: colors.forestGreen + '08',
  },
  languageOptionPressed: {
    opacity: 0.9,
  },
  languageInfo: {
    flex: 1,
  },
  languageNative: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkGreen,
    marginBottom: 2,
  },
  languageEnglish: {
    fontSize: 14,
    color: '#6B7280',
  },
  textSelected: {
    color: colors.forestGreen,
  },
  checkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.forestGreen + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewSection: {
    padding: 16,
    paddingTop: 8,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  previewLabel: {
    fontSize: 15,
    color: colors.darkGreen,
    fontWeight: '500',
  },
  previewDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  infoSection: {
    padding: 16,
    paddingTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});
