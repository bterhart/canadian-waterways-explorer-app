// User Guide Screen - Displays comprehensive user guide from user_guide.md
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  BookOpen,
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

// Parse user guide content into sections
interface Section {
  id: string;
  title: string;
  content: string;
  level: number;
}

const USER_GUIDE_CONTENT = `# Canadian Interactive Waterways Initiative
## User Guide for Educators and Students

Welcome to the Canadian Interactive Waterways Initiative - an immersive educational app that brings Canada's waterways, Indigenous heritage, and exploration history to life.

## Getting Started

When you open the app, you'll see tabs at the bottom:
- Map - Interactive map of Canada's waterways and historic locations
- Explorers - Profiles of the explorers who travelled these waterways
- Quizzes - Test your knowledge by topic and grade level
- Learn - Educational resources, lesson plans, and teacher tools
- Admin - Sign-in for content administrators

No account is needed. Simply tap a tab to begin exploring.

## Interactive Map

The heart of the app is an interactive map showcasing Canada's major waterways and historic locations: 70 waterways and 100 historic locations.

### Map Features

Waterway Markers:
- Blue markers - Rivers (St. Lawrence, Mackenzie, Fraser, etc.)
- Cyan markers - Lakes (Superior, Huron, Winnipeg, etc.)
- Green markers - Bays and Sounds (Hudson Bay, Nootka Sound, etc.)

Historic Location Markers:
- Red markers - Forts (Prince of Wales Fort, Fort William, etc.)
- Orange markers - Trading Posts (York Factory, Moose Factory, etc.)
- Brown markers - Portages and other sites

The Map Legend explains every icon. Filters let you show one waterway, one explorer's waterways, or one time period at a time.

### How to Use the Map

Tap any marker to see a preview card with name, type, and description.

Tap "Learn More" to open the full detail view with complete history, connected explorers, Indigenous heritage information, and fur trade significance.

### Boundary Highlighting

When you select a waterway, its outline is drawn on the map, helping visualize the true scale of Canada's water systems. Outlines become more detailed as you zoom in.

## Learn Tab

The Learn tab is your gateway to structured educational content.

### Available Resources

- Deep Dives (26 lesson plans) - Curriculum-aligned plans organized by grade level and topic
- Timeline (23 events) - Nearly 300 years of exploration history, from 1613 to 1885
- Field Trips (6 virtual tours) - Experience historic locations stop by stop
- Documents (48 primary sources) - Annotated letters, journals, maps and records
- What Happened Here? - Historical events near your current location
- Notable Figures (18 profiles) - Women, Indigenous leaders, guides and traders
- My Maps - Your own annotated maps with pins, routes and notes
- Indigenous Languages (298 words) - Vocabulary from First Nations and Inuit languages
- Compare (4 templates) - Side-by-side comparisons of people, places and events
- Pronunciations (33 entries) - Phonetic spellings of Indigenous place and nation names
- My Class - Join a teacher's class and complete assignments
- My Journal - Private reflections on what you have learned
- Teacher Portal - Classes, assignments and progress tracking for teachers
- Printable Resources (8 items) - Worksheets and activity sheets to download and print

## Teacher Portal

The Teacher Portal provides tools for managing classroom learning.

### Getting Started

1. Tap the "Learn" tab
2. Tap "Teacher Portal"
3. Tap "Create an Account" and register, or sign in if you already have an account
4. An administrator reviews new accounts, typically within 1-2 business days. You can sign in once approved.

### Dashboard Features

- Class Management - Create classes; each one gets a 6-character join code for students
- Assignments - Assign quizzes, Deep Dives or field trips with due dates and instructions
- Progress Tracking - See who has joined and which assignments each student has completed

## Student Features

Students never create accounts. Progress, points, achievements and journal entries are tied to the device.

### My Class

1. Open the Learn tab
2. Tap "My Class"
3. Enter the join code from your teacher and a display name
4. Your teacher's assignments appear here. Quizzes count when you finish them; a Deep Dive or field trip counts when you tap its "Mark ... Complete" button at the bottom of the page.

### Student Journal

Students can record their learning journey:
1. Open the Learn tab
2. Tap "My Journal"
3. The first time, enter your name (school and grade are optional) to create your journal
4. Tap the + button and write your reflections

Journal entries are private and are not shown to teachers.

### Achievement Badges

28 badges are available, including:
- First Steps - Explore your first waterway
- Quiz Beginner - Complete your first quiz
- First Voyage - Finish your first virtual field trip
- First Words - Learn your first pronunciation
- First Entry - Write your first journal entry
- First Discovery - Read your first primary source document
- And many more, up to Unstoppable for long daily streaks

## Quizzes

13 quizzes in five categories:
- Explorers - Test knowledge of Canada's famous explorers
- Fur Trade - Learn about trading companies and routes
- Maritime History - Discover coastal exploration
- Indigenous Heritage - Understand First Nations history
- Geography - Know Canada's waterways and territories

Each quiz is written for one grade band: K-3, 4-6, 7-9 or 10-12. Quizzes can be retaken as often as you like.

## Gamification & Progress

Track your learning journey and earn achievements!

### Explorer Ranks

Progress through these ranks:
1. Apprentice Voyageur (0-100 points)
2. Junior Explorer (101-300 points)
3. Fur Trade Clerk (301-600 points)
4. Seasoned Voyageur (601-1,000 points)
5. Fort Factor (1,001-1,500 points)
6. Chief Trader (1,501-2,500 points)
7. Master Explorer (2,501+ points)

### Earning Points

- Complete a quiz: 10-20 points, depending on your score
- Complete a Deep Dive lesson: 15 points
- Finish a virtual field trip: 20 points
- Write a journal entry: 5 points
- Daily challenge: bonus points when a challenge is scheduled for the day

Your points, rank, streak and badges are shown on the Achievements screen.

## Indigenous Language Learning

Learn words and phrases from Canada's Indigenous languages.

### 298 Indigenous Words Available

- Cree: 83 words
- Ojibwe: 58 words
- Inuktitut: 45 words
- Dene: 34 words
- Blackfoot: 30 words
- Mohawk: 22 words
- Mi'kmaq: 19 words
- Iroquoian languages: 7 words

### Word Categories

- Waterway terms: River, lake, rapids, portage
- Animals: Bear, beaver, moose, caribou, fish
- Nature: Tree, forest, mountain, sky, sun, moon
- Actions: Paddle, walk, run, speak, listen
- Greetings & phrases: Hello, goodbye, thank you

## Notable Figures

Meet the 18 women, Indigenous leaders, guides and traders who shaped Canadian history.

### Featured Women
- Charlotte Small - Métis partner of David Thompson, interpreter and expedition companion
- Thanadelthur - Chipewyan peacemaker, guide and interpreter for the Hudson's Bay Company
- Marie-Anne Gaboury - First European woman to travel to the Canadian Northwest
- Isabel Gunn - First European woman in Rupert's Land, disguised as a man
- Sacagawea - Lemhi Shoshone guide and interpreter for the Lewis and Clark Expedition

### Indigenous Leaders & Guides
- Matonabbee - Chipewyan leader, guide and diplomat who led Samuel Hearne to the Arctic Ocean
- Saukamappee - Cree warrior, Piikani elder and oral historian
- Akaitcho - Yellowknife Dene chief and guide for John Franklin's expedition
- Keskarrah - Yellowknife leader who assisted Samuel Hearne
- Tattannoeuck - Inuit interpreter for John Franklin's Arctic expeditions
- Crowfoot (Isapo-Muxika) - Siksika (Blackfoot) Chief
- Poundmaker (Pîhtokahanapiwiyin) - Plains Cree Chief
- Big Bear (Mistahimaskwa) - Plains Cree Chief

### Métis Leaders
- Louis Riel - Founder of Manitoba and Métis rights leader
- Gabriel Dumont - Métis military leader and buffalo hunt captain
- Cuthbert Grant - Warden of the Plains and early Métis leader

### Voyageurs & Traders
- Jean-Baptiste Lagimodière - Legendary voyageur and grandfather of Louis Riel
- Roderick McKenzie - North West Company fur trader, later Hudson's Bay Company chief factor

## Language Settings

Menus, the main tabs and settings can be shown in English or French. Educational content, quizzes and this guide are currently in English.

### How to Change Language

1. Go to Settings
2. Select "Language"
3. Choose English or Français
4. The app will update immediately

## What Happened Here?

Discover historical events near your location using GPS!

### How to Use

1. Open "What Happened Here?" from the Learn tab
2. Allow location access when prompted
3. Choose a search radius (5 km to 100 km)
4. Filter by category (optional)
5. See historical events sorted by distance

Location is used only on this screen and is never stored.

## Frequently Asked Questions

### Is this app free to use?
Yes, the app is completely free for all students, teachers, and educational institutions.

### What grade levels is this designed for?
The app contains content for K-12 students, with features tailored to different grade levels.

### Can I use this app offline?
No. Content is loaded from our servers, so an internet connection is required.

### Is the app available in French?
Menus and navigation can be shown in French. Educational content is currently in English.

### How accurate is the historical information?
All content is based on historical records, archives, academic publications and public domain materials.

### Do students need accounts?
No. Students never create accounts. Progress is tied to the device, and a student joins a class with a join code and display name only.

### Can I track student progress?
Yes. Create a teacher account, create a class, and have students join it with the class code. Assignment completion is shown on your dashboard.

## Getting Help

If you need assistance:

In-App Support:
- Review this User Guide
- Check the FAQ section (Settings > FAQ)

Contact Support:
- Technical Issues: support@canadianwaterways.ca
- Educational Questions: education@canadianwaterways.ca

## Credits & Acknowledgments

The Canadian Interactive Waterways Initiative is a self-financed project of the Kainani Across Alone Team, with thanks to:
- Royal Canadian Geographical Society
- Indigenous Education Consultants
- Historians and Archaeologists
- Teachers and Educators

### Land Acknowledgment

We acknowledge that the waterways featured in this app flow through the traditional territories of diverse Indigenous peoples across what is now called Canada. These waterways have been traveled, named, and stewarded by Indigenous peoples for thousands of years before European contact.`;

