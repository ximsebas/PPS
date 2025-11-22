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
    const top = Math.random() * 100 + 1;
    const color =
      particleColors[Math.floor(Math.random() * particleColors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 8 + 8;

    particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            top: ${top}%;
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
  const colors = ["#ec4899", "#a78bfa", "#f472b6", "#c084fc"];
  createParticles("particles", 150, colors);
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  // Detectar automáticamente el tipo de página
  if (!document.getElementById("particles")) {
    return;
  }
  // Inicialización por defecto
  initParticles();
});
// Exportar funciones para uso global
window.Particles = {
  create: createParticles,
  cleanup: cleanupParticles,
};
