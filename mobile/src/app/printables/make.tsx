// Make a printable (roadmap item 13): a blank river map from the geometry, a timeline strip from
// the events, or pronunciation cards from the guide, built on the server from the live records,
// previewed here and printed or shared from the device.
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, TextInput, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { WebView } from 'react-native-webview';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Map, Clock, Mic, Printer } from 'lucide-react-native';
import {
  useGeneratedPrintable,
  useGeneratedPrintableOptions,
  type GeneratedPrintableRequest,
  type MapLabels,
} from '@/lib/api/generated-printables-api';

const colors = { forestGreen: '#2D5A3D', creamWhite: '#FFFEF7', darkGreen: '#1A3A24', earthBrown: '#8B5A2B' };
type Kind = GeneratedPrintableRequest['kind'];
type StripSource = 'theme' | 'explorer' | 'waterway';

const KINDS: { kind: Kind; label: string; icon: typeof Map; blurb: string }[] = [
  { kind: 'blank-map', label: 'Blank map', icon: Map, blurb: 'A river system drawn from the app’s own geometry, with numbers to label, a word bank, or the names.' },
  { kind: 'timeline-strip', label: 'Timeline strip', icon: Clock, blurb: 'The dated events of a river, an explorer or a theme on one strip, with the titles shown or left to fill in.' },
  { kind: 'pronunciation-cards', label: 'Pronunciation cards', icon: Mic, blurb: 'Cut-out cards from the pronunciation guide: the term, how it is said, the language and the meaning.' },
];

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }}>
      <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

