export const plantIdentificationPrompt = `
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

export const recipeIdentificationPrompt = `
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
