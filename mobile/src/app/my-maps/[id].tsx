// Map Editor Screen - Full screen map with annotation tools
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import MapView, { Marker, Polyline, Callout, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import {
  MapPin,
  Route,
  StickyNote,
  Eraser,
  Save,
  Share2,
  Download,
  X,
  Check,
  Layers,
  List,
  ChevronDown,
  Palette,
  Trash2,
  Edit3,
  ArrowLeft,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useMapAnnotation,
  useAddMapPin,
  useAddMapRoute,
  useAddMapNote,
  useDeleteMapPin,
  useDeleteMapRoute,
  useDeleteMapNote,
  useShareMapAnnotation,
  useUpdateMapAnnotation,
} from '@/lib/api/education-api';
import type { MapPin as MapPinType, MapRoute as MapRouteType, MapNote as MapNoteType } from '@/lib/types/education';

const { width, height } = Dimensions.get('window');

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
  gold: '#C9A962',
  lightGreen: '#E8F5E9',
  coral: '#FF6B6B',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  orange: '#F97316',
  pink: '#EC4899',
};

// Available colors for annotations
const ANNOTATION_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#2D5A3D', // Forest Green
];

type Tool = 'pin' | 'route' | 'note' | 'eraser' | null;

// Canada centered region
const CANADA_REGION = {
  latitude: 56.0,
  longitude: -96.0,
  latitudeDelta: 40,
  longitudeDelta: 40,
};

interface EditModalData {
  type: 'pin' | 'route' | 'note';
  id: string;
  title?: string;
  description?: string;
  content?: string;
  color?: string;
}

