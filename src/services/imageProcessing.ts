import * as FileSystem from 'expo-file-system';

// Convert image URI to base64 for API consumption
export const imageUriToBase64 = async (imageUri: string): Promise<string> => {
  try {
    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to convert image to base64');
  }
};

// Compress/resize image before processing
export const compressImage = async (
  imageUri: string,
  quality: number = 0.7,
): Promise<string> => {
  try {
    // Generate a new filename for the compressed image
    const filename = imageUri.split('/').pop();
    const newUri = `${FileSystem.cacheDirectory}${filename}`;

    // FileSystem doesn't have built-in image compression in Expo
    // In a real app, you would use a library like expo-image-manipulator
    // For now, we'll return the original URI
    console.log('Image compression would happen here in a real implementation');
    return imageUri;
  } catch (error) {
    console.error('Error compressing image:', error);
    return imageUri; // Return original on error
  }
};

// Validate image size and format
export const validateImage = (imageUri: string): boolean => {
  // Check file extension
  const extension = imageUri.split('.').pop()?.toLowerCase();
  const validExtensions = ['jpg', 'jpeg', 'png'];

  // In a real app, you would also check file size
  return validExtensions.includes(extension || '') ? true : false;
};
