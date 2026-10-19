// A historic map's page (roadmap item 15, 2026-10-19): the image full width and pinch-zoomable,
// what it shows and what it got wrong, the mapmaker, related waterways and explorers as links,
// the sources, and "View on the map", which lays the image over the live map at its bounds.
import React from 'react';
import { View, Text, ScrollView, Image, Pressable, StyleSheet, ActivityIndicator, Linking, useWindowDimensions } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Layers, ExternalLink, Compass, Waves, User } from 'lucide-react-native';
import { useHistoricalMap } from '@/lib/api/historical-maps-api';
import { SourcesList } from '@/components/SourcesList';

const colors = { forestGreen: '#2D5A3D', creamWhite: '#FFFEF7', earthBrown: '#8B5A2B', waterBlue: '#3B82A3', parchment: '#F5ECD7' };

export default function HistoricalMapScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data: map, isLoading, isError } = useHistoricalMap(id ?? null);

  if (isLoading) return <View style={styles.center}><ActivityIndicator color={colors.forestGreen} /></View>;
  if (isError || !map) return <View style={styles.center}><Text style={styles.error}>This map could not be loaded.</Text></View>;

  const years = map.yearLabel ?? String(map.year);
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Stack.Screen options={{ title: years, headerStyle: { backgroundColor: colors.forestGreen }, headerTintColor: 'white' }} />

      {/* The map itself: pinch to zoom inside a horizontal/vertical scroll view */}
      <ScrollView style={[styles.imageFrame, { height: Math.min(width * 0.75, 420) }]} maximumZoomScale={6} minimumZoomScale={1} horizontal={false} bouncesZoom centerContent showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: map.imageUrl }} style={{ width, height: Math.min(width * 0.75, 420) }} resizeMode="contain" />
      </ScrollView>
      <Text style={styles.credit}>{map.imageCredit} · {map.imageLicense}</Text>

      <View style={styles.body}>
        <Text style={styles.title}>{map.title}</Text>
        <Text style={styles.maker}>{map.mapmaker}{map.mapmakerNation ? ` (${map.mapmakerNation})` : ''} · {years}{map.region ? ` · ${map.region}` : ''}</Text>

        {map.bounds ? (
          <Pressable style={styles.overlayButton} onPress={() => router.push({ pathname: '/', params: { mapOverlayId: map.id } })} accessibilityLabel="View this map laid over the live map">
            <Layers size={16} color="white" />
            <Text style={styles.overlayButtonText}>View on the map</Text>
          </Pressable>
        ) : (
          <Text style={styles.noOverlay}>This map is not georeferenced for overlay; it is shown as an image.</Text>
        )}

        <Section title="About this map"><Text style={styles.bodyText}>{map.description}</Text></Section>
        {map.whatItShows ? <Section title="What it shows"><Text style={styles.bodyText}>{map.whatItShows}</Text></Section> : null}
        {map.whatItGotWrong ? <Section title="What it got wrong" tint="#FFF4E5"><Text style={styles.bodyText}>{map.whatItGotWrong}</Text></Section> : null}

        {map.cartographer ? (
          <Section title="The mapmaker">
            <View style={styles.row}><User size={16} color={colors.earthBrown} /><Text style={styles.makerName}>{map.cartographer.name}{map.cartographer.birthYear ? ` (${map.cartographer.birthYear}${map.cartographer.deathYear ? `-${map.cartographer.deathYear}` : ''})` : ''}</Text></View>
            {map.cartographer.biography ? <Text style={styles.bodyText}>{map.cartographer.biography}</Text> : null}
            {map.cartographer.notableMaps ? <Text style={styles.small}>Notable maps: {map.cartographer.notableMaps}</Text> : null}
          </Section>
        ) : null}

        {map.relatedWaterways.length || map.relatedExplorers.length ? (
          <Section title="Related">
            {map.relatedWaterways.map((w) => (
              <Pressable key={w.id} style={styles.linkRow} onPress={() => router.push({ pathname: '/', params: { markerId: w.id, markerType: 'waterway' } })}>
                <Waves size={15} color={colors.waterBlue} /><Text style={[styles.linkText, { color: colors.waterBlue }]}>{w.name}</Text>
              </Pressable>
            ))}
            {map.relatedExplorers.map((e) => (
              <View key={e.id} style={styles.linkRow}><Compass size={15} color={colors.earthBrown} /><Text style={styles.plainText}>{e.name}</Text></View>
            ))}
          </Section>
        ) : null}

        {map.sourceUrl || map.sourceNote ? (
          <Section title="Where this copy comes from">
            {map.sourceNote ? <Text style={styles.bodyText}>{map.sourceNote}</Text> : null}
            {map.sourceUrl ? (
              <Pressable style={styles.linkRow} onPress={() => Linking.openURL(map.sourceUrl!)}>
                <ExternalLink size={14} color={colors.waterBlue} /><Text style={[styles.linkText, { color: colors.waterBlue }]} numberOfLines={1}>{map.sourceUrl.replace(/^https?:\/\/(www\.)?/, '')}</Text>
              </Pressable>
            ) : null}
          </Section>
        ) : null}

        <SourcesList targetType="historical_map" targetId={map.id} titleColor={colors.earthBrown} linkColor={colors.waterBlue} />
      </View>
    </ScrollView>
  );
}

function Section({ title, tint, children }: { title: string; tint?: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={[styles.sectionBox, tint ? { backgroundColor: tint } : null]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.creamWhite },
  error: { color: '#6B7280' },
  imageFrame: { backgroundColor: colors.parchment },
  credit: { fontSize: 11, color: '#9CA3AF', paddingHorizontal: 16, paddingTop: 6 },
  body: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.forestGreen, lineHeight: 28 },
  maker: { fontSize: 14, color: colors.earthBrown, marginTop: 4, marginBottom: 12 },
  overlayButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.forestGreen, borderRadius: 12, paddingVertical: 12, marginBottom: 16 },
  overlayButtonText: { color: 'white', fontWeight: '700', fontSize: 15 },
  noOverlay: { fontSize: 12, color: '#9CA3AF', fontStyle: 'italic', marginBottom: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.forestGreen, marginBottom: 8 },
  sectionBox: { backgroundColor: 'white', borderRadius: 12, padding: 14, gap: 6 },
  bodyText: { fontSize: 15, lineHeight: 23, color: '#333' },
  small: { fontSize: 13, color: '#6B7280', lineHeight: 19 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  makerName: { fontSize: 15, fontWeight: '700', color: '#333' },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  linkText: { fontSize: 15, textDecorationLine: 'underline' },
  plainText: { fontSize: 15, color: '#333' },
});
