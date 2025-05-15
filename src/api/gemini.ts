import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { PlantIdentificationResult } from '../types/plants';
import { RecipeIdentificationResult } from '../types/recipes';
import * as FileSystem from 'expo-file-system';
import { API_CONFIG } from './config';

const genAI = new GoogleGenerativeAI(API_CONFIG.GEMINI_API_KEY);

const imageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    console.log('Converting image to base64:', imageUri);

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
    throw error;
  }
};

const createFilePart = async (imageUri: string) => {
  try {
    const base64Data = await imageToBase64(imageUri);
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

const sendImageToGemini = async (
  image: string,
  prompt: string,
  modelVersion: string = 'gemini-1.5-flash',
) => {
  try {
    const imagePart = await createFilePart(image);

    const model = genAI.getGenerativeModel({ model: modelVersion });

    const generationConfig = {
      temperature: 0.4,
      topK: 32, 
      topP: 1,
      maxOutputTokens: 2048, 
    };

    // Configure safety settings
    // const safetySettings = [
    //   {
    //     category: HarmCategory.HARASSMENT,
    //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //   },
    //   {
    //     category: HarmCategory.HATE_SPEECH,
    //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //   },
    //   {
    //     category: HarmCategory.SEXUALLY_EXPLICIT,
    //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //   },
    //   {
    //     category: HarmCategory.DANGEROUS_CONTENT,
    //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //   },
    // ];

    // Generate content with image and prompt
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }, imagePart],
        },
      ],
      generationConfig,
      // safetySettings,
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

export const identifyPlant = async (
  imageUri: string,
): Promise<PlantIdentificationResult> => {
  const prompt = `
    Analisis gambar tanaman ini secara menyeluruh dan berikan identifikasi yang komprehensif. Fokus utama pada deteksi penyakit atau masalah kesehatan tanaman.

    INSTRUKSI:
    1. Identifikasi spesies tanaman dengan nama umum dan ilmiah
    2. Analisis kondisi kesehatan tanaman secara menyeluruh dalam bahasa indonesia
    3. Jika ada penyakit atau masalah, berikan:
       - Nama penyakit/masalah
       - Deskripsi detail
       - Penyebab spesifik dari penyakit/masalah
       - Tahap perkembangan penyakit (awal, menengah, lanjut)
       - Dampak potensial pada tanaman jika tidak ditangani
       - Tingkat keparahan (rendah, sedang, tinggi)
       - Gejala yang terlihat dan yang mungkin berkembang
       - Metode diagnosis lanjutan jika diperlukan
    4. Untuk perawatan, berikan:
       - Solusi organik dan kimia
       - Langkah-langkah pengendalian segera
       - Tindakan pencegahan untuk masa depan
       - Jadwal perawatan yang disarankan
       - Produk spesifik yang direkomendasikan (jika ada)
    5. Tambahkan tips budidaya untuk memperbaiki kesehatan tanaman secara umum
    6. Berikan fakta menarik dan informasi tambahan tentang tanaman
    7. Nilai tingkat keyakinan analisis (0.0-1.0)

    Jika tidak ada penyakit yang terdeteksi, sebutkan bahwa tanaman tampak sehat dan fokus pada tips pemeliharaan dan optimalisasi pertumbuhan.
    
    Format your response as JSON with the following structure:
    {
      "plant": {
        "name": "",
        "scientificName": "",
        "description": "",
        "growingConditions": {
          "light": "",
          "water": "",
          "soil": "",
          "temperature": "",
          "humidity": ""
        },
        "careGuide": {
          "watering": "",
          "fertilizing": "",
          "pruning": "",
          "repotting": ""
        },
        "funFacts": [],
        "diseases": []
      },
      "analysis": {
        "overallHealth": "",
        "issuesIdentified": true/false,
        "growthStage": "",
        "estimatedAge": "",
        "recommendedActions": []
      },
      "detectedDisease": {
        "name": "",
        "scientificName": "",
        "description": "",
        "symptoms": [],
        "causes": [],
        "developmentStage": "",
        "potentialImpact": "",
        "treatments": [],
        "organicSolutions": [],
        "chemicalSolutions": [],
        "preventions": [],
        "spreadRisk": "",
        "treatmentSchedule": "",
        "recommendedProducts": [],
        "severity": "",
        "diagnosticNotes": ""
      },
      "confidence": 0.0
    }
    
    Jika tidak ada penyakit, atur "detectedDisease" ke null dan "issuesIdentified" ke false.
    
    Wajib memberikan respons dalam format JSON yang valid dan pastikan seluruh teks respons hanya berisi JSON tersebut.
  `;

  try {
    const result = await sendImageToGemini(imageUri, prompt);
    console.log('Raw Gemini response for plant:', result);

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : result;

    const parsedResult = JSON.parse(jsonStr);

    return {
      ...parsedResult,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error identifying plant:', error);
    throw error;
  }
};

export const identifyRecipe = async (
  imageUri: string,
): Promise<RecipeIdentificationResult> => {
  const prompt = `
    Identifikasi bahan-bahan yang terlihat pada gambar ini. Kemudian sarankan 3 kemungkinan resep yang dapat dibuat dengan menggunakan bahan-bahan ini. Untuk setiap resep, berikan:
    1. Nama resep
    2. Daftar bahan lengkap (tandai bahan mana dari foto yang digunakan)
    3. Instruksi persiapan singkat
    4. Perkiraan waktu memasak
    
    Format your response as JSON with the following structure:
    {
      "detectedIngredients": [
        { "name": "", "amount": "", "unit": "" }
      ],
      "suggestedRecipes": [
        {
          "name": "",
          "description": "",
          "ingredients": [
            { "name": "", "amount": "", "unit": "" }
          ],
          "instructions": [],
          "prepTime": 0,
          "cookTime": 0,
          "servings": 0,
          "difficulty": ""
        }
      ],
      "confidence": 0.0
    }
    
    Wajib memberikan respons dalam format JSON yang valid dan pastikan seluruh teks respons hanya berisi JSON tersebut.
  `;

  try {
    const result = await sendImageToGemini(imageUri, prompt);
    console.log('Raw Gemini response for recipe:', result);

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : result;

    const parsedResult = JSON.parse(jsonStr);

    return {
      ...parsedResult,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error identifying recipe ingredients:', error);
    throw error;
  }
};
