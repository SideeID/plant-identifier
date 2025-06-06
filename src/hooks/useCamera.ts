import { useState, useRef, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';

const CameraTypes = {
  front: 'front',
  back: 'back',
};

interface UseCameraOptions {
  saveToGallery?: boolean;
}

interface UseCameraReturn {
  camera: React.RefObject<any>;
  type: any;
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

  useEffect(() => {
    requestPermission();
    if (saveToGallery) {
      requestMediaLibraryPermission();
    }
  }, []);

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
  }; 
  const toggleCameraType = () => {
    setType((current) =>
      current === CameraTypes.back ? CameraTypes.front : CameraTypes.back,
    );
  };

  const takePicture = async (): Promise<string | null> => {
    if (!camera.current || !permission) {
      Alert.alert('Error', 'Camera not available or permission not granted.');
      return null;
    }

    try {
      const photo = await camera.current.takePictureAsync();

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
