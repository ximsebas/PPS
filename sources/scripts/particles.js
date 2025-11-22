// particles.js - Sistema de partículas reutilizable para todas las páginas

/**
 * Crea partículas animadas para el fondo
 * @param {string} containerId - ID del contenedor de partículas
 * @param {number} count - Número de partículas a crear
 * @param {array} colors - Array de colores para las partículas
 */
function createParticles(containerId = "particles", count = 12, colors = null) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Contenedor de partículas #${containerId} no encontrado`);
    return;
  }

  // Colores por defecto (tema rosa)
  const defaultColors = ["#ec4899", "#a78bfa", "#f472b6", "#c084fc", "#34d399"];
  const particleColors = colors || defaultColors;

  // Limpiar partículas existentes
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Configuración aleatoria para cada partícula
    const size = Math.random() * 5 + 2;
    const color =
      particleColors[Math.floor(Math.random() * particleColors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 8 + 8;

    particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${left}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;

    container.appendChild(particle);
  }

  console.log(`🎉 ${count} partículas creadas en #${containerId}`);
}

/**
 * Limpia todas las partículas de un contenedor
 * @param {string} containerId - ID del contenedor
 */
function cleanupParticles(containerId = "particles") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = "";
    console.log(`🧹 Partículas limpiadas de #${containerId}`);
  }
}

/**
 * Inicializa partículas cuando el DOM está listo
 */
function initParticles() {
  createParticles();
}

/**
 * Crea partículas con configuración específica para diferentes páginas
 */
function initLoginParticles() {
  const colors = ["#ec4899", "#a78bfa", "#f472b6", "#c084fc"];
  createParticles("particles", 12, colors);
}

function initLandingParticles() {
  const colors = ["#ec4899", "#a78bfa", "#f472b6", "#c084fc", "#34d399"];
  createParticles("particles", 15, colors);
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  // Detectar automáticamente el tipo de página
  const body = document.body;

  if (body.classList.contains("landing-body")) {
    initLandingParticles();
  } else if (body.classList.contains("login-body")) {
    initLoginParticles();
  } else {
    // Inicialización por defecto
    initParticles();
  }
});

// Exportar funciones para uso global
window.Particles = {
  create: createParticles,
  cleanup: cleanupParticles,
  initLogin: initLoginParticles,
  initLanding: initLandingParticles,
};
