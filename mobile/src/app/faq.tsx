// FAQ Screen - Frequently Asked Questions with accordion interface
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  HelpCircle,
  Search,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react-native';
import { useTranslation } from '@/lib/i18n';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  // General
  {
    id: 'free-app',
    question: 'Is this app free to use?',
    answer:
      'Yes, the Canadian Interactive Waterways Initiative is free for all students, teachers, and educational institutions. There are no in-app purchases or premium features.',
    category: 'General',
  },
  {
    id: 'grade-levels',
    question: 'What grade levels is this designed for?',
    answer:
      'The app contains content for K-12 students, with specific features and activities tailored to different grade levels (K-3, 4-6, 7-9, 10-12). Teachers can select age-appropriate content.',
    category: 'General',
  },
  {
    id: 'offline-use',
    question: 'Can I use this app offline?',
    answer:
      'Basic map features and previously viewed content work with limited connectivity. However, full functionality (quizzes, videos, images, new content) requires an internet connection. We recommend downloading key content before field trips if connectivity may be limited.',
    category: 'General',
  },
  {
    id: 'french-support',
    question: 'Is the app available in French?',
    answer:
      'Yes! The entire app is available in both English and French. Switch languages in Settings. Perfect for French immersion classrooms and Francophone Canada.',
    category: 'General',
  },
  {
    id: 'devices',
    question: 'What devices does the app work on?',
    answer:
      'The app works on iOS devices (iPhone, iPad), Android devices, and web browsers. It\'s optimized for tablets for the best map viewing experience.',
    category: 'General',
  },

  // Educational Content
  {
    id: 'accuracy',
    question: 'How accurate is the historical information?',
    answer:
      'All content is based on historical records, archaeological findings, and academic research. We work with historians, archaeologists, and Indigenous communities to ensure accuracy and cultural sensitivity. Sources are cited for key facts.',
    category: 'Educational Content',
  },
  {
    id: 'indigenous-names',
    question: 'How are Indigenous names and terms verified?',
    answer:
      'We consult with Indigenous language experts, elders, and communities to ensure proper spellings, pronunciations, and cultural context. When Indigenous language sources disagree, we note variations and cite our sources.',
    category: 'Educational Content',
  },
  {
    id: 'curriculum',
    question: 'Can I use this app to meet curriculum requirements?',
    answer:
      'Yes, lesson plans are explicitly aligned with provincial curriculum expectations for Social Studies and Canadian History. Curriculum connections are noted in each lesson plan. The app addresses learning outcomes across multiple provinces.',
    category: 'Educational Content',
  },
  {
    id: 'regions',
    question: 'Is there content about all regions of Canada?',
    answer:
      'The app includes content from coast to coast to coast, with waterways, locations, and explorers from Atlantic Canada, Quebec, Ontario, the Prairies, British Columbia, the Territories, and the Arctic. Coverage is comprehensive but not exhaustive.',
    category: 'Educational Content',
  },
  {
    id: 'updates',
    question: 'How often is new content added?',
    answer:
      'We update the app regularly (typically quarterly) with new lesson plans, quizzes, field trips, and approved community contributions. Check the app for "New" badges on recently added content.',
    category: 'Educational Content',
  },
  {
    id: 'indigenous-perspectives',
    question: 'Are Indigenous perspectives included?',
    answer:
      'Yes, this is a core priority. The app includes Indigenous place names, Notable Figures highlighting Indigenous leaders, Indigenous perspectives in comparisons, 298 Indigenous language words, traditional stories, and content about Indigenous peoples\' relationships with waterways throughout history.',
    category: 'Educational Content',
  },

  // For Teachers
  {
    id: 'student-accounts',
    question: 'Do students need accounts to use the app?',
    answer:
      'No! Students can explore all map features, quizzes, and educational content without creating an account. Accounts are optional and only needed if students want to save progress, write journals, or join a teacher\'s class.',
    category: 'For Teachers',
  },
  {
    id: 'track-progress',
    question: 'How do I track student progress?',
    answer:
      'Create a teacher account, set up your classes, and have students join using a class code. You can then track quiz completion, scores, and engagement through the Teacher Dashboard.',
    category: 'For Teachers',
  },
  {
    id: 'create-quizzes',
    question: 'Can I create my own quizzes?',
    answer:
      'Currently, quiz creation is limited to admins to ensure quality and accuracy. However, you can suggest quiz topics and questions through the feedback form, and our team will review them for inclusion.',
    category: 'For Teachers',
  },
  {
    id: 'modify-lessons',
    question: 'Can I modify lesson plans?',
    answer:
      'You can view and print lesson plans, then modify them for your classroom offline. You cannot edit them within the app, but you\'re welcome to adapt them to your teaching style and student needs.',
    category: 'For Teachers',
  },
  {
    id: 'teacher-guide',
    question: 'Is there a teacher\'s guide available?',
    answer:
      'The User Guide serves as the comprehensive teacher\'s guide. Additional resources, including video tutorials and best practices, are available on our website.',
    category: 'For Teachers',
  },

  // Gamification
  {
    id: 'account-required',
    question: 'Do I need to create an account to earn points and badges?',
    answer:
      'No account is needed. Progress is automatically tracked using your device. Your progress will be saved on the device you\'re using. If you use multiple devices, progress won\'t sync (unless you create an optional account in a future update).',
    category: 'Gamification',
  },
  {
    id: 'reset-progress',
    question: 'Can I reset my progress and start over?',
    answer:
      'Yes, in Settings you can reset your progress if you want to start fresh or if multiple students are sharing a device.',
    category: 'Gamification',
  },
  {
    id: 'master-explorer',
    question: 'What happens when I reach Master Explorer rank?',
    answer:
      'You can continue earning points, badges, and achievements. We celebrate lifelong learning! There\'s always more to discover about Canadian history.',
    category: 'Gamification',
  },
  {
    id: 'daily-streaks',
    question: 'How do daily streaks work?',
    answer:
      'Use the app for at least 5 minutes on consecutive days to build your streak. If you miss a day, your streak resets. Complete the daily challenge to ensure your streak is counted.',
    category: 'Gamification',
  },

  // Technical
  {
    id: 'location-not-working',
    question: 'Why isn\'t my location working for "What Happened Here?"',
    answer:
      'Make sure you\'ve granted location permissions to the app in your device settings. Go to Settings > Privacy > Location Services and ensure the app is set to "While Using App" or "Always."',
    category: 'Technical',
  },
  {
    id: 'map-not-loading',
    question: 'The map isn\'t loading. What should I do?',
    answer:
      'Check your internet connection. If connected and still having issues, try closing and reopening the app. If problems persist, check for app updates in your app store.',
    category: 'Technical',
  },
  {
    id: 'report-bug',
    question: 'How do I report a bug or issue?',
    answer:
      'Use the "Feedback" option in the app menu, or contact support@waterways.edu with details about the issue (device type, iOS/Android version, what you were doing when the problem occurred).',
    category: 'Technical',
  },
  {
    id: 'suggest-features',
    question: 'Can I suggest new features or content?',
    answer:
      'Absolutely! We welcome suggestions. Use the Feedback form in the app or email education@waterways.edu with your ideas.',
    category: 'Technical',
  },

  // Privacy
  {
    id: 'student-data',
    question: 'What information is collected about students?',
    answer:
      'We collect minimal data: device ID for progress tracking (not personally identifiable), optional display name if joining a class, and location only when using "What Happened Here?" (and only when you grant permission). We do not collect email addresses, phone numbers, or other personal information from students.',
    category: 'Privacy',
  },
  {
    id: 'data-safe',
    question: 'Is student data safe?',
    answer:
      'Yes. We follow educational data privacy standards including FERPA and COPPA compliance. Student data is encrypted, stored securely, and never shared with third parties. Teachers can only see their own students\' progress.',
    category: 'Privacy',
  },
  {
    id: 'student-communication',
    question: 'Can students communicate with each other through the app?',
    answer:
      'No. There are no messaging, chat, or social features. Students can only share custom maps using anonymous share codes. Safety is a top priority.',
    category: 'Privacy',
  },
  {
    id: 'journal-privacy',
    question: 'Who can see student journal entries?',
    answer:
      'Journal entries are private by default. Students can choose to share specific entries with their teacher if enrolled in a class. Teachers cannot access journals unless explicitly shared.',
    category: 'Privacy',
  },
  {
    id: 'ads',
    question: 'Are there ads in the app?',
    answer:
      'No. The app is ad-free and will remain ad-free. It\'s a purely educational tool funded by educational grants and partnerships.',
    category: 'Privacy',
  },
];

