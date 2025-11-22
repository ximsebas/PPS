// landing.js - Efectos y animaciones para la página de inicio

/**
 * Crea partículas animadas para el fondo
 */
function createParticles() {
  const container = document.getElementById("particles");
  if (!container) return;

  const colors = ["#ec4899", "#a78bfa", "#f472b6", "#c084fc", "#34d399"];

  for (let i = 0; i < 15; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Configurar estilos de la partícula
    const size = Math.random() * 6 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;

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
}

/**
 * Efecto de escritura para el título (opcional)
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
 * Animación de contador para las estadísticas
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
 * Animación de contador numérico
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
 * Efecto de aparición escalonada para las tarjetas de características
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
 * Efecto de hover mejorado para los botones
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
 * Efecto de parallax para el fondo (opcional)
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
 * Inicializar todos los efectos cuando el DOM esté listo
 */
document.addEventListener("DOMContentLoaded", function () {
  console.log("🎬 Inicializando efectos de landing page...");

  // Crear partículas animadas
  createParticles();

  // Efecto de escritura para el título (opcional)
  // typeWriterEffect();

  // Animación de estadísticas
  // animateStats();

  // Animación de tarjetas de características
  animateFeatureCards();

  // Mejorar efectos hover de botones
  enhanceButtonHover();

  // Efecto parallax (opcional)
  // initParallaxEffect();

  console.log("✅ Efectos de landing page inicializados correctamente");
});

/**
 * Función para limpiar partículas (útil si se cambia de página)
 */
function cleanupParticles() {
  const container = document.getElementById("particles");
  if (container) {
    container.innerHTML = "";
  }
}

// Exportar funciones para uso global (si es necesario)
window.LandingEffects = {
  createParticles,
  cleanupParticles,
  animateStats,
  animateFeatureCards,
};
