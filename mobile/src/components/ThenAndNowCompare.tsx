// Then and now (roadmap item 7, 2026-10-20): a period image and a modern photograph of the same
// spot in one frame, with a handle to slide between them. Drag the handle (or tap a side) to
// reveal more of either; the year labels sit on each side. Below the frame, the caption and
// credit of each image. No new dependency: the slide is a PanResponder over two Images.
import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, PanResponder, Pressable, Linking, type LayoutChangeEvent } from 'react-native';
import { ChevronsLeftRight, ExternalLink } from 'lucide-react-native';
import type { ThenAndNowPair } from '@/lib/types/then-and-now';

interface Props {
  pair: ThenAndNowPair;
  /** Height of the frame; the width is the container's. */
  height?: number;
  /** Hide the captions and credits under the frame (the list shows them elsewhere). */
  bare?: boolean;
}

const HANDLE = 36;

export function ThenAndNowCompare({ pair, height = 240, bare }: Props) {
  const [width, setWidth] = useState(0);
  const [split, setSplit] = useState(0.5);
  const splitRef = useRef(0.5);
  const widthRef = useRef(0);
  const startRef = useRef(0.5);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 2,
      onPanResponderGrant: () => { startRef.current = splitRef.current; },
      onPanResponderMove: (_, g) => {
        if (!widthRef.current) return;
        const next = Math.min(0.98, Math.max(0.02, startRef.current + g.dx / widthRef.current));
        splitRef.current = next;
        setSplit(next);
      },
      onPanResponderTerminationRequest: () => false,
    }),
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    widthRef.current = e.nativeEvent.layout.width;
    setWidth(e.nativeEvent.layout.width);
  };
  const thenLabel = pair.then.yearLabel ?? (pair.then.year ? String(pair.then.year) : 'Then');
  const nowLabel = pair.now.year ? String(pair.now.year) : 'Now';
  const x = width * split;

  return (
    <View>
      <View style={[styles.frame, { height }]} onLayout={onLayout} {...pan.panHandlers}>
        {width > 0 ? (
          <>
            {/* The modern photograph underneath, full width */}
            <Image source={{ uri: pair.now.url }} style={{ width, height }} resizeMode="cover" />
            {/* The period image on top, clipped at the handle */}
            <View style={[styles.clip, { width: x, height }]} pointerEvents="none">
              <Image source={{ uri: pair.then.url }} style={{ width, height }} resizeMode="cover" />
            </View>
            <View style={[styles.divider, { left: x - 1, height }]} pointerEvents="none" />
            <View style={[styles.handle, { left: x - HANDLE / 2, top: height / 2 - HANDLE / 2 }]} pointerEvents="none">
              <ChevronsLeftRight size={20} color="#1F2937" />
            </View>
            <View style={[styles.tag, styles.tagLeft]} pointerEvents="none"><Text style={styles.tagText}>{thenLabel}</Text></View>
            <View style={[styles.tag, styles.tagRight]} pointerEvents="none"><Text style={styles.tagText}>{nowLabel}</Text></View>
          </>
        ) : null}
      </View>
      {!bare ? (
        <View style={styles.captions}>
          <Caption label={thenLabel} image={pair.then} />
          <Caption label={nowLabel} image={pair.now} />
        </View>
      ) : null}
    </View>
  );
}

function Caption({ label, image }: { label: string; image: ThenAndNowPair['then'] }) {
  return (
    <View style={styles.caption}>
      <Text style={styles.captionLabel}>{label}</Text>
      <Text style={styles.captionText}>{image.caption}</Text>
      <Pressable disabled={!image.sourceUrl} onPress={() => image.sourceUrl && Linking.openURL(image.sourceUrl)} style={styles.creditRow} hitSlop={4}>
        <Text style={styles.creditText} numberOfLines={2}>{image.credit}</Text>
        {image.sourceUrl ? <ExternalLink size={11} color="#9CA3AF" /> : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: '100%', backgroundColor: '#E5E7EB', borderRadius: 12, overflow: 'hidden' },
  clip: { position: 'absolute', left: 0, top: 0, overflow: 'hidden' },
  divider: { position: 'absolute', top: 0, width: 2, backgroundColor: 'white', shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 2, shadowOffset: { width: 0, height: 0 } },
  handle: { position: 'absolute', width: HANDLE, height: HANDLE, borderRadius: HANDLE / 2, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 3 },
  tag: { position: 'absolute', top: 8, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  tagLeft: { left: 8 },
  tagRight: { right: 8 },
  tagText: { color: 'white', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  captions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  caption: { flex: 1 },
  captionLabel: { fontSize: 10, fontWeight: '800', color: '#8B5A2B', letterSpacing: 0.5 },
  captionText: { fontSize: 12, color: '#374151', lineHeight: 17, marginTop: 2 },
  creditRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  creditText: { flex: 1, fontSize: 10, color: '#9CA3AF' },
});
