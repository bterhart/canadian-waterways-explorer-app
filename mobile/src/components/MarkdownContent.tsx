// MarkdownContent - Renders markdown text with proper styling for Deep Dive content
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MarkdownContentProps {
  content: string;
  baseTextColor?: string;
  accentColor?: string;
}

const colors = {
  forestGreen: '#2D5A3D',
  darkGreen: '#1A3A24',
  textPrimary: '#374151',
  textSecondary: '#6B7280',
};

export function MarkdownContent({
  content,
  baseTextColor = colors.textPrimary,
  accentColor = colors.forestGreen
}: MarkdownContentProps) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let listKey = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <View key={`list-${listKey++}`} style={styles.listContainer}>
          {currentList.map((item, idx) => (
            <View key={idx} style={styles.listItem}>
              <View style={[styles.bullet, { backgroundColor: accentColor }]} />
              <Text style={[styles.listText, { color: baseTextColor }]}>
                {renderInlineFormatting(item, baseTextColor, accentColor)}
              </Text>
            </View>
          ))}
        </View>
      );
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip empty lines but flush any pending list
    if (!trimmedLine) {
      flushList();
      continue;
    }

    // H2: ## Header
    if (trimmedLine.startsWith('## ')) {
      flushList();
      const headerText = trimmedLine.slice(3);
      elements.push(
        <Text key={`h2-${i}`} style={[styles.h2, { color: colors.darkGreen }]}>
          {headerText}
        </Text>
      );
      continue;
    }

    // H3: ### Header
    if (trimmedLine.startsWith('### ')) {
      flushList();
      const headerText = trimmedLine.slice(4);
      elements.push(
        <Text key={`h3-${i}`} style={[styles.h3, { color: accentColor }]}>
          {headerText}
        </Text>
      );
      continue;
    }

    // H4: #### Header
    if (trimmedLine.startsWith('#### ')) {
      flushList();
      const headerText = trimmedLine.slice(5);
      elements.push(
        <Text key={`h4-${i}`} style={[styles.h4, { color: colors.darkGreen }]}>
          {headerText}
        </Text>
      );
      continue;
    }

    // Bullet list item: - item or * item
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      const itemText = trimmedLine.slice(2);
      currentList.push(itemText);
      continue;
    }

    // Numbered list item: 1. item
    const numberedMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch) {
      currentList.push(numberedMatch[1]);
      continue;
    }

    // Bold-only line (like **Before the Fur Trade:**)
    if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
      flushList();
      const boldText = trimmedLine.slice(2, -2);
      elements.push(
        <Text key={`bold-${i}`} style={[styles.boldLine, { color: colors.darkGreen }]}>
          {boldText}
        </Text>
      );
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <Text key={`p-${i}`} style={[styles.paragraph, { color: baseTextColor }]}>
        {renderInlineFormatting(trimmedLine, baseTextColor, accentColor)}
      </Text>
    );
  }

  // Flush any remaining list
  flushList();

  return <View style={styles.container}>{elements}</View>;
}

// Render inline formatting like **bold** and *italic*
function renderInlineFormatting(
  text: string,
  baseColor: string,
  accentColor: string
): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Look for **bold** pattern
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)$/);
    if (boldMatch) {
      if (boldMatch[1]) {
        parts.push(<Text key={key++}>{boldMatch[1]}</Text>);
      }
      parts.push(
        <Text key={key++} style={{ fontWeight: '700', color: accentColor }}>
          {boldMatch[2]}
        </Text>
      );
      remaining = boldMatch[3];
      continue;
    }

    // Look for *italic* pattern (single asterisk)
    const italicMatch = remaining.match(/^(.*?)\*(.+?)\*(.*)$/);
    if (italicMatch) {
      if (italicMatch[1]) {
        parts.push(<Text key={key++}>{italicMatch[1]}</Text>);
      }
      parts.push(
        <Text key={key++} style={{ fontStyle: 'italic' }}>
          {italicMatch[2]}
        </Text>
      );
      remaining = italicMatch[3];
      continue;
    }

    // No more formatting, add the rest
    parts.push(<Text key={key++}>{remaining}</Text>);
    break;
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  h2: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 12,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    lineHeight: 24,
  },
  h4: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  boldLine: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 6,
    lineHeight: 22,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 12,
  },
  listContainer: {
    marginBottom: 12,
    paddingLeft: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 9,
    marginRight: 12,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
  },
});

export default MarkdownContent;
