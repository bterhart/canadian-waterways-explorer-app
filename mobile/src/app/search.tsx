// Search across everything (roadmap item 3, 2026-10-19): one box over waterways, places,
// explorers, figures, documents (including their text), events, deep dives, field trips, maps,
// words, pronunciations, expeditions, discoveries, quizzes, stories and years. Results are ranked
// and grouped by type; every result opens its record. GET /api/search.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, ActivityIndicator, Modal, Keyboard } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Search as SearchIcon, X, ChevronRight } from 'lucide-react-native';
import { useSearch } from '@/lib/api/search-api';
import { useExplorerDetail } from '@/lib/api/waterways-api';
import ExplorerDetailModal from '@/components/ExplorerDetailModal';
import { SEARCH_TYPE_COLOR, SEARCH_TYPE_LABEL, type SearchHit, type SearchType } from '@/lib/types/search';

const colors = { forestGreen: '#2D5A3D', creamWhite: '#FFFEF7', earthBrown: '#8B5A2B', waterBlue: '#3B82A3' };

const SUGGESTIONS = ['Mackenzie', 'Thanadelthur', "Hudson's Bay Company", '1793', 'scurvy', "Mi'kmaq", 'beaver', 'Northwest Passage'];

export default function SearchScreen() {
  const router = useRouter();
  const { q: initial } = useLocalSearchParams<{ q?: string }>();
  const [text, setText] = useState(initial ?? '');
  const [query, setQuery] = useState(initial ?? '');
  const [type, setType] = useState<SearchType | null>(null);
  const [selectedExplorerId, setSelectedExplorerId] = useState<string | null>(null);
  const { data: selectedExplorer } = useExplorerDetail(selectedExplorerId);
  const inputRef = useRef<TextInput>(null);

  // Debounce typing so the index is asked once per pause, not once per keystroke
  useEffect(() => {
    const handle = setTimeout(() => setQuery(text), 250);
    return () => clearTimeout(handle);
  }, [text]);

  const { data, isFetching, isError } = useSearch(query, type ? [type] : null);
  const { data: allData } = useSearch(query, null);
  const counts = allData?.counts ?? data?.counts ?? {};

  // Types that have hits for this query, most hits first, for the filter chips
  const typeChips = useMemo(
    () => (Object.entries(counts) as [SearchType, number][]).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]),
    [counts]
  );

  // Hits grouped by type in rank order of their best hit
  const groups = useMemo(() => {
    const map = new Map<SearchType, SearchHit[]>();
    (data?.hits ?? []).forEach((h) => {
      const list = map.get(h.type) ?? [];
      list.push(h);
      map.set(h.type, list);
    });
    return [...map.entries()];
  }, [data]);

  const open = (hit: SearchHit) => {
    Keyboard.dismiss();
    const t = hit.target;
    switch (hit.type) {
      case 'waterway':
      case 'location':
        router.push({ pathname: '/', params: { markerId: String(t.markerId), markerType: String(t.markerType) } });
        return;
      case 'explorer':
        setSelectedExplorerId(String(t.explorerId));
        return;
      case 'notable_figure':
        router.push(`/notable-figures/${t.notableFigureId}`);
        return;
      case 'document':
        router.push(`/documents/${t.documentId}`);
        return;
      case 'lesson_plan':
        router.push(`/lessons/${t.lessonId}`);
        return;
      case 'field_trip':
        router.push(`/field-trips/${t.fieldTripId}`);
        return;
      case 'historical_map':
        router.push(`/historical-maps/${t.historicalMapId}`);
        return;
      case 'expedition':
        router.push({ pathname: '/', params: { expeditionId: String(t.expeditionId) } });
        return;
      case 'quiz':
        router.push(`/quiz/${t.quizId}`);
        return;
      case 'story':
        router.push(`/stories/${t.storyId}`);
        return;
      case 'decade':
        router.push(`/decades/${t.decade}`);
        return;
      case 'indigenous_word':
        router.push('/indigenous-languages');
        return;
      case 'pronunciation':
        router.push('/pronunciations');
        return;
      case 'timeline_event':
      case 'historical_event':
      case 'discovery':
        if (t.locationId) router.push({ pathname: '/', params: { markerId: String(t.locationId), markerType: 'location' } });
        else if (t.waterwayId) router.push({ pathname: '/', params: { markerId: String(t.waterwayId), markerType: 'waterway' } });
        else if (t.lat !== null && t.lat !== undefined && t.lng !== null && t.lng !== undefined) router.push({ pathname: '/', params: { lat: String(t.lat), lng: String(t.lng) } });
        else if (hit.type === 'timeline_event') router.push('/timeline');
        else if (t.year) router.push(`/decades/${Math.floor(Number(t.year) / 10) * 10}`);
        return;
    }
  };

  const showResults = query.trim().length >= 2;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Search', headerStyle: { backgroundColor: colors.forestGreen }, headerTintColor: 'white' }} />

      <View style={styles.searchBox}>
        <SearchIcon size={18} color="#6B7280" />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Rivers, people, places, words, years, document text…"
          placeholderTextColor="#9CA3AF"
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={() => setQuery(text)}
          accessibilityLabel="Search everything"
        />
        {text ? (
          <Pressable onPress={() => { setText(''); setQuery(''); setType(null); inputRef.current?.focus(); }} hitSlop={8} accessibilityLabel="Clear search">
            <X size={18} color="#6B7280" />
          </Pressable>
        ) : null}
        {isFetching ? <ActivityIndicator size="small" color={colors.forestGreen} /> : null}
      </View>

      {showResults && typeChips.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={{ flexGrow: 0 }}>
          <Chip label={`All · ${allData?.total ?? data?.total ?? 0}`} active={type === null} color={colors.forestGreen} onPress={() => setType(null)} />
          {typeChips.map(([t, n]) => (
            <Chip key={t} label={`${SEARCH_TYPE_LABEL[t]} · ${n}`} active={type === t} color={SEARCH_TYPE_COLOR[t]} onPress={() => setType(type === t ? null : t)} />
          ))}
        </ScrollView>
      ) : null}

      <ScrollView contentContainerStyle={styles.results} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {!showResults ? (
          <View>
            <Text style={styles.hint}>
              One search over every record in the app: the name of a river or its Indigenous name, an explorer, a nation, a company, a year, or a word inside a document's text.
            </Text>
            <Text style={styles.suggestionsLabel}>Try</Text>
            <View style={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <Pressable key={s} style={styles.suggestion} onPress={() => { setText(s); setQuery(s); }}>
                  <Text style={styles.suggestionText}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {showResults && isError ? <Text style={styles.empty}>Search is not available right now. Check your connection and try again.</Text> : null}
        {showResults && data && data.total === 0 ? <Text style={styles.empty}>Nothing matches "{query}".</Text> : null}

        {groups.map(([t, hits]) => (
          <View key={t} style={styles.group}>
            <View style={styles.groupHeader}>
              <View style={[styles.groupDot, { backgroundColor: SEARCH_TYPE_COLOR[t] }]} />
              <Text style={[styles.groupTitle, { color: SEARCH_TYPE_COLOR[t] }]}>{SEARCH_TYPE_LABEL[t]}</Text>
              <Text style={styles.groupCount}>{hits.length}</Text>
            </View>
            {hits.map((hit) => (
              <Pressable key={`${hit.type}-${hit.id}`} style={({ pressed }) => [styles.hit, pressed && { opacity: 0.7 }]} onPress={() => open(hit)} accessibilityRole="button">
                <View style={{ flex: 1 }}>
                  <Text style={styles.hitTitle}>{hit.title}</Text>
                  {hit.subtitle ? <Text style={styles.hitSubtitle} numberOfLines={2}>{hit.subtitle}</Text> : null}
                  {hit.snippet ? <Text style={styles.hitSnippet} numberOfLines={3}>{hit.snippet}</Text> : null}
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </Pressable>
            ))}
          </View>
        ))}
        {data && data.total > data.hits.length ? (
          <Text style={styles.more}>Showing the first {data.hits.length} of {data.total}. Narrow the search or pick a type above.</Text>
        ) : null}
      </ScrollView>

      <Modal visible={!!selectedExplorerId && !!selectedExplorer} transparent animationType="fade" onRequestClose={() => setSelectedExplorerId(null)}>
        {selectedExplorer ? <ExplorerDetailModal explorer={selectedExplorer} onClose={() => setSelectedExplorerId(null)} /> : null}
      </Modal>
    </View>
  );
}

function Chip({ label, active, color, onPress }: { label: string; active: boolean; color: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && { backgroundColor: color, borderColor: color }]}>
      <Text style={[styles.chipText, active && { color: 'white' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 12, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  input: { flex: 1, fontSize: 16, color: '#1F2937', paddingVertical: 0 },
  chips: { paddingHorizontal: 12, paddingBottom: 8, gap: 8 },
  chip: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'white' },
  chipText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  results: { padding: 12, paddingBottom: 40 },
  hint: { fontSize: 14, color: '#4B5563', lineHeight: 21, paddingHorizontal: 4, marginBottom: 16 },
  suggestionsLabel: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8, paddingHorizontal: 4 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestion: { backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 },
  suggestionText: { fontSize: 14, color: colors.forestGreen, fontWeight: '600' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40, paddingHorizontal: 24 },
  group: { marginBottom: 16 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6, paddingHorizontal: 4 },
  groupDot: { width: 8, height: 8, borderRadius: 4 },
  groupTitle: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  groupCount: { fontSize: 12, color: '#9CA3AF' },
  hit: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  hitTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  hitSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  hitSnippet: { fontSize: 13, color: '#374151', marginTop: 6, lineHeight: 18, fontStyle: 'italic' },
  more: { textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 8 },
});
