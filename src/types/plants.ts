export interface Plant {
  id?: string;
  name: string;
  scientificName: string;
  description: string;
  growingConditions?: {
    light: string;
    water: string;
    soil: string;
    temperature: string;
    humidity: string;
  };
  careGuide?: {
    watering: string;
    fertilizing: string;
    pruning: string;
    repotting: string;
  };
  funFacts?: string[];
  diseases: PlantDisease[];
  imageUri?: string;
}

export interface PlantDisease {
  id?: string;
  name: string;
  scientificName?: string;
  description: string;
  symptoms: string[];
  causes: string[];
  developmentStage?: string;
  potentialImpact?: string;
  treatments: string[];
  organicSolutions?: string[];
  chemicalSolutions?: string[];
  preventions: string[];
  spreadRisk?: string;
  treatmentSchedule?: string;
  recommendedProducts?: string[];
  severity: 'low' | 'medium' | 'high';
  diagnosticNotes?: string;
  imageUri?: string;
}

export interface PlantAnalysis {
  overallHealth: string;
  issuesIdentified: boolean;
  growthStage?: string;
  estimatedAge?: string;
  recommendedActions: string[];
}

export interface PlantIdentificationResult {
  plant: Plant;
  analysis?: PlantAnalysis;
  confidence: number;
  detectedDisease?: PlantDisease;
  timestamp: Date;
}
