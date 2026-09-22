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

        // Quitar la clase is-section al volver a Home
        document.body.classList.remove('is-section');
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

            // Si NO es home, activar is-section; si es home, quitarla
            if (sectionId === 'home') {
                document.body.classList.remove('is-section');
            } else {
                document.body.classList.add('is-section');
            }
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







/* ======================================
   SCRIPT: NAVEGACIÓN MOBILE
====================================== */
document.addEventListener('DOMContentLoaded', function () {
    console.log('📱 Navegación mobile iniciada');

    // ======================================
    // ABRIR / CERRAR MENÚ HAMBURGUESA
    // ======================================
    const botonMobile = document.querySelector('.menu-mobile-toggle');
    const menuMobile = document.querySelector('.menu-mobile-nav');

    if (botonMobile && menuMobile) {
        botonMobile.addEventListener('click', function () {
            menuMobile.classList.toggle('active');
        });
    }

    // FUNCIÓN: CERRAR MENÚ MOBILE
    function cerrarMenuMobile() {
        if (menuMobile) {
            menuMobile.classList.remove('active');
        }
    }

    // FUNCIÓN: OCULTAR TODAS LAS SECCIONES Y MOSTRAR SOLO HOME
    function showOnlyHomeOnLoad() {
        document.querySelectorAll('.main-section-mobile, .subsection-mobile').forEach(section => {
            section.style.display = 'none';
        });

        const homeSection = document.getElementById('home-mobile');
        if (homeSection) {
            homeSection.style.display = 'block';
        }

        document.querySelectorAll('[id^="home-mobile-"]').forEach(subsection => {
            subsection.style.display = 'block';
        });
    }

    // FUNCIÓN: NAVEGAR A UNA SECCIÓN
    function showOnlyOneSection(sectionId) {
        console.log('Mostrando SOLO:', sectionId);

        document.querySelectorAll('.main-section-mobile, .subsection-mobile').forEach(section => {
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

        const mainSectionId = subsectionId.split('-')[0] + '-mobile';
        showOnlyOneSection(mainSectionId);

        setTimeout(() => {
            const subsection = document.getElementById(subsectionId);
            if (subsection) {
                subsection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    // EVENTOS PARA BOTONES DEL MENÚ MOBILE
    document.querySelectorAll('.menu-mobile-nav a').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
            showOnlyOneSection(targetId);
            history.pushState(null, null, `#${targetId}`);
            cerrarMenuMobile();
        });
    });

    // EVENTOS PARA BOTONES DE SUBMENÚ MOBILE
    document.querySelectorAll('.menu-mobile-nav-submenu a').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
            goToSubsection(targetId);
            history.pushState(null, null, `#${targetId}`);
            cerrarMenuMobile();
        });
    });

    // VERIFICAR HASH AL CARGAR LA PÁGINA
    function checkInitialHash() {
        const hash = window.location.hash.replace('#', '');

        if (hash) {
            if (hash.includes('-') && hash !== 'home-mobile') {
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
            if (hash.includes('-') && hash !== 'home-mobile') {
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
    console.log('✅ Navegación mobile configurada correctamente');
});











/* ======================================
   CONTACT: MOSTRAR TOPIC SOLO SI ELIGEN "WORK"
====================================== */

// ========== PC ==========
const contactTypePC = document.getElementById('contact-type');
const contactWrapperPC = document.getElementById('contact-wrapper');
const contactTopicPC = document.getElementById('contact-topic');

if (contactTypePC && contactWrapperPC && contactTopicPC) {
    contactTypePC.addEventListener('change', function () {
        if (this.value === 'work') {
            contactWrapperPC.style.display = 'block';
            contactTopicPC.setAttribute('required', 'required');
            contactTopicPC.removeAttribute('disabled');
        } else {
            contactWrapperPC.style.display = 'none';
            contactTopicPC.removeAttribute('required');
            contactTopicPC.value = '';
            contactTopicPC.setAttribute('disabled', 'disabled');
        }
    });
}

// ========== MOBILE ==========
const contactTypeMobile = document.getElementById('contact-type-mobile');
const contactWrapperMobile = document.getElementById('contact-wrapper-mobile');
const contactTopicMobile = document.getElementById('contact-topic-mobile');

if (contactTypeMobile && contactWrapperMobile && contactTopicMobile) {
    contactTypeMobile.addEventListener('change', function () {
        if (this.value === 'work') {
            contactWrapperMobile.style.display = 'block';
            contactTopicMobile.setAttribute('required', 'required');
            contactTopicMobile.removeAttribute('disabled');
        } else {
            contactWrapperMobile.style.display = 'none';
            contactTopicMobile.removeAttribute('required');
            contactTopicMobile.value = '';
            contactTopicMobile.setAttribute('disabled', 'disabled');
        }
    });
}
