import { Stack } from 'expo-router';

// Theme colors matching the app
const colors = {
  forestGreen: '#2D5A3D',
  darkGreen: '#1A3A24',
};

export default function LearnLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.forestGreen,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Educational Feature Screens */}
      <Stack.Screen name="lessons/index" options={{ headerShown: true, title: 'Deep Dives' }} />
      <Stack.Screen name="lessons/[id]" options={{ headerShown: true, title: 'Deep Dive' }} />
      <Stack.Screen name="timeline" options={{ headerShown: true, title: 'Timeline' }} />
      <Stack.Screen name="field-trips/index" options={{ headerShown: true, title: 'Field Trips' }} />
      <Stack.Screen name="field-trips/[id]" options={{ headerShown: true, title: 'Field Trip' }} />
      <Stack.Screen name="documents/index" options={{ headerShown: true, title: 'Documents' }} />
      <Stack.Screen name="documents/[id]" options={{ headerShown: true, title: 'Document' }} />
      <Stack.Screen name="comparisons/index" options={{ headerShown: true, title: 'Comparisons' }} />
      <Stack.Screen name="comparisons/[id]" options={{ headerShown: true, title: 'Comparison' }} />
      <Stack.Screen name="pronunciations" options={{ headerShown: true, title: 'Pronunciations' }} />
      <Stack.Screen name="journal/index" options={{ headerShown: true, title: 'My Journal' }} />
      <Stack.Screen name="journal/entry/[id]" options={{ headerShown: true, title: 'Journal Entry' }} />
      <Stack.Screen name="printables" options={{ headerShown: true, title: 'Printable Resources' }} />
      <Stack.Screen name="indigenous-languages" options={{ headerShown: true, title: 'Indigenous Languages' }} />
      {/* Settings Screens */}
      <Stack.Screen name="settings/index" options={{ headerShown: true, title: 'Settings' }} />
      <Stack.Screen name="settings/language" options={{ headerShown: true, title: 'Language' }} />
      {/* My Maps Screens */}
      <Stack.Screen name="my-maps/index" options={{ headerShown: true, title: 'My Maps' }} />
      <Stack.Screen name="my-maps/new" options={{ headerShown: true, title: 'New Map' }} />
      <Stack.Screen name="my-maps/[id]" options={{ headerShown: false }} />
      {/* Nearby History Screen */}
      <Stack.Screen name="nearby-history" options={{ headerShown: true, title: 'What Happened Here?' }} />
      {/* Achievements & Progress Screen */}
      <Stack.Screen name="achievements" options={{ headerShown: true, title: 'My Progress' }} />
      {/* Notable Figures Screens */}
      <Stack.Screen name="notable-figures/index" options={{ headerShown: true, title: 'Notable Figures' }} />
      <Stack.Screen name="notable-figures/[id]" options={{ headerShown: true, title: 'Notable Figure' }} />
      {/* Voyageur Journey Screens */}
      <Stack.Screen name="voyageur-journey/index" options={{ headerShown: true, title: 'Voyageur Journeys' }} />
      <Stack.Screen name="voyageur-journey/[id]" options={{ headerShown: true, title: 'Voyageur Journey' }} />
      {/* Help & Support Screens */}
      <Stack.Screen name="user-guide" options={{ headerShown: true, title: 'User Guide' }} />
      <Stack.Screen name="faq" options={{ headerShown: true, title: 'FAQ' }} />
      <Stack.Screen name="about" options={{ headerShown: true, title: 'About' }} />
      {/* Teacher Portal Screens */}
      <Stack.Screen name="teacher/login" options={{ headerShown: true, title: 'Teacher Login' }} />
      <Stack.Screen name="teacher/register" options={{ headerShown: true, title: 'Teacher Registration' }} />
      <Stack.Screen name="teacher/dashboard" options={{ headerShown: true, title: 'Teacher Dashboard' }} />
      <Stack.Screen name="teacher/class/new" options={{ headerShown: true, title: 'New Class' }} />
      <Stack.Screen name="teacher/class/[id]" options={{ headerShown: true, title: 'Class Details' }} />
      <Stack.Screen name="teacher/assignment/new" options={{ headerShown: true, title: 'New Assignment' }} />
      <Stack.Screen name="teacher/deep-dives" options={{ headerShown: true, title: 'Deep Dives' }} />
      <Stack.Screen name="teacher/deep-dive/[id]" options={{ headerShown: true, title: 'Deep Dive' }} />
      <Stack.Screen name="teacher/lesson-plans" options={{ headerShown: true, title: 'Lesson Plans' }} />
      <Stack.Screen name="teacher/lesson-plan/[id]" options={{ headerShown: true, title: 'Lesson Plan' }} />
    </Stack>
  );
}
