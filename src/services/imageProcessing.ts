import * as FileSystem from 'expo-file-system';

export const imageUriToBase64 = async (imageUri: string): Promise<string> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (!fileInfo.exists) {
      throw new Error('Image file does not exist');
    }
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to convert image to base64');
  }
};

export const createFilePart = async (imageUri: string) => {
  try {
    const base64Data = await imageUriToBase64(imageUri);
    return {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg',
      },
    };
  } catch (error) {
    console.error('Error creating file part:', error);
    throw error;
  }
};

export const compressImage = async (
  imageUri: string,
  quality: number = 0.7,
): Promise<string> => {
  try {
    const filename = imageUri.split('/').pop();
    const newUri = `${FileSystem.cacheDirectory}${filename}`;

    console.log('Image compression would happen here in a real implementation');
    return imageUri;
  } catch (error) {
    console.error('Error compressing image:', error);
    return imageUri;
  }
};

export const validateImage = (imageUri: string): boolean => {
  const extension = imageUri.split('.').pop()?.toLowerCase();
  const validExtensions = ['jpg', 'jpeg', 'png'];

  return validExtensions.includes(extension || '') ? true : false;
};
