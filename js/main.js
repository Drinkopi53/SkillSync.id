// Berkas: js/main.js

import generateRoadmap from './generateRoadmap.js';

// Variabel untuk Pagination Sumber Belajar
let allLearningResources = [];
let currentLearningResourcesPage = 1;
const learningResourcesPerPage = 5; // Tampilkan 5 item per halaman

// Variabel untuk menyimpan target karier saat ini
let currentTargetCareer = '';

const sourceTypeIcons = {
    "Artikel Blog": "📄",
    "Kursus Online": "🎓",
    "Video Tutorial": "🎬",
    "Dokumentasi Resmi": "📖", // Mengganti ikon Devanagari dengan yang lebih umum
    "Publikasi Ilmiah (Google Scholar)": "🔬",
    "Artikel Jurnal": "🔬",
    "Repositori Penelitian (arXiv)": "🔬",
    "Repositori Kode (GitHub)": "💻",
    "Forum Komunitas": "💬",
    "Panduan Interaktif": "🎮",
    "Website Edukasi": "🌐",
    "default": "🔗" // Ikon default jika tipe tidak ada di map
};

document.addEventListener('DOMContentLoaded', () => {
    // Referensi Elemen
    const landingPageSection = document.getElementById('landingPageSection');
    const loadingSection = document.getElementById('loadingSection');
    const careerPathSection = document.getElementById('careerPathSection');

    const careerGoalInput = document.getElementById('careerGoalInput');
    const generatePathButton = document.getElementById('generatePathButton');
    const careerPathTitleSpan = document.querySelector('#careerPathTitle span');
    const inputError = document.getElementById('inputError');

    // Kontainer konten Accordion
    const foundationSkillsContent = document.getElementById('foundationSkillsContent');
    const advancedSkillsContent = document.getElementById('advancedSkillsContent');
    const courseRecommendationsContent = document.getElementById('courseRecommendationsContent');
    const portfolioProjectsContent = document.getElementById('portfolioProjectsContent'); // Kontainer utama untuk accordion item
    const portfolioProjectList = document.getElementById('portfolioProjectList'); // Sub-kontainer untuk daftar item proyek
    const learningResourcesPaginationContainer = document.getElementById('learningResourcesPagination');
    const refreshPortfolioButton = document.getElementById('refreshPortfolioButton');

    const loginButton = document.getElementById('loginButton');
    const backToHomeButton = document.getElementById('backToHomeButton');
    const logo = document.getElementById('logo');

    // Accordion Elements
    const accordionButtons = document.querySelectorAll('.accordion-button');

    // Event Listener untuk Tombol Generate Peta Jalan
    generatePathButton.addEventListener('click', async () => {
        const goal = careerGoalInput.value.trim();

        if (goal === "") {
            inputError.classList.remove('hidden');
            inputError.textContent = 'Mohon masukkan posisi karier.';
            return;
        }
        inputError.classList.add('hidden');

        // Bersihkan konten roadmap & pagination sebelumnya
        clearRoadmapContents();

        // Cek Cache
        const cacheKey = `roadmap_${goal.toLowerCase().replace(/\s+/g, '_')}`;
        const cachedData = sessionStorage.getItem(cacheKey);

        if (cachedData) {
            console.log("Data ditemukan di sessionStorage cache:", cacheKey);
            const roadmapData = JSON.parse(cachedData);

            if (careerPathTitleSpan) careerPathTitleSpan.textContent = goal; // Update judul

            allLearningResources = roadmapData.learning_resources || [];
            currentLearningResourcesPage = 1;
            renderAllRoadmapContent(roadmapData); // Render konten dari cache

            // Langsung tampilkan hasil, tidak perlu loading
            if (landingPageSection) landingPageSection.classList.add('hidden');
            if (loadingSection) loadingSection.classList.add('hidden'); // Pastikan loading tidak tampil
            if (careerPathSection) careerPathSection.classList.remove('hidden');
            if (loginButton) loginButton.classList.add('hidden');
            if (backToHomeButton) backToHomeButton.classList.remove('hidden');
            return; // Hentikan eksekusi lebih lanjut jika data dari cache
        }

        // Jika tidak ada di cache, lanjutkan dengan API call
        console.log("Data tidak ditemukan di cache, memanggil API untuk:", goal);

        currentTargetCareer = goal; // Simpan target karier saat ini

        // Update judul peta jalan
        if (careerPathTitleSpan) {
            careerPathTitleSpan.textContent = goal;
        }

        // Tampilkan loading
        if (landingPageSection) landingPageSection.classList.add('hidden');
        if (loadingSection) loadingSection.classList.remove('hidden');
        if (careerPathSection) careerPathSection.classList.add('hidden');
        if (loginButton) loginButton.classList.add('hidden');
        if (backToHomeButton) backToHomeButton.classList.remove('hidden');

        try {
            const roadmapData = await generateRoadmap(goal);

            if (roadmapData) {
                // Simpan ke cache sebelum render
                sessionStorage.setItem(cacheKey, JSON.stringify(roadmapData));
                console.log("Data dari API disimpan ke sessionStorage cache:", cacheKey);

                allLearningResources = roadmapData.learning_resources || [];
                currentLearningResourcesPage = 1;

                renderAllRoadmapContent(roadmapData); // Ini akan memanggil displayCurrentPageLearningResources secara internal

                if (loadingSection) loadingSection.classList.add('hidden');
                if (careerPathSection) careerPathSection.classList.remove('hidden');

                // Reset accordion ke state awal setelah render
                accordionButtons.forEach((button, index) => {
                    const content = button.nextElementSibling;
                    const isFirst = index === 0;
                    // Cek apakah accordion pertama (Keterampilan Fondasi) memiliki konten
                    // Atau jika itu adalah accordion Sumber Belajar, dan memiliki item
                    let shouldOpen = false;
                    if (index === 0 && foundationSkillsContent && foundationSkillsContent.innerHTML.trim() !== "") {
                        shouldOpen = true;
                    } else if (content === courseRecommendationsContent && allLearningResources.length > 0) {
                        // Jika ini adalah accordion sumber belajar dan ada item, buka juga (atau sesuaikan logika ini)
                        // Untuk sekarang, kita hanya fokus pada yang pertama secara umum
                        // shouldOpen = true; // Uncomment jika ingin membuka section sumber belajar jika ada isinya
                    }


                    button.setAttribute('aria-expanded', isFirst ? 'true' : 'false'); // Buka accordion pertama saja
                    if (content) {
                         content.classList.toggle('hidden', !isFirst);
                    }
                    const arrowIcon = button.querySelector('svg');
                    if (arrowIcon) {
                        arrowIcon.style.transform = isFirst ? 'rotate(180deg)' : 'rotate(0deg)';
                    }
                });

            } else {
                // Handle error jika roadmapData null (gagal fetch atau parsing di generateRoadmap)
                if (loadingSection) loadingSection.classList.add('hidden');
                // Tampilkan pesan error di careerPathSection atau kembali ke landing
                // Untuk sekarang, kita kembali ke home dan tampilkan alert
                goHome();
                alert("Gagal menghasilkan peta jalan. Silakan coba lagi atau periksa konsol untuk detail.");
            }
        } catch (error) {
            console.error("Error saat generate atau render peta jalan:", error);
            if (loadingSection) loadingSection.classList.add('hidden');
            goHome();
            alert("Terjadi kesalahan. Silakan coba lagi.");
        }
    });

    // Event Listener untuk Tombol Kembali ke Awal
    const goHome = () => {
        if (careerPathSection) careerPathSection.classList.add('hidden');
        if (loadingSection) loadingSection.classList.add('hidden');
        if (landingPageSection) landingPageSection.classList.remove('hidden');

        if (loginButton) loginButton.classList.remove('hidden');
        if (backToHomeButton) backToHomeButton.classList.add('hidden');
        if (inputError) inputError.classList.add('hidden');

        allLearningResources = [];
        currentLearningResourcesPage = 1;
        currentTargetCareer = ''; // Reset target karier saat ini
        clearRoadmapContents();
    };

    if (backToHomeButton) {
        backToHomeButton.addEventListener('click', goHome);
    }
    if (logo) {
        logo.addEventListener('click', goHome);
        logo.style.cursor = 'pointer';
    }

    // Fungsionalitas Accordion
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            button.setAttribute('aria-expanded', !isExpanded);
            if (content) {
                content.classList.toggle('hidden');
            }

            const arrowIcon = button.querySelector('svg');
            if(arrowIcon) {
                 arrowIcon.style.transform = !isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    });

    // Fungsi untuk membersihkan konten roadmap sebelumnya
    function clearRoadmapContents() {
        if (foundationSkillsContent) foundationSkillsContent.innerHTML = '';
        if (advancedSkillsContent) advancedSkillsContent.innerHTML = '';
        if (courseRecommendationsContent) courseRecommendationsContent.innerHTML = '';
        // portfolioProjectsContent tidak perlu dibersihkan sepenuhnya karena tombol refresh ada di dalamnya
        if (portfolioProjectList) portfolioProjectList.innerHTML = ''; // Bersihkan hanya daftar proyek
        if (learningResourcesPaginationContainer) learningResourcesPaginationContainer.innerHTML = '';
    }

    // Fungsi render gabungan
    function renderAllRoadmapContent(roadmapData) {
        if (!roadmapData) return;

        if (roadmapData.foundation_skills && foundationSkillsContent) {
            renderFoundationSkills(roadmapData.foundation_skills);
        }
        if (roadmapData.advanced_skills && advancedSkillsContent) {
            renderAdvancedSkills(roadmapData.advanced_skills);
        }
        // Pemanggilan renderLearningResources dan renderPaginationControls sekarang di displayCurrentPageLearningResources
        if (roadmapData.learning_resources) { // Cukup cek apakah ada datanya
            displayCurrentPageLearningResources();
        }
        if (roadmapData.portfolio_projects && portfolioProjectsContent) {
            renderPortfolioProjects(roadmapData.portfolio_projects);
        }
    }

    function displayCurrentPageLearningResources() {
        if (courseRecommendationsContent) { // Tetap menggunakan ID ini sebagai kontainer
            renderLearningResources(courseRecommendationsContent, allLearningResources, currentLearningResourcesPage, learningResourcesPerPage);
        }
        if (learningResourcesPaginationContainer) {
            renderPaginationControls(
                learningResourcesPaginationContainer,
                allLearningResources.length,
                learningResourcesPerPage,
                currentLearningResourcesPage,
                handleLearningResourcePageChange
            );
        }
    }

    function renderFoundationSkills(skills) {
        if (!foundationSkillsContent || !skills || skills.length === 0) return;
        const ul = document.createElement('ul');
        ul.className = 'list-disc list-inside space-y-2 text-gray-600';
        skills.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill;
            ul.appendChild(li);
        });
        foundationSkillsContent.appendChild(ul);
    }

    function renderAdvancedSkills(skills) {
        if (!advancedSkillsContent || !skills || skills.length === 0) return;
        const ul = document.createElement('ul');
        ul.className = 'list-disc list-inside space-y-2 text-gray-600';
        skills.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill;
            ul.appendChild(li);
        });
        advancedSkillsContent.appendChild(ul);
    }

    function renderLearningResources(containerElement, allItems, currentPage, itemsPerPage) {
        if (!containerElement) return;
        containerElement.innerHTML = ''; // Bersihkan kontainer sebelum render ulang

        if (!allItems || allItems.length === 0) {
            containerElement.innerHTML = '<p class="text-gray-500 text-center py-4">AI kami belum menemukan sumber belajar yang relevan untuk karier ini. Coba dengan kata kunci atau karier yang sedikit berbeda.</p>';
            return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = allItems.slice(startIndex, endIndex);

        const resourceListContainer = document.createElement('div');
        resourceListContainer.className = 'space-y-4';

        paginatedItems.forEach(resource => {
            const card = document.createElement('div');
            card.className = 'p-4 border rounded-lg bg-gray-50 shadow-sm';

            // Membuat elemen secara programatik untuk keamanan dan fleksibilitas
            const titleElement = document.createElement('h4');
            titleElement.className = 'font-semibold text-gray-700 text-lg mb-1';
            titleElement.textContent = resource.resource_title;

            const typeIcon = sourceTypeIcons[resource.source_type] || sourceTypeIcons["default"];
            const typeElement = document.createElement('p');
            typeElement.className = 'text-xs text-indigo-600 bg-indigo-100 inline-block px-2 py-0.5 rounded-full mb-2 font-medium';
            typeElement.textContent = `${typeIcon} ${resource.source_type}`;

            const skillElement = document.createElement('p');
            skillElement.className = 'text-sm text-gray-500 mb-2'; // Tambah margin bottom
            skillElement.innerHTML = `Keterampilan Terkait: <span class="font-medium text-gray-600">${resource.skill_related || 'Tidak spesifik'}</span>`;

            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'mt-3 flex items-center space-x-2';

            const linkElement = document.createElement('a');
            linkElement.href = resource.link;
            linkElement.target = '_blank';
            linkElement.rel = 'noopener noreferrer';
            linkElement.className = 'inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 transition duration-300';
            linkElement.innerHTML = 'Kunjungi Sumber <span class="ml-1">↗</span>';

            const copyButton = document.createElement('button');
            copyButton.className = 'inline-flex items-center px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-300 transition duration-300';
            copyButton.innerHTML = 'Salin Link <span class="ml-1">📋</span>';
            copyButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Hindari trigger event lain jika ada
                navigator.clipboard.writeText(resource.link).then(() => {
                    const originalText = copyButton.innerHTML;
                    copyButton.innerHTML = 'Disalin! <span class="ml-1">✅</span>';
                    copyButton.disabled = true;
                    setTimeout(() => {
                        copyButton.innerHTML = originalText;
                        copyButton.disabled = false;
                    }, 2000);
                }).catch(err => {
                    console.error('Gagal menyalin link:', err);
                    // Mungkin tambahkan alert atau feedback error lain di sini
                });
            });

            actionsContainer.appendChild(linkElement);
            actionsContainer.appendChild(copyButton);

            card.appendChild(titleElement);
            card.appendChild(typeElement);
            card.appendChild(skillElement);
            card.appendChild(actionsContainer); // Tambahkan container tombol ke kartu

            resourceListContainer.appendChild(card);
        });
        containerElement.appendChild(resourceListContainer);
    }

    function renderPortfolioProjects(projects) {
        if (!portfolioProjectList) return; // Targetkan sub-kontainer
        portfolioProjectList.innerHTML = ''; // Bersihkan daftar proyek sebelumnya

        if (!projects || projects.length === 0) {
            portfolioProjectList.innerHTML = '<p class="text-gray-500">Tidak ada ide proyek yang ditemukan.</p>';
            return;
        }

        // const container = document.createElement('div'); // Tidak perlu container tambahan jika sudah ada #portfolioProjectList dengan class space-y-4
        // container.className = 'space-y-4'; // Class ini sudah ada di #portfolioProjectList

        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'p-4 border rounded-lg bg-gray-50 shadow-sm';
            projectItem.innerHTML = `
                <h4 class="font-semibold text-gray-700 text-lg mb-1">${project.title}</h4>
                <p class="text-sm text-gray-600 mb-2">${project.description}</p>
                <div class="text-xs text-gray-500">
                    <span>Kesulitan: <span class="font-medium text-gray-700">${project.difficulty}</span></span> |
                    <span>Estimasi Waktu: <span class="font-medium text-gray-700">${project.estimated_time}</span></span>
                </div>
            `;
            portfolioProjectList.appendChild(projectItem); // Tambahkan ke sub-kontainer
        });
        // portfolioProjectsContent.appendChild(container); // Tidak lagi menambahkan container baru
    }

    if (refreshPortfolioButton) {
        refreshPortfolioButton.addEventListener('click', async () => {
            if (!currentTargetCareer) {
                console.log("Tidak ada target karier saat ini untuk me-refresh portofolio.");
                return;
            }

            console.log(`Tombol Refresh Portofolio diklik untuk: ${currentTargetCareer}`);
            // Opsional: Tampilkan spinner/loading kecil
            if(portfolioProjectList) portfolioProjectList.innerHTML = '<div class="flex justify-center items-center py-4"><div class="loader_small"></div><p class="ml-2 text-sm text-gray-500">Memuat ide baru...</p></div>';
            // Definisikan .loader_small di CSS jika diperlukan, atau gunakan teks saja.
            // Untuk sementara, kita akan gunakan teks:
            // if(portfolioProjectList) portfolioProjectList.innerHTML = '<p class="text-gray-500 text-center py-4">Memuat ide proyek baru...</p>';


            const cacheKey = `roadmap_${currentTargetCareer.toLowerCase().replace(/\s+/g, '_')}`;
            sessionStorage.removeItem(cacheKey);
            console.log(`Cache untuk ${currentTargetCareer} dihapus, meminta data baru untuk portofolio.`);

            try {
                const newRoadmapData = await generateRoadmap(currentTargetCareer);

                if (newRoadmapData) {
                    sessionStorage.setItem(cacheKey, JSON.stringify(newRoadmapData)); // Simpan data lengkap yang baru
                    console.log("Data baru dari API disimpan kembali ke cache:", cacheKey);

                    if (newRoadmapData.portfolio_projects) {
                        renderPortfolioProjects(newRoadmapData.portfolio_projects);
                    } else {
                         if(portfolioProjectList) portfolioProjectList.innerHTML = '<p class="text-gray-500">Gagal memuat ide proyek baru.</p>';
                    }

                    // Update data lain di state jika diperlukan, agar konsisten jika user navigasi pagination learning resources
                    allLearningResources = newRoadmapData.learning_resources || [];
                    // Tidak perlu render ulang learning resources kecuali jika kita mau,
                    // tapi state paginationnya mungkin perlu di-reset jika jumlahnya berubah
                    // Untuk sekarang, biarkan pagination learning resources apa adanya.
                    // Jika ingin reset:
                    // currentLearningResourcesPage = 1;
                    // displayCurrentPageLearningResources();

                } else {
                    console.error("Gagal mendapatkan data baru setelah refresh portofolio.");
                    if(portfolioProjectList) portfolioProjectList.innerHTML = '<p class="text-red-500 text-center py-4">Gagal memuat ide proyek baru. Coba lagi.</p>';
                }
            } catch (error) {
                console.error("Error saat me-refresh portofolio:", error);
                if(portfolioProjectList) portfolioProjectList.innerHTML = '<p class="text-red-500 text-center py-4">Terjadi kesalahan saat memuat ide. Coba lagi.</p>';
            }
            // Opsional: Sembunyikan spinner/loading
        });
    }


    function renderPaginationControls(containerElement, totalItems, itemsPerPage, currentPage, pageChangeCallback) {
        if (!containerElement) return;
        containerElement.innerHTML = ''; // Bersihkan kontrol pagination sebelumnya

        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) {
            return; // Tidak perlu pagination jika hanya 1 halaman atau kurang
        }

        // Tombol Sebelumnya
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '&laquo; Sebelumnya';
        prevButton.className = 'px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed';
        if (currentPage === 1) {
            prevButton.disabled = true;
        }
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                pageChangeCallback(currentPage - 1);
            }
        });
        containerElement.appendChild(prevButton);

        // Info Halaman (Contoh: Halaman 1 dari 3)
        const pageInfo = document.createElement('span');
        pageInfo.className = 'text-sm text-gray-700';
        pageInfo.textContent = `Hal ${currentPage} dari ${totalPages}`;
        containerElement.appendChild(pageInfo);

        // Tombol Berikutnya
        const nextButton = document.createElement('button');
        nextButton.innerHTML = 'Berikutnya &raquo;';
        nextButton.className = 'px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed';
        if (currentPage === totalPages) {
            nextButton.disabled = true;
        }
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                pageChangeCallback(currentPage + 1);
            }
        });
        containerElement.appendChild(nextButton);
    }

    function handleLearningResourcePageChange(newPage) {
        currentLearningResourcesPage = newPage;
        displayCurrentPageLearningResources();
    }
});
