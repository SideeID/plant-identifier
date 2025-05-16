
export const FEATURES = {
  USE_MOCK_API: __DEV__,
  ENABLE_ANALYTICS: !__DEV__, 
};

export const IMAGE = {
  MAX_SIZE_MB: 5,
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png'],
  QUALITY: 0.8,
  COMPRESSION_RATIO: 0.7,
};

export const API = {
  TIMEOUT_MS: 30000, 
  RETRY_ATTEMPTS: 3,
  MOCK_DELAY_MS: 2000, 
};

export const STORAGE_KEYS = {
  HISTORY: 'app_history',
  RECENT_PLANTS: 'recent_plants',
  RECENT_RECIPES: 'recent_recipes',
  USER_PREFERENCES: 'user_preferences',
};

export const ANIMATION = {
  DURATION: 300, // ms
};

export const UI = {
  LOADING_TIMEOUT: 15000, // 15 seconds
};

export const ERROR_MESSAGES = {
  CAMERA_PERMISSION: 'Camera permission is required to use this feature',
  GALLERY_PERMISSION: 'Gallery access is required to use this feature',
  IMAGE_PROCESSING: 'Error processing image. Please try again.',
  API_ERROR:
    'Error connecting to the identification service. Please check your connection and try again.',
  UNKNOWN: 'An unknown error occurred. Please try again.',
};

export const SUCCESS_MESSAGES = {
  IMAGE_CAPTURED: 'Image captured successfully!',
  IDENTIFICATION_COMPLETE: 'Identification complete!',
};
