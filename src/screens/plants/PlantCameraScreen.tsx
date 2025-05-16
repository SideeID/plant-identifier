import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { useImagePicker } from '../../hooks/useImagePicker';
import { RootStackParamList, Routes } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

type PlantCameraScreenProps = StackScreenProps<
  RootStackParamList,
  typeof Routes.PlantCamera
>;

const PlantCameraScreen: React.FC<PlantCameraScreenProps> = ({
  navigation,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null,
  );

  const { pickImage, isLoading: isPickerLoading } = useImagePicker({
    aspect: [4, 3],
    quality: 0.8,
  });

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);

  const handleCameraCapture = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        navigation.navigate(Routes.PlantResult, {
          imageUri: result.assets[0].uri,
          useMockData: false,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image.');
      console.error('Error capturing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePickImage = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const imageUri = await pickImage();

      if (imageUri) {
        navigation.navigate(Routes.PlantResult, {
          imageUri,
          useMockData: false,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image.');
      console.error('Error selecting image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cameraPermission === false) {
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <MaterialIcons name='no-photography' size={60} color={colors.error} />
        <Text style={styles.permissionText}>
          Akses kamera diperlukan untuk menangkap gambar tanaman.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={async () => {
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();
            setCameraPermission(status === 'granted');
          }}
        >
          <Text style={styles.permissionButtonText}>Berikan Izin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.modernContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Identifikasi Tanaman</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.instructionCard}>
          <MaterialIcons name='eco' size={50} color={colors.primary} />
          <Text style={styles.instructionTitle}>
            Cara Mengidentifikasi Tanaman
          </Text>

          <View style={styles.stepContainer}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepText}>Ambil foto tanaman dengan jelas</Text>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepText}>Pastikan pencahayaan cukup baik</Text>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Fokuskan pada daun atau bunga untuk hasil terbaik
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <Text style={styles.actionText}>
          Pilih metode untuk mengidentifikasi:
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCameraCapture}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size='small' color={colors.white} />
            ) : (
              <>
                <MaterialIcons
                  name='camera-alt'
                  size={28}
                  color={colors.white}
                />
                <Text style={styles.actionButtonText}>Kamera</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.galleryButton]}
            onPress={handlePickImage}
            disabled={isProcessing || isPickerLoading}
          >
            {isPickerLoading ? (
              <ActivityIndicator size='small' color={colors.white} />
            ) : (
              <>
                <MaterialIcons
                  name='photo-library'
                  size={28}
                  color={colors.white}
                />
                <Text style={styles.actionButtonText}>Galeri</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  modernContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSizes.heading.large,
    fontWeight: '700',
    color: colors.primary,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  instructionCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: spacing.md,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  instructionTitle: {
    fontSize: typography.fontSizes.subheading.large,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    color: colors.textPrimary,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    width: '100%',
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  stepNumber: {
    color: colors.white,
    fontWeight: '600',
    fontSize: typography.fontSizes.small,
  },
  stepText: {
    fontSize: typography.fontSizes.body,
    color: colors.textPrimary,
    flex: 1,
  },
  actionContainer: {
    padding: spacing.lg,
  },
  actionText: {
    fontSize: typography.fontSizes.body,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: spacing.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xs,
    flexDirection: 'row',
  },
  galleryButton: {
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: typography.fontSizes.body,
    marginLeft: spacing.sm,
  },
  permissionText: {
    color: colors.white,
    fontSize: typography.fontSizes.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: spacing.sm,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.body,
    fontWeight: '500',
  },
});

export default PlantCameraScreen;