export default function MakePrintableScreen() {
  const { data: options, isLoading: optionsLoading } = useGeneratedPrintableOptions();
  const [kind, setKind] = useState<Kind>('blank-map');
  const [waterwayId, setWaterwayId] = useState<string | undefined>();
  const [labels, setLabels] = useState<MapLabels>('numbered');
  const [stripSource, setStripSource] = useState<StripSource>('theme');
  const [theme, setTheme] = useState<string | undefined>();
  const [explorerId, setExplorerId] = useState<string | undefined>();
  const [stripWaterwayId, setStripWaterwayId] = useState<string | undefined>();
  const [blankStrip, setBlankStrip] = useState(false);
  const [language, setLanguage] = useState<string | undefined>();
  const [search, setSearch] = useState('');
  const [printing, setPrinting] = useState(false);

  const request: GeneratedPrintableRequest = useMemo(() => {
    if (kind === 'blank-map') return { kind, waterwayId: waterwayId ?? '', labels };
    if (kind === 'timeline-strip') return { kind, theme: stripSource === 'theme' ? theme : undefined, explorerId: stripSource === 'explorer' ? explorerId : undefined, waterwayId: stripSource === 'waterway' ? stripWaterwayId : undefined, blank: blankStrip };
    return { kind, language };
  }, [kind, waterwayId, labels, stripSource, theme, explorerId, stripWaterwayId, blankStrip, language]);
  const { data: printable, isFetching, isError, error } = useGeneratedPrintable(request);

  const q = search.trim().toLowerCase();
  const waterMatches = useMemo(() => (options?.waterways ?? []).filter((w) => !q || w.name.toLowerCase().includes(q)).slice(0, 12), [options, q]);
  const stripWaterMatches = useMemo(() => (options?.waterways ?? []).filter((w) => w.timelineEvents > 0 && (!q || w.name.toLowerCase().includes(q))).slice(0, 12), [options, q]);
  const explorerMatches = useMemo(() => (options?.explorers ?? []).filter((e) => !q || e.name.toLowerCase().includes(q)).slice(0, 12), [options, q]);

  const printOrShare = async () => {
    if (!printable) return;
    setPrinting(true);
    try {
      const { uri } = await Print.printToFileAsync({ html: printable.html, base64: false });
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: printable.title, UTI: 'com.adobe.pdf' });
      else await Print.printAsync({ uri });
    } catch (e) {
      Alert.alert('Not printed', (e as Error).message || 'The printable could not be prepared. Try again.');
    } finally {
      setPrinting(false);
    }
  };

  const current = KINDS.find((k) => k.kind === kind)!;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Make a Printable', headerStyle: { backgroundColor: colors.forestGreen }, headerTintColor: 'white' }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.kinds}>
          {KINDS.map((k) => {
            const Icon = k.icon;
            const active = k.kind === kind;
            return (
              <Pressable key={k.kind} style={[styles.kindCard, active && styles.kindCardActive]} onPress={() => { setKind(k.kind); setSearch(''); }} accessibilityRole="button" accessibilityState={{ selected: active }}>
                <Icon size={20} color={active ? 'white' : colors.forestGreen} />
                <Text style={[styles.kindLabel, active && styles.kindLabelActive]}>{k.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.blurb}>{current.blurb}</Text>

        {optionsLoading ? <ActivityIndicator color={colors.forestGreen} style={{ marginVertical: 12 }} /> : null}

        {kind === 'blank-map' && options ? (
          <View style={styles.block}>
            <Text style={styles.label}>River or lake</Text>
            <TextInput style={styles.input} placeholder="Search the 180 waters with drawn geometry" placeholderTextColor="#9CA3AF" value={search} onChangeText={setSearch} autoCorrect={false} />
            <View style={styles.chips}>
              {waterMatches.map((w) => <Chip key={w.id} label={w.name} active={waterwayId === w.id} onPress={() => setWaterwayId(w.id)} />)}
            </View>
            <Text style={styles.label}>Labels</Text>
            <View style={styles.chips}>
              <Chip label="Numbers and a key" active={labels === 'numbered'} onPress={() => setLabels('numbered')} />
              <Chip label="Word bank only" active={labels === 'blank'} onPress={() => setLabels('blank')} />
              <Chip label="Names on the map" active={labels === 'named'} onPress={() => setLabels('named')} />
            </View>
          </View>
        ) : null}

        {kind === 'timeline-strip' && options ? (
          <View style={styles.block}>
            <Text style={styles.label}>Events of</Text>
            <View style={styles.chips}>
              <Chip label="A theme" active={stripSource === 'theme'} onPress={() => { setStripSource('theme'); setSearch(''); }} />
              <Chip label="An explorer" active={stripSource === 'explorer'} onPress={() => { setStripSource('explorer'); setSearch(''); }} />
              <Chip label="A river or lake" active={stripSource === 'waterway'} onPress={() => { setStripSource('waterway'); setSearch(''); }} />
            </View>
            {stripSource === 'theme' ? (
              <View style={styles.chips}>
                {options.themes.map((t) => <Chip key={t.theme} label={`${t.theme.replace(/_/g, ' ')} (${t.events})`} active={theme === t.theme} onPress={() => setTheme(t.theme)} />)}
              </View>
            ) : (
              <>
                <TextInput style={styles.input} placeholder={stripSource === 'explorer' ? 'Search explorers with dated events' : 'Search waters with dated events'} placeholderTextColor="#9CA3AF" value={search} onChangeText={setSearch} autoCorrect={false} />
                <View style={styles.chips}>
                  {stripSource === 'explorer'
                    ? explorerMatches.map((e) => <Chip key={e.id} label={`${e.name} (${e.events})`} active={explorerId === e.id} onPress={() => setExplorerId(e.id)} />)
                    : stripWaterMatches.map((w) => <Chip key={w.id} label={`${w.name} (${w.timelineEvents})`} active={stripWaterwayId === w.id} onPress={() => setStripWaterwayId(w.id)} />)}
                </View>
              </>
            )}
            <Text style={styles.label}>Titles</Text>
            <View style={styles.chips}>
              <Chip label="Shown" active={!blankStrip} onPress={() => setBlankStrip(false)} />
              <Chip label="Left to fill in" active={blankStrip} onPress={() => setBlankStrip(true)} />
            </View>
          </View>
        ) : null}

        {kind === 'pronunciation-cards' && options ? (
          <View style={styles.block}>
            <Text style={styles.label}>Language</Text>
            <View style={styles.chips}>
              {options.languages.map((l) => <Chip key={l.language} label={`${l.language} (${l.terms})`} active={language === l.language} onPress={() => setLanguage(l.language)} />)}
            </View>
          </View>
        ) : null}

        <View style={styles.previewHeader}>
          <Text style={styles.label}>{printable ? printable.title : 'Preview'}</Text>
          {isFetching ? <ActivityIndicator size="small" color={colors.forestGreen} /> : null}
        </View>
        {isError ? (
          <Text style={styles.error}>{(error as Error)?.message || 'Nothing matches that choice.'}</Text>
        ) : printable ? (
          <View style={styles.preview}>
            <WebView originWhitelist={['*']} source={{ html: printable.html }} style={styles.webview} scrollEnabled nestedScrollEnabled />
          </View>
        ) : (
          <Text style={styles.hint}>Choose above and the printable appears here.</Text>
        )}

        <Pressable style={[styles.printButton, (!printable || printing) && styles.printButtonDisabled]} onPress={printOrShare} disabled={!printable || printing} accessibilityRole="button">
          {printing ? <ActivityIndicator size="small" color="white" /> : <Printer size={18} color="white" />}
          <Text style={styles.printButtonText}>Print or share as PDF</Text>
        </Pressable>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  content: { padding: 16 },
  kinds: { flexDirection: 'row', gap: 8 },
  kindCard: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 12, paddingHorizontal: 6, borderRadius: 12, backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E7EB' },
  kindCardActive: { backgroundColor: colors.forestGreen, borderColor: colors.forestGreen },
  kindLabel: { fontSize: 12, fontWeight: '700', color: colors.darkGreen, textAlign: 'center' },
  kindLabelActive: { color: 'white' },
  blurb: { fontSize: 13, color: '#4B5563', lineHeight: 19, marginTop: 10 },
  block: { marginTop: 12 },
  label: { fontSize: 12, fontWeight: '800', color: colors.earthBrown, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 10, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'white', fontSize: 14, color: '#1F2937', marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', maxWidth: '100%' },
  chipActive: { backgroundColor: colors.forestGreen, borderColor: colors.forestGreen },
  chipText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  chipTextActive: { color: 'white' },
  previewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  preview: { height: 520, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: 'white' },
  webview: { flex: 1, backgroundColor: 'white' },
  hint: { fontSize: 13, color: '#9CA3AF', fontStyle: 'italic', marginTop: 4 },
  error: { fontSize: 13, color: '#B91C1C', marginTop: 4 },
  printButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.forestGreen, paddingVertical: 13, borderRadius: 12, marginTop: 14 },
  printButtonDisabled: { opacity: 0.5 },
  printButtonText: { fontSize: 15, fontWeight: '700', color: 'white' },
});
