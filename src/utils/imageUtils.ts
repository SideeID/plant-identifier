import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// Generate a unique filename for an image
export const generateUniqueFilename = (extension: string = 'jpg'): string => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `image_${timestamp}_${random}.${extension}`;
};

// Get file information (size, type, etc.)
export const getFileInfo = async (fileUri: string): Promise<any> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    return fileInfo;
  } catch (error) {
    console.error('Error getting file info:', error);
    throw error;
  }
};

// Get image extension from uri
export const getImageExtension = (uri: string): string => {
  const splitUri = uri.split('.');
  return splitUri[splitUri.length - 1].toLowerCase();
};

// Check if image size is within limits
export const isImageSizeValid = async (
  imageUri: string,
  maxSizeMB: number = 5,
): Promise<boolean> => {
  try {
    const fileInfo = await getFileInfo(imageUri);
    const fileSizeInMB = fileInfo.size / (1024 * 1024);
    return fileSizeInMB <= maxSizeMB;
  } catch (error) {
    console.error('Error checking image size:', error);
    return false;
  }
};

// Move temporary image to app's permanent storage
export const moveImageToPermanentStorage = async (
  uri: string,
  filename?: string,
): Promise<string> => {
  try {
    const extension = getImageExtension(uri);
    const newFilename = filename || generateUniqueFilename(extension);

    // Destination directory differs by platform
    const directory =
      Platform.OS === 'ios'
        ? FileSystem.documentDirectory
        : FileSystem.cacheDirectory;

    const newUri = `${directory}${newFilename}`;

    await FileSystem.moveAsync({
      from: uri,
      to: newUri,
    });

    return newUri;
  } catch (error) {
    console.error('Error moving image to storage:', error);
    throw error;
  }
};

// Delete an image file
export const deleteImage = async (uri: string): Promise<void> => {
  try {
    await FileSystem.deleteAsync(uri);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
