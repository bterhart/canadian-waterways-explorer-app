import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  FileEdit,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Calendar,
  GraduationCap,
} from 'lucide-react-native';
import {
  useAdminDocuments,
  useDeleteDocument,
  adminDocumentsKeys,
  type AdminDocument,
} from '@/lib/api/admin-api';

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  waterBlue: '#3B82A3',
  earthBrown: '#8B5A2B',
  creamWhite: '#FFFEF7',
  white: '#FFFFFF',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray500: '#6B7280',
  gray700: '#374151',
  red500: '#EF4444',
  red600: '#DC2626',
  green500: '#22C55E',
  green600: '#16A34A',
  gold: '#C9A227',
};

// Document type colors
const documentTypeColors: Record<string, string> = {
  'Letter': colors.waterBlue,
  'Journal Entry': colors.earthBrown,
  'Map': colors.forestGreen,
  'Treaty': '#8B5CF6',
  'Report': '#0EA5E9',
};

interface DocumentCardProps {
  document: AdminDocument;
  onEdit: () => void;
  onDelete: () => void;
}

function DocumentCard({ document, onEdit, onDelete }: DocumentCardProps) {
  const typeColor = documentTypeColors[document.documentType] ?? colors.earthBrown;

  return (
    <View style={styles.documentCard}>
      {/* Document image or placeholder */}
      {document.imageUrl ? (
        <Image
          source={{ uri: document.imageUrl }}
          style={styles.documentImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.documentImagePlaceholder, { backgroundColor: `${typeColor}20` }]}>
          <FileText size={32} color={typeColor} />
        </View>
      )}

      <View style={styles.cardContent}>
        {/* Status and badges row */}
        <View style={styles.badgesRow}>
          {/* Published status */}
          <View style={[
            styles.statusBadge,
            document.isPublished ? styles.publishedBadge : styles.draftBadge
          ]}>
            {document.isPublished ? (
              <Eye size={12} color={colors.green600} />
            ) : (
              <EyeOff size={12} color={colors.gray500} />
            )}
            <Text style={[
              styles.statusText,
              { color: document.isPublished ? colors.green600 : colors.gray500 }
            ]}>
              {document.isPublished ? 'Published' : 'Draft'}
            </Text>
          </View>

          {/* Document type badge */}
          <View style={[styles.typeBadge, { backgroundColor: `${typeColor}20` }]}>
            <Text style={[styles.typeText, { color: typeColor }]}>
              {document.documentType}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.documentTitle} numberOfLines={2}>
          {document.title}
        </Text>

        {/* Meta info */}
        <View style={styles.metaRow}>
          {document.author ? (
            <Text style={styles.metaText} numberOfLines={1}>
              By {document.author}
            </Text>
          ) : null}
          {document.originalYear ? (
            <View style={styles.metaItem}>
              <Calendar size={14} color={colors.gray500} />
              <Text style={styles.metaText}>{document.originalYear}</Text>
            </View>
          ) : null}
        </View>

        {/* Stats row */}
        {document.gradeLevel ? (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <GraduationCap size={16} color={colors.gray500} />
              <Text style={styles.statText}>
                Grade {document.gradeLevel}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Actions row */}
        <View style={styles.actionsRow}>
          <Pressable style={styles.editButton} onPress={onEdit}>
            <FileEdit size={18} color={colors.forestGreen} />
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={onDelete}>
            <Trash2 size={18} color={colors.red600} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function AdminDocumentsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: documents, isLoading, error, refetch } = useAdminDocuments();
  const deleteMutation = useDeleteDocument();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateDocument = () => {
    // TODO: Create document editor route
    Alert.alert('Coming Soon', 'Document editor is under development');
  };

  const handleEditDocument = (documentId: string) => {
    // TODO: Navigate to document editor
    Alert.alert('Coming Soon', 'Document editor is under development');
  };

  const handleDeleteDocument = (document: AdminDocument) => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete "${document.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(document.id);
            try {
              await deleteMutation.mutateAsync(document.id);
              queryClient.invalidateQueries({ queryKey: adminDocumentsKeys.list() });
            } catch (err) {
              Alert.alert('Error', 'Failed to delete document. Please try again.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Manage Documents',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Loading documents...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Manage Documents',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Documents</Text>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'An error occurred'}
          </Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Manage Documents',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* Create button */}
      <View style={styles.headerSection}>
        <Pressable style={styles.createButton} onPress={handleCreateDocument}>
          <Plus size={20} color={colors.white} />
          <Text style={styles.createButtonText}>Create New Document</Text>
        </Pressable>
        <Text style={styles.itemCount}>
          {documents?.length ?? 0} document{(documents?.length ?? 0) !== 1 ? 's' : ''} total
        </Text>
      </View>

      {/* Document list */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {documents && documents.length > 0 ? (
          documents.map((document) => (
            <View key={document.id} style={deletingId === document.id ? styles.deletingCard : undefined}>
              {deletingId === document.id ? (
                <View style={styles.deletingOverlay}>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.deletingText}>Deleting...</Text>
                </View>
              ) : null}
              <DocumentCard
                document={document}
                onEdit={() => handleEditDocument(document.id)}
                onDelete={() => handleDeleteDocument(document)}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <FileText size={48} color={colors.gray200} />
            <Text style={styles.emptyTitle}>No Documents Yet</Text>
            <Text style={styles.emptyText}>
              Create your first primary source document to get started
            </Text>
            <Pressable style={styles.createEmptyButton} onPress={handleCreateDocument}>
              <Plus size={18} color={colors.white} />
              <Text style={styles.createEmptyButtonText}>Create Document</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },

  // Header section
  headerSection: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.forestGreen,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  itemCount: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 12,
    textAlign: 'center',
  },

  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: colors.gray500,
    marginTop: 12,
  },

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // List
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Document card
  documentCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  documentImage: {
    width: '100%',
    height: 180,
  },
  documentImagePlaceholder: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
  },

  // Badges row
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  publishedBadge: {
    backgroundColor: '#D1FAE5',
  },
  draftBadge: {
    backgroundColor: colors.gray100,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Document info
  documentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray700,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: colors.gray500,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: colors.gray500,
  },

  // Actions row
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingTop: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: `${colors.forestGreen}10`,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.forestGreen,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: `${colors.red600}10`,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.red600,
  },

  // Deleting state
  deletingCard: {
    opacity: 0.5,
    position: 'relative',
  },
  deletingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  deletingText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray700,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    marginBottom: 24,
  },
  createEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  createEmptyButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