function parseUserGuide(content: string): Section[] {
  const sections: Section[] = [];
  const lines = content.split('\n');
  let currentSection: Section | null = null;
  let contentBuffer: string[] = [];

  for (const line of lines) {
    // Check for headers (## or ###)
    const h2Match = line.match(/^## (.+)$/);
    const h3Match = line.match(/^### (.+)$/);

    if (h2Match) {
      // Save previous section
      if (currentSection) {
        currentSection.content = contentBuffer.join('\n').trim();
        sections.push(currentSection);
      }
      // Start new section
      currentSection = {
        id: h2Match[1].toLowerCase().replace(/\s+/g, '-'),
        title: h2Match[1],
        content: '',
        level: 2,
      };
      contentBuffer = [];
    } else if (h3Match) {
      // Save previous section
      if (currentSection) {
        currentSection.content = contentBuffer.join('\n').trim();
        sections.push(currentSection);
      }
      // Start new subsection
      currentSection = {
        id: h3Match[1].toLowerCase().replace(/\s+/g, '-'),
        title: h3Match[1],
        content: '',
        level: 3,
      };
      contentBuffer = [];
    } else if (currentSection) {
      contentBuffer.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    currentSection.content = contentBuffer.join('\n').trim();
    sections.push(currentSection);
  }

  return sections;
}

export default function UserGuideScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const sections = useMemo(() => parseUserGuide(USER_GUIDE_CONTENT), []);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;

    const query = searchQuery.toLowerCase();
    return sections.filter(
      (section) =>
        section.title.toLowerCase().includes(query) ||
        section.content.toLowerCase().includes(query)
    );
  }, [sections, searchQuery]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'User Guide',
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
            placeholder="Search guide..."
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

      {/* Guide Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <BookOpen size={32} color={colors.forestGreen} />
          </View>
          <Text style={styles.heroTitle}>User Guide</Text>
          <Text style={styles.heroSubtitle}>
            Everything you need to know about using the Canadian Interactive Waterways
            Initiative
          </Text>
        </View>

        {/* Search Results Info */}
        {searchQuery ? (
          <View style={styles.resultsInfo}>
            <Text style={styles.resultsText}>
              Found {filteredSections.length} section{filteredSections.length !== 1 ? 's' : ''}
            </Text>
          </View>
        ) : null}

        {/* Sections */}
        {filteredSections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const isLevel3 = section.level === 3;

          return (
            <View key={section.id} style={styles.sectionContainer}>
              <Pressable
                style={[
                  styles.sectionHeader,
                  isLevel3 && styles.sectionHeaderLevel3,
                ]}
                onPress={() => toggleSection(section.id)}
              >
                <Text
                  style={[
                    styles.sectionTitle,
                    isLevel3 && styles.sectionTitleLevel3,
                  ]}
                >
                  {section.title}
                </Text>
                {isExpanded ? (
                  <ChevronDown size={20} color={colors.forestGreen} />
                ) : (
                  <ChevronRight size={20} color="#9CA3AF" />
                )}
              </Pressable>

              {isExpanded ? (
                <View style={styles.sectionContent}>
                  <Text style={styles.contentText}>{section.content}</Text>
                </View>
              ) : null}
            </View>
          );
        })}

        {filteredSections.length === 0 ? (
          <View style={styles.emptyState}>
            <Search size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No results found</Text>
            <Text style={styles.emptySubtext}>
              Try searching for different keywords
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
  sectionContainer: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
  sectionHeaderLevel3: {
    paddingLeft: 24,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  sectionTitleLevel3: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#FAFAFA',
  },
  contentText: {
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
  },
  bottomSpacer: {
    height: 32,
  },
});