export default function MapEditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const mapRef = useRef<MapView>(null);

  // State
  const [selectedTool, setSelectedTool] = useState<Tool>(null);
  const [routePoints, setRoutePoints] = useState<{ latitude: number; longitude: number }[]>([]);
  const [isDrawingRoute, setIsDrawingRoute] = useState(false);
  const [showAnnotationsList, setShowAnnotationsList] = useState(false);
  const [selectedColor, setSelectedColor] = useState(ANNOTATION_COLORS[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Modal states
  const [pinModal, setPinModal] = useState<{ visible: boolean; latitude: number; longitude: number }>({
    visible: false,
    latitude: 0,
    longitude: 0,
  });
  const [pinTitle, setPinTitle] = useState('');
  const [pinDescription, setPinDescription] = useState('');

  const [noteModal, setNoteModal] = useState<{ visible: boolean; latitude: number; longitude: number }>({
    visible: false,
    latitude: 0,
    longitude: 0,
  });
  const [noteContent, setNoteContent] = useState('');

  const [routeModal, setRouteModal] = useState(false);
  const [routeTitle, setRouteTitle] = useState('');
  const [routeDescription, setRouteDescription] = useState('');

  const [editModal, setEditModal] = useState<EditModalData | null>(null);

  // Queries and mutations
  const { data: mapData, isLoading, error, refetch } = useMapAnnotation(id ?? null);
  const addPin = useAddMapPin();
  const addRoute = useAddMapRoute();
  const addNote = useAddMapNote();
  const deletePin = useDeleteMapPin();
  const deleteRoute = useDeleteMapRoute();
  const deleteNote = useDeleteMapNote();
  const shareMap = useShareMapAnnotation();
  const updateMap = useUpdateMapAnnotation();

  // Handle map press based on selected tool
  const handleMapPress = useCallback(
    (event: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
      const { latitude, longitude } = event.nativeEvent.coordinate;

      switch (selectedTool) {
        case 'pin':
          setPinModal({ visible: true, latitude, longitude });
          setPinTitle('');
          setPinDescription('');
          break;

        case 'route':
          if (!isDrawingRoute) {
            setIsDrawingRoute(true);
            setRoutePoints([{ latitude, longitude }]);
          } else {
            setRoutePoints((prev) => [...prev, { latitude, longitude }]);
          }
          break;

        case 'note':
          setNoteModal({ visible: true, latitude, longitude });
          setNoteContent('');
          break;

        default:
          break;
      }
    },
    [selectedTool, isDrawingRoute]
  );

  // Handle marker press for eraser tool
  const handleMarkerPress = useCallback(
    (type: 'pin' | 'note', itemId: string, title?: string) => {
      if (selectedTool === 'eraser') {
        Alert.alert(
          'Delete Annotation',
          `Delete this ${type}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                if (type === 'pin') {
                  deletePin.mutate({ annotationId: id!, pinId: itemId });
                } else {
                  deleteNote.mutate({ annotationId: id!, noteId: itemId });
                }
              },
            },
          ]
        );
      }
    },
    [selectedTool, id, deletePin, deleteNote]
  );

  // Handle route press for eraser tool
  const handleRoutePress = useCallback(
    (routeId: string, routeTitle: string) => {
      if (selectedTool === 'eraser') {
        Alert.alert(
          'Delete Route',
          `Delete "${routeTitle}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                deleteRoute.mutate({ annotationId: id!, routeId });
              },
            },
          ]
        );
      }
    },
    [selectedTool, id, deleteRoute]
  );

  // Save pin
  const handleSavePin = () => {
    if (!pinTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for the pin');
      return;
    }

    addPin.mutate(
      {
        annotationId: id!,
        payload: {
          latitude: pinModal.latitude,
          longitude: pinModal.longitude,
          title: pinTitle.trim(),
          description: pinDescription.trim() || undefined,
          color: selectedColor,
        },
      },
      {
        onSuccess: () => {
          setPinModal({ visible: false, latitude: 0, longitude: 0 });
          refetch();
        },
        onError: () => {
          Alert.alert('Error', 'Failed to add pin');
        },
      }
    );
  };

  // Save route
  const handleSaveRoute = () => {
    if (!routeTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for the route');
      return;
    }

    if (routePoints.length < 2) {
      Alert.alert('Error', 'Please draw at least 2 points');
      return;
    }

    const coordinates: [number, number][] = routePoints.map((p) => [p.latitude, p.longitude]);

    addRoute.mutate(
      {
        annotationId: id!,
        payload: {
          title: routeTitle.trim(),
          description: routeDescription.trim() || undefined,
          coordinates,
          color: selectedColor,
        },
      },
      {
        onSuccess: () => {
          setRouteModal(false);
          setRoutePoints([]);
          setIsDrawingRoute(false);
          setRouteTitle('');
          setRouteDescription('');
          refetch();
        },
        onError: () => {
          Alert.alert('Error', 'Failed to add route');
        },
      }
    );
  };

  // Save note
  const handleSaveNote = () => {
    if (!noteContent.trim()) {
      Alert.alert('Error', 'Please enter some text for the note');
      return;
    }

    addNote.mutate(
      {
        annotationId: id!,
        payload: {
          latitude: noteModal.latitude,
          longitude: noteModal.longitude,
          content: noteContent.trim(),
          backgroundColor: selectedColor,
        },
      },
      {
        onSuccess: () => {
          setNoteModal({ visible: false, latitude: 0, longitude: 0 });
          refetch();
        },
        onError: () => {
          Alert.alert('Error', 'Failed to add note');
        },
      }
    );
  };

  // Complete route drawing
  const handleCompleteRoute = () => {
    if (routePoints.length >= 2) {
      setRouteModal(true);
      setRouteTitle('');
      setRouteDescription('');
    } else {
      Alert.alert('Error', 'Please add at least 2 points to create a route');
    }
  };

  // Cancel route drawing
  const handleCancelRoute = () => {
    setRoutePoints([]);
    setIsDrawingRoute(false);
  };

  // Share map
  const handleShare = () => {
    shareMap.mutate(id!, {
      onSuccess: (data) => {
        const shareCode = data.shareCode;
        Alert.alert(
          'Map Shared!',
          `Your share code is: ${shareCode}\n\nShare this code with others so they can view your map.`,
          [{ text: 'OK' }]
        );
      },
      onError: () => {
        Alert.alert('Error', 'Failed to generate share code');
      },
    });
  };

  // Export map data
  const handleExport = () => {
    if (!mapData) return;

    const exportData = {
      title: mapData.title,
      description: mapData.description,
      pins: mapData.pins,
      routes: mapData.routes,
      notes: mapData.notes,
      exportedAt: new Date().toISOString(),
    };

    Alert.alert(
      'Export Complete',
      `Map "${mapData.title}" has been prepared for export.\n\n${mapData.pins.length} pins, ${mapData.routes.length} routes, ${mapData.notes.length} notes`,
      [{ text: 'OK' }]
    );
  };

  // Tool button component
  const ToolButton = ({
    tool,
    icon,
    label,
    isActive,
  }: {
    tool: Tool;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
  }) => (
    <Pressable
      onPress={() => {
        if (selectedTool === tool) {
          setSelectedTool(null);
        } else {
          setSelectedTool(tool);
          if (tool !== 'route') {
            setRoutePoints([]);
            setIsDrawingRoute(false);
          }
        }
      }}
      style={[styles.toolButton, isActive && styles.toolButtonActive]}
    >
      {icon}
      <Text style={[styles.toolLabel, isActive && styles.toolLabelActive]}>{label}</Text>
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.forestGreen} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (error || !mapData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load map</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        {/* Map */}
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={
            mapData.centerLatitude && mapData.centerLongitude
              ? {
                  latitude: mapData.centerLatitude,
                  longitude: mapData.centerLongitude,
                  latitudeDelta: mapData.zoomLevel ?? 10,
                  longitudeDelta: mapData.zoomLevel ?? 10,
                }
              : CANADA_REGION
          }
          onPress={handleMapPress}
          showsUserLocation
          showsCompass
        >
          {/* Render existing pins */}
          {mapData.pins.map((pin) => (
            <Marker
              key={pin.id}
              coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
              pinColor={pin.color ?? colors.coral}
              onPress={() => handleMarkerPress('pin', pin.id, pin.title)}
            >
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{pin.title}</Text>
                  {pin.description ? (
                    <Text style={styles.calloutDescription}>{pin.description}</Text>
                  ) : null}
                </View>
              </Callout>
            </Marker>
          ))}

          {/* Render existing routes */}
          {mapData.routes.map((route) => (
            <Polyline
              key={route.id}
              coordinates={route.coordinates.map((c) => ({ latitude: c[0], longitude: c[1] }))}
              strokeColor={route.color ?? colors.blue}
              strokeWidth={route.strokeWidth ?? 3}
              lineDashPattern={route.isDashed ? [10, 5] : undefined}
              tappable
              onPress={() => handleRoutePress(route.id, route.title)}
            />
          ))}

          {/* Render existing notes as markers */}
          {mapData.notes.map((note) => (
            <Marker
              key={note.id}
              coordinate={{ latitude: note.latitude, longitude: note.longitude }}
              onPress={() => handleMarkerPress('note', note.id)}
            >
              <View style={[styles.noteMarker, { backgroundColor: note.backgroundColor ?? colors.gold }]}>
                <StickyNote size={16} color="white" />
              </View>
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutDescription}>{note.content}</Text>
                </View>
              </Callout>
            </Marker>
          ))}

          {/* Render route being drawn */}
          {routePoints.length > 0 && (
            <>
              <Polyline
                coordinates={routePoints}
                strokeColor={selectedColor}
                strokeWidth={4}
                lineDashPattern={[5, 5]}
              />
              {routePoints.map((point, index) => (
                <Marker
                  key={`route-point-${index}`}
                  coordinate={point}
                  anchor={{ x: 0.5, y: 0.5 }}
                >
                  <View style={[styles.routePoint, { backgroundColor: selectedColor }]}>
                    <Text style={styles.routePointText}>{index + 1}</Text>
                  </View>
                </Marker>
              ))}
            </>
          )}
        </MapView>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <ArrowLeft size={24} color="white" />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {mapData.title}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable onPress={handleShare} style={styles.headerButton}>
              <Share2 size={20} color="white" />
            </Pressable>
            <Pressable onPress={handleExport} style={styles.headerButton}>
              <Download size={20} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Selected Tool Indicator */}
        {selectedTool ? (
          <View style={styles.toolIndicator}>
            <Text style={styles.toolIndicatorText}>
              {selectedTool === 'pin' ? 'Tap on the map to add a pin' : null}
              {selectedTool === 'route' ? (isDrawingRoute ? 'Tap to add points, then complete route' : 'Tap to start drawing a route') : null}
              {selectedTool === 'note' ? 'Tap on the map to add a note' : null}
              {selectedTool === 'eraser' ? 'Tap on pins, notes, or routes to delete' : null}
            </Text>
          </View>
        ) : null}

        {/* Route Drawing Controls */}
        {isDrawingRoute ? (
          <View style={styles.routeControls}>
            <Text style={styles.routeControlsText}>{routePoints.length} points added</Text>
            <View style={styles.routeControlsButtons}>
              <Pressable onPress={handleCancelRoute} style={styles.routeControlButton}>
                <X size={20} color={colors.coral} />
                <Text style={[styles.routeControlButtonText, { color: colors.coral }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleCompleteRoute}
                style={[styles.routeControlButton, styles.routeControlButtonPrimary]}
              >
                <Check size={20} color="white" />
                <Text style={[styles.routeControlButtonText, { color: 'white' }]}>Complete</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* Color Picker */}
        {showColorPicker ? (
          <View style={styles.colorPicker}>
            <Text style={styles.colorPickerTitle}>Select Color</Text>
            <View style={styles.colorOptions}>
              {ANNOTATION_COLORS.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => {
                    setSelectedColor(color);
                    setShowColorPicker(false);
                  }}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected,
                  ]}
                />
              ))}
            </View>
          </View>
        ) : null}

        {/* Bottom Toolbar */}
        <View style={styles.toolbar}>
          <View style={styles.toolbarMain}>
            <ToolButton
              tool="pin"
              icon={<MapPin size={22} color={selectedTool === 'pin' ? 'white' : colors.forestGreen} />}
              label="Pin"
              isActive={selectedTool === 'pin'}
            />
            <ToolButton
              tool="route"
              icon={<Route size={22} color={selectedTool === 'route' ? 'white' : colors.forestGreen} />}
              label="Route"
              isActive={selectedTool === 'route'}
            />
            <ToolButton
              tool="note"
              icon={<StickyNote size={22} color={selectedTool === 'note' ? 'white' : colors.forestGreen} />}
              label="Note"
              isActive={selectedTool === 'note'}
            />
            <ToolButton
              tool="eraser"
              icon={<Eraser size={22} color={selectedTool === 'eraser' ? 'white' : colors.forestGreen} />}
              label="Eraser"
              isActive={selectedTool === 'eraser'}
            />
          </View>
          <View style={styles.toolbarDivider} />
          <Pressable
            onPress={() => setShowColorPicker(!showColorPicker)}
            style={styles.colorButton}
          >
            <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />
            <Palette size={18} color={colors.forestGreen} />
          </Pressable>
          <Pressable
            onPress={() => setShowAnnotationsList(true)}
            style={styles.listButton}
          >
            <List size={22} color={colors.forestGreen} />
          </Pressable>
        </View>

        {/* Pin Modal */}
        <Modal
          visible={pinModal.visible}
          animationType="slide"
          transparent
          onRequestClose={() => setPinModal({ visible: false, latitude: 0, longitude: 0 })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Pin</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Pin title"
                value={pinTitle}
                onChangeText={setPinTitle}
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                placeholder="Description (optional)"
                value={pinDescription}
                onChangeText={setPinDescription}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9CA3AF"
              />
              <View style={styles.modalButtons}>
                <Pressable
                  onPress={() => setPinModal({ visible: false, latitude: 0, longitude: 0 })}
                  style={styles.modalButtonCancel}
                >
                  <Text style={styles.modalButtonCancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSavePin}
                  style={styles.modalButtonSave}
                  disabled={addPin.isPending}
                >
                  {addPin.isPending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.modalButtonSaveText}>Add Pin</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Note Modal */}
        <Modal
          visible={noteModal.visible}
          animationType="slide"
          transparent
          onRequestClose={() => setNoteModal({ visible: false, latitude: 0, longitude: 0 })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Note</Text>
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                placeholder="Write your note here..."
                value={noteContent}
                onChangeText={setNoteContent}
                multiline
                numberOfLines={4}
                placeholderTextColor="#9CA3AF"
              />
              <View style={styles.modalButtons}>
                <Pressable
                  onPress={() => setNoteModal({ visible: false, latitude: 0, longitude: 0 })}
                  style={styles.modalButtonCancel}
                >
                  <Text style={styles.modalButtonCancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSaveNote}
                  style={styles.modalButtonSave}
                  disabled={addNote.isPending}
                >
                  {addNote.isPending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.modalButtonSaveText}>Add Note</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Route Modal */}
        <Modal
          visible={routeModal}
          animationType="slide"
          transparent
          onRequestClose={() => setRouteModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Save Route</Text>
              <Text style={styles.modalSubtitle}>
                {routePoints.length} points in this route
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Route name"
                value={routeTitle}
                onChangeText={setRouteTitle}
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                placeholder="Description (optional)"
                value={routeDescription}
                onChangeText={setRouteDescription}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9CA3AF"
              />
              <View style={styles.modalButtons}>
                <Pressable
                  onPress={() => {
                    setRouteModal(false);
                  }}
                  style={styles.modalButtonCancel}
                >
                  <Text style={styles.modalButtonCancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSaveRoute}
                  style={styles.modalButtonSave}
                  disabled={addRoute.isPending}
                >
                  {addRoute.isPending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.modalButtonSaveText}>Save Route</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Annotations List Modal */}
        <Modal
          visible={showAnnotationsList}
          animationType="slide"
          transparent
          onRequestClose={() => setShowAnnotationsList(false)}
        >
          <View style={styles.listModalOverlay}>
            <View style={styles.listModalContent}>
              <View style={styles.listModalHeader}>
                <Text style={styles.listModalTitle}>Annotations</Text>
                <Pressable onPress={() => setShowAnnotationsList(false)}>
                  <X size={24} color={colors.darkGreen} />
                </Pressable>
              </View>
              <ScrollView style={styles.listModalScroll}>
                {/* Pins Section */}
                <Text style={styles.listSectionTitle}>
                  Pins ({mapData.pins.length})
                </Text>
                {mapData.pins.length === 0 ? (
                  <Text style={styles.listEmptyText}>No pins added yet</Text>
                ) : (
                  mapData.pins.map((pin) => (
                    <View key={pin.id} style={styles.listItem}>
                      <View style={[styles.listItemIcon, { backgroundColor: pin.color ?? colors.coral }]}>
                        <MapPin size={14} color="white" />
                      </View>
                      <View style={styles.listItemContent}>
                        <Text style={styles.listItemTitle}>{pin.title}</Text>
                        {pin.description ? (
                          <Text style={styles.listItemDescription} numberOfLines={1}>
                            {pin.description}
                          </Text>
                        ) : null}
                      </View>
                      <Pressable
                        onPress={() => {
                          deletePin.mutate({ annotationId: id!, pinId: pin.id });
                        }}
                        style={styles.listItemDelete}
                      >
                        <Trash2 size={18} color={colors.coral} />
                      </Pressable>
                    </View>
                  ))
                )}

                {/* Routes Section */}
                <Text style={styles.listSectionTitle}>
                  Routes ({mapData.routes.length})
                </Text>
                {mapData.routes.length === 0 ? (
                  <Text style={styles.listEmptyText}>No routes added yet</Text>
                ) : (
                  mapData.routes.map((route) => (
                    <View key={route.id} style={styles.listItem}>
                      <View style={[styles.listItemIcon, { backgroundColor: route.color ?? colors.blue }]}>
                        <Route size={14} color="white" />
                      </View>
                      <View style={styles.listItemContent}>
                        <Text style={styles.listItemTitle}>{route.title}</Text>
                        <Text style={styles.listItemDescription}>
                          {route.coordinates.length} points
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => {
                          deleteRoute.mutate({ annotationId: id!, routeId: route.id });
                        }}
                        style={styles.listItemDelete}
                      >
                        <Trash2 size={18} color={colors.coral} />
                      </Pressable>
                    </View>
                  ))
                )}

                {/* Notes Section */}
                <Text style={styles.listSectionTitle}>
                  Notes ({mapData.notes.length})
                </Text>
                {mapData.notes.length === 0 ? (
                  <Text style={styles.listEmptyText}>No notes added yet</Text>
                ) : (
                  mapData.notes.map((note) => (
                    <View key={note.id} style={styles.listItem}>
                      <View style={[styles.listItemIcon, { backgroundColor: note.backgroundColor ?? colors.gold }]}>
                        <StickyNote size={14} color="white" />
                      </View>
                      <View style={styles.listItemContent}>
                        <Text style={styles.listItemDescription} numberOfLines={2}>
                          {note.content}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => {
                          deleteNote.mutate({ annotationId: id!, noteId: note.id });
                        }}
                        style={styles.listItemDelete}
                      >
                        <Trash2 size={18} color={colors.coral} />
                      </Pressable>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.creamWhite,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.forestGreen,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.creamWhite,
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.forestGreen,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(45, 90, 61, 0.95)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  toolIndicator: {
    position: 'absolute',
    top: 110,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  toolIndicatorText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  routeControls: {
    position: 'absolute',
    top: 160,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  routeControlsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGreen,
    marginBottom: 12,
    textAlign: 'center',
  },
  routeControlsButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  routeControlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  routeControlButtonPrimary: {
    backgroundColor: colors.forestGreen,
  },
  routeControlButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  colorPicker: {
    position: 'absolute',
    bottom: 140,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  colorPickerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGreen,
    marginBottom: 12,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: colors.darkGreen,
  },
  toolbar: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  toolbarMain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  toolbarDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  toolButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  toolButtonActive: {
    backgroundColor: colors.forestGreen,
  },
  toolLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.forestGreen,
    marginTop: 4,
  },
  toolLabelActive: {
    color: 'white',
  },
  colorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  listButton: {
    padding: 8,
  },
  callout: {
    padding: 8,
    maxWidth: 200,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  noteMarker: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  routePoint: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  routePointText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.darkGreen,
    marginBottom: 12,
  },
  modalTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalButtonSave: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.forestGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  listModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  listModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.7,
  },
  listModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  listModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  listModalScroll: {
    padding: 20,
    paddingBottom: 40,
  },
  listSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.forestGreen,
    marginTop: 16,
    marginBottom: 8,
  },
  listEmptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  listItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  listItemDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  listItemDelete: {
    padding: 8,
  },
});
