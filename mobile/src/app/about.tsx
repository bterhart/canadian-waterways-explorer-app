// About Screen - App information, credits, and land acknowledgment
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  Info,
  Heart,
  Mail,
  Globe,
  ExternalLink,
  Users,
  Award,
  Leaf,
} from 'lucide-react-native';
import { useTranslation } from '@/lib/i18n';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

interface ContactItemProps {
  label: string;
  email: string;
  icon: React.ReactNode;
}

function ContactItem({ label, email, icon }: ContactItemProps) {
  return (
    <Pressable
      style={styles.contactItem}
      onPress={() => Linking.openURL(`mailto:${email}`)}
    >
      <View style={styles.contactIcon}>{icon}</View>
      <View style={styles.contactContent}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactEmail}>{email}</Text>
      </View>
      <ExternalLink size={16} color="#9CA3AF" />
    </Pressable>
  );
}

export default function AboutScreen() {
  const { t, language } = useTranslation();

  const handleWebsitePress = () => {
    Linking.openURL('https://www.canadianwaterways.edu');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: language === 'fr' ? 'À Propos' : 'About',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* App Info Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Info size={40} color={colors.forestGreen} />
          </View>
          <Text style={styles.appName}>
            Canadian Interactive
            {'\n'}
            Waterways Initiative
          </Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
          <Text style={styles.versionDate}>February 2026</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>
            An immersive educational app that brings Canada's waterways, Indigenous
            heritage, and exploration history to life. Designed for students, teachers,
            and educational professionals from coast to coast to coast.
          </Text>
        </View>

        {/* Land Acknowledgment */}
        <Section
          title={language === 'fr' ? 'Reconnaissance des Terres' : 'Land Acknowledgment'}
          icon={<Leaf size={22} color={colors.forestGreen} />}
        >
          <View style={styles.landAcknowledgment}>
            <Text style={styles.landAcknowledgmentText}>
              We acknowledge that the waterways featured in this app flow through the
              traditional territories of diverse Indigenous peoples across what is now
              called Canada. These waterways have been traveled, named, and stewarded by
              Indigenous peoples for thousands of years before European contact.
              {'\n\n'}
              We are grateful to be able to share these stories and histories, and we
              commit to ongoing learning, consultation, and respectful representation of
              Indigenous peoples, cultures, and knowledge.
            </Text>
          </View>
        </Section>

        {/* Partners */}
        <Section
          title={language === 'fr' ? 'Partenaires' : 'Partners & Credits'}
          icon={<Users size={22} color={colors.forestGreen} />}
        >
          <View style={styles.partnerCard}>
            <View style={styles.partnerHeader}>
              <Award size={20} color={colors.forestGreen} />
              <Text style={styles.partnerName}>
                Royal Canadian Geographical Society
              </Text>
            </View>
            <Text style={styles.partnerDescription}>
              Educational content, quizzes, and curriculum resources
            </Text>
          </View>

          <View style={styles.creditsList}>
            <Text style={styles.creditItem}>
              • Indigenous Education Consultants - Cultural accuracy and Indigenous
              perspectives
            </Text>
            <Text style={styles.creditItem}>
              • Historians and Archaeologists - Historical accuracy and content
              verification
            </Text>
            <Text style={styles.creditItem}>
              • Teachers and Educators - Lesson plans and classroom testing
            </Text>
            <Text style={styles.creditItem}>
              • Students - Feedback and user testing
            </Text>
            <Text style={styles.creditItem}>
              • Indigenous Communities - Language verification, traditional knowledge, and
              ongoing consultation
            </Text>
          </View>
        </Section>

        {/* Funding */}
        <Section
          title={language === 'fr' ? 'Financement' : 'Funding'}
          icon={<Heart size={22} color={colors.forestGreen} />}
        >
          <Text style={styles.fundingText}>
            This project is made possible through grants from educational foundations and
            partnerships with museums, heritage organizations, and educational
            institutions across Canada.
          </Text>
        </Section>

        {/* Contact Information */}
        <Section
          title={language === 'fr' ? 'Nous Contacter' : 'Contact Information'}
          icon={<Mail size={22} color={colors.forestGreen} />}
        >
          <ContactItem
            label="Technical Support"
            email="support@waterways.edu"
            icon={<Info size={18} color={colors.forestGreen} />}
          />
          <ContactItem
            label="Educational Questions"
            email="education@waterways.edu"
            icon={<Award size={18} color={colors.forestGreen} />}
          />
          <ContactItem
            label="Indigenous Content"
            email="indigenous@waterways.edu"
            icon={<Users size={18} color={colors.forestGreen} />}
          />
          <ContactItem
            label="General Inquiries"
            email="info@waterways.edu"
            icon={<Mail size={18} color={colors.forestGreen} />}
          />
        </Section>

        {/* Website */}
        <Pressable style={styles.websiteCard} onPress={handleWebsitePress}>
          <View style={styles.websiteIcon}>
            <Globe size={24} color={colors.forestGreen} />
          </View>
          <View style={styles.websiteContent}>
            <Text style={styles.websiteLabel}>Visit Our Website</Text>
            <Text style={styles.websiteUrl}>www.canadianwaterways.edu</Text>
          </View>
          <ExternalLink size={20} color={colors.forestGreen} />
        </Pressable>

        {/* Legal & Open Source */}
        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>Open Source & Licenses</Text>
          <Text style={styles.legalText}>
            This app uses open-source software and educational resources. For a complete
            list of licenses and attributions, please visit our website.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with {language === 'fr' ? 'amour' : 'love'} for Canadian education
          </Text>
          <Text style={styles.footerCopyright}>
            © 2026 Canadian Interactive Waterways Initiative
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
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
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: 'white',
    padding: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.darkGreen,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 16,
  },
  versionBadge: {
    backgroundColor: colors.forestGreen + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.forestGreen,
  },
  versionDate: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  descriptionCard: {
    backgroundColor: 'white',
    marginTop: 12,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 12,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  landAcknowledgment: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.forestGreen,
  },
  landAcknowledgmentText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  partnerCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  partnerDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  creditsList: {
    gap: 12,
  },
  creditItem: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  fundingText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  contactEmail: {
    fontSize: 13,
    color: '#3B82F6',
    marginTop: 2,
  },
  websiteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 12,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  websiteIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  websiteContent: {
    flex: 1,
  },
  websiteLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  websiteUrl: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 2,
  },
  legalSection: {
    marginTop: 12,
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  legalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  legalText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  footer: {
    marginTop: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 8,
  },
  footerCopyright: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 32,
  },
});
