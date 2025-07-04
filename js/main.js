// Berkas: js/main.js

import generateRoadmap from './generateRoadmap.js';

window.addEventListener('DOMContentLoaded', () => {
    // Variabel untuk Pagination Sumber Belajar dan data Peta Jalan
    let allLearningResources = [];
    let currentLearningResourcesPage = 1;
    const learningResourcesPerPage = 5; // Tampilkan 5 item per halaman
    let currentRoadmapData = null; // Variabel untuk menyimpan data peta jalan saat ini

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
    const courseRecommendationsContent = document.getElementById('courseRecommendationsContent'); // Ini juga kontainer untuk Learning Resources
    const portfolioProjectsContent = document.getElementById('portfolioProjectsContent');
    const learningResourcesPaginationContainer = document.getElementById('learningResourcesPagination');

    const loginButton = document.getElementById('loginButton');
    const backToHomeButton = document.getElementById('backToHomeButton');
    const logo = document.getElementById('logo');
    const saveRoadmapButton = document.getElementById('saveRoadmapButton'); // Tombol Simpan Peta Jalan

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

        // Bersihkan konten sebelumnya
        clearRoadmapContents();

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

        console.log(`Memanggil generateRoadmap untuk: ${goal}`);
        try {
            // const roadmapData = await generateRoadmap(goal); // Deklarasi lama
            currentRoadmapData = await generateRoadmap(goal); // Simpan ke variabel scope lebih luas

            if (currentRoadmapData) {
                allLearningResources = currentRoadmapData.learning_resources || [];
                currentLearningResourcesPage = 1;

                renderAllRoadmapContent(currentRoadmapData); // Ini akan memanggil displayCurrentPageLearningResources secara internal

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

        allLearningResources = []; // Reset data sumber belajar
        currentLearningResourcesPage = 1; // Reset halaman
        clearRoadmapContents(); // Termasuk membersihkan pagination
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
        if (portfolioProjectsContent) portfolioProjectsContent.innerHTML = '';
        if (learningResourcesPaginationContainer) learningResourcesPaginationContainer.innerHTML = ''; // Bersihkan pagination
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
            containerElement.innerHTML = '<p class="text-gray-500">Tidak ada sumber belajar yang ditemukan.</p>';
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

            const typeElement = document.createElement('p');
            typeElement.className = 'text-xs text-indigo-600 bg-indigo-100 inline-block px-2 py-0.5 rounded-full mb-2 font-medium';
            typeElement.textContent = resource.source_type;

            const skillElement = document.createElement('p');
            skillElement.className = 'text-sm text-gray-500 mb-1';
            skillElement.innerHTML = `Keterampilan Terkait: <span class="font-medium text-gray-600">${resource.skill_related || 'Tidak spesifik'}</span>`;

            const linkElement = document.createElement('a');
            linkElement.href = resource.link;
            linkElement.target = '_blank';
            linkElement.rel = 'noopener noreferrer';
            linkElement.className = 'inline-block mt-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition duration-300';
            linkElement.textContent = 'Kunjungi Sumber';

            card.appendChild(titleElement);
            card.appendChild(typeElement);
            card.appendChild(skillElement);
            card.appendChild(linkElement);

            resourceListContainer.appendChild(card);
        });
        containerElement.appendChild(resourceListContainer);
    }

    function renderPortfolioProjects(projects) {
        if (!portfolioProjectsContent || !projects || projects.length === 0) return;
        const container = document.createElement('div');
        container.className = 'space-y-4';

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
            container.appendChild(projectItem);
        });
        portfolioProjectsContent.appendChild(container);
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

    function prepareContentForPdf(careerTitle, foundationSkills, advancedSkills) {
        const container = document.createElement('div');
        container.className = 'pdf-container'; // Gunakan kelas CSS yang didefinisikan di index.html
        // Style untuk menyembunyikan dari viewport tapi tetap bisa dirender oleh html2canvas
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0px';
        container.style.zIndex = '-1'; // Pastikan tidak mengganggu interaksi pengguna
        // container.style.width = '595pt'; // A4 width in points, bisa disesuaikan atau biarkan html2canvas handle scaling

        // Judul Utama PDF
        const mainTitle = document.createElement('h1');
        mainTitle.textContent = `Peta Jalan Karir untuk: ${careerTitle}`;
        container.appendChild(mainTitle);

        // Bagian Keterampilan Fondasi
        if (foundationSkills && foundationSkills.length > 0) {
            const foundationTitle = document.createElement('h2');
            foundationTitle.textContent = 'Keterampilan Fondasi';
            container.appendChild(foundationTitle);

            const ulFoundation = document.createElement('ul');
            foundationSkills.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                ulFoundation.appendChild(li);
            });
            container.appendChild(ulFoundation);
        }

        // Bagian Keterampilan Lanjutan & Spesialisasi
        if (advancedSkills && advancedSkills.length > 0) {
            const advancedTitle = document.createElement('h2');
            advancedTitle.textContent = 'Keterampilan Lanjutan & Spesialisasi';
            container.appendChild(advancedTitle);

            const ulAdvanced = document.createElement('ul');
            advancedSkills.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                ulAdvanced.appendChild(li);
            });
            container.appendChild(ulAdvanced);
        }

        document.body.appendChild(container); // Tambahkan ke body agar html2canvas bisa mengaksesnya
        return container;
    }

    // Event Listener untuk Tombol Simpan Peta Jalan (Unduh PDF)
    if (saveRoadmapButton) {
        saveRoadmapButton.addEventListener('click', async () => {
            // Menggunakan currentRoadmapData yang sudah disimpan
            if (!currentRoadmapData || !careerPathSection || careerPathSection.classList.contains('hidden')) {
                alert("Tidak ada peta jalan untuk disimpan. Harap buat peta jalan terlebih dahulu.");
                return;
            }

            // Ambil judul karier untuk nama file
            const careerGoalText = careerPathTitleSpan ? careerPathTitleSpan.textContent : "Karier";
            const filename = `Peta Jalan - ${careerGoalText.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;

            // Tambahkan kelas loading ke tombol
            saveRoadmapButton.classList.add('button-loading');
            saveRoadmapButton.disabled = true;
            // Sembunyikan ikon SVG sementara jika ada, agar spinner tidak tumpang tindih
            const svgIcon = saveRoadmapButton.querySelector('svg');
            if (svgIcon) svgIcon.style.display = 'none';

            let pdfContentElement = null; // Variabel untuk menyimpan elemen konten PDF sementara

            try {
                // Ambil judul karier dari currentRoadmapData jika tersedia, atau dari DOM
                const titleForPdf = currentRoadmapData.career_goal_title || (careerPathTitleSpan ? careerPathTitleSpan.textContent : "Karier");

                // Siapkan konten khusus untuk PDF
                pdfContentElement = prepareContentForPdf(
                    titleForPdf,
                    currentRoadmapData.foundation_skills,
                    currentRoadmapData.advanced_skills
                );

                if (!pdfContentElement) {
                    throw new Error("Gagal menyiapkan konten untuk PDF.");
                }

                // Beri sedikit waktu agar elemen baru sepenuhnya dirender di DOM (meskipun tersembunyi)
                await new Promise(resolve => setTimeout(resolve, 100));

                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'pt',
                    format: 'a4',
                    putOnlyUsedFonts: true,
                    floatPrecision: 16
                });

                const canvas = await window.html2canvas(pdfContentElement, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff', // Pastikan background putih
                     onclone: (documentClone) => {
                        // Tidak perlu lagi membuka accordion karena kita sudah membuat konten terpisah
                        // Namun, kita bisa memastikan elemen pdf-container di klon memiliki style yang benar jika perlu
                        const clonedPdfContainer = documentClone.querySelector('.pdf-container');
                        if (clonedPdfContainer) {
                            // Contoh: pastikan width-nya diterapkan jika penting untuk rendering html2canvas
                            // clonedPdfContainer.style.width = '595pt'; // Sesuaikan jika perlu
                        }
                    }
                });

                const imgData = canvas.toDataURL('image/png');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                let heightLeft = pdfHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();

                while (heightLeft >= 0) {
                    position = heightLeft - pdfHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                    heightLeft -= pdf.internal.pageSize.getHeight();
                }

                pdf.save(filename);

            } catch (error) {
                console.error("Error saat membuat PDF:", error);
                alert("Gagal membuat PDF. Silakan coba lagi. Error: " + error.message);
            } finally {
                // Kembalikan tombol ke state normal
                saveRoadmapButton.classList.remove('button-loading');
                saveRoadmapButton.disabled = false;
                if (svgIcon) svgIcon.style.display = ''; // Kembalikan ikon

                // Hapus elemen konten PDF sementara dari DOM
                if (pdfContentElement && pdfContentElement.parentNode) {
                    pdfContentElement.parentNode.removeChild(pdfContentElement);
                }
            }
        });
    }
});
