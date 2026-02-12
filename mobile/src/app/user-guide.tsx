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
- Learn - Educational resources, lesson plans, and teacher tools

Simply tap on either tab to begin exploring.

## Interactive Map

The heart of the app is an interactive map showcasing Canada's major waterways and historic locations.

### Map Features

Waterway Markers:
- Blue markers - Rivers (St. Lawrence, Mackenzie, Fraser, etc.)
- Cyan markers - Lakes (Superior, Huron, Winnipeg, etc.)
- Green markers - Bays and Sounds (Hudson Bay, Nootka Sound, etc.)

Historic Location Markers:
- Red markers - Forts (Prince of Wales Fort, Fort William, etc.)
- Orange markers - Trading Posts (York Factory, Moose Factory, etc.)
- Brown markers - Portages and other sites

### How to Use the Map

Tap any marker to see a preview card with name, type, and description.

Tap "Learn More" to open the full detail view with complete history, connected explorers, Indigenous heritage information, and fur trade significance.

### Boundary Highlighting

When you select a waterway, the entire waterway boundary illuminates like a highlighter on a map, helping visualize the true scale of Canada's water systems.

## Learn Tab

The Learn tab is your gateway to structured educational content.

### Available Resources

- Lesson Plans (26 Complete Plans) - Curriculum-aligned plans organized by grade level and topic
- Virtual Field Trips (4 Complete Tours) - Experience historic locations
- Document Library (14 Primary Source Documents) - Access annotated primary sources
- Printable Worksheets (8 Resources) - Download and print educational materials
- Pronunciation Guide (33+ Entries) - Learn correct pronunciation of Indigenous place names
- Historical Comparisons (4 Templates) - Compare different aspects of Canadian history
- Interactive Timeline (16 Major Events) - Visualize 1,000 years of exploration history

## Teacher Portal

The Teacher Portal provides tools for managing classroom learning.

### Getting Started

1. Tap "Learn" tab
2. Tap "Teacher Portal"
3. Register with your school email or log in

### Dashboard Features

- Class Management - Create classes and generate student join codes
- Assignments - Create custom assignments with due dates
- Progress Tracking - Monitor student engagement and quiz scores

## Student Features

### Student Journal

Students can record their learning journey:
1. Open the Learn tab
2. Tap "My Journal"
3. Tap "New Entry"
4. Select a topic and write reflections

### Achievement Badges

Earn badges for:
- First Steps - Explore your first waterway
- Knowledge Seeker - Complete your first quiz
- Voyageur in Training - Complete a journey adventure
- Word Learner - Learn 10 Indigenous words
- And many more...

## RCGS Educational Quizzes

Test your knowledge with quizzes developed in partnership with the Royal Canadian Geographical Society.

### Quiz Categories
- Explorers - Test knowledge of Canada's famous explorers
- Fur Trade - Learn about trading companies and routes
- Maritime History - Discover coastal exploration
- Indigenous Heritage - Understand First Nations history
- Geography - Know Canada's waterways and territories

### Grade Levels
- K-3: Picture-based, simplified questions
- 4-6: Standard multiple choice with explanations
- 7-9: More detailed analytical questions
- 10-12: Advanced source-based questions

## Gamification & Progress

Track your learning journey and earn achievements!

### Explorer Ranks

Progress through these ranks:
1. Apprentice Voyageur (0-99 points)
2. Junior Explorer (100-249 points)
3. Trail Blazer (250-499 points)
4. Seasoned Voyageur (500-999 points)
5. Master Explorer (1,000+ points)

### Earning Points

- Complete a quiz: 10-20 points
- Explore a waterway: 5 points
- Complete a lesson plan: 15 points
- Finish a virtual field trip: 20 points
- Learn 10 Indigenous words: 10 points
- Daily challenge: 10 points

## Indigenous Language Learning

Learn words and phrases from Canada's Indigenous languages.

### 298 Indigenous Words Available

The app features vocabulary across 8 First Nations languages:
- Cree: 83 words
- Ojibwe: 58 words
- Inuktitut: 45 words
- Dene: 34 words
- Blackfoot: 30 words
- Mohawk: 22 words
- Mi'kmaq: 19 words

### Word Categories

- Waterway terms: River, lake, rapids, portage
- Animals: Bear, beaver, moose, caribou, fish
- Nature: Tree, forest, mountain, sky, sun, moon
- Actions: Paddle, walk, run, speak, listen
- Greetings & phrases: Hello, goodbye, thank you

## Notable Figures

Meet the 14 women and Indigenous leaders who shaped Canadian history.

### Featured Women
- Charlotte Small - Métis wife and partner of David Thompson
- Thanadelthur - Chipewyan peacemaker and guide
- Marie-Anne Gaboury - First European woman to travel to Canadian Northwest
- Isabel Gunn - Only known woman to work disguised as a man for HBC

### Indigenous Leaders & Guides
- Matonabbee - Led Samuel Hearne to Arctic Ocean
- Saukamappee - Shared invaluable oral history
- Akaitcho - Guided John Franklin's Arctic expedition

### Métis Leaders
- Louis Riel - Founder of Manitoba, Métis leader
- Gabriel Dumont - Military leader
- Cuthbert Grant - Warden of the Plains

## Multi-Language Support

The app is available in English and French.

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
3. Choose a search radius (5km to 100km)
4. Filter by category (optional)
5. See historical events sorted by distance

## Frequently Asked Questions

### Is this app free to use?
Yes, the app is completely free for all students, teachers, and educational institutions.

### What grade levels is this designed for?
The app contains content for K-12 students, with features tailored to different grade levels.

### Can I use this app offline?
Basic map features work with limited connectivity, but full functionality requires internet.

### Is the app available in French?
Yes! The entire app is available in both English and French.

### How accurate is the historical information?
All content is based on historical records and academic research, reviewed by historians and Indigenous communities.

### Do students need accounts?
No! Students can explore all content without creating an account. Accounts are optional for saving progress.

### Can I track student progress?
Yes, create a teacher account and have students join your class using a class code.

## Getting Help

If you need assistance:

In-App Support:
- Review this User Guide
- Check the FAQ section
- Use the Feedback form

Contact Support:
- Technical Issues: support@waterways.edu
- Educational Questions: education@waterways.edu

## Credits & Acknowledgments

The Canadian Interactive Waterways Initiative is developed in partnership with:
- Royal Canadian Geographical Society
- Indigenous Education Consultants
- Historians and Archaeologists
- Teachers and Educators

### Land Acknowledgment

We acknowledge that the waterways featured in this app flow through the traditional territories of diverse Indigenous peoples across what is now called Canada. These waterways have been traveled, named, and stewarded by Indigenous peoples for thousands of years before European contact.

Version 1.0 | February 2026`;

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
