# Integra Tech Consulting — Plataforma Web de Consultoría Tecnológica

![Integra Tech Consulting](favicon.svg)

## Introducción

Integra Tech Consulting es una plataforma web completa para una empresa de consultoría y desarrollo tecnológico. Combina una web pública de captación de clientes con un panel de administración interno que incluye dashboard de KPIs, gestión de clientes, agenda interactiva con calendario y un generador de presupuestos automático con exportación a PDF. El proyecto está construido enteramente con HTML, CSS y JavaScript vanilla, sin frameworks ni dependencias backend, demostrando que es posible crear una experiencia premium y funcional con las tecnologías fundamentales de la web.

---

## Desarrollo de las partes

### 1. Landing Page Corporativa con Diseño Premium

La página principal (`index.html`) implementa una web corporativa moderna con diseño dark-mode y paleta Sky/Indigo/Teal. Incluye secciones de hero con métricas, servicios, metodología de trabajo, about, CTA, formulario de contacto y FAQ con `<details>`.

```html
<!-- index.html, líneas 42-68 — Sección Hero con métricas animadas -->
<section id="inicio" class="hero">
    <div class="container">
        <div class="hero-content">
            <div class="hero-eyebrow">Integra Tech Consulting v2.0</div>
            <h1 class="hero-title">Ingeniería web para <br>
                <span class="gradient-text">negocios escalables</span></h1>
            <p class="hero-subtitle">Desarrollamos infraestructura digital...</p>
            <div class="hero-metrics">
                <div class="metric">
                    <span class="metric-value">100%</span>
                    <span class="metric-label">Uptime Garantizado</span>
                </div>
                ...
            </div>
        </div>
    </div>
</section>
```

El diseño utiliza variables CSS custom (`--bg-main`, `--primary`, `--gradient-text`), efectos de glassmorphism con `backdrop-filter: blur(20px)` y un fondo con grid de líneas sutiles definido en `styles.css`.

### 2. Sistema de Estilos CSS con Variables y Efectos Avanzados

El archivo `styles.css` (610+ líneas) define un sistema de diseño completo basado en variables CSS, con elementos como gradientes de texto, glass-morphism, grid background pattern, y animaciones de scroll.

```css
/* styles.css, líneas 1-22 — Variables del sistema de diseño */
:root {
    --bg-main: #020617;
    --bg-card: rgba(15, 23, 42, 0.6);
    --primary: #38bdf8;
    --secondary: #818cf8;
    --accent: #2dd4bf;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --border: rgba(255, 255, 255, 0.08);
    --glass: blur(20px);
    --gradient-text: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
}
```

Las tarjetas de servicio usan un efecto de borde superior con gradiente que aparece en hover, y un fondo glass con opacidad variable. El diseño es totalmente responsive con media queries para 768px.

### 3. JavaScript Interactivo — Formulario, Animaciones y Scroll

El archivo `script.js` implementa múltiples funcionalidades: smooth scrolling con `scrollIntoView`, menú hamburguesa con accesibilidad (aria-expanded), formulario de contacto con validación de email por regex, animaciones al scroll usando `IntersectionObserver`, y contadores animados.

```javascript
// script.js, líneas 86-104 — IntersectionObserver para animaciones al scroll
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

document.querySelectorAll('.service-card, .project-card, .feature-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});
```

La validación del formulario incluye comprobación de formato email con regex y trim() de los campos antes del envío.

### 4. Dashboard de Administración con KPIs y Tablas

El panel de control (`dashboard.html` + `dashboard.css`) presenta un layout sidebar + main content con estadísticas en tiempo real, tabla de proyectos recientes con estados coloreados y navegación entre secciones (Dashboard, Agenda, Clientes, Proyectos, Finanzas).

```html
<!-- dashboard.html, líneas 63-83 — Grid de estadísticas del dashboard -->
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-label">Ingresos Mensuales</div>
        <div class="stat-value">€12,450</div>
        <div class="stat-trend trend-up">↑ 12% vs mes anterior</div>
    </div>
    <div class="stat-card">
        <div class="stat-label">Proyectos Activos</div>
        <div class="stat-value">8</div>
        <div class="stat-trend">3 en fase final</div>
    </div>
    ...
</div>
```

El `dashboard.css` (991 líneas) define un sistema completo con sidebar fija, tarjetas estadísticas con tendencias, badges de estado, barras de progreso y estilos para tablas interactivas.

### 5. Agenda Interactiva con Calendario JS Dinámico

La agenda (`agenda.html` + `agenda.js`) renderiza un calendario mensual completo con JavaScript puro. Soporta navegación entre meses, marcado del día actual, eventos con chips coloreados por tipo (reuniones, trabajo, entregas) y un panel lateral con próximos eventos.

