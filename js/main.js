// Berkas: js/main.js

import generateRoadmap from './generateRoadmap.js';

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
    const portfolioProjectsContent = document.getElementById('portfolioProjectsContent');

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
            const roadmapData = await generateRoadmap(goal);

            if (roadmapData) {
                renderAllRoadmapContent(roadmapData);
                if (loadingSection) loadingSection.classList.add('hidden');
                if (careerPathSection) careerPathSection.classList.remove('hidden');

                // Reset accordion ke state awal setelah render
                accordionButtons.forEach((button, index) => {
                    const content = button.nextElementSibling;
                    // Buka accordion pertama jika ada konten, atau semua jika hanya ada 1 section data (misal hanya skill)
                    // Untuk sekarang, buka yang pertama jika ada data di dalamnya.
                    const hasContent = content && content.innerHTML.trim() !== "";
                    const isFirstMeaningful = index === 0 && hasContent; // Lebih baik jika kita tahu section mana yang pasti ada data

                    button.setAttribute('aria-expanded', isFirstMeaningful ? 'true' : 'false');
                    if (content) {
                        content.classList.toggle('hidden', !isFirstMeaningful);
                    }
                    const arrowIcon = button.querySelector('svg');
                    if (arrowIcon) {
                        arrowIcon.style.transform = isFirstMeaningful ? 'rotate(180deg)' : 'rotate(0deg)';
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
        if (inputError) inputError.classList.add('hidden'); // Sembunyikan error input saat kembali
        // if(careerGoalInput) careerGoalInput.value = ""; // Opsional
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
        if (roadmapData.course_recommendations && courseRecommendationsContent) {
            renderCourseRecommendations(roadmapData.course_recommendations);
        }
        if (roadmapData.portfolio_projects && portfolioProjectsContent) {
            renderPortfolioProjects(roadmapData.portfolio_projects);
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

    function renderCourseRecommendations(courses) {
        if (!courseRecommendationsContent || !courses || courses.length === 0) return;
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-6';

        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'border p-4 rounded-lg bg-gray-50 shadow-sm';

            let logoHtml = '';
            if (course.provider && course.provider.toLowerCase().includes('google')) {
                logoHtml = `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/80px-Google_2015_logo.svg.png" alt="Google" class="course-logo">`;
            } else if (course.provider && course.provider.toLowerCase().includes('coursera')) {
                logoHtml = `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/80px-Coursera-Logo_600x600.svg.png" alt="Coursera" class="course-logo">`;
            } else if (course.provider && course.provider.toLowerCase().includes('udemy')) {
                logoHtml = `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Udemy_logo.svg/80px-Udemy_logo.svg.png" alt="Udemy" class="course-logo">`;
            } else if (course.provider && course.provider.toLowerCase().includes('dicoding')) {
                logoHtml = `<img src="https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/commons/new-dicoding-logo.png" alt="Dicoding" class="course-logo">`;
            } else {
                // Placeholder logo jika tidak ada atau tidak dikenal
                logoHtml = `<span class="course-logo bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600 font-semibold">${course.provider ? course.provider.substring(0, 3).toUpperCase() : 'CRS'}</span>`;
            }

            card.innerHTML = `
                <div class="flex items-center mb-2">
                    ${logoHtml}
                    <h4 class="font-semibold text-gray-700 flex-1">${course.course_name}</h4>
                </div>
                <p class="text-sm text-gray-500 mb-1">Keterampilan: ${course.skill_related || 'Tidak spesifik'}</p>
                <p class="text-sm text-gray-500 mb-3">Penyedia: ${course.provider}</p>
                <a href="${course.link}" target="_blank" rel="noopener noreferrer" class="inline-block px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition duration-300">
                    Lihat Kursus
                </a>
            `;
            gridContainer.appendChild(card);
        });
        courseRecommendationsContent.appendChild(gridContainer);
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
});
