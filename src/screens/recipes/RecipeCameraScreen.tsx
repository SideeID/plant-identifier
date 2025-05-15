import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { useImagePicker } from '../../hooks/useImagePicker';
import { RootStackParamList, Routes } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

type RecipeCameraScreenProps = StackScreenProps<
  RootStackParamList,
  typeof Routes.RecipeCamera
>;

const RecipeCameraScreen: React.FC<RecipeCameraScreenProps> = ({
  navigation,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null,
  );

  // Use image picker
  const { pickImage, isLoading: isPickerLoading } = useImagePicker({
    aspect: [4, 3],
    quality: 0.8,
  });

  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);

  // Handle camera capture using ImagePicker
  const handleCameraCapture = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        navigation.navigate(Routes.RecipeResult, {
          imageUri: result.assets[0].uri,
          useMockData: false, // Use actual Gemini API
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image.');
      console.error('Error capturing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle picking image from gallery
  const handlePickImage = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const imageUri = await pickImage();

      if (imageUri) {
        navigation.navigate(Routes.RecipeResult, {
          imageUri,
          useMockData: false, // Use actual Gemini API
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image.');
      console.error('Error selecting image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Render permission denied screen
  if (cameraPermission === false) {
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <MaterialIcons name='no-photography' size={60} color={colors.error} />
        <Text style={styles.permissionText}>
          Camera access is required to capture ingredient images.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={async () => {
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();
            setCameraPermission(status === 'granted');
          }}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Camera Placeholder */}
      <View style={styles.cameraContainer}>
        <View style={styles.camera}>
          <View style={styles.overlay}>
            <View style={styles.targetBox} />
            <Text style={styles.placeholderText}>
              Press the camera button to take a photo
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        <Text style={styles.instruction}>
          Take a clear photo of ingredients to get recipe ideas
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePickImage}
            disabled={isProcessing || isPickerLoading}
          >
            <MaterialIcons
              name='photo-library'
              size={28}
              color={colors.white}
            />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.captureButton]}
            onPress={handleCameraCapture}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size='large' color={colors.white} />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <MaterialIcons name='info-outline' size={28} color={colors.white} />
            <Text style={styles.buttonText}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Dark placeholder
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 8,
    opacity: 0.7,
  },
  placeholderText: {
    marginTop: spacing.md,
    color: colors.white,
    opacity: 0.7,
    fontSize: typography.fontSizes.body,
  },
  controls: {
    padding: spacing.md,
    backgroundColor: colors.black,
  },
  instruction: {
    color: colors.white,
    fontSize: typography.fontSizes.body,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
  },
  buttonText: {
    color: colors.white,
    marginTop: spacing.xs,
    fontSize: typography.fontSizes.small,
  },
  permissionText: {
    color: colors.white,
    fontSize: typography.fontSizes.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: spacing.sm,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.body,
    fontWeight: '500',
  },
});

export default RecipeCameraScreen;