```javascript
// agenda.js, líneas 1-22 — Base de datos de eventos y configuración del calendario
const events = {
    "2026-0-2": [
        { type: "event-meeting", title: "10:00 Reunión Logística Norte" },
        { type: "event-work", title: "15:00 Dev Sprint" }
    ],
    "2026-0-5": [
        { type: "event-meeting", title: "11:30 Demo Cliente" }
    ],
    "2026-0-9": [
        { type: "event-deadline", title: "Entrega Prototipo" }
    ]
};
```

El calendario calcula dinámicamente los días del mes, ajusta el primer día para empezar en lunes (estándar europeo) y rellena días del mes anterior/siguiente.

### 6. Calculadora de Presupuestos con Generación de PDF

El generador de presupuestos (`new-project.html` + `budget-calculator.js`) es un formulario interactivo que calcula en tiempo real el coste de un proyecto basándose en Blueprint, tipo de web, funcionalidades adicionales, multiplicadores de complejidad y plan de soporte.

```javascript
// budget-calculator.js, líneas 27-90 — Cálculo del presupuesto en tiempo real
function calculateBudget() {
    let blueprintCost = 0;
    let implementationBase = 0;
    let monthlyCost = 0;

    // Blueprint (radio buttons: 0€, 450€, 900€, 1500€)
    for (const radio of blueprintRadios) {
        if (radio.checked) { blueprintCost = parseFloat(radio.value); break; }
    }
    // Web Type + Quantities + Feature Checkboxes
    implementationBase += parseFloat(webTypeSelect.value || 0);
    qtyInputs.forEach(input => { ... });
    featureChecks.forEach(check => { ... });

    // Multiplicadores (Plazo × Complejidad) + Gestión de Proyecto
    const combinedMult = deadlineMult * complexityMult;
    const pmCost = multipliedBase * pmRate;
    const finalTotal = multipliedBase + pmCost;
}
```

El sistema genera un PDF profesional con `html2pdf.js`, construyendo dinámicamente un documento de propuesta de servicios con cabecera corporativa, secciones del cuestionario y resumen económico.

### 7. Gestión de Clientes con Detalle y Proyectos Asociados

La sección de clientes (`clients.html` + `client-details.html`) implementa una tabla interactiva con filas clickables que navegan al detalle del cliente. La ficha incluye información de contacto, datos fiscales, notas internas y tabla de proyectos asociados con barras de progreso.

```html
<!-- client-details.html, líneas 65-86 — Grid de información del cliente -->
<div class="client-info-grid">
    <div class="info-card">
        <h3>Información de Contacto</h3>
        <p><strong>Persona:</strong> Carlos Ruiz</p>
        <p><strong>Email:</strong> carlos@logisticanorte.com</p>
        <p><strong>Cargo:</strong> Director de Operaciones</p>
    </div>
    <div class="info-card">
        <h3>Datos Fiscales & Facturación</h3>
        <p><strong>CIF:</strong> B-12345678</p>
        <p><strong>Condiciones:</strong> 50% inicio / 50% entrega</p>
    </div>
</div>
```

---

## Presentación del proyecto

Integra Tech Consulting es una solución web completa que demuestra cómo construir una presencia digital profesional y un sistema de gestión interno usando únicamente HTML, CSS y JavaScript.

**La web pública** presenta la marca con un diseño dark premium inspirado en empresas SaaS de referencia: hero con métricas rotundas, tres servicios core (Frontend, Sistemas Integrados, Infraestructura), proceso de trabajo en tres fases, sección about con estadísticas, un call-to-action potente, formulario de contacto validado y sección FAQ interactiva. Todo con efectos glassmorphism, animaciones al scroll y responsive completo.

**El panel de administración** ofrece un dashboard con 4 KPIs principales (ingresos, proyectos activos, tickets, conversión), una tabla de proyectos recientes con estados coloreados, una agenda con calendario interactivo renderizado con JavaScript que muestra eventos por tipo, gestión de clientes con fichas detalladas y proyectos asociados, y un generador de presupuestos automatizado que calcula costes en tiempo real (blueprint, web, funcionalidades, multiplicadores, soporte) y exporta propuestas profesionales en PDF.

Todo el proyecto funciona sin backend, sin frameworks y sin bases de datos — es HTML/CSS/JS puro funcionando directamente en el navegador, lo que lo hace ideal para GitHub Pages y demuestra dominio de las tecnologías web fundamentales.

---

## Conclusión

Integra Tech Consulting demuestra que con las tecnologías fundamentales de la web —HTML semántico, CSS moderno con variables y glass effects, y JavaScript con APIs nativas como IntersectionObserver— se puede construir una plataforma funcional y visualmente impactante. El proyecto abarca desde el diseño de marca con gradientes y tipografía premium hasta lógica de negocio completa como el cálculo de presupuestos con multiplicadores y la generación de PDF. La organización del código en archivos especializados (styles.css para la landing, dashboard.css para el panel, scripts separados para cada funcionalidad) refleja buenas prácticas de desarrollo web que facilitan el mantenimiento y la escalabilidad del proyecto.
