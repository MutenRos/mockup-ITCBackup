// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Cerrar menú móvil si está abierto
            navLinks.classList.remove('active');
        }
    });
});

// Menú hamburguesa
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
});

// Permitir abrir menú con tecla Enter
hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
    }
});

// Cambiar navbar al hacer scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
});

// Formulario de contacto
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Obtener datos del formulario
    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        empresa: document.getElementById('empresa').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        mensaje: document.getElementById('mensaje').value.trim()
    };

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        formMessage.textContent = 'Por favor, introduce un email válido.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        return;
    }
    
    // Mostrar mensaje de carga
    formMessage.textContent = 'Enviando mensaje...';
    formMessage.className = 'form-message';
    formMessage.style.display = 'block';
    formMessage.style.background = '#dbeafe';
    formMessage.style.color = '#1e40af';
    
    // Simular envío (en producción, aquí harías la llamada al servidor)
    setTimeout(() => {
        // Aquí normalmente harías:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // })
        
        // Por ahora mostramos un mensaje de éxito
        formMessage.textContent = '¡Mensaje enviado con éxito! Te responderemos pronto.';
        formMessage.className = 'form-message success';
        
        // Limpiar formulario
        contactForm.reset();
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
        
        // En caso de error, usarías:
        // formMessage.textContent = 'Hubo un error. Por favor, intenta de nuevo.';
        // formMessage.className = 'form-message error';
    }, 1500);
});

// Animación de elementos al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos con animación
document.querySelectorAll('.service-card, .project-card, .feature-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Contador animado para las estadísticas
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

// Activar contadores cuando entran en viewport
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const targetText = statNumber.textContent;
            
            // Solo animar números
            if (!isNaN(targetText)) {
                animateCounter(statNumber, parseInt(targetText));
            }
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Efecto de escritura para el título (opcional)
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    heroTitle.style.opacity = '1';
    
    let index = 0;
    const typeSpeed = 50;
    
    function typeWriter() {
        if (index < text.length) {
            heroTitle.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, typeSpeed);
        }
    }
    
    // Descomentar para activar efecto de escritura
    // typeWriter();
}

const loadActiveWeekCard = async () => {
    const activeWeekDescription = document.getElementById('activeWeekDescription');
    const activeWeekLink = document.getElementById('activeWeekLink');
    const previousWeekDescription = document.getElementById('previousWeekDescription');
    const previousWeekLink = document.getElementById('previousWeekLink');

    if (!activeWeekDescription || !activeWeekLink) {
        return;
    }

    try {
        const response = await fetch('/api/reviews/list');
        if (!response.ok) {
            throw new Error('No se pudo obtener el listado de revisiones');
        }

        const payload = await response.json();
        const reviewFiles = Array.isArray(payload.files) ? payload.files : [];

        if (!reviewFiles.length) {
            activeWeekDescription.textContent = 'No se encontraron planes semanales publicados aún.';
            activeWeekLink.textContent = 'Abrir Revisión Base';
            activeWeekLink.href = 'reviews/REVISION_SEMANAL_BASELINE_2026-03-06.md';
            if (previousWeekDescription && previousWeekLink) {
                previousWeekDescription.textContent = 'No hay semana anterior disponible.';
                previousWeekLink.textContent = 'Abrir Índice Operativo';
                previousWeekLink.href = 'INDICE_OPERATIVO_RAPIDO.md';
            }
            return;
        }

        const uniqueWeeks = reviewFiles
            .filter((item) => Number.isInteger(item.week) && typeof item.name === 'string')
            .map((item) => ({ weekNumber: item.week, fileName: item.name }))
            .sort((a, b) => b.weekNumber - a.weekNumber);

        const latest = uniqueWeeks[0];
        const previous = uniqueWeeks[1];

        activeWeekDescription.textContent = `Plan más reciente detectado: Semana ${latest.weekNumber}.`;
        activeWeekLink.textContent = `Abrir Semana ${latest.weekNumber}`;
        activeWeekLink.href = `reviews/${latest.fileName}`;

        if (previousWeekDescription && previousWeekLink) {
            if (previous) {
                previousWeekDescription.textContent = `Comparativa rápida: Semana anterior ${previous.weekNumber}.`;
                previousWeekLink.textContent = `Abrir Semana ${previous.weekNumber}`;
                previousWeekLink.href = `reviews/${previous.fileName}`;
            } else {
                previousWeekDescription.textContent = 'No hay semana anterior disponible.';
                previousWeekLink.textContent = 'Abrir Índice Operativo';
                previousWeekLink.href = 'INDICE_OPERATIVO_RAPIDO.md';
            }
        }
    } catch (error) {
        activeWeekDescription.textContent = 'No fue posible detectar automáticamente la semana activa.';
        activeWeekLink.textContent = 'Abrir Índice Operativo';
        activeWeekLink.href = 'INDICE_OPERATIVO_RAPIDO.md';
        if (previousWeekDescription && previousWeekLink) {
            previousWeekDescription.textContent = 'No fue posible detectar la semana anterior automáticamente.';
            previousWeekLink.textContent = 'Abrir Índice Operativo';
            previousWeekLink.href = 'INDICE_OPERATIVO_RAPIDO.md';
        }
    }
};

loadActiveWeekCard();

console.log('🚀 Integra Tech Consulting - Website cargado correctamente');
