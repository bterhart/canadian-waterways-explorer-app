// Contribution Submission Modal Component
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { X, Send } from 'lucide-react-native';
import { useSubmitContribution } from '@/lib/api/waterways-api';
import type { ContributionType } from '@/lib/types/waterways';

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  waterBlue: '#3B82A3',
  earthBrown: '#8B5A2B',
  creamWhite: '#FFFEF7',
  gold: '#C9A227',
};

interface ContributeModalProps {
  visible: boolean;
  onClose: () => void;
  waterwayId?: string;
  locationId?: string;
  waterwayName?: string;
  locationName?: string;
}

const CONTRIBUTION_TYPES: { value: ContributionType; label: string }[] = [
  { value: 'photo', label: 'Photo' },
  { value: 'description', label: 'Description' },
  { value: 'historical_fact', label: 'Historical Fact' },
  { value: 'story', label: 'Story' },
];

export default function ContributeModal({
  visible,
  onClose,
  waterwayId,
  locationId,
  waterwayName,
  locationName,
}: ContributeModalProps) {
  const [contributionType, setContributionType] = useState<ContributionType>('description');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contributorName, setContributorName] = useState('');
  const [contributorEmail, setContributorEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const submitMutation = useSubmitContribution();

  const targetName = locationName || waterwayName || 'this location';

  const resetForm = () => {
    setContributionType('description');
    setTitle('');
    setContent('');
    setContributorName('');
    setContributorEmail('');
    setErrors({});
    setShowSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await submitMutation.mutateAsync({
        contributionType,
        title: title.trim(),
        content: content.trim(),
        contributorName: contributorName.trim() || undefined,
        contributorEmail: contributorEmail.trim() || undefined,
        waterwayId,
        locationId,
      });
      setShowSuccess(true);
    } catch (error) {
      // Error is handled by mutation state
    }
  };

  if (showSuccess) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleClose}
      >
        <View style={styles.container}>
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <Send size={48} color={colors.forestGreen} />
            </View>
            <Text style={styles.successTitle}>Thank You!</Text>
            <Text style={styles.successMessage}>
              Your contribution will be reviewed by our team.
            </Text>
            <Pressable style={styles.successButton} onPress={handleClose}>
              <Text style={styles.successButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <X size={24} color={colors.forestGreen} />
            </Pressable>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Contribute</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                to {targetName}
              </Text>
            </View>
            <Pressable
              style={[
                styles.submitButton,
                submitMutation.isPending && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <ActivityIndicator size="small" color={colors.creamWhite} />
              ) : (
                <Send size={20} color={colors.creamWhite} />
              )}
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Error Message */}
          {submitMutation.isError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>
                Failed to submit contribution. Please try again.
              </Text>
            </View>
          ) : null}

          {/* Contribution Type Selector */}
          <View style={styles.section}>
            <Text style={styles.label}>Type of Contribution</Text>
            <View style={styles.typeSelector}>
              {CONTRIBUTION_TYPES.map((type) => (
                <Pressable
                  key={type.value}
                  style={[
                    styles.typeOption,
                    contributionType === type.value && styles.typeOptionSelected,
                  ]}
                  onPress={() => setContributionType(type.value)}
                >
                  <Text
                    style={[
                      styles.typeOptionText,
                      contributionType === type.value && styles.typeOptionTextSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Title Input */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Title <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.title ? styles.inputError : null]}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              placeholder="Give your contribution a title"
              placeholderTextColor="#9CA3AF"
              maxLength={100}
            />
            {errors.title ? (
              <Text style={styles.errorText}>{errors.title}</Text>
            ) : null}
          </View>

          {/* Content Textarea */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Content <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textarea,
                errors.content ? styles.inputError : null,
              ]}
              value={content}
              onChangeText={(text) => {
                setContent(text);
                if (errors.content) setErrors({ ...errors, content: undefined });
              }}
              placeholder="Share your knowledge, story, or description..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={2000}
            />
            {errors.content ? (
              <Text style={styles.errorText}>{errors.content}</Text>
            ) : null}
          </View>

          {/* Optional Fields Section */}
          <View style={styles.optionalSection}>
            <Text style={styles.optionalTitle}>Optional Information</Text>

            {/* Contributor Name */}
            <View style={styles.section}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                value={contributorName}
                onChangeText={setContributorName}
                placeholder="How should we credit you?"
                placeholderTextColor="#9CA3AF"
                maxLength={100}
              />
            </View>

            {/* Contributor Email */}
            <View style={styles.section}>
              <Text style={styles.label}>Your Email</Text>
              <TextInput
                style={styles.input}
                value={contributorEmail}
                onChangeText={setContributorEmail}
                placeholder="We may reach out with questions"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={255}
              />
            </View>
          </View>

          {/* Submit Button (for scrolled view) */}
          <Pressable
            style={[
              styles.submitButtonLarge,
              submitMutation.isPending && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              <ActivityIndicator size="small" color={colors.creamWhite} />
            ) : (
              <>
                <Send size={20} color={colors.creamWhite} style={styles.submitIcon} />
                <Text style={styles.submitButtonLargeText}>Submit Contribution</Text>
              </>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  header: {
    backgroundColor: colors.creamWhite,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(45, 90, 61, 0.1)',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(45, 90, 61, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.forestGreen,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.earthBrown,
    marginTop: 2,
  },
  submitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.forestGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.forestGreen,
    marginBottom: 8,
  },
  required: {
    color: '#DC2626',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(45, 90, 61, 0.1)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeOptionSelected: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.forestGreen,
  },
  typeOptionTextSelected: {
    color: colors.creamWhite,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 61, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  textarea: {
    minHeight: 140,
    paddingTop: 14,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginTop: 4,
  },
  optionalSection: {
    backgroundColor: 'rgba(59, 130, 163, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  optionalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.waterBlue,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  submitButtonLarge: {
    backgroundColor: colors.forestGreen,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonLargeText: {
    color: colors.creamWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(45, 90, 61, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.forestGreen,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: colors.earthBrown,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  successButton: {
    backgroundColor: colors.forestGreen,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  successButtonText: {
    color: colors.creamWhite,
    fontSize: 16,
    fontWeight: '600',
  },
});
