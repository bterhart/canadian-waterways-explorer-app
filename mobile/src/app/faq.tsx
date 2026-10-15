// FAQ Screen - Frequently Asked Questions with compact filter design
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
  Search,
  X,
  ChevronDown,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Map,
  Trophy,
  Wrench,
  Shield,
  Users,
  Compass,
  HelpCircle,
} from 'lucide-react-native';

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

// Category configuration with icons and colors
const CATEGORY_CONFIG: Record<string, { icon: typeof BookOpen; color: string }> = {
  'All': { icon: HelpCircle, color: '#6B7280' },
  'Getting Started': { icon: Compass, color: '#3B82F6' },
  'Map & Navigation': { icon: Map, color: '#10B981' },
  'Educational Content': { icon: BookOpen, color: '#8B5CF6' },
  'For Teachers': { icon: GraduationCap, color: '#F59E0B' },
  'For Students': { icon: Users, color: '#EC4899' },
  'Gamification': { icon: Trophy, color: '#EF4444' },
  'Technical': { icon: Wrench, color: '#6B7280' },
  'Privacy & Safety': { icon: Shield, color: '#06B6D4' },
};

const FAQ_DATA: FAQItem[] = [
  // Getting Started
  {
    id: 'free-app',
    question: 'Is this app free to use?',
    answer: 'Yes, the Canadian Interactive Waterways Initiative is completely free for all students, teachers, and educational institutions. There are no in-app purchases, subscriptions, or premium features.',
    category: 'Getting Started',
  },
  {
    id: 'grade-levels',
    question: 'What grade levels is this designed for?',
    answer: 'The app contains content for K-12 students, with specific features and activities tailored to different grade levels (K-3, 4-6, 7-9, 10-12). Teachers can select age-appropriate content for their classrooms.',
    category: 'Getting Started',
  },
  {
    id: 'devices',
    question: 'What devices does the app work on?',
    answer: 'The app is published for iPhone and iPad through the App Store. An Android version is being prepared. Tablets give the best map viewing experience, but the app works well on phones too.',
    category: 'Getting Started',
  },
  {
    id: 'french-support',
    question: 'Is the app available in French?',
    answer: 'Partly. Menus, the main tabs and settings can be shown in French (Settings > Language). Educational content, quizzes, the User Guide and this FAQ are currently in English.',
    category: 'Getting Started',
  },
  {
    id: 'offline-use',
    question: 'Can I use this app offline?',
    answer: 'No. Waterways, locations, quizzes and images are loaded from our servers, so the app needs an internet connection. Screens you have already opened may stay visible for a short time, but nothing new will load without a connection.',
    category: 'Getting Started',
  },
  {
    id: 'get-started',
    question: 'How do I get started?',
    answer: 'Simply open the app and explore! Start with the Map tab to see Canadian waterways, or visit the Learn tab for educational content. No account is required.',
    category: 'Getting Started',
  },

  // Map & Navigation
  {
    id: 'map-markers',
    question: 'What do the different map markers mean?',
    answer: 'Blue markers indicate waterways (rivers, lakes, bays). Red/orange markers show historic locations like forts and trading posts. Tap any marker to see details. The Map Legend in the menu explains all icons.',
    category: 'Map & Navigation',
  },
  {
    id: 'waterway-boundaries',
    question: 'How do I see a waterway\'s full extent?',
    answer: 'Tap on any waterway marker to see its details. The map will automatically zoom to show the full waterway boundary highlighted in blue. This helps visualize the entire river or lake system.',
    category: 'Map & Navigation',
  },
  {
    id: 'nearby-history',
    question: 'How does "What Happened Here?" work?',
    answer: 'This feature uses your location to find historical events nearby. Grant location permission, then browse events by distance. Perfect for field trips! Adjust the search radius (5-100km) to find more or fewer results.',
    category: 'Map & Navigation',
  },
  {
    id: 'my-maps',
    question: 'What can I do with My Maps?',
    answer: 'Create custom annotated maps! Add pins to mark locations, draw routes to trace explorer paths, and add notes anywhere. Save and share your maps with classmates using a share code.',
    category: 'Map & Navigation',
  },
  {
    id: 'explorer-routes',
    question: 'Can I see explorer routes on the map?',
    answer: 'Yes! Use the Explorer filter on the Map tab to highlight the waterways an explorer travelled. You can also use My Maps to draw and compare routes yourself.',
    category: 'Map & Navigation',
  },

  // Educational Content
  {
    id: 'accuracy',
    question: 'How accurate is the historical information?',
    answer: 'All content is based on historical records, archaeological findings, and academic research. We work with historians, archaeologists, and Indigenous communities to ensure accuracy and cultural sensitivity. Sources are cited for key facts.',
    category: 'Educational Content',
  },
  {
    id: 'indigenous-names',
    question: 'How are Indigenous names and terms verified?',
    answer: 'We consult with Indigenous language experts, elders, and communities to ensure proper spellings, pronunciations, and cultural context. When sources disagree, we note variations and cite our references.',
    category: 'Educational Content',
  },
  {
    id: 'curriculum',
    question: 'Is content aligned with provincial curriculum?',
    answer: 'Yes, lesson plans are explicitly aligned with provincial curriculum expectations for Social Studies and Canadian History. Curriculum connections are noted in each lesson plan, addressing learning outcomes across multiple provinces.',
    category: 'Educational Content',
  },
  {
    id: 'regions',
    question: 'Is there content about all regions of Canada?',
    answer: 'Yes! The app includes content from coast to coast to coast: Atlantic Canada, Quebec, Ontario, the Prairies, British Columbia, the Territories, and the Arctic. Coverage is comprehensive with 70 waterways and 100 historic locations.',
    category: 'Educational Content',
  },
  {
    id: 'indigenous-perspectives',
    question: 'Are Indigenous perspectives included?',
    answer: 'Absolutely. The app includes Indigenous place names, Notable Figures highlighting Indigenous leaders, Indigenous perspectives in comparisons, 298 Indigenous language words, traditional stories, and content about Indigenous peoples\' relationships with waterways.',
    category: 'Educational Content',
  },
  {
    id: 'primary-sources',
    question: 'What are Primary Source Documents?',
    answer: 'These are actual historical documents - letters, journal entries, maps, and records from explorers and traders. Each includes the original text, transcription, vocabulary help, and grade-appropriate annotations.',
    category: 'Educational Content',
  },
  {
    id: 'deep-dives',
    question: 'What are Deep Dives?',
    answer: 'Deep Dives are in-depth educational content modules that explore specific topics like "The Voyageur Life" or "Women of the Fur Trade." They include learning objectives, activities, discussion questions, and curriculum connections.',
    category: 'Educational Content',
  },
  {
    id: 'updates',
    question: 'How often is new content added?',
    answer: 'Content, quizzes and field trips are added over time through app updates. Contributions submitted in the app are reviewed by administrators before they appear.',
    category: 'Educational Content',
  },

  // For Teachers
  {
    id: 'teacher-account',
    question: 'How do I apply for teacher access?',
    answer: 'Go to Learn > Teacher Portal, tap "Create an Account," and fill out the registration form with your name, email, password, and optional school information. Your account will be created with "pending" status. An administrator will review and approve your application (typically 1-2 business days). Once approved, you can sign in and access all teacher features.',
    category: 'For Teachers',
  },
  {
    id: 'teacher-approval-time',
    question: 'How long does teacher approval take?',
    answer: 'Teacher account approval typically takes 1-2 business days. An administrator will review your application and approve or reject it. You\'ll be able to sign in once approved.',
    category: 'For Teachers',
  },
  {
    id: 'teacher-pending-status',
    question: 'What does "pending" status mean for my teacher account?',
    answer: 'When you register, your account is created with "pending" status. This means an administrator needs to review and approve your application before you can access teacher features. You cannot sign in until approved.',
    category: 'For Teachers',
  },
  {
    id: 'student-accounts',
    question: 'Do students need accounts?',
    answer: 'No. Students never create accounts. Progress, points, achievements and journal entries are tied to the device, so no email or password is needed. To receive a teacher\'s assignments, a student joins the class from Learn > My Class with the class join code.',
    category: 'For Teachers',
  },
  {
    id: 'track-progress',
    question: 'How do I track student progress?',
    answer: 'Create classes in the Teacher Portal and share the join code with students. You\'ll see their quiz scores, assignment completion, and engagement through your Teacher Dashboard.',
    category: 'For Teachers',
  },
  {
    id: 'create-quizzes',
    question: 'Can I create my own quizzes?',
    answer: 'Quizzes are created and edited by administrators to keep them accurate and consistent. If you would like a quiz added, email education@canadianwaterways.ca with the topic and grade level.',
    category: 'For Teachers',
  },
  {
    id: 'modify-lessons',
    question: 'Can I modify lesson plans?',
    answer: 'You can view and print lesson plans, then adapt them offline for your classroom. While you can\'t edit them in the app, you\'re encouraged to modify them for your teaching style and student needs.',
    category: 'For Teachers',
  },
  {
    id: 'class-codes',
    question: 'How do class join codes work?',
    answer: 'Each class gets a unique 6-character code when you create it. Share it with students; they enter it under Learn > My Class, along with a display name, to join your class.',
    category: 'For Teachers',
  },
  {
    id: 'assign-content',
    question: 'What content can I assign to students?',
    answer: 'You can assign quizzes, lesson plans, and virtual field trips. Set due dates and instructions for each assignment. Track completion through your dashboard.',
    category: 'For Teachers',
  },
  {
    id: 'printables',
    question: 'Are there printable resources?',
    answer: 'Yes! The Printable Resources section under Learn includes worksheets, maps, vocabulary builders, and activity sheets. Teacher notes and answer keys are included where provided.',
    category: 'For Teachers',
  },

  // For Students
  {
    id: 'join-class',
    question: 'How do I join my teacher\'s class?',
    answer: 'Ask your teacher for the class join code. Go to Learn > My Class, enter the code and your display name. You\'ll then see assignments from your teacher, and each one is marked complete when you finish it.',
    category: 'For Students',
  },
  {
    id: 'retake-quiz',
    question: 'Can I retake a quiz?',
    answer: 'Yes! You can retake quizzes as many times as you like to improve your score. Practice makes perfect, and each attempt helps reinforce learning.',
    category: 'For Students',
  },
  {
    id: 'journal-private',
    question: 'Who can see my journal?',
    answer: 'Your journal is private. Entries are tied to your device and are not shown to teachers, classmates or anyone else in the app.',
    category: 'For Students',
  },
  {
    id: 'pronunciation-help',
    question: 'How do I learn to pronounce Indigenous words?',
    answer: 'The Pronunciation Guide in the Learn tab provides phonetic spellings for Indigenous place names, nation names, and fur trade terms. Entries that include a recording have a play button.',
    category: 'For Students',
  },

  // Gamification
  {
    id: 'earn-points',
    question: 'How do I earn points?',
    answer: 'Earn points by completing quizzes (10 to 20 points depending on your score), Deep Dive lessons (15), virtual field trips (20) and journal entries (5), plus bonus points for the daily challenge when one is scheduled.',
    category: 'Gamification',
  },
  {
    id: 'ranks',
    question: 'What are the explorer ranks?',
    answer: 'There are 7 ranks: Apprentice Voyageur (0-100 points), Junior Explorer (101-300), Fur Trade Clerk (301-600), Seasoned Voyageur (601-1,000), Fort Factor (1,001-1,500), Chief Trader (1,501-2,500) and Master Explorer (2,501+).',
    category: 'Gamification',
  },
  {
    id: 'achievements',
    question: 'How do achievements work?',
    answer: 'Achievements are badges for specific accomplishments: exploring waterways and locations (First Steps, Waterway Wanderer, Fort Finder), quizzes (Quiz Beginner through History Scholar), journal writing (First Entry to Master Chronicler), Indigenous words (First Words to Polyglot), documents (Document Detective), points (Point Collector) and streaks (Consistent Explorer to Unstoppable). The Achievements screen lists all 28.',
    category: 'Gamification',
  },
  {
    id: 'daily-challenges',
    question: 'What are daily challenges?',
    answer: 'When a challenge is scheduled for the day, it appears on the Achievements screen. Answer correctly to earn bonus points. Challenges cover various topics from Canadian history; there is not one every day.',
    category: 'Gamification',
  },
  {
    id: 'daily-streaks',
    question: 'How do daily streaks work?',
    answer: 'Use the app and complete at least one activity on consecutive days to build your streak. If you miss a day, your streak resets. Longer streaks earn bonus achievements!',
    category: 'Gamification',
  },
  {
    id: 'reset-progress',
    question: 'Can I reset my progress?',
    answer: 'There is no reset button. Progress is tied to the app installation on the device, so deleting and reinstalling the app starts fresh. To have stored progress removed from our servers, email support@canadianwaterways.ca.',
    category: 'Gamification',
  },
  {
    id: 'leaderboard',
    question: 'Is there a leaderboard?',
    answer: 'Not at the moment. The app does not rank students against each other anywhere.',
    category: 'Gamification',
  },

  // Admin Access
  {
    id: 'admin-access',
    question: 'How do I apply for admin access?',
    answer: 'Go to the Admin tab and tap "Request Access." Fill out the registration form with your name, email, organization (optional), and password. Your account will be created with "pending" status. A Super Admin will review your request. Once approved, you can sign in and manage educational content.',
    category: 'Technical',
  },
  {
    id: 'admin-approval-process',
    question: 'How does admin approval work?',
    answer: 'When you request admin access, your account is created with "pending" status. A Super Admin reviews your application and either approves or rejects it. If approved, you\'ll be able to sign in as a moderator. Super Admins can later grant additional permissions if needed.',
    category: 'Technical',
  },
  {
    id: 'super-admin-approve',
    question: 'How do Super Admins approve teacher and admin requests?',
    answer: 'Super Admins sign in to the Admin tab, then access "Pending Teacher Approvals" or "Pending Admin Approvals" from the dashboard. They can review each request and approve or reject it, and later suspend or reactivate an account. Rejections and suspensions require a reason (minimum 10 characters).',
    category: 'Technical',
  },

  // Technical
  {
    id: 'location-not-working',
    question: 'Why isn\'t my location working?',
    answer: 'Check that location permissions are enabled for the app in your device settings. Go to Settings > Privacy > Location Services and ensure the app is set to "While Using App."',
    category: 'Technical',
  },
  {
    id: 'map-not-loading',
    question: 'The map isn\'t loading. What should I do?',
    answer: 'Check your internet connection first. If connected, close and reopen the app, and check the App Store for an update.',
    category: 'Technical',
  },
  {
    id: 'app-slow',
    question: 'The app is running slowly. How can I fix it?',
    answer: 'Try closing other apps running in the background. Ensure you have the latest app version. If the issue persists, try restarting your device.',
    category: 'Technical',
  },
  {
    id: 'report-bug',
    question: 'How do I report a bug?',
    answer: 'Email support@canadianwaterways.ca with details: device type, operating system version, and what you were doing when the problem occurred.',
    category: 'Technical',
  },
  {
    id: 'suggest-features',
    question: 'Can I suggest new features?',
    answer: 'Absolutely! We welcome suggestions. Email education@canadianwaterways.ca with your ideas. Many features come from user suggestions.',
    category: 'Technical',
  },
  {
    id: 'content-error',
    question: 'I found an error in the content. How do I report it?',
    answer: 'Please email support@canadianwaterways.ca. Include the specific content (waterway name, quiz question, etc.) and describe the error. We take accuracy seriously.',
    category: 'Technical',
  },

  // Privacy & Safety
  {
    id: 'student-data',
    question: 'What information is collected about students?',
    answer: 'We collect minimal data: device ID for progress tracking (not personally identifiable), optional display name if joining a class, and location only when using "What Happened Here?" (with permission). We do not collect email, phone, or personal info from students.',
    category: 'Privacy & Safety',
  },
  {
    id: 'data-safe',
    question: 'Is student data safe?',
    answer: 'Student records hold no names beyond an optional display name and no contact details. Data travels over encrypted connections, is not sold or shared with third parties, and teachers can only see students in their own classes.',
    category: 'Privacy & Safety',
  },
  {
    id: 'no-communication',
    question: 'Can students communicate with each other?',
    answer: 'No. There are no messaging, chat, or social features. Students can only share custom maps using anonymous share codes. Student safety is a top priority.',
    category: 'Privacy & Safety',
  },
  {
    id: 'ads',
    question: 'Are there ads in the app?',
    answer: 'No. The app is completely ad-free and will remain ad-free. It\'s a purely educational, self-financed project.',
    category: 'Privacy & Safety',
  },
  {
    id: 'delete-data',
    question: 'Can I delete my data?',
    answer: 'Yes. Email support@canadianwaterways.ca to request deletion of stored progress, journal entries or class membership. Deleting the app from the device also removes the device identity, so a reinstall starts fresh.',
    category: 'Privacy & Safety',
  },
  {
    id: 'parental-consent',
    question: 'Is parental consent required?',
    answer: 'The app can be used without any account or personal information. If a student joins a class with a display name, schools typically handle consent as part of their ed-tech policies.',
    category: 'Privacy & Safety',
  },
];

