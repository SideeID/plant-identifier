import { PlantIdentificationResult } from '../types/plants';
import { identifyPlant } from '../api/gemini';
import { compressImage, validateImage } from './imageProcessing';

// Identify plant from image
export const identifyPlantFromImage = async (
  imageUri: string,
): Promise<PlantIdentificationResult> => {
  try {
    // Validate image
    if (!validateImage(imageUri)) {
      throw new Error('Invalid image format. Please use JPG or PNG.');
    }

    // Compress image for better API performance
    const compressedImageUri = await compressImage(imageUri);

    // Send to Gemini API
    const result = await identifyPlant(compressedImageUri);

    return result;
  } catch (error) {
    console.error('Error in plant identification service:', error);
    throw error;
  }
};

// Mock data for testing when API is not available
export const getMockPlantIdentification = (): PlantIdentificationResult => {
  return {
    plant: {
      name: 'Tomato Plant',
      scientificName: 'Solanum lycopersicum',
      description:
        'The tomato is the edible berry of the plant Solanum lycopersicum, commonly known as a tomato plant. It is one of the most widely grown vegetables in home gardens and is valued for its flavorful fruits.',
      growingConditions: {
        light: 'Full sun',
        water: 'Regular, consistent moisture',
        soil: 'Well-draining, rich in organic matter',
        temperature: '65-85°F (18-29°C)',
        humidity: 'Moderate to high',
      },
      careGuide: {
        watering:
          'Water deeply 1-2 times per week, ensuring soil stays evenly moist but not waterlogged. Avoid wetting the foliage when watering to prevent disease.',
        fertilizing:
          'Apply balanced fertilizer (10-10-10) every 2-3 weeks during growing season. Side-dress with compost when first fruits begin to form.',
        pruning:
          'Remove suckers (shoots growing between main stem and branches) to improve air circulation and focus plant energy on fruit production.',
        repotting:
          'Transplant seedlings to larger containers or garden when they reach 6-8 inches tall. Space plants 24-36 inches apart.',
      },
      funFacts: [
        'Tomatoes are technically fruits, not vegetables.',
        'There are over 10,000 varieties of tomatoes worldwide.',
        'Tomatoes were once thought to be poisonous in the United States.',
        'Tomato plants can grow up to 10 feet tall with proper support.',
      ],
      diseases: [
        {
          name: 'Early Blight',
          scientificName: 'Alternaria solani',
          description:
            'Early blight is a common fungal disease that affects tomato plants, causing characteristic dark spots on leaves and reducing overall plant vigor.',
          symptoms: [
            'Dark brown spots on leaves with concentric rings',
            'Yellow areas surrounding the spots',
            'Spots appear on lower leaves first and move upward',
            'Leaf drop or withering',
            'Sunken dark spots may appear on stems and fruits',
          ],
          causes: [
            'Fungus (Alternaria solani)',
            'Warm, humid conditions (75-85°F)',
            'Poor air circulation',
            'Extended leaf wetness',
            'Stressed or undernourished plants',
          ],
          developmentStage:
            "Early to moderate development stage. The disease has established but hasn't severely impacted the entire plant yet.",
          potentialImpact:
            'If untreated, early blight can cause significant defoliation, reduced photosynthesis, and decreased fruit production. Severe cases may lead to crop yield reduction of 30-50%.',
          treatments: [
            'Remove affected leaves immediately',
            'Apply approved fungicide every 7-10 days',
            'Water at the base of plant to keep foliage dry',
            'Improve air circulation around plants',
          ],
          organicSolutions: [
            'Copper-based fungicides (apply every 7 days)',
            'Neem oil spray (apply every 7-14 days)',
            'Bacillus subtilis biological fungicide',
            'Compost tea foliar spray',
          ],
          chemicalSolutions: [
            'Chlorothalonil fungicide',
            'Mancozeb fungicide',
            'Azoxystrobin fungicide',
            'Propiconazole fungicide',
          ],
          preventions: [
            'Crop rotation (avoid planting tomatoes in the same spot for 3 years)',
            'Proper spacing between plants',
            'Mulching to prevent soil splash',
            'Remove and destroy plant debris at end of season',
            'Use resistant varieties where available',
          ],
          spreadRisk:
            'Moderate to high. Early blight spreads through wind-borne spores, rain splash, and contact with contaminated tools or hands.',
          treatmentSchedule:
            'Begin treatment immediately. Apply fungicides every 7-10 days until symptoms subside. Continue preventative applications every 10-14 days throughout growing season.',
          recommendedProducts: [
            'Bonide Copper Fungicide',
            'Garden Safe Brand Neem Oil Extract',
            'Southern Ag Liquid Copper Fungicide',
            'Serenade Garden Disease Control',
          ],
          severity: 'medium',
          diagnosticNotes:
            'Distinguishable from late blight by the presence of concentric rings in the spots and the absence of fuzzy white growth on leaf undersides.',
        },
      ],
    },
    analysis: {
      overallHealth: 'Fair',
      issuesIdentified: true,
      growthStage: 'Mature vegetative/Early fruiting',
      estimatedAge: '8-10 weeks',
      recommendedActions: [
        'Begin fungicide treatment within next 24 hours',
        'Remove all visibly affected leaves and destroy (do not compost)',
        'Improve air circulation around plant by pruning and proper spacing',
        'Apply balanced fertilizer to improve plant vigor',
        'Mulch around base to prevent soil splash',
      ],
    },
    confidence: 0.92,
    detectedDisease: {
      name: 'Early Blight',
      scientificName: 'Alternaria solani',
      description:
        'Early blight is a common fungal disease that affects tomato plants, causing characteristic dark spots on leaves and reducing overall plant vigor.',
      symptoms: [
        'Dark brown spots on leaves with concentric rings',
        'Yellow areas surrounding the spots',
        'Spots appear on lower leaves first and move upward',
        'Leaf drop or withering',
        'Sunken dark spots may appear on stems and fruits',
      ],
      causes: [
        'Fungus (Alternaria solani)',
        'Warm, humid conditions (75-85°F)',
        'Poor air circulation',
        'Extended leaf wetness',
        'Stressed or undernourished plants',
      ],
      developmentStage:
        "Early to moderate development stage. The disease has established but hasn't severely impacted the entire plant yet.",
      potentialImpact:
        'If untreated, early blight can cause significant defoliation, reduced photosynthesis, and decreased fruit production. Severe cases may lead to crop yield reduction of 30-50%.',
      treatments: [
        'Remove affected leaves immediately',
        'Apply approved fungicide every 7-10 days',
        'Water at the base of plant to keep foliage dry',
        'Improve air circulation around plants',
      ],
      organicSolutions: [
        'Copper-based fungicides (apply every 7 days)',
        'Neem oil spray (apply every 7-14 days)',
        'Bacillus subtilis biological fungicide',
        'Compost tea foliar spray',
      ],
      chemicalSolutions: [
        'Chlorothalonil fungicide',
        'Mancozeb fungicide',
        'Azoxystrobin fungicide',
        'Propiconazole fungicide',
      ],
      preventions: [
        'Crop rotation (avoid planting tomatoes in the same spot for 3 years)',
        'Proper spacing between plants',
        'Mulching to prevent soil splash',
        'Remove and destroy plant debris at end of season',
        'Use resistant varieties where available',
      ],
      spreadRisk:
        'Moderate to high. Early blight spreads through wind-borne spores, rain splash, and contact with contaminated tools or hands.',
      treatmentSchedule:
        'Begin treatment immediately. Apply fungicides every 7-10 days until symptoms subside. Continue preventative applications every 10-14 days throughout growing season.',
      recommendedProducts: [
        'Bonide Copper Fungicide',
        'Garden Safe Brand Neem Oil Extract',
        'Southern Ag Liquid Copper Fungicide',
        'Serenade Garden Disease Control',
      ],
      severity: 'medium',
      diagnosticNotes:
        'Distinguishable from late blight by the presence of concentric rings in the spots and the absence of fuzzy white growth on leaf undersides.',
    },
    timestamp: new Date(),
  };
};
