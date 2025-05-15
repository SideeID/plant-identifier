import { useState, useRef, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';

// Safely get CameraType from expo-camera
const CameraTypes = {
  front: 'front',
  back: 'back',
};

interface UseCameraOptions {
  saveToGallery?: boolean;
}

interface UseCameraReturn {
  camera: React.RefObject<any>; // Using 'any' to avoid type issues with Camera
  type: any; // Use any for Camera type to avoid type issues
  permission: boolean | null;
  isReady: boolean;
  takePicture: () => Promise<string | null>;
  toggleCameraType: () => void;
  requestPermission: () => Promise<boolean>;
}

export const useCamera = (options: UseCameraOptions = {}): UseCameraReturn => {
  const { saveToGallery = false } = options;
  const [permission, setPermission] = useState<boolean | null>(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<
    boolean | null
  >(null);
  const [type, setType] = useState(CameraTypes.back);
  const [isReady, setIsReady] = useState(false);
  const camera = useRef<any>(null);

  // Request camera permissions on mount
  useEffect(() => {
    requestPermission();
    if (saveToGallery) {
      requestMediaLibraryPermission();
    }
  }, []);

  // Request camera permission
  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    const granted = status === 'granted';
    setPermission(granted);

    if (!granted) {
      Alert.alert(
        'Camera Permission Required',
        'Please grant camera permission to use this feature.',
      );
    }

    return granted;
  };

  // Request media library permission
  const requestMediaLibraryPermission = async () => {
    if (!saveToGallery) return true;

    const { status } = await MediaLibrary.requestPermissionsAsync();
    const granted = status === 'granted';
    setMediaLibraryPermission(granted);

    if (!granted && saveToGallery) {
      Alert.alert(
        'Media Library Permission Required',
        'Please grant media library permission to save photos.',
      );
    }

    return granted;
  }; // Toggle between front and back camera
  const toggleCameraType = () => {
    setType((current) =>
      current === CameraTypes.back ? CameraTypes.front : CameraTypes.back,
    );
  };

  // Take a picture
  const takePicture = async (): Promise<string | null> => {
    if (!camera.current || !permission) {
      Alert.alert('Error', 'Camera not available or permission not granted.');
      return null;
    }

    try {
      const photo = await camera.current.takePictureAsync();

      // Save to gallery if requested and permission granted
      if (saveToGallery && mediaLibraryPermission) {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
      }

      return photo.uri;
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture.');
      return null;
    }
  };

  return {
    camera,
    type,
    permission,
    isReady,
    takePicture,
    toggleCameraType,
    requestPermission,
  };
};
