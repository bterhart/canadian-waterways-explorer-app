import React from 'react';
import { Tabs } from 'expo-router';
import { Map, Compass, Shield, GraduationCap, BookOpen } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import { useClientOnlyValue } from '@/lib/useClientOnlyValue';
import { useTranslation } from '@/lib/i18n';

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.forestGreen,
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDark ? colors.darkGreen : colors.creamWhite,
          borderTopColor: isDark ? '#374151' : '#E5E7EB',
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: isDark ? colors.darkGreen : colors.forestGreen,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('map'),
          headerTitle: t('canadianWaterways'),
          tabBarIcon: ({ color, focused }) => (
            <Map
              size={focused ? 26 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: t('explorers'),
          headerTitle: t('explorers'),
          tabBarIcon: ({ color, focused }) => (
            <Compass
              size={focused ? 26 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="quizzes"
        options={{
          title: t('quizzes'),
          headerTitle: t('quizzes'),
          tabBarIcon: ({ color, focused }) => (
            <GraduationCap
              size={focused ? 26 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t('learn'),
          headerTitle: t('learn'),
          tabBarIcon: ({ color, focused }) => (
            <BookOpen
              size={focused ? 26 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: t('admin'),
          headerTitle: t('admin'),
          tabBarIcon: ({ color, focused }) => (
            <Shield
              size={focused ? 26 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}
