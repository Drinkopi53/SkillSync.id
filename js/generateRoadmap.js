// File js/generateRoadmap.js
// Fungsi ini akan menjadi inti dari SkillSync.id untuk menghasilkan peta jalan karier.

// MASUKKAN API KEY DAN ENDPOINT GEMINI ANDA YANG VALID DAN AMAN DI SINI:
const GEMINI_API_KEY = 'AIzaSyDet_RXvk9Xb1W67qxe0aoIr_iCst2qOt0';
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Menghasilkan peta jalan karier menggunakan AI generatif.
 * @param {string} targetCareer - Posisi karier yang diinginkan (misalnya, "Data Scientist").
 * @returns {Promise<Object|null>} Objek peta jalan karier atau null jika terjadi error.
 */
async function generateRoadmap(targetCareer) {
    const prompt = `
        Anda adalah seorang penasihat karier AI yang sangat ahli bernama SkillSync.
        Tugas Anda adalah membuat peta jalan karier yang detail dan actionable untuk seseorang yang ingin mencapai posisi: "${targetCareer}".

        Berdasarkan analisis tren pasar kerja terkini dan kebutuhan industri global/lokal, berikan informasi berikut dalam format JSON yang SANGAT SPESIFIK:

        1.  **Keterampilan Fondasi (foundation_skills)**: Identifikasi 5-7 keterampilan dasar paling krusial yang harus dikuasai.
        2.  **Keterampilan Lanjutan (advanced_skills)**: Identifikasi 5-7 keterampilan lanjutan atau spesialisasi yang relevan.
        3.  **Rekomendasi Sumber Belajar (learning_resources)**: Berikan 7-15 rekomendasi sumber belajar yang sangat relevan, populer, dan memiliki konten berkualitas untuk beberapa keterampilan kunci (baik fondasi maupun lanjutan). Ini bisa berupa artikel teknis mendalam, tutorial komprehensif, modul kursus online, dokumentasi resmi, publikasi ilmiah (misalnya dari Google Scholar, arXiv), video tutorial berkualitas tinggi, repositori kode, atau forum komunitas yang aktif. Untuk setiap sumber, sertakan:
            *   \`skill_related\`: Nama skill utama yang dibahas atau dapat ditingkatkan oleh sumber belajar ini.
            *   \`resource_title\`: Judul yang jelas dan deskriptif dari artikel, video, kursus, publikasi, atau sumber tersebut.
            *   \`source_type\`: Jenis sumber (Contoh: "Artikel Blog", "Kursus Online", "Dokumentasi Resmi", "Publikasi Ilmiah (Google Scholar)", "Artikel Jurnal", "Repositori Penelitian (arXiv)", "Video Tutorial", "Forum Komunitas", "Panduan Interaktif", "Website Edukasi", "Repositori Kode (GitHub)").
            *   \`link\`: URL yang VALID dan LANGSUNG menuju sumber belajar tersebut.
        PENTING UNTUK LINK: Lakukan upaya terbaik Anda (berdasarkan pengetahuan Anda hingga saat ini) untuk memastikan link yang diberikan kemungkinan besar masih AKTIF, relevan dengan judul sumber, dan TIDAK mengarah ke halaman error 'tidak ditemukan' atau konten yang usang. Jika Anda ragu dengan validitas link spesifik ke konten, lebih baik berikan link ke halaman pencarian di platform penyedia dengan judul sumber sebagai query, atau link ke halaman utama platform/website penyedia tersebut. Kualitas dan keberfungsian link adalah prioritas tinggi. Selalu tambahkan parameter query '?ref=skillsyncid' di akhir setiap URL.
        4.  **Ide Proyek Portofolio (portfolio_projects)**: Usulkan 3-4 ide proyek portofolio yang praktis. Untuk setiap proyek, sertakan:
            *   \`title\`: Judul proyek yang menarik.
            *   \`description\`: Deskripsi singkat proyek, apa yang harus dilakukan, dan keterampilan apa yang akan ditunjukkan.
            *   \`difficulty\`: Tingkat kesulitan (Pemula, Menengah, Mahir).
            *   \`estimated_time\`: Estimasi waktu pengerjaan (misalnya, "15 jam", "2 minggu").

        Pastikan semua nama skill, nama kursus, dan penyedia akurat dan relevan. Hindari informasi yang terlalu umum.

        Format output HARUS JSON dengan skema berikut. Pastikan JSON ini valid:
        \`\`\`json
        {
          "foundation_skills": ["Skill Fondasi 1", "Skill Fondasi 2"],
          "advanced_skills": ["Skill Lanjutan 1", "Skill Lanjutan 2"],
          "learning_resources": [
            {
              "skill_related": "Contoh: Pemrograman Python Dasar",
              "resource_title": "Tutorial Python Lengkap untuk Pemula di Situs XYZ",
              "source_type": "Artikel Blog",
              "link": "https://xyz.com/artikel/python-pemula?ref=skillsyncid"
            },
            {
              "skill_related": "Contoh: Manajemen Proyek Agile",
              "resource_title": "Kursus Scrum Fundamental",
              "source_type": "Kursus Online",
              "link": "https://platformkursus.com/scrum-fundamental?ref=skillsyncid"
            }
          ],
          "portfolio_projects": [
            {
              "title": "Judul Proyek Keren",
              "description": "Deskripsi lengkap dan jelas tentang proyek ini.",
              "difficulty": "Menengah",
              "estimated_time": "Sekitar 20 jam"
            }
          ]
        }
        \`\`\`

        Contoh untuk 'Data Scientist':
        {
          "foundation_skills": ["Python Programming", "Statistics and Probability", "Data Wrangling with Pandas", "Data Visualization with Matplotlib/Seaborn", "SQL Databases", "Basic Machine Learning Concepts"],
          "advanced_skills": ["Deep Learning (TensorFlow/PyTorch)", "Natural Language Processing (NLP)", "Big Data Technologies (Spark, Hadoop)", "Cloud Computing (AWS, GCP, Azure)", "MLOps", "Advanced Statistical Modeling"],
          "learning_resources": [
            {
              "skill_related": "Python Programming",
              "resource_title": "Python for Everybody Specialization (Coursera)",
              "source_type": "Kursus Online",
              "link": "https://www.coursera.org/specializations/python-for-everybody?ref=skillsyncid"
            },
            {
              "skill_related": "Machine Learning",
              "resource_title": "Machine Learning by Andrew Ng (Coursera)",
              "source_type": "Kursus Online",
              "link": "https://www.coursera.org/learn/machine-learning?ref=skillsyncid"
            },
            {
              "skill_related": "SQL Databases",
              "resource_title": "SQLBolt - Interactive SQL Tutorial",
              "source_type": "Panduan Interaktif",
              "link": "https://sqlbolt.com?ref=skillsyncid"
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

    console.log("Prompt yang akan dikirim ke Gemini API (potongan):", prompt.substring(0, 500) + "...");
    console.log(`Attempting to call Gemini API for target career: ${targetCareer}`);

    try {
        // BAGIAN UNTUK MELAKUKAN FETCH KE GEMINI API
        // =============================================
        // Pastikan GEMINI_API_KEY dan GEMINI_API_ENDPOINT sudah terisi dengan benar di atas file ini.
        if (GEMINI_API_KEY === 'MASUKKAN_API_KEY_ANDA_DI_SINI' || GEMINI_API_ENDPOINT === 'MASUKKAN_ENDPOINT_GEMINI_API_ANDA_DI_SINI') {
            console.error("API Key atau Endpoint Gemini belum diatur. Silakan perbarui di js/generateRoadmap.js");
            throw new Error("API Key atau Endpoint Gemini belum dikonfigurasi.");
        }

        console.log(`Sending request to Gemini API Endpoint: ${GEMINI_API_ENDPOINT}`);
        const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                // generationConfig: { // Opsional, sesuaikan jika perlu.
                //    // responseMimeType: "application/json", // Aktifkan jika Anda ingin meminta JSON secara eksplisit dan model mendukungnya.
                // }
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('API Error Body:', errorBody);
            throw new Error(`API call failed with status ${response.status}: ${response.statusText}. Detail: ${errorBody}`);
        }

        const data = await response.json();

        console.log('Full API Response Data:', data);

        if (data.candidates && data.candidates.length > 0 &&
            data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0 &&
            data.candidates[0].content.parts[0].text) {

            let roadmapString = data.candidates[0].content.parts[0].text; // Diubah ke let
            console.log('Raw Roadmap String from API:', roadmapString);

            // Hapus ```json di awal dan ``` di akhir jika ada
            if (roadmapString.startsWith("```json")) {
                roadmapString = roadmapString.substring(7);
            }
            if (roadmapString.endsWith("```")) {
                roadmapString = roadmapString.substring(0, roadmapString.length - 3);
            }
            roadmapString = roadmapString.trim();
            console.log('Cleaned Roadmap String for Parsing:', roadmapString);

            try {
                const roadmap = JSON.parse(roadmapString);
                console.log('Successfully parsed JSON from API:', roadmap);
                return roadmap;
            } catch (parseError) {
                console.error('Failed to parse JSON from API response:', parseError);
                console.error('Raw string that failed to parse (after cleaning attempt):', roadmapString); // Diperbarui lognya
                throw new Error('AI did not return valid JSON, even after cleaning attempt.'); // Diperbarui pesannya
            }
        } else {
            console.error('Unexpected API response structure:', data);
            throw new Error('Unexpected API response structure. Could not find generated text.');
        }
        // =============================================

        // --- MENGGUNAKAN DATA DUMMY UNTUK PENGEMBANGAN (DIKOMENTARI KARENA API AKTIF) ---
        /*
        console.warn("Menggunakan data dummy karena API call ke Gemini tidak diaktifkan.");
        const dummyRoadmap = {
            "foundation_skills": [
                `Dasar ${targetCareer}: Konsep Utama`,
                `Dasar ${targetCareer}: Alat Esensial`,
                "Pemecahan Masalah Dasar",
                "Komunikasi Efektif"
            ],
            "advanced_skills": [
                `Spesialisasi Lanjutan ${targetCareer} A`,
                `Teknik ${targetCareer} Mendalam B`,
                "Manajemen Proyek terkait " + targetCareer,
                "Analisis Data untuk " + targetCareer
            ],
            "learning_resources": [
                {
                    "skill_related": `Dasar ${targetCareer}: Konsep Utama`,
                    "resource_title": `Pengantar Komprehensif ${targetCareer}`,
                    "source_type": "Artikel Blog",
                    "link": `https://contoh.situs.dev/artikel/${targetCareer.toLowerCase().replace(/\s+/g, '-')}-pengantar?ref=skillsyncid`
                },
                {
                    "skill_related": `Dasar ${targetCareer}: Alat Esensial`,
                    "resource_title": `Tutorial Video: Alat Wajib untuk ${targetCareer}`,
                    "source_type": "Video Tutorial",
                    "link": `https://youtube.com/watch?v=contoh1&list=${targetCareer.toLowerCase().replace(/\s+/g, '-')}-tools&ref=skillsyncid`
                },
                {
                    "skill_related": "Pemecahan Masalah Dasar",
                    "resource_title": "Kursus Online: Teknik Problem Solving Fundamental",
                    "source_type": "Kursus Online",
                    "link": "https://platformkursus.com/problem-solving-101?ref=skillsyncid"
                },
                {
                    "skill_related": `Teknik ${targetCareer} Mendalam B`,
                    "resource_title": `Dokumentasi Resmi: ${targetCareer} Advanced Techniques`,
                    "source_type": "Dokumentasi Resmi",
                    "link": `https://docs.contoh-teknologi.com/${targetCareer.toLowerCase().replace(/\s+/g, '-')}/advanced?ref=skillsyncid`
                },
                {
                    "skill_related": "Struktur Data & Algoritma",
                    "resource_title": "Publikasi Ilmiah: Analisis Efisiensi Algoritma X",
                    "source_type": "Publikasi Ilmiah (Google Scholar)",
                    "link": "https://scholar.google.com/scholar?q=efisiensi+algoritma+x&ref=skillsyncid"
                },
                {
                    "skill_related": `Dasar ${targetCareer}: Studi Kasus`,
                    "resource_title": `Studi Kasus Implementasi ${targetCareer} di Industri ABC`,
                    "source_type": "Artikel Jurnal",
                    "link": `https://jurnalilmiah.com/artikel/${targetCareer.toLowerCase().replace(/\s+/g, '-')}-studi-kasus?ref=skillsyncid`
                },
                {
                    "skill_related": `Pengembangan ${targetCareer}`,
                    "resource_title": `Repositori Proyek ${targetCareer} Populer`,
                    "source_type": "Repositori Kode (GitHub)",
                    "link": `https://github.com/topics/${targetCareer.toLowerCase().replace(/\s+/g, '-')}-projects?ref=skillsyncid`
                },
                {
                    "skill_related": "Komunitas " + targetCareer,
                    "resource_title": `Forum Diskusi ${targetCareer} Indonesia`,
                    "source_type": "Forum Komunitas",
                    "link": `https://forumdiskusi.id/t/${targetCareer.toLowerCase().replace(/\s+/g, '-')}-indonesia?ref=skillsyncid`
                },
                {
                    "skill_related": `Dasar ${targetCareer}: Alat Bantu C`,
                    "resource_title": `Panduan Interaktif: Menggunakan Alat C untuk ${targetCareer}`,
                    "source_type": "Panduan Interaktif",
                    "link": `https://interactiveguide.com/${targetCareer.toLowerCase().replace(/\s+/g, '-')}/alat-c?ref=skillsyncid`
                },
                {
                    "skill_related": `Tips & Trik ${targetCareer}`,
                    "resource_title": `Website Edukasi: Kumpulan Tips ${targetCareer}`,
                    "source_type": "Website Edukasi",
                    "link": `https://edukasi-karir.com/${targetCareer.toLowerCase().replace(/\s+/g, '-')}/tips?ref=skillsyncid`
                },
                 {
                    "skill_related": `Advanced ${targetCareer}: Tool D`,
                    "resource_title": `Advanced Tutorial for Tool D in ${targetCareer}`,
                    "source_type": "Video Tutorial",
                    "link": `https://youtube.com/watch?v=contoh2&list=${targetCareer.toLowerCase().replace(/\s+/g, '-')}-tool-d&ref=skillsyncid`
                },
                {
                    "skill_related": "Machine Learning dalam " + targetCareer,
                    "resource_title": "Riset Paper: Aplikasi ML di " + targetCareer,
                    "source_type": "Repositori Penelitian (arXiv)",
                    "link": "https://arxiv.org/abs/1234.56789?ref=skillsyncid"
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
        */
        // --- AKHIR DATA DUMMY ---

    } catch (error) {
        console.error("Error in generateRoadmap function:", error.message);
        // Cek apakah errornya karena API Key/Endpoint belum diisi
        if (error.message.includes("API Key atau Endpoint Gemini belum dikonfigurasi")) {
             // Tidak perlu return null lagi karena sudah di throw, tapi bisa ditambahkan UI feedback di main.js
        }
        return null; // Kembalikan null jika ada error apapun
    }
}

export default generateRoadmap;

// Contoh penggunaan (bisa di-uncomment untuk testing di console browser jika perlu):
// async function testRoadmap() {
//     const career = "Software Engineer"; // Ganti dengan karier yang ingin diuji
//     console.log(`Testing generateRoadmap for: ${career}`);
//     const roadmap = await generateRoadmap(career);
//     if (roadmap) {
//         console.log("Test Roadmap generated successfully:", roadmap);
//     } else {
//         console.log("Test Failed to generate roadmap.");
//     }
// }
// Panggil testRoadmap jika Anda membuka file ini langsung di browser (dengan API key terisi)
// atau ingin menguji dari console.
// Hati-hati jika API Key Anda ada di sini saat melakukan push ke repository publik.
// testRoadmap();
