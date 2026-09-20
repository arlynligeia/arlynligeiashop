/* ======================================
   SCRIPT: NAVEGACIÓN MENÚS Y SUBMENÚS
====================================== */
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔧 Navegación iniciada');

    // FUNCIÓN: OCULTAR TODAS LAS SECCIONES Y MOSTRAR SOLO HOME
    function showOnlyHomeOnLoad() {
        document.querySelectorAll('.main-section, .subsection').forEach(section => {
            section.style.display = 'none';
        });

        const homeSection = document.getElementById('home');
        if (homeSection) {
            homeSection.style.display = 'block';
        }

        document.querySelectorAll('[id^="home-"]').forEach(subsection => {
            subsection.style.display = 'block';
        });
    }

    // FUNCIÓN: NAVEGAR A UNA SECCIÓN
    function showOnlyOneSection(sectionId) {
        console.log('Mostrando SOLO:', sectionId);

        document.querySelectorAll('.main-section, .subsection').forEach(section => {
            section.style.display = 'none';
        });

        const mainSection = document.getElementById(sectionId);
        if (mainSection) {
            mainSection.style.display = 'block';

            document.querySelectorAll(`[id^="${sectionId}-"]`).forEach(subsection => {
                subsection.style.display = 'block';
            });

            mainSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // FUNCIÓN: NAVEGAR A UNA SUBSECCIÓN
    function goToSubsection(subsectionId) {
        console.log('Yendo a subsección:', subsectionId);

        const mainSectionId = subsectionId.split('-')[0];
        showOnlyOneSection(mainSectionId);

        setTimeout(() => {
            const subsection = document.getElementById(subsectionId);
            if (subsection) {
                subsection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    // EVENTOS PARA BOTONES DEL MENÚ PRINCIPAL
    document.querySelectorAll('.menu-nav a, .menu-mobile-nav a').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
            showOnlyOneSection(targetId);
            history.pushState(null, null, `#${targetId}`);
        });
    });

    // EVENTOS PARA BOTONES DE SUBMENÚ
    document.querySelectorAll('.menu-nav-submenu a, .menu-mobile-nav-submenu a').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
            goToSubsection(targetId);
            history.pushState(null, null, `#${targetId}`);
        });
    });

    // VERIFICAR HASH AL CARGAR LA PÁGINA
    function checkInitialHash() {
        const hash = window.location.hash.replace('#', '');

        if (hash) {
            if (hash.includes('-')) {
                goToSubsection(hash);
            } else {
                showOnlyOneSection(hash);
            }
        } else {
            showOnlyHomeOnLoad();
        }
    }

    // NAVEGACIÓN DEL NAVEGADOR (atrás/adelante)
    function handleBrowserNavigation() {
        const hash = window.location.hash.replace('#', '');

        if (hash) {
            if (hash.includes('-')) {
                goToSubsection(hash);
            } else {
                showOnlyOneSection(hash);
            }
        } else {
            showOnlyHomeOnLoad();
        }
    }

    window.addEventListener('popstate', handleBrowserNavigation);

    // INICIALIZACIÓN
    checkInitialHash();
    console.log('✅ Navegación configurada correctamente');
});