const CATEGORIES = [
  'All',
  'General',
  'Educational Content',
  'For Teachers',
  'Gamification',
  'Technical',
  'Privacy',
];

export default function FAQScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredFAQs = useMemo(() => {
    let filtered = FAQ_DATA;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'FAQ',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search questions..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery ? (
            <Pressable onPress={clearSearch}>
              <X size={18} color="#9CA3AF" />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {CATEGORIES.map((category) => (
          <Pressable
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* FAQ List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <HelpCircle size={32} color={colors.forestGreen} />
          </View>
          <Text style={styles.heroTitle}>Frequently Asked Questions</Text>
          <Text style={styles.heroSubtitle}>
            Find answers to common questions about using the app
          </Text>
        </View>

        {/* Results Info */}
        {searchQuery || selectedCategory !== 'All' ? (
          <View style={styles.resultsInfo}>
            <Text style={styles.resultsText}>
              Showing {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
            </Text>
          </View>
        ) : null}

        {/* FAQ Items */}
        {filteredFAQs.map((item) => {
          const isExpanded = expandedItems.has(item.id);

          return (
            <View key={item.id} style={styles.faqItem}>
              <Pressable
                style={styles.faqHeader}
                onPress={() => toggleItem(item.id)}
              >
                <View style={styles.faqHeaderContent}>
                  <View style={styles.faqIconContainer}>
                    {isExpanded ? (
                      <ChevronDown size={20} color={colors.forestGreen} />
                    ) : (
                      <ChevronRight size={20} color="#9CA3AF" />
                    )}
                  </View>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{item.category}</Text>
                </View>
              </Pressable>

              {isExpanded ? (
                <View style={styles.faqAnswer}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              ) : null}
            </View>
          );
        })}

        {filteredFAQs.length === 0 ? (
          <View style={styles.emptyState}>
            <Search size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No questions found</Text>
            <Text style={styles.emptySubtext}>
              Try searching for different keywords or changing the category
            </Text>
          </View>
        ) : null}

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
  searchContainer: {
    backgroundColor: 'white',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  categoryScroll: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: colors.forestGreen,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hero: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  resultsInfo: {
    backgroundColor: colors.forestGreen + '10',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  resultsText: {
    fontSize: 14,
    color: colors.forestGreen,
    fontWeight: '600',
  },
  faqItem: {
    backgroundColor: 'white',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  faqHeader: {
    padding: 16,
  },
  faqHeaderContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  faqIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGreen,
    lineHeight: 22,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 32,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 48,
    backgroundColor: '#FAFAFA',
  },
  answerText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  bottomSpacer: {
    height: 32,
  },
});
