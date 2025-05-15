import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackParamList, ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

const { width } = Dimensions.get('window');

type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.Home
>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  return (
    <>
      <StatusBar barStyle='light-content' />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <Animated.View
          style={[styles.heroContainer, { opacity: headerOpacity }]}
        >
          <LinearGradient
            colors={['#43A047', '#2E7D32']}
            style={styles.gradientBackground}
          />
          <SafeAreaView style={styles.heroContent}>
            <View style={styles.logoContainer}>
              <MaterialIcons name='eco' size={40} color='white' />
            </View>
            <Text style={styles.heroTitle}>Plant & Recipe</Text>
            <Text style={styles.heroTitle}>Identifier</Text>
            <Text style={styles.heroSubtitle}>
              Temukan tanaman dan resep dengan kekuatan AI
            </Text>
          </SafeAreaView>
        </Animated.View>

        <View style={styles.content}>
          {/* Features Section */}
          <Text style={styles.sectionTitle}>Apa yang ingin Anda lakukan?</Text>

          <View style={styles.cardsContainer}>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => navigation.navigate(ROUTES.PlantCamera)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(67, 160, 71, 0.8)', 'rgba(67, 160, 71, 0.6)']}
                style={styles.cardOverlay}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?q=80&w=600',
                }}
                style={styles.cardBackground}
              />
              <View style={styles.cardContent}>
                <View style={styles.cardIconContainer}>
                  <MaterialIcons name='local-florist' size={32} color='white' />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Identifikasi Tanaman</Text>
                  <Text style={styles.cardDescription}>
                    Ambil foto tanaman untuk mengidentifikasi spesies dan
                    mendeteksi penyakit
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => navigation.navigate(ROUTES.PlantCamera)}
                >
                  <Text style={styles.cardButtonText}>Mulai</Text>
                  <MaterialIcons name='arrow-forward' size={16} color='white' />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => navigation.navigate(ROUTES.RecipeCamera)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(255, 152, 0, 0.8)', 'rgba(255, 152, 0, 0.6)']}
                style={styles.cardOverlay}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=600',
                }}
                style={styles.cardBackground}
              />
              <View style={styles.cardContent}>
                <View
                  style={[styles.cardIconContainer, styles.recipeIconContainer]}
                >
                  <MaterialIcons name='restaurant' size={32} color='white' />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Cari Resep</Text>
                  <Text style={styles.cardDescription}>
                    Ambil foto bahan makanan untuk menemukan ide resep lezat
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.cardButton, styles.recipeCardButton]}
                  onPress={() => navigation.navigate(ROUTES.RecipeCamera)}
                >
                  <Text style={styles.cardButtonText}>Mulai</Text>
                  <MaterialIcons name='arrow-forward' size={16} color='white' />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>

          {/* How It Works Section */}
          <View style={styles.howItWorksSection}>
            <Text style={styles.sectionTitle}>Bagaimana Cara Kerjanya</Text>

            <View style={styles.stepContainer}>
              <View style={styles.stepIconContainer}>
                <MaterialIcons
                  name='camera-alt'
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Ambil Foto</Text>
                <Text style={styles.stepDescription}>
                  Ambil gambar tanaman atau bahan makanan dengan jelas
                </Text>
              </View>
            </View>

            <View style={styles.stepContainer}>
              <View style={styles.stepIconContainer}>
                <MaterialIcons
                  name='auto-awesome'
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Analisis AI</Text>
                <Text style={styles.stepDescription}>
                  AI kami mengidentifikasi spesies tanaman atau menyarankan
                  resep
                </Text>
              </View>
            </View>

            <View style={styles.stepContainer}>
              <View style={styles.stepIconContainer}>
                <MaterialIcons
                  name='insights'
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Dapatkan Hasil Lengkap</Text>
                <Text style={styles.stepDescription}>
                  Lihat informasi lengkap dan wawasan yang dapat ditindaklanjuti
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <MaterialIcons name='api' size={16} color={colors.textSecondary} />
          <Text style={styles.footerText}>Made with ❤️ by Side ID</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroContainer: {
    height: 260,
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: typography.fontSizes.body,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: spacing.md,
    maxWidth: 280,
  },
  content: {
    marginTop: -20,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.subheading.medium,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    marginLeft: spacing.sm,
  },
  cardsContainer: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  featureCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    position: 'relative',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  cardContent: {
    position: 'relative',
    zIndex: 2,
    padding: spacing.lg,
    height: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  cardTextContainer: {
    marginTop: spacing.md,
    marginBottom: 'auto',
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(67, 160, 71, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeIconContainer: {
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
  },
  cardTitle: {
    fontSize: typography.fontSizes.subheading.large,
    fontWeight: 'bold',
    color: 'white',
    marginTop: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cardDescription: {
    fontSize: typography.fontSizes.body,
    color: 'white',
    marginTop: spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    maxWidth: '90%',
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(67, 160, 71, 0.9)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    zIndex: 3,
  },
  recipeCardButton: {
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
  },
  cardButtonText: {
    color: 'white',
    fontWeight: '500',
    marginRight: spacing.xs,
  },
  howItWorksSection: {
    marginTop: spacing.lg,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: typography.fontSizes.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  stepDescription: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
});

export default HomeScreen;
