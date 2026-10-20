// One then-and-now pair (roadmap item 7): the slide at full size, what changed, both captions
// and credits, and the way to the place on the map.
import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { useThenAndNowPair } from '@/lib/api/then-and-now-api';
import { ThenAndNowCompare } from '@/components/ThenAndNowCompare';

const colors = { forestGreen: '#2D5A3D', creamWhite: '#FFFEF7', earthBrown: '#8B5A2B', waterBlue: '#3B82A3' };

export default function ThenAndNowPairScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data: pair, isLoading, isError } = useThenAndNowPair(id ?? null);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Loading…' }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
      </View>
    );
  }
  if (isError || !pair) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Then and Now' }} />
        <Text style={styles.error}>Unable to load the pair</Text>
      </View>
    );
  }
  const place = pair.location ?? pair.waterway;
  const frameHeight = Math.round(Math.min(420, (width - 32) * 0.75));

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Then and Now', headerStyle: { backgroundColor: colors.forestGreen }, headerTintColor: 'white' }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{pair.title}</Text>
          {place ? (
            <Pressable
              style={styles.placeRow}
              onPress={() => router.push({ pathname: '/', params: { markerId: place.id, markerType: pair.location ? 'location' : 'waterway' } })}
              accessibilityRole="button"
            >
              <MapPin size={14} color={colors.waterBlue} />
              <Text style={styles.placeText}>{place.name}</Text>
              <Text style={styles.placeLink}>Show on the map</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.section}>
          <ThenAndNowCompare pair={pair} height={frameHeight} />
        </View>
        {pair.note ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What changed</Text>
            <Text style={styles.body}>{pair.note}</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.creamWhite },
  error: { color: '#EF4444' },
  header: { backgroundColor: 'white', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  title: { fontSize: 22, fontWeight: '800', color: '#1A3A24', lineHeight: 29 },
  placeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  placeText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  placeLink: { fontSize: 13, fontWeight: '600', color: colors.waterBlue, textDecorationLine: 'underline', marginLeft: 6 },
  section: { backgroundColor: 'white', marginTop: 12, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A3A24', marginBottom: 8 },
  body: { fontSize: 15, color: '#374151', lineHeight: 24 },
});
