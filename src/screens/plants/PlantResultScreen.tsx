import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGeminiAPI } from '../../hooks/useGeminiAPI';
import { RootStackParamList, ROUTES } from '../../navigation/routes';
import { PlantIdentificationResult, PlantDisease } from '../../types/plants';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

type PlantResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.PlantResult
>;

const PlantResultScreen: React.FC<PlantResultScreenProps> = ({
  route,
  navigation,
}) => {
  const { imageUri, useMockData = true } = route.params;
  const [result, setResult] = useState<PlantIdentificationResult | null>(null);
  const { isLoading, error, identifyPlant } = useGeminiAPI();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'disease' | 'treatment' | 'care' | 'more'
  >('overview');

  useEffect(() => {
    const identifyPlantImage = async () => {
      try {
        const data = await identifyPlant(imageUri, useMockData);
        if (data) {
          setResult(data);
        }
      } catch (err) {
        console.error('Error in PlantResultScreen:', err);
      }
    };

    identifyPlantImage();
  }, [imageUri, useMockData]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={colors.primary} />
        <Text style={styles.loadingText}>
          Menganalisis kondisi tanaman dan kesehatan...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name='error-outline' size={60} color={colors.error} />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name='info-outline' size={60} color={colors.secondary} />
        <Text style={styles.errorText}>
          Tidak ada data tanaman yang ditemukan.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { plant, confidence, detectedDisease, analysis } = result;

  const renderSeverityBadge = (severity: string | undefined) => {
    const actualSeverity = severity || 'unknown';

    let badgeColor;
    switch (actualSeverity) {
      case 'low':
        badgeColor = '#4CAF50';
        break;
      case 'medium':
        badgeColor = '#FF9800';
        break;
      case 'high':
        badgeColor = '#F44336';
        break;
      default:
        badgeColor = '#9E9E9E';
    }

    return (
      <View style={[styles.severityBadge, { backgroundColor: badgeColor }]}>
        <Text style={styles.severityText}>{actualSeverity.toUpperCase()}</Text>
      </View>
    );
  };

  const renderOverallHealthIndicator = (health: string | undefined) => {
    const healthStatus = health?.toLowerCase() || 'unknown';

    let statusColor;
    let statusText = healthStatus;

    switch (true) {
      case healthStatus.includes('excellent') ||
        healthStatus.includes('very good'):
        statusColor = '#4CAF50';
        break;
      case healthStatus.includes('good'):
        statusColor = '#8BC34A';
        break;
      case healthStatus.includes('fair'):
        statusColor = '#FFC107';
        break;
      case healthStatus.includes('poor'):
        statusColor = '#FF9800';
        break;
      case healthStatus.includes('critical') || healthStatus.includes('bad'):
        statusColor = '#F44336';
        break;
      default:
        statusColor = '#9E9E9E';
    }

    return (
      <View style={[styles.healthIndicator, { backgroundColor: statusColor }]}>
        <Text style={styles.healthIndicatorText}>
          {healthStatus.toUpperCase()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode='cover'
          />
        </View>

        <View style={styles.infoHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.plantName}>{plant.name}</Text>
            <Text style={styles.scientificName}>{plant.scientificName}</Text>
          </View>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence</Text>
            <Text style={styles.confidenceValue}>
              {(confidence * 100).toFixed(1)}%
            </Text>
          </View>
        </View>

        {analysis && (
          <View style={styles.healthBanner}>
            <View style={styles.healthStatus}>
              <Text style={styles.healthLabel}>Kesehatan:</Text>
              {renderOverallHealthIndicator(analysis.overallHealth)}
            </View>
            {analysis.growthStage && (
              <View style={styles.growthStage}>
                <Text style={styles.growthStageLabel}>Pertumbuhan:</Text>
                <Text style={styles.growthStageValue}>
                  {analysis.growthStage}
                </Text>
              </View>
            )}
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScrollContainer}
        >
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
              onPress={() => setActiveTab('overview')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'overview' && styles.activeTabText,
                ]}
              >
                Ringkasan
              </Text>
            </TouchableOpacity>

            {detectedDisease && (
              <>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    activeTab === 'disease' && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab('disease')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'disease' && styles.activeTabText,
                    ]}
                  >
                    Penyakit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tab,
                    activeTab === 'treatment' && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab('treatment')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'treatment' && styles.activeTabText,
                    ]}
                  >
                    Penanganan
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {plant.careGuide && (
              <TouchableOpacity
                style={[styles.tab, activeTab === 'care' && styles.activeTab]}
                onPress={() => setActiveTab('care')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'care' && styles.activeTabText,
                  ]}
                >
                  Perawatan
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.tab, activeTab === 'more' && styles.activeTab]}
              onPress={() => setActiveTab('more')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'more' && styles.activeTabText,
                ]}
              >
                Info Lainnya
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.tabContent}>
          {activeTab === 'overview' && (
            <View>
              <Text style={styles.sectionHeading}>Deskripsi Tanaman</Text>
              <Text style={styles.description}>{plant.description}</Text>

              {analysis &&
                analysis.recommendedActions &&
                analysis.recommendedActions.length > 0 && (
                  <View>
                    <Text style={styles.sectionHeading}>
                      Tindakan yang Disarankan
                    </Text>
                    {analysis.recommendedActions.map((action, index) => (
                      <View key={index} style={styles.listItem}>
                        <MaterialIcons
                          name='check-circle'
                          size={18}
                          color={colors.primary}
                        />
                        <Text style={styles.listItemText}>{action}</Text>
                      </View>
                    ))}
                  </View>
                )}

              {detectedDisease && (
                <View style={styles.diseaseAlert}>
                  <MaterialIcons
                    name='warning'
                    size={24}
                    color={colors.secondary}
                  />
                  <View style={styles.diseaseAlertContent}>
                    <Text style={styles.diseaseAlertText}>
                      Penyakit terdeteksi: {detectedDisease.name}
                    </Text>
                    <Text style={styles.diseaseAlertSubtext}>
                      Ketuk tab Penyakit untuk informasi terperinci
                    </Text>
                  </View>
                  {renderSeverityBadge(detectedDisease.severity)}
                </View>
              )}
            </View>
          )}

          {activeTab === 'disease' && detectedDisease && (
            <View>
              <Text style={styles.sectionHeading}>Informasi Penyakit</Text>
              <Text style={styles.diseaseName}>{detectedDisease.name}</Text>
              {detectedDisease.scientificName && (
                <Text style={styles.diseaseScientificName}>
                  ({detectedDisease.scientificName})
                </Text>
              )}

              <View style={styles.infoCard}>
                <Text style={styles.description}>
                  {detectedDisease.description}
                </Text>
              </View>

              {detectedDisease.developmentStage && (
                <>
                  <Text style={styles.subHeading}>Tahap Penyakit</Text>
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardText}>
                      {detectedDisease.developmentStage}
                    </Text>
                  </View>
                </>
              )}

              {detectedDisease.potentialImpact && (
                <>
                  <Text style={styles.subHeading}>Dampak Potensial</Text>
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardText}>
                      {detectedDisease.potentialImpact}
                    </Text>
                  </View>
                </>
              )}

              <Text style={styles.subHeading}>Gejala</Text>
              <View style={styles.infoCard}>
                {detectedDisease.symptoms.map((symptom, index) => (
                  <View key={index} style={styles.listItem}>
                    <MaterialIcons
                      name='fiber-manual-record'
                      size={12}
                      color={colors.primary}
                    />
                    <Text style={styles.listItemText}>{symptom}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.subHeading}>Penyebab</Text>
              <View style={styles.infoCard}>
                {detectedDisease.causes.map((cause, index) => (
                  <View key={index} style={styles.listItem}>
                    <MaterialIcons
                      name='fiber-manual-record'
                      size={12}
                      color={colors.primary}
                    />
                    <Text style={styles.listItemText}>{cause}</Text>
                  </View>
                ))}
              </View>

              {detectedDisease.spreadRisk && (
                <>
                  <Text style={styles.subHeading}>Risiko Penyebaran</Text>
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardText}>
                      {detectedDisease.spreadRisk}
                    </Text>
                  </View>
                </>
              )}

              {detectedDisease.diagnosticNotes && (
                <>
                  <Text style={styles.subHeading}>Catatan Diagnostik</Text>
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardText}>
                      {detectedDisease.diagnosticNotes}
                    </Text>
                  </View>
                </>
              )}

              <View style={styles.severityContainer}>
                <Text style={styles.severityLabel}>Tingkat Keparahan:</Text>
                {renderSeverityBadge(detectedDisease.severity)}
              </View>
            </View>
          )}

          {activeTab === 'treatment' && detectedDisease && (
            <View>
              <Text style={styles.sectionHeading}>Opsi Penanganan</Text>

              {detectedDisease.treatmentSchedule && (
                <>
                  <Text style={styles.subHeading}>Jadwal Penanganan</Text>
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardText}>
                      {detectedDisease.treatmentSchedule}
                    </Text>
                  </View>
                </>
              )}

              {detectedDisease.organicSolutions &&
                detectedDisease.organicSolutions.length > 0 && (
                  <>
                    <Text style={styles.subHeading}>Solusi Organik</Text>
                    <View style={styles.infoCard}>
                      {detectedDisease.organicSolutions.map(
                        (solution, index) => (
                          <View key={index} style={styles.listItem}>
                            <MaterialIcons
                              name='eco'
                              size={16}
                              color={colors.primary}
                            />
                            <Text style={styles.listItemText}>{solution}</Text>
                          </View>
                        ),
                      )}
                    </View>
                  </>
                )}

              {detectedDisease.chemicalSolutions &&
                detectedDisease.chemicalSolutions.length > 0 && (
                  <>
                    <Text style={styles.subHeading}>Solusi Kimia</Text>
                    <View style={styles.infoCard}>
                      {detectedDisease.chemicalSolutions.map(
                        (solution, index) => (
                          <View key={index} style={styles.listItem}>
                            <MaterialIcons
                              name='science'
                              size={16}
                              color={colors.primary}
                            />
                            <Text style={styles.listItemText}>{solution}</Text>
                          </View>
                        ),
                      )}
                    </View>
                  </>
                )}

              <Text style={styles.subHeading}>Penanganan Umum</Text>
              <View style={styles.infoCard}>
                {detectedDisease.treatments.map((treatment, index) => (
                  <View key={index} style={styles.listItem}>
                    <MaterialIcons
                      name='check-circle'
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={styles.listItemText}>{treatment}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.subHeading}>Pencegahan</Text>
              <View style={styles.infoCard}>
                {detectedDisease.preventions.map((prevention, index) => (
                  <View key={index} style={styles.listItem}>
                    <MaterialIcons
                      name='shield'
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={styles.listItemText}>{prevention}</Text>
                  </View>
                ))}
              </View>

              {detectedDisease.recommendedProducts &&
                detectedDisease.recommendedProducts.length > 0 && (
                  <>
                    <Text style={styles.subHeading}>
                      Produk yang Disarankan
                    </Text>
                    <View style={styles.infoCard}>
                      {detectedDisease.recommendedProducts.map(
                        (product, index) => (
                          <View key={index} style={styles.listItem}>
                            <MaterialIcons
                              name='shopping-cart'
                              size={16}
                              color={colors.primary}
                            />
                            <Text style={styles.listItemText}>{product}</Text>
                          </View>
                        ),
                      )}
                    </View>
                  </>
                )}
            </View>
          )}

          {activeTab === 'care' && plant.careGuide && (
            <View>
              <Text style={styles.sectionHeading}>
                Panduan Perawatan Tanaman
              </Text>

              <View style={styles.careGuideContainer}>
                <View style={styles.careGuideItem}>
                  <View style={styles.careGuideIconContainer}>
                    <MaterialIcons
                      name='water-drop'
                      size={32}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.careGuideTitle}>Penyiraman</Text>
                  <Text style={styles.careGuideText}>
                    {plant.careGuide.watering}
                  </Text>
                </View>

                <View style={styles.careGuideItem}>
                  <View style={styles.careGuideIconContainer}>
                    <MaterialIcons
                      name='grass'
                      size={32}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.careGuideTitle}>Pemupukan</Text>
                  <Text style={styles.careGuideText}>
                    {plant.careGuide.fertilizing}
                  </Text>
                </View>

                <View style={styles.careGuideItem}>
                  <View style={styles.careGuideIconContainer}>
                    <MaterialIcons
                      name='content-cut'
                      size={32}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.careGuideTitle}>Pemangkasan</Text>
                  <Text style={styles.careGuideText}>
                    {plant.careGuide.pruning}
                  </Text>
                </View>

                <View style={styles.careGuideItem}>
                  <View style={styles.careGuideIconContainer}>
                    <MaterialIcons
                      name='swap-vert'
                      size={32}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.careGuideTitle}>Penggantian Pot</Text>
                  <Text style={styles.careGuideText}>
                    {plant.careGuide.repotting}
                  </Text>
                </View>
              </View>

              {plant.growingConditions && (
                <>
                  <Text style={styles.subHeading}>Kondisi Tumbuh Ideal</Text>
                  <View style={styles.conditionsContainer}>
                    <View style={styles.conditionItem}>
                      <MaterialIcons
                        name='wb-sunny'
                        size={24}
                        color={colors.primary}
                      />
                      <Text style={styles.conditionLabel}>Cahaya</Text>
                      <Text style={styles.conditionValue}>
                        {plant.growingConditions.light}
                      </Text>
                    </View>

                    <View style={styles.conditionItem}>
                      <MaterialIcons
                        name='opacity'
                        size={24}
                        color={colors.primary}
                      />
                      <Text style={styles.conditionLabel}>Air</Text>
                      <Text style={styles.conditionValue}>
                        {plant.growingConditions.water}
                      </Text>
                    </View>

                    <View style={styles.conditionItem}>
                      <MaterialIcons
                        name='landscape'
                        size={24}
                        color={colors.primary}
                      />
                      <Text style={styles.conditionLabel}>Tanah</Text>
                      <Text style={styles.conditionValue}>
                        {plant.growingConditions.soil}
                      </Text>
                    </View>

                    <View style={styles.conditionItem}>
                      <MaterialIcons
                        name='thermostat'
                        size={24}
                        color={colors.primary}
                      />
                      <Text style={styles.conditionLabel}>Suhu</Text>
                      <Text style={styles.conditionValue}>
                        {plant.growingConditions.temperature}
                      </Text>
                    </View>

                    <View style={styles.conditionItem}>
                      <MaterialIcons
                        name='water'
                        size={24}
                        color={colors.primary}
                      />
                      <Text style={styles.conditionLabel}>Kelembaban</Text>
                      <Text style={styles.conditionValue}>
                        {plant.growingConditions.humidity}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}

          {activeTab === 'more' && (
            <View>
              <Text style={styles.sectionHeading}>Informasi Tambahan</Text>

              {plant.funFacts && plant.funFacts.length > 0 && (
                <View>
                  <Text style={styles.subHeading}>Fakta Menarik</Text>
                  <View style={styles.funFactsContainer}>
                    {plant.funFacts.map((fact, index) => (
                      <View key={index} style={styles.funFactItem}>
                        <MaterialIcons
                          name='lightbulb'
                          size={22}
                          color={colors.primary}
                        />
                        <Text style={styles.funFactText}>{fact}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {analysis && analysis.estimatedAge && (
                <View style={styles.infoRow}>
                  <MaterialIcons
                    name='schedule'
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={styles.infoLabel}>Perkiraan Usia:</Text>
                  <Text style={styles.infoValue}>{analysis.estimatedAge}</Text>
                </View>
              )}

              {analysis && analysis.growthStage && (
                <View style={styles.infoRow}>
                  <MaterialIcons
                    name='trending-up'
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={styles.infoLabel}>Tahap Pertumbuhan:</Text>
                  <Text style={styles.infoValue}>{analysis.growthStage}</Text>
                </View>
              )}

              <View style={styles.analysisSummary}>
                <Text style={styles.subHeading}>Ringkasan Analisis</Text>
                <View style={styles.analysisTimeContainer}>
                  <MaterialIcons
                    name='access-time'
                    size={18}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.analysisTime}>
                    Analisis dilakukan pada {result.timestamp.toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.confidenceSummary}>
                  Tanaman teridentifikasi dengan tingkat keyakinan{' '}
                  {(confidence * 100).toFixed(1)}%.
                  {analysis?.issuesIdentified
                    ? ' Terdapat masalah yang perlu diperhatikan.'
                    : ' Tidak ada masalah signifikan yang terdeteksi.'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name='camera-alt' size={24} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: typography.fontSizes.body,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  errorText: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    color: colors.textSecondary,
    fontSize: typography.fontSizes.body,
    textAlign: 'center',
  },
  imageContainer: {
    height: 250,
    width: '100%',
    backgroundColor: colors.lightGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  nameContainer: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  plantName: {
    fontSize: typography.fontSizes.heading.medium,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  scientificName: {
    fontSize: typography.fontSizes.body,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  confidenceContainer: {
    alignItems: 'flex-end',
  },
  confidenceLabel: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
  },
  confidenceValue: {
    fontSize: typography.fontSizes.subheading.medium,
    fontWeight: 'bold',
    color: colors.primary,
  },
  healthBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  healthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthLabel: {
    fontSize: typography.fontSizes.body,
    fontWeight: '500',
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  healthIndicator: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.sm,
  },
  healthIndicatorText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: 'bold',
    color: colors.white,
  },
  growthStage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthStageLabel: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  growthStageValue: {
    fontSize: typography.fontSizes.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  tabScrollContainer: {
    maxHeight: 50,
    backgroundColor: colors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingHorizontal: spacing.sm,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.xs,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '500',
  },
  tabContent: {
    backgroundColor: colors.white,
    padding: spacing.md,
    minHeight: 300,
  },
  sectionHeading: {
    fontSize: typography.fontSizes.subheading.medium,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSizes.body,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  diseaseAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginTop: spacing.sm,
  },
  diseaseAlertContent: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  diseaseAlertText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.body,
    fontWeight: '500',
  },
  diseaseAlertSubtext: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  diseaseName: {
    fontSize: typography.fontSizes.subheading.medium,
    fontWeight: '500',
    color: colors.error,
    marginBottom: spacing.xs,
  },
  diseaseScientificName: {
    fontSize: typography.fontSizes.body,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  subHeading: {
    fontSize: typography.fontSizes.subheading.medium,
    fontWeight: '500',
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  infoCardText: {
    fontSize: typography.fontSizes.body,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    paddingRight: spacing.md,
  },
  listItemText: {
    marginLeft: spacing.sm,
    flex: 1,
    fontSize: typography.fontSizes.body,
    color: colors.textPrimary,
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  severityLabel: {
    fontSize: typography.fontSizes.body,
    fontWeight: '500',
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  severityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: spacing.sm,
  },
  severityText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: 'bold',
    color: colors.white,
  },
  careGuideContainer: {
    marginTop: spacing.sm,
  },
  careGuideItem: {
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  careGuideIconContainer: {
    backgroundColor: colors.secondary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  careGuideTitle: {
    fontSize: typography.fontSizes.subheading.small,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  careGuideText: {
    fontSize: typography.fontSizes.body,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  conditionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    padding: spacing.md,
  },
  conditionItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  conditionLabel: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginVertical: spacing.xs,
  },
  conditionValue: {
    fontSize: typography.fontSizes.body,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  funFactsContainer: {
    marginTop: spacing.xs,
  },
  funFactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  funFactText: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSizes.body,
    flex: 1,
    color: colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginVertical: spacing.xs,
  },
  infoLabel: {
    fontSize: typography.fontSizes.body,
    fontWeight: '500',
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  infoValue: {
    fontSize: typography.fontSizes.body,
    color: colors.textPrimary,
    flex: 1,
  },
  analysisSummary: {
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  analysisTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  analysisTime: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
  },
  confidenceSummary: {
    fontSize: typography.fontSizes.body,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.sm,
    marginTop: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSizes.body,
    fontWeight: '500',
  },
  floatingButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default PlantResultScreen;
