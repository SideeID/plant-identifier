import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

interface UseImagePickerOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}

interface UseImagePickerReturn {
  selectedImage: string | null;
  pickImage: () => Promise<string | null>;
  requestPermission: () => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const useImagePicker = (
  options: UseImagePickerOptions = {},
): UseImagePickerReturn => {
  const { allowsEditing = true, aspect = [1, 1], quality = 0.7 } = options;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request media library permission
  const requestPermission = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const granted = status === 'granted';

      if (!granted) {
        Alert.alert(
          'Media Library Permission Required',
          'Please grant media library permission to pick images.',
        );
        setError('Permission not granted');
      }

      return granted;
    } catch (err) {
      setError('Error requesting permission');
      return false;
    }
  };

  // Pick image from gallery
  const pickImage = async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Ensure permission is granted
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setIsLoading(false);
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing,
        aspect,
        quality,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        return result.assets[0].uri;
      } else {
        // User cancelled the picker
        return null;
      }
    } catch (err) {
      console.error('Error picking image:', err);
      setError('Failed to pick image');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedImage,
    pickImage,
    requestPermission,
    isLoading,
    error,
  };
};
