import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export const generateUniqueFilename = (extension: string = 'jpg'): string => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `image_${timestamp}_${random}.${extension}`;
};

export const getFileInfo = async (fileUri: string): Promise<any> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    return fileInfo;
  } catch (error) {
    console.error('Error getting file info:', error);
    throw error;
  }
};

export const getImageExtension = (uri: string): string => {
  const splitUri = uri.split('.');
  return splitUri[splitUri.length - 1].toLowerCase();
};

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

export const moveImageToPermanentStorage = async (
  uri: string,
  filename?: string,
): Promise<string> => {
  try {
    const extension = getImageExtension(uri);
    const newFilename = filename || generateUniqueFilename(extension);

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

export const deleteImage = async (uri: string): Promise<void> => {
  try {
    await FileSystem.deleteAsync(uri);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
