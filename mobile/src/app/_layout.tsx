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
        {/* Admin Screens - remain at root level */}
        <Stack.Screen name="admin/quizzes" options={{ headerShown: true }} />
        <Stack.Screen name="admin/quiz-editor/new" options={{ headerShown: true }} />
        <Stack.Screen name="admin/quiz-editor/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="admin/approvals" options={{ headerShown: true }} />
        <Stack.Screen name="admin/teacher-approvals" options={{ headerShown: true }} />
        <Stack.Screen name="admin/users" options={{ headerShown: true }} />
        <Stack.Screen name="admin/lesson-plans" options={{ headerShown: true }} />
        <Stack.Screen name="admin/field-trips" options={{ headerShown: true }} />
        <Stack.Screen name="admin/documents" options={{ headerShown: true }} />
        <Stack.Screen name="admin/printables" options={{ headerShown: true }} />
        <Stack.Screen name="admin/contributions" options={{ headerShown: true }} />
        <Stack.Screen name="admin/my-content" options={{ headerShown: true }} />
        <Stack.Screen name="admin/register" options={{ headerShown: true }} />
        {/* Onboarding - remains at root level */}
        <Stack.Screen name="onboarding" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
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
