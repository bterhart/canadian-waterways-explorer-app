// Create New Map Screen - Form to create a new map annotation
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Map, MapPin, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCreateMapAnnotation } from '@/lib/api/education-api';

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
  gold: '#C9A962',
  lightGreen: '#E8F5E9',
};

// Mock user ID - in production this would come from auth context
const MOCK_USER_ID = 'student-user-001';

// Preset map centers for Canadian regions
const MAP_PRESETS = [
  { label: 'Canada (Default)', latitude: 56.0, longitude: -96.0, zoom: 40 },
  { label: 'Great Lakes Region', latitude: 45.0, longitude: -82.0, zoom: 8 },
  { label: 'St. Lawrence River', latitude: 46.8, longitude: -71.2, zoom: 6 },
  { label: 'Hudson Bay', latitude: 60.0, longitude: -85.0, zoom: 10 },
  { label: 'Pacific Coast', latitude: 49.2, longitude: -123.1, zoom: 8 },
  { label: 'Atlantic Provinces', latitude: 45.5, longitude: -63.0, zoom: 8 },
  { label: 'Prairie Region', latitude: 52.0, longitude: -106.0, zoom: 10 },
  { label: 'Northern Territories', latitude: 64.0, longitude: -114.0, zoom: 15 },
];

export default function NewMapScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(0);

  const createMap = useCreateMapAnnotation();

  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a title for your map');
      return;
    }

    const preset = MAP_PRESETS[selectedPreset];

    createMap.mutate(
      {
        userId: MOCK_USER_ID,
        title: title.trim(),
        description: description.trim() || undefined,
        centerLatitude: preset.latitude,
        centerLongitude: preset.longitude,
        zoomLevel: preset.zoom,
      },
      {
        onSuccess: (data) => {
          // Navigate to the new map editor
          router.replace(`/my-maps/${data.id}` as const);
        },
        onError: () => {
          Alert.alert('Error', 'Failed to create map. Please try again.');
        },
      }
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create New Map',
          headerStyle: { backgroundColor: colors.creamWhite },
          headerTitleStyle: {
            color: colors.forestGreen,
            fontWeight: '700',
          },
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Illustration */}
          <View style={styles.headerIllustration}>
            <LinearGradient
              colors={[colors.forestGreen, colors.darkGreen]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.illustrationGradient}
            >
              <Map size={48} color="white" />
            </LinearGradient>
            <Text style={styles.headerTitle}>Create Your Map</Text>
            <Text style={styles.headerSubtitle}>
              Add pins, draw routes, and take notes about Canadian waterways
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Map Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., My Explorer Route"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#9CA3AF"
                maxLength={100}
              />
              <Text style={styles.inputHint}>{title.length}/100 characters</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe what this map is about..."
                value={description}
                onChangeText={setDescription}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                maxLength={500}
              />
              <Text style={styles.inputHint}>{description.length}/500 characters</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Starting Region</Text>
              <Text style={styles.inputSubLabel}>
                Choose where your map will be centered initially
              </Text>
              <View style={styles.presetGrid}>
                {MAP_PRESETS.map((preset, index) => (
                  <Pressable
                    key={preset.label}
                    onPress={() => setSelectedPreset(index)}
                    style={[
                      styles.presetButton,
                      selectedPreset === index && styles.presetButtonActive,
                    ]}
                  >
                    <MapPin
                      size={16}
                      color={selectedPreset === index ? 'white' : colors.forestGreen}
                    />
                    <Text
                      style={[
                        styles.presetButtonText,
                        selectedPreset === index && styles.presetButtonTextActive,
                      ]}
                    >
                      {preset.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>Tips for Creating Great Maps</Text>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>
                Use descriptive titles so you can find your maps easily later
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>
                Add pins to mark important locations like forts, trading posts, or portages
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>
                Draw routes to trace explorer journeys or plan your own adventures
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>
                Use notes to record observations and interesting facts
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Create Button */}
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={handleCreate}
            disabled={createMap.isPending || !title.trim()}
            style={({ pressed }) => [
              styles.createButton,
              pressed && styles.createButtonPressed,
              (!title.trim() || createMap.isPending) && styles.createButtonDisabled,
            ]}
          >
            {createMap.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text style={styles.createButtonText}>Create Map</Text>
                <ChevronRight size={20} color="white" />
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
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
    padding: 20,
    paddingBottom: 100,
  },
  headerIllustration: {
    alignItems: 'center',
    marginBottom: 32,
  },
  illustrationGradient: {
    width: 100,
    height: 100,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  inputSubLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.darkGreen,
    backgroundColor: 'white',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputHint: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  presetButtonActive: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
  },
  presetButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.forestGreen,
  },
  presetButtonTextActive: {
    color: 'white',
  },
  tipsSection: {
    marginTop: 32,
    padding: 16,
    backgroundColor: colors.lightGreen,
    borderRadius: 16,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.forestGreen,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.forestGreen,
    marginTop: 6,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: colors.darkGreen,
    lineHeight: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: colors.creamWhite,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.forestGreen,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  createButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
  },
});
