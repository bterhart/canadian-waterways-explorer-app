// Onboarding utility functions and hooks
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const ONBOARDING_KEY = '@waterways_onboarding_completed';

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

/**
 * Mark onboarding as completed
 */
export async function completeOnboarding(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.error('Error completing onboarding:', error);
  }
}

/**
 * Reset onboarding (for testing or settings)
 */
export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch (error) {
    console.error('Error resetting onboarding:', error);
  }
}

/**
 * Hook to check onboarding status and navigate if needed
 * Use this on the main app screen to redirect to onboarding
 */
export function useOnboardingCheck() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await hasCompletedOnboarding();
      setShouldShowOnboarding(!completed);
      setIsChecking(false);

      // Navigate to onboarding if not completed
      if (!completed) {
        // Small delay to ensure navigation is ready
        setTimeout(() => {
          router.replace('/onboarding');
        }, 100);
      }
    };

    checkOnboarding();
  }, [router]);

  return { isChecking, shouldShowOnboarding };
}