const CATEGORIES = Object.keys(CATEGORY_CONFIG);

export default function FAQScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredFAQs = useMemo(() => {
    let filtered = FAQ_DATA;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

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

  const getCategoryCount = (category: string) => {
    if (category === 'All') return FAQ_DATA.length;
    return FAQ_DATA.filter(item => item.category === category).length;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'FAQ',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      {/* Compact Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={16} color="#9CA3AF" />
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
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={16} color="#9CA3AF" />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Compact Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {CATEGORIES.map((category) => {
          const config = CATEGORY_CONFIG[category];
          const Icon = config.icon;
          const isSelected = selectedCategory === category;
          const count = getCategoryCount(category);

          return (
            <Pressable
              key={category}
              style={[
                styles.categoryPill,
                isSelected && { backgroundColor: config.color },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Icon
                size={14}
                color={isSelected ? 'white' : config.color}
              />
              <Text
                style={[
                  styles.categoryPillText,
                  isSelected && styles.categoryPillTextActive,
                ]}
                numberOfLines={1}
              >
                {category === 'All' ? 'All' : category}
              </Text>
              <View style={[
                styles.categoryCount,
                isSelected && styles.categoryCountActive,
              ]}>
                <Text style={[
                  styles.categoryCountText,
                  isSelected && styles.categoryCountTextActive,
                ]}>
                  {count}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Results Count Bar */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
        </Text>
        {(searchQuery || selectedCategory !== 'All') ? (
          <Pressable
            onPress={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            <Text style={styles.clearFilters}>Clear filters</Text>
          </Pressable>
        ) : null}
      </View>

      {/* FAQ List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredFAQs.map((item) => {
          const isExpanded = expandedItems.has(item.id);
          const categoryConfig = CATEGORY_CONFIG[item.category];

          return (
            <Pressable
              key={item.id}
              style={styles.faqItem}
              onPress={() => toggleItem(item.id)}
            >
              <View style={styles.faqHeader}>
                <View style={styles.faqLeft}>
                  {isExpanded ? (
                    <ChevronDown size={18} color={colors.forestGreen} />
                  ) : (
                    <ChevronRight size={18} color="#9CA3AF" />
                  )}
                  <Text style={[
                    styles.faqQuestion,
                    isExpanded && styles.faqQuestionExpanded,
                  ]}>
                    {item.question}
                  </Text>
                </View>
                <View style={[
                  styles.categoryDot,
                  { backgroundColor: categoryConfig?.color || '#6B7280' },
                ]} />
              </View>

              {isExpanded ? (
                <View style={styles.faqAnswer}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                  <View style={styles.categoryTag}>
                    <Text style={[
                      styles.categoryTagText,
                      { color: categoryConfig?.color || '#6B7280' },
                    ]}>
                      {item.category}
                    </Text>
                  </View>
                </View>
              ) : null}
            </Pressable>
          );
        })}

        {filteredFAQs.length === 0 && (
          <View style={styles.emptyState}>
            <Search size={40} color="#D1D5DB" />
            <Text style={styles.emptyText}>No questions found</Text>
            <Text style={styles.emptySubtext}>
              Try different keywords or clear filters
            </Text>
          </View>
        )}

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
  searchSection: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    padding: 0,
  },
  categoryScroll: {
    backgroundColor: 'white',
    maxHeight: 48,
  },
  categoryContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  categoryPillTextActive: {
    color: 'white',
  },
  categoryCount: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  categoryCountActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  categoryCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryCountTextActive: {
    color: 'white',
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsText: {
    fontSize: 13,
    color: '#6B7280',
  },
  clearFilters: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.forestGreen,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    gap: 8,
  },
  faqItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    gap: 8,
  },
  faqLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 8,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    lineHeight: 20,
  },
  faqQuestionExpanded: {
    fontWeight: '600',
    color: colors.darkGreen,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  faqAnswer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingLeft: 38,
    backgroundColor: '#FAFAFA',
  },
  answerText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 21,
  },
  categoryTag: {
    marginTop: 8,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  bottomSpacer: {
    height: 24,
  },
});
