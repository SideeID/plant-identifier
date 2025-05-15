// App-wide constants

// Feature flags
export const FEATURES = {
  USE_MOCK_API: __DEV__, // Use mock API responses in development
  ENABLE_ANALYTICS: !__DEV__, // Only enable analytics in production
};

// Image constants
export const IMAGE = {
  MAX_SIZE_MB: 5,
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png'],
  QUALITY: 0.8,
  COMPRESSION_RATIO: 0.7,
};

// API constants
export const API = {
  TIMEOUT_MS: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  MOCK_DELAY_MS: 2000, // Delay for mock API responses
};

// Storage keys
export const STORAGE_KEYS = {
  HISTORY: 'app_history',
  RECENT_PLANTS: 'recent_plants',
  RECENT_RECIPES: 'recent_recipes',
  USER_PREFERENCES: 'user_preferences',
};

// Navigation constants
export const ANIMATION = {
  DURATION: 300, // ms
};

// User interface constants
export const UI = {
  LOADING_TIMEOUT: 15000, // 15 seconds
};

// Error messages
export const ERROR_MESSAGES = {
  CAMERA_PERMISSION: 'Camera permission is required to use this feature',
  GALLERY_PERMISSION: 'Gallery access is required to use this feature',
  IMAGE_PROCESSING: 'Error processing image. Please try again.',
  API_ERROR:
    'Error connecting to the identification service. Please check your connection and try again.',
  UNKNOWN: 'An unknown error occurred. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  IMAGE_CAPTURED: 'Image captured successfully!',
  IDENTIFICATION_COMPLETE: 'Identification complete!',
};
