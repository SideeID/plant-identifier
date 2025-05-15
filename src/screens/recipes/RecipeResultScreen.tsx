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
import {
  RecipeIdentificationResult,
  Recipe,
  Ingredient,
} from '../../types/recipes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

type RecipeResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.RecipeResult
>;

const RecipeResultScreen: React.FC<RecipeResultScreenProps> = ({
  route,
  navigation,
}) => {
  const { imageUri, useMockData = true } = route.params;
  const [result, setResult] = useState<RecipeIdentificationResult | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [viewMode, setViewMode] = useState<
    'ingredients' | 'recipes' | 'detail'
  >('ingredients');
  const { isLoading, error, identifyRecipe } = useGeminiAPI();

  // Fetch recipe identification when component mounts
  useEffect(() => {
    const identifyRecipeImage = async () => {
      try {
        const data = await identifyRecipe(imageUri, useMockData);
        if (data) {
          setResult(data);
        }
      } catch (err) {
        console.error('Error in RecipeResultScreen:', err);
      }
    };

    identifyRecipeImage();
  }, [imageUri, useMockData]);

  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={colors.secondary} />
        <Text style={styles.loadingText}>
          Identifying ingredients and recipes...
        </Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name='error-outline' size={60} color={colors.error} />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render empty result
  if (!result) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name='info-outline' size={60} color={colors.secondary} />
        <Text style={styles.errorText}>No ingredients or recipes found.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Extract data from result
  const { detectedIngredients, suggestedRecipes, confidence } = result;

  // Render ingredient list
  const renderIngredientItem = ({ item }: { item: Ingredient }) => {
    return (
      <View style={styles.ingredientItem}>
        <MaterialIcons name='check' size={20} color={colors.secondary} />
        <Text style={styles.ingredientName}>{item.name}</Text>
        <Text style={styles.ingredientAmount}>
          {item.amount} {item.unit}
        </Text>
      </View>
    );
  };

  // Render recipe card in the list
  const renderRecipeCard = ({ item }: { item: Recipe }) => {
    return (
      <TouchableOpacity
        style={styles.recipeCard}
        onPress={() => {
          setSelectedRecipe(item);
          setViewMode('detail');
        }}
      >
        <View style={styles.recipeCardContent}>
          <Text style={styles.recipeCardTitle}>{item.name}</Text>
          <Text style={styles.recipeCardDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.recipeCardFooter}>
            <View style={styles.recipeCardDetail}>
              <MaterialIcons
                name='timer'
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.recipeCardDetailText}>
                {item.prepTime + item.cookTime} min
              </Text>
            </View>
            <View style={styles.recipeCardDetail}>
              <MaterialIcons
                name='restaurant'
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.recipeCardDetailText}>
                {item.servings} servings
              </Text>
            </View>
            <View style={styles.recipeCardDetail}>
              <View
                style={[
                  styles.difficultyBadge,
                  getDifficultyBadgeStyle(item.difficulty),
                ]}
              >
                <Text style={styles.difficultyText}>{item.difficulty}</Text>
              </View>
            </View>
          </View>
        </View>
        <MaterialIcons
          name='chevron-right'
          size={24}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    );
  };

  // Render ingredients screen
  const renderIngredientsScreen = () => {
    return (
      <>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerTitle}>Detected Ingredients</Text>
            <Text style={styles.headerSubtitle}>
              {detectedIngredients.length} ingredients found
            </Text>
          </View>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence</Text>
            <Text style={styles.confidenceValue}>
              {(confidence * 100).toFixed(1)}%
            </Text>
          </View>
        </View>

        <FlatList
          data={detectedIngredients}
          renderItem={renderIngredientItem}
          keyExtractor={(item, index) => `ingredient-${index}`}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.secondary }]}
          onPress={() => setViewMode('recipes')}
        >
          <Text style={styles.nextButtonText}>View Recipe Suggestions</Text>
          <MaterialIcons name='arrow-forward' size={20} color={colors.white} />
        </TouchableOpacity>
      </>
    );
  };

  // Render recipes screen
  const renderRecipesScreen = () => {
    return (
      <>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Recipe Suggestions</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setViewMode('ingredients')}
          >
            <MaterialIcons
              name='arrow-back'
              size={20}
              color={colors.secondary}
            />
            <Text style={[styles.backButtonText, { color: colors.secondary }]}>
              Ingredients
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={suggestedRecipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item, index) => `recipe-${index}`}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      </>
    );
  };

  // Render recipe detail screen
  const renderRecipeDetail = () => {
    if (!selectedRecipe) return null;

    return (
      <>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {selectedRecipe.name}
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setViewMode('recipes');
              setSelectedRecipe(null);
            }}
          >
            <MaterialIcons
              name='arrow-back'
              size={20}
              color={colors.secondary}
            />
            <Text style={[styles.backButtonText, { color: colors.secondary }]}>
              Back to Recipes
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.list}>
          <View style={styles.recipeDetailContainer}>
            <Text style={styles.description}>{selectedRecipe.description}</Text>

            <View style={styles.recipeMetadataContainer}>
              <View style={styles.recipeMetadataItem}>
                <MaterialIcons
                  name='access-time'
                  size={20}
                  color={colors.secondary}
                />
                <Text style={styles.recipeMetadataLabel}>Prep</Text>
                <Text style={styles.recipeMetadataValue}>
                  {selectedRecipe.prepTime} min
                </Text>
              </View>

              <View style={styles.recipeMetadataItem}>
                <MaterialIcons
                  name='watch-later'
                  size={20}
                  color={colors.secondary}
                />
                <Text style={styles.recipeMetadataLabel}>Cook</Text>
                <Text style={styles.recipeMetadataValue}>
                  {selectedRecipe.cookTime} min
                </Text>
              </View>

              <View style={styles.recipeMetadataItem}>
                <MaterialIcons
                  name='people'
                  size={20}
                  color={colors.secondary}
                />
                <Text style={styles.recipeMetadataLabel}>Serves</Text>
                <Text style={styles.recipeMetadataValue}>
                  {selectedRecipe.servings}
                </Text>
              </View>

              <View style={styles.recipeMetadataItem}>
                <MaterialIcons
                  name='stairs'
                  size={20}
                  color={colors.secondary}
                />
                <Text style={styles.recipeMetadataLabel}>Difficulty</Text>
                <View
                  style={[
                    styles.difficultyBadge,
                    getDifficultyBadgeStyle(selectedRecipe.difficulty),
                  ]}
                >
                  <Text style={styles.difficultyText}>
                    {selectedRecipe.difficulty}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Ingredients</Text>
            {selectedRecipe.ingredients.map((ingredient, index) => (
              <View
                key={`detail-ingredient-${index}`}
                style={styles.ingredientItem}
              >
                <MaterialIcons
                  name='check'
                  size={20}
                  color={colors.secondary}
                />
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientAmount}>
                  {ingredient.amount} {ingredient.unit}
                </Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Instructions</Text>
            {selectedRecipe.instructions.map((instruction, index) => (
              <View key={`instruction-${index}`} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode='cover'
        />
      </View>

      <View style={styles.contentContainer}>
        {viewMode === 'ingredients' && renderIngredientsScreen()}
        {viewMode === 'recipes' && renderRecipesScreen()}
        {viewMode === 'detail' && renderRecipeDetail()}
      </View>

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
    height: 180,
    width: '100%',
    backgroundColor: colors.lightGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: typography.fontSizes.subheading.large,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.fontSizes.body,
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
    color: colors.secondary,
  },
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  ingredientName: {
    flex: 1,
    fontSize: typography.fontSizes.body,
    fontWeight: '500',
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  ingredientAmount: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.secondary,
    margin: spacing.md,
    borderRadius: spacing.sm,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.body,
    fontWeight: '500',
    marginRight: spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: typography.fontSizes.body,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  recipeCardContent: {
    flex: 1,
  },
  recipeCardTitle: {
    fontSize: typography.fontSizes.subheading.medium,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  recipeCardDescription: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  recipeCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeCardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  recipeCardDetailText: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  difficultyBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.xs,
  },
  easyBadge: {
    backgroundColor: '#E8F5E9',
  },
  mediumBadge: {
    backgroundColor: '#FFF3E0',
  },
  hardBadge: {
    backgroundColor: '#FFEBEE',
  },
  difficultyText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: '500',
  },
  recipeDetailContainer: {
    padding: spacing.md,
  },
  description: {
    fontSize: typography.fontSizes.body,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  recipeMetadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  recipeMetadataItem: {
    alignItems: 'center',
    width: '22%',
  },
  recipeMetadataLabel: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  recipeMetadataValue: {
    fontSize: typography.fontSizes.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.subheading.medium,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  instructionNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  instructionNumberText: {
    color: colors.white,
    fontSize: typography.fontSizes.caption,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: typography.fontSizes.body,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.secondary,
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
    backgroundColor: colors.secondary,
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

// Helper function for difficulty badge style
const getDifficultyBadgeStyle = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return styles.easyBadge;
    case 'medium':
      return styles.mediumBadge;
    case 'hard':
      return styles.hardBadge;
    default:
      return undefined;
  }
};

export default RecipeResultScreen;
