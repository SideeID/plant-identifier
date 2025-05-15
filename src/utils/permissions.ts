import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Linking, Platform } from 'react-native';

// Request camera permissions
export const requestCameraPermission = async (): Promise<boolean> => {
  const { status } = await Camera.requestCameraPermissionsAsync();
  return status === 'granted';
};

// Request media library permissions
export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
};

// Request image picker permissions
export const requestImagePickerPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
};

// Check if a permission is granted
export const checkPermission = async (
  permission: 'camera' | 'mediaLibrary' | 'imagePicker',
): Promise<boolean> => {
  switch (permission) {
    case 'camera':
      const cameraPermission = await Camera.getCameraPermissionsAsync();
      return cameraPermission.status === 'granted';

    case 'mediaLibrary':
      const mediaLibraryPermission = await MediaLibrary.getPermissionsAsync();
      return mediaLibraryPermission.status === 'granted';

    case 'imagePicker':
      const imagePickerPermission =
        await ImagePicker.getMediaLibraryPermissionsAsync();
      return imagePickerPermission.status === 'granted';

    default:
      return false;
  }
};

// Show alert to direct user to settings when permission is denied
export const showPermissionAlert = (
  permissionType: string,
  onCancel?: () => void,
) => {
  Alert.alert(
    `${permissionType} Permission Required`,
    `This feature requires ${permissionType.toLowerCase()} permission. Please enable it in your device settings.`,
    [
      {
        text: 'Cancel',
        onPress: onCancel,
        style: 'cancel',
      },
      {
        text: 'Open Settings',
        onPress: () => Linking.openSettings(),
      },
    ],
  );
};
