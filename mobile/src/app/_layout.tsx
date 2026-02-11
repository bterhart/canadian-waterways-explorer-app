import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/lib/useColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { LanguageProvider } from '@/lib/i18n';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav({ colorScheme }: { colorScheme: 'light' | 'dark' | null | undefined }) {
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="quiz/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="admin/quizzes" options={{ headerShown: true }} />
        <Stack.Screen name="admin/quiz-editor/new" options={{ headerShown: true }} />
        <Stack.Screen name="admin/quiz-editor/[id]" options={{ headerShown: true }} />
        {/* Educational Feature Screens */}
        <Stack.Screen name="lessons/index" options={{ headerShown: true }} />
        <Stack.Screen name="lessons/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="timeline" options={{ headerShown: true }} />
        <Stack.Screen name="field-trips/index" options={{ headerShown: true }} />
        <Stack.Screen name="field-trips/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="documents/index" options={{ headerShown: true }} />
        <Stack.Screen name="documents/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="comparisons/index" options={{ headerShown: true }} />
        <Stack.Screen name="comparisons/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="pronunciations" options={{ headerShown: true }} />
        <Stack.Screen name="journal/index" options={{ headerShown: true }} />
        <Stack.Screen name="journal/entry/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="printables" options={{ headerShown: true }} />
        {/* Teacher Portal Screens */}
        <Stack.Screen name="teacher/login" options={{ headerShown: true }} />
        <Stack.Screen name="teacher/register" options={{ headerShown: true }} />
        <Stack.Screen name="teacher/dashboard" options={{ headerShown: true }} />
        <Stack.Screen name="teacher/class/new" options={{ headerShown: true }} />
        <Stack.Screen name="teacher/class/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="teacher/assignment/new" options={{ headerShown: true }} />
        <Stack.Screen name="indigenous-languages" options={{ headerShown: true }} />
        {/* Settings Screens */}
        <Stack.Screen name="settings/index" options={{ headerShown: true }} />
        <Stack.Screen name="settings/language" options={{ headerShown: true }} />
        {/* My Maps Screens */}
        <Stack.Screen name="my-maps/index" options={{ headerShown: true }} />
        <Stack.Screen name="my-maps/new" options={{ headerShown: true }} />
        <Stack.Screen name="my-maps/[id]" options={{ headerShown: false }} />
        {/* Nearby History Screen */}
        <Stack.Screen name="nearby-history" options={{ headerShown: true }} />
        {/* Achievements & Progress Screen */}
        <Stack.Screen name="achievements" options={{ headerShown: true }} />
        {/* Notable Figures Screens */}
        <Stack.Screen name="notable-figures/index" options={{ headerShown: true }} />
        <Stack.Screen name="notable-figures/[id]" options={{ headerShown: true }} />
      </Stack>
    </ThemeProvider>
  );
}



export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <RootLayoutNav colorScheme={colorScheme} />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </LanguageProvider>
    </QueryClientProvider>
  );
}