// Printable Resource Detail Screen — renders the stored HTML `content`.
// Live data: every printable has HTML content; none has a fileUrl yet.
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Linking,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { WebView } from 'react-native-webview';
import { Download, Printer } from 'lucide-react-native';
import { usePrintable } from '@/lib/api/education-api';
import {
  getGradeLevelRangeColor,
  getGradeLevelRangeLabel,
} from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

const formatResourceType = (type: string) => type.replace(/_/g, ' ');

// Wrap the stored HTML fragment in a minimal, print-friendly document.
function buildHtml(content: string): string {
  return `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<style>
  body { margin: 0; padding: 16px 20px 32px; font-family: -apple-system, Helvetica, Arial, sans-serif;
         font-size: 16px; line-height: 1.55; color: #374151; background: #ffffff; }
  h1, h2, h3, h4 { color: ${colors.darkGreen}; line-height: 1.25; margin: 1.2em 0 0.5em; }
  h2 { font-size: 1.25em; } h3 { font-size: 1.1em; }
  p { margin: 0 0 0.9em; }
  ul, ol { padding-left: 1.4em; margin: 0 0 1em; }
  li { margin-bottom: 0.35em; }
  table { border-collapse: collapse; width: 100%; margin: 0 0 1em; }
  th, td { border: 1px solid #E5E7EB; padding: 6px 8px; text-align: left; vertical-align: top; }
  th { background: #F3F4F6; }
  img { max-width: 100%; height: auto; }
  hr { border: 0; border-top: 1px solid #E5E7EB; margin: 1.2em 0; }
</style>
</head>
<body>${content}</body>
</html>`;
}

export default function PrintableDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: printable, isLoading, isError } = usePrintable(id ?? null);

  const html = useMemo(
    () => (printable?.content ? buildHtml(printable.content) : null),
    [printable?.content]
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
      </View>
    );
  }

  if (isError || !printable) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>Unable to load resource</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Printable',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadges}>
          <View style={styles.typeBadge}>
            <Printer size={14} color={colors.forestGreen} />
            <Text style={styles.typeText}>{formatResourceType(printable.resourceType)}</Text>
          </View>
          {printable.gradeLevel ? (
            <View
              style={[
                styles.gradeBadge,
                { backgroundColor: getGradeLevelRangeColor(printable.gradeLevel) },
              ]}
            >
              <Text style={styles.gradeBadgeText}>
                {getGradeLevelRangeLabel(printable.gradeLevel)}
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.title}>{printable.title}</Text>
        {printable.description ? (
          <Text style={styles.description}>{printable.description}</Text>
        ) : null}
        <View style={styles.topicBadge}>
          <Text style={styles.topicText}>{printable.topic}</Text>
        </View>
      </View>

      {/* Content */}
      {html ? (
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={styles.webview}
          // Links inside the content open in the device browser, not the WebView.
          onShouldStartLoadWithRequest={(request) => {
            if (request.url.startsWith('http')) {
              Linking.openURL(request.url);
              return false;
            }
            return true;
          }}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Printer size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No content available for this resource yet</Text>
        </View>
      )}

      {/* File download, only when a file exists */}
      {printable.fileUrl ? (
        <Pressable
          style={styles.downloadButton}
          onPress={() => Linking.openURL(printable.fileUrl as string)}
        >
          <Download size={18} color="white" />
          <Text style={styles.downloadText}>Download File</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.creamWhite,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.forestGreen + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.forestGreen,
    textTransform: 'capitalize',
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  gradeBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 10,
  },
  topicBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  topicText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  webview: {
    flex: 1,
    backgroundColor: 'white',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.forestGreen,
    padding: 16,
  },
  downloadText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
});
