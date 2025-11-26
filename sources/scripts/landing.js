/**
 * =============================================
 * ARCHIVO: landing.js
 * DESCRIPCIÓN: Efectos visuales y animaciones para la página de inicio
 * FUNCIONALIDADES:
 * - Animaciones de entrada para elementos
 * - Efectos de hover mejorados
 * - Contadores animados para estadísticas
 * =============================================
 */

// landing.js - Efectos y animaciones para la página de inicio

/**
 * Efecto de máquina de escribir para el título principal
 * @function
 */
function typeWriterEffect() {
  const title = document.querySelector(".hero-title .gradient-text");
  if (!title) return;

  const text = title.textContent;
  title.textContent = "";
  let i = 0;

  function type() {
    if (i < text.length) {
      title.textContent += text.charAt(i);
      i++;
      setTimeout(type, 100);
    }
  }

  // Iniciar después de un delay
  setTimeout(type, 1000);
}

/**
 * Anima los contadores numéricos de las estadísticas
 * @function
 */
function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number");

  statNumbers.forEach((stat) => {
    const target = stat.textContent;
    if (target.includes("+")) {
      const number = parseInt(target);
      if (!isNaN(number)) {
        animateCounter(stat, number);
      }
    }
  });
}

/**
 * Animación incremental para números
 * @param {HTMLElement} element - Elemento HTML a animar
 * @param {number} target - Valor final del contador
 */
function animateCounter(element, target) {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + "+";
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + "+";
    }
  }, 40);
}

/**
 * Efecto de aparición escalonada para tarjetas de características
 * @function
 */
function animateFeatureCards() {
  const featureCards = document.querySelectorAll(".feature-card");

  featureCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";

    setTimeout(() => {
      card.style.transition =
        "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 300 + index * 200);
  });
}

/**
 * Mejora los efectos hover de los botones
 * @function
 */
function enhanceButtonHover() {
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-4px) scale(1.05)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
}

/**
 * Efecto de parallax para elementos de fondo
 * @function
 */
function initParallaxEffect() {
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const particles = document.querySelector(".particles-container");

    if (particles) {
      particles.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
}

/**
 * Inicializa todos los efectos cuando el DOM esté listo
 */
document.addEventListener("DOMContentLoaded", function () {
  console.log(" Inicializando efectos de landing page...");

  // Animación de tarjetas de características
  animateFeatureCards();

  // Mejorar efectos hover de botones
  enhanceButtonHover();

  console.log(" Efectos de landing page inicializados correctamente");
});

// Exportar funciones para uso global
window.LandingEffects = {
  animateStats,
  animateFeatureCards,
};
