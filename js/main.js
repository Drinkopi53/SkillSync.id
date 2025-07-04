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
        if (roadmapData.learning_resources && courseRecommendationsContent) { // Menggunakan courseRecommendationsContent sebagai container
            renderLearningResources(roadmapData.learning_resources, courseRecommendationsContent);
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

    function renderLearningResources(resources, containerElement) {
        if (!containerElement || !resources || resources.length === 0) return;

        const resourceListContainer = document.createElement('div');
        resourceListContainer.className = 'space-y-4'; // Menggunakan space-y untuk jarak antar item

        resources.forEach(resource => {
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
});
