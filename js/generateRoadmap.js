// File js/generateRoadmap.js
// Fungsi ini akan menjadi inti dari SkillSync.id untuk menghasilkan peta jalan karier.

// Placeholder untuk API Key dan Endpoint Gemini
const GEMINI_API_KEY = 'MASUKKAN_API_KEY_ANDA_DI_SINI';
const GEMINI_API_ENDPOINT = 'MASUKKAN_ENDPOINT_GEMINI_API_ANDA_DI_SINI'; // Contoh: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

/**
 * Menghasilkan peta jalan karier menggunakan AI generatif.
 * @param {string} targetCareer - Posisi karier yang diinginkan (misalnya, "Data Scientist").
 * @returns {Promise<Object|null>} Objek peta jalan karier atau null jika terjadi error.
 */
async function generateRoadmap(targetCareer) {
    // Langkah 2: Konstruksi Prompt Dinamis (akan diisi di langkah selanjutnya)
    const prompt = `
        Anda adalah seorang penasihat karier AI yang sangat ahli bernama SkillSync.
        Tugas Anda adalah membuat peta jalan karier yang detail dan actionable untuk seseorang yang ingin mencapai posisi: "${targetCareer}".

        Berdasarkan analisis tren pasar kerja terkini dan kebutuhan industri global/lokal, berikan informasi berikut dalam format JSON yang SANGAT SPESIFIK:

        1.  **Keterampilan Fondasi (foundation_skills)**: Identifikasi 5-7 keterampilan dasar paling krusial yang harus dikuasai.
        2.  **Keterampilan Lanjutan (advanced_skills)**: Identifikasi 5-7 keterampilan lanjutan atau spesialisasi yang relevan.
        3.  **Rekomendasi Kursus (course_recommendations)**: Berikan 2-4 rekomendasi kursus yang sangat spesifik untuk beberapa keterampilan kunci (baik fondasi maupun lanjutan). Untuk setiap kursus, sertakan:
            *   `skill_related`: Nama skill yang diajarkan kursus tersebut.
            *   `course_name`: Nama lengkap kursus.
            *   `provider`: Penyedia kursus (misalnya, Coursera, Dicoding, edX, Udemy, freeCodeCamp, dll.).
            *   `link`: URL langsung menuju kursus tersebut. Penting: Tambahkan parameter query '?ref=skillsyncid' di akhir setiap URL.
        4.  **Ide Proyek Portofolio (portfolio_projects)**: Usulkan 3-4 ide proyek portofolio yang praktis. Untuk setiap proyek, sertakan:
            *   `title`: Judul proyek yang menarik.
            *   `description`: Deskripsi singkat proyek, apa yang harus dilakukan, dan keterampilan apa yang akan ditunjukkan.
            *   `difficulty`: Tingkat kesulitan (Pemula, Menengah, Mahir).
            *   `estimated_time`: Estimasi waktu pengerjaan (misalnya, "15 jam", "2 minggu").

        Pastikan semua nama skill, nama kursus, dan penyedia akurat dan relevan. Hindari informasi yang terlalu umum.

        Format output HARUS JSON dengan skema berikut:
        {
          "foundation_skills": ["skill 1", "skill 2", "..."],
          "advanced_skills": ["skill 3", "skill 4", "..."],
          "course_recommendations": [
            {
              "skill_related": "Nama Skill",
              "course_name": "Nama Kursus",
              "provider": "Coursera",
              "link": "https://contoh.link/kursus?ref=skillsyncid"
            }
          ],
          "portfolio_projects": [
            {
              "title": "Judul Proyek",
              "description": "Deskripsi singkat proyek...",
              "difficulty": "Menengah",
              "estimated_time": "20 jam"
            }
          ]
        }

        Contoh untuk 'Data Scientist':
        {
          "foundation_skills": ["Python Programming", "Statistics and Probability", "Data Wrangling with Pandas", "Data Visualization with Matplotlib/Seaborn", "SQL Databases", "Basic Machine Learning Concepts"],
          "advanced_skills": ["Deep Learning (TensorFlow/PyTorch)", "Natural Language Processing (NLP)", "Big Data Technologies (Spark, Hadoop)", "Cloud Computing (AWS, GCP, Azure)", "MLOps", "Advanced Statistical Modeling"],
          "course_recommendations": [
            {
              "skill_related": "Python Programming",
              "course_name": "Python for Everybody Specialization",
              "provider": "Coursera (University of Michigan)",
              "link": "https://www.coursera.org/specializations/python-for-everybody?ref=skillsyncid"
            },
            {
              "skill_related": "Machine Learning",
              "course_name": "Machine Learning by Andrew Ng",
              "provider": "Coursera (Stanford University)",
              "link": "https://www.coursera.org/learn/machine-learning?ref=skillsyncid"
            }
          ],
          "portfolio_projects": [
            {
              "title": "Analisis Sentimen Ulasan Produk E-commerce",
              "description": "Kumpulkan ulasan produk dari platform e-commerce, lakukan pra-pemrosesan teks, dan bangun model klasifikasi sentimen (positif/negatif/netral). Visualisasikan hasilnya.",
              "difficulty": "Menengah",
              "estimated_time": "25 jam"
            },
            {
              "title": "Prediksi Harga Rumah",
              "description": "Gunakan dataset harga rumah (misalnya, Kaggle's House Prices), lakukan analisis data eksploratif, rekayasa fitur, dan bangun model regresi untuk memprediksi harga rumah.",
              "difficulty": "Menengah",
              "estimated_time": "30 jam"
            }
          ]
        }

        Sekarang, hasilkan peta jalan untuk: "${targetCareer}".
    `;

    // Langkah 3: Placeholder untuk API Call (akan diisi di langkah selanjutnya)
    console.log("Prompt yang akan dikirim ke Gemini API:", prompt);

    try {
        // BAGIAN UNTUK MELAKUKAN FETCH KE GEMINI API
        // =============================================
        // const response = await fetch(GEMINI_API_ENDPOINT + '?key=' + GEMINI_API_KEY, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         contents: [{ parts: [{ text: prompt }] }],
        //         // generationConfig: { // Opsional, sesuaikan jika perlu
        //         //    responseMimeType: "application/json", // Penting!
        //         // }
        //     }),
        // });

        // if (!response.ok) {
        //     const errorBody = await response.text();
        //     throw new Error(`API call failed with status ${response.status}: ${errorBody}`);
        // }

        // // Gemini API mungkin membungkus JSON dalam struktur tertentu, sesuaikan parsingnya
        // const data = await response.json();
        // // Contoh jika JSON ada di data.candidates[0].content.parts[0].text
        // const roadmapString = data.candidates[0].content.parts[0].text;
        // const roadmap = JSON.parse(roadmapString);
        // return roadmap;
        // =============================================

        // --- MENGGUNAKAN DATA DUMMY UNTUK PENGEMBANGAN ---
        console.warn("Menggunakan data dummy karena API call ke Gemini tidak diaktifkan.");
        const dummyRoadmap = {
            "foundation_skills": [
                `Dasar ${targetCareer} 1`,
                `Dasar ${targetCareer} 2`,
                "SEO Dasar",
                "Content Marketing Awal",
                "Analisis Web Fundamental"
            ],
            "advanced_skills": [
                `Spesialisasi ${targetCareer} 1`,
                `Spesialisasi ${targetCareer} 2`,
                "Marketing Automation Lanjutan",
                "Data Analysis untuk Marketing Expert",
                "CRO Lanjutan"
            ],
            "course_recommendations": [
                {
                    "skill_related": `Dasar ${targetCareer} 1`,
                    "course_name": `Kursus Lengkap ${targetCareer} untuk Pemula`,
                    "provider": "Udemy",
                    "link": `https://www.udemy.com/topic/${targetCareer.toLowerCase().replace(/\s+/g, '-')}/?ref=skillsyncid`
                },
                {
                    "skill_related": "SEO Dasar",
                    "course_name": "Google Digital Garage - Fundamentals of Digital Marketing",
                    "provider": "Google",
                    "link": "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing?ref=skillsyncid"
                }
            ],
            "portfolio_projects": [
                {
                    "title": `Proyek Portofolio ${targetCareer} 1`,
                    "description": `Buat strategi ${targetCareer.toLowerCase()} komprehensif untuk sebuah startup fiktif di industri X. Fokus pada riset pasar, persona target, dan channel utama.`,
                    "difficulty": "Menengah",
                    "estimated_time": "25 jam"
                },
                {
                    "title": `Analisis Kampanye ${targetCareer}`,
                    "description": "Analisis data kampanye marketing (gunakan dataset publik atau buat sendiri), identifikasi KPI, visualisasikan performa, dan berikan rekomendasi optimasi.",
                    "difficulty": "Menengah",
                    "estimated_time": "20 jam"
                }
            ]
        };
        // Simulasikan network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return dummyRoadmap;
        // --- AKHIR DATA DUMMY ---

    } catch (error) {
        console.error("Error in generateRoadmap:", error);
        // Tambahkan notifikasi ke pengguna di UI jika perlu
        return null;
    }
}

// Untuk memungkinkan penggunaan di environment Node.js (misalnya untuk testing)
// dan juga sebagai modul ES di browser.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = generateRoadmap;
} else if (typeof экспорта !== 'undefined') { // Workaround for ES module detection in some environments
    экспорта(generateRoadmap); // Fictitious export function for environments that might use it
}
// Jika menggunakan ES modules secara native di browser, Anda akan menggunakan:
// export default generateRoadmap; // atau export { generateRoadmap };
// Untuk sekarang, kita akan mengandalkan pemanggilan global atau include manual di HTML.

// Contoh penggunaan (bisa di-uncomment untuk testing di console browser):
// async function testRoadmap() {
//     const career = "Digital Marketing Specialist";
//     console.log(`Generating roadmap for: ${career}`);
//     const roadmap = await generateRoadmap(career);
//     if (roadmap) {
//         console.log("Roadmap generated:", roadmap);
//     } else {
//         console.log("Failed to generate roadmap.");
//     }
// }
// testRoadmap();
