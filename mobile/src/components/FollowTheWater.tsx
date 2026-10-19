// "Follow the Water" card (roadmap item 1, 2026-10-19): the downstream chain, the tributaries,
// the arms and the joined bodies of a waterway, walked server-side from WaterwayConnection
// (GET /api/waterways/:id/system). Every row opens that water on the map; the footer draws the
// whole system over the map (`/?systemId=`).
import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowDown, CornerDownRight, Waves, Network } from 'lucide-react-native';
import { useWaterwaySystem } from '@/lib/api/connections-api';
import type { SystemStep, SystemWaterway } from '@/lib/types/connections';

const colors = { waterBlue: '#3B82A3', forestGreen: '#2D5A3D', panel: '#E6F3F8', text: '#333', muted: '#6B7280' };

const typeColor = (typeName: string) =>
  typeName === 'River' ? '#3B82F6' : typeName === 'Lake' ? '#06B6D4' : typeName === 'Bay' ? '#10B981' : '#0EA5E9';

const visitsLabel = (w: SystemWaterway) =>
  w.explorerCount === 0
    ? 'no explorers linked'
    : `${w.explorerCount} ${w.explorerCount === 1 ? 'explorer' : 'explorers'}${w.firstYear ? ` from ${w.firstYear}` : ''}`;

interface Props {
  waterwayId: string;
  /** Called before leaving for another map selection, e.g. to let the sheet close. */
  onBeforeNavigate?: () => void;
}

export function FollowTheWater({ waterwayId, onBeforeNavigate }: Props) {
  const router = useRouter();
  const { data, isLoading } = useWaterwaySystem(waterwayId);

  if (isLoading) {
    return (
      <View style={styles.block}>
        <Text style={styles.title}>Follow the Water</Text>
        <View style={styles.panel}><ActivityIndicator color={colors.waterBlue} /></View>
      </View>
    );
  }
  if (!data) return null;
  const { waterway, downstream, upstream, partOf, parts, joins, waterwayIds } = data;
  const hasAny = downstream.length + upstream.length + partOf.length + parts.length + joins.length > 0;
  if (!hasAny) return null;

  const open = (w: SystemWaterway) => {
    onBeforeNavigate?.();
    router.push({ pathname: '/', params: { markerId: w.id, markerType: 'waterway', lat: String(w.latitude), lng: String(w.longitude) } });
  };
  const showSystem = () => {
    onBeforeNavigate?.();
    router.push({ pathname: '/', params: { systemId: waterway.id } });
  };

  const Row = ({ step, indent = 0, mark }: { step: SystemStep; indent?: number; mark?: React.ReactNode }) => (
    <Pressable
      style={({ pressed }) => [styles.row, { marginLeft: indent }, pressed && { opacity: 0.7 }]}
      onPress={() => open(step)}
      accessibilityRole="button"
      accessibilityLabel={`Open ${step.name} on the map`}
    >
      {mark}
      <View style={[styles.dot, { backgroundColor: typeColor(step.typeName) }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowName}>{step.name}</Text>
        <Text style={styles.rowMeta}>
          {step.typeName} · {visitsLabel(step)}
          {step.notes ? ` · ${step.notes.replace(/\.$/, '')}` : ''}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.block}>
      <Text style={styles.title}>Follow the Water</Text>
      <View style={styles.panel}>
        {/* Downstream: this water first, then where its water goes, nearest first */}
        {downstream.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Downstream</Text>
            <View style={[styles.row, styles.rowHere]}>
              <View style={[styles.dot, { backgroundColor: typeColor(waterway.typeName) }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowName, { fontWeight: '700' }]}>{waterway.name}</Text>
                <Text style={styles.rowMeta}>{waterway.typeName} · {visitsLabel(waterway)}</Text>
              </View>
            </View>
            {downstream.map((step) => (
              <View key={step.id}>
                <View style={styles.connector}>
                  <ArrowDown size={12} color={colors.waterBlue} />
                  <Text style={styles.connectorText}>flows into</Text>
                </View>
                <Row step={step} />
              </View>
            ))}
          </View>
        ) : null}

        {/* Upstream: the tributaries, depth-first, indented by how far up they sit */}
        {upstream.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Fed by</Text>
            {upstream.map((step) => (
              <Row
                key={step.id}
                step={step}
                indent={(step.depth - 1) * 14}
                mark={<CornerDownRight size={12} color={colors.muted} style={{ marginRight: 2 }} />}
              />
            ))}
          </View>
        ) : null}

        {partOf.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Part of</Text>
            {partOf.map((step) => <Row key={step.id} step={step} />)}
          </View>
        ) : null}

        {parts.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Arms and reaches</Text>
            {parts.map((step) => <Row key={step.id} step={step} />)}
          </View>
        ) : null}

        {joins.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Joined to</Text>
            {joins.map((step) => <Row key={step.id} step={step} mark={<Waves size={12} color={colors.muted} style={{ marginRight: 2 }} />} />)}
          </View>
        ) : null}

        <Pressable style={({ pressed }) => [styles.systemButton, pressed && { opacity: 0.85 }]} onPress={showSystem} accessibilityRole="button">
          <Network size={16} color="white" />
          <Text style={styles.systemButtonText}>Show the whole system on the map · {waterwayIds.length} waters</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.waterBlue, marginBottom: 8 },
  panel: { backgroundColor: colors.panel, borderRadius: 12, padding: 14 },
  section: { marginBottom: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  rowHere: { backgroundColor: 'rgba(59, 130, 163, 0.12)', borderRadius: 8, paddingHorizontal: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  rowName: { fontSize: 15, fontWeight: '600', color: colors.text },
  rowMeta: { fontSize: 12, color: colors.muted, marginTop: 1 },
  connector: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 3, paddingVertical: 2 },
  connectorText: { fontSize: 11, color: colors.waterBlue, fontStyle: 'italic' },
  systemButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.waterBlue, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, marginTop: 2 },
  systemButtonText: { color: 'white', fontSize: 13, fontWeight: '700' },
});

export default FollowTheWater;
