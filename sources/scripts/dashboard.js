// API Key de OMDB
const API_KEY = "eaa6e858";
const API_URL = "https://www.omdbapi.com/";

const TRANSLATE_API_URL = "https://api.mymemory.translated.net/get";
let translationsEnabled = false;
// Elementos del DOM
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const moviesContainer = document.getElementById("movies-container");
const loading = document.getElementById("loading");
const modal = document.getElementById("movieModal");
const closeBtn = document.querySelector(".close");
// Agrega después de las constantes API
const POPULAR_MOVIES = [
  "Avengers",
  "Titanic",
  "The Godfather",
  "Star Wars",
  "Harry Potter",
  "The Dark Knight",
  "Pulp Fiction",
  "Forrest Gump",
  "Inception",
  "The Matrix",
  "Spider Man",
  "Iron Man",
  "Black Panther",
  "Avatar",
  "Jurassic Park",
];

// Función para mostrar películas populares al inicio
async function loadPopularMovies() {
  console.log("🎬 Cargando películas populares...");

  // Mostrar estado de carga mejorado
  moviesContainer.innerHTML = `
    <div class="loading-popular">
      <div class="loading-spinner"></div>
      <p>Cargando películas populares...</p>
    </div>
  `;

  const randomMovies = [...POPULAR_MOVIES]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8); // 6 películas aleatorias

  const moviePromises = randomMovies.map((movieTitle) =>
    fetch(`${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(movieTitle)}`)
      .then((response) => response.json())
      .then((data) => (data.Search ? data.Search[0] : null))
      .catch((error) => {
        console.error("Error cargando película popular:", error);
        return null;
      })
  );

  try {
    const movies = await Promise.all(moviePromises);
    const validMovies = movies.filter((movie) => movie !== null);

    if (validMovies.length > 0) {
      displayMovies(validMovies);
      // Agregar título de sección
      const sectionTitle = document.createElement("div");
      sectionTitle.className = "popular-section-title";
      sectionTitle.innerHTML = `
        <h2>🎬 Películas Populares</h2>
        <p>Descubre algunas de las películas más famosas</p>
      `;
      moviesContainer.insertBefore(sectionTitle, moviesContainer.firstChild);
    } else {
      showWelcomeMessage();
    }
  } catch (error) {
    console.error("Error cargando películas populares:", error);
    showWelcomeMessage();
  }
}

// Función para mensaje de bienvenida (fallback)
function showWelcomeMessage() {
  moviesContainer.innerHTML = `
    <div class="welcome-message">
      <div class="welcome-icon">🎬</div>
      <h2>Bienvenido al Buscador de Películas</h2>
      <p>Comienza buscando tu película o serie favorita</p>
      <div class="search-tips">
        <div class="tip">🔍 Escribe el nombre exacto para mejores resultados</div>
        <div class="tip">❤️ Agrega a favoritos tus películas preferidas</div>
        <div class="tip">🌍 Traduce las sinopsis al español</div>
      </div>
    </div>
  `;
}

// Función para limpiar y mostrar resultados de búsqueda
function clearPopularSection() {
  const popularTitle = document.querySelector(".popular-section-title");
  if (popularTitle) {
    popularTitle.remove();
  }
}
// Hacer las funciones disponibles globalmente
window.showMovieDetails = async function (movieId) {
  console.log("Mostrando detalles para:", movieId);
  try {
    const response = await fetch(
      `${API_URL}?apikey=${API_KEY}&i=${movieId}&plot=full`
    );
    const movie = await response.json();

    if (movie.Response === "True") {
      displayMovieModal(movie);
    } else {
      alert("Error al cargar detalles de la película");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cargar detalles");
  }
};

window.addToFavorites = async function (
  movieId,
  movieTitle,
  moviePoster,
  movieYear
) {
  console.log("Agregando a favoritos:", movieId, movieTitle);

  // Verificar sesión primero
  const isLoggedIn = await checkSession();
  if (!isLoggedIn) return;

  // Validar datos
  if (!movieId || movieId === "undefined" || movieId === "null") {
    console.error("ID de película inválido");
    alert("Error: ID de película inválido");
    return;
  }

  try {
    const response = await fetch("controllers/add_favorite.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `movie_id=${encodeURIComponent(
        movieId
      )}&movie_title=${encodeURIComponent(
        movieTitle
      )}&movie_poster=${encodeURIComponent(
        moviePoster
      )}&movie_year=${encodeURIComponent(movieYear)}`,
    });

    const result = await response.json();
    console.log("Respuesta del servidor:", result);

    if (result.success) {
      alert(`🎉 "${movieTitle}" agregada a favoritos!`);
    } else {
      alert(`⚠️ ${result.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Error al agregar a favoritos");
  }
};
// Función para traducir texto a español (con división de texto largo)
async function translateToSpanish(text) {
  console.log(
    "🔍 Iniciando traducción para texto:",
    text.substring(0, 50) + "..."
  );

  if (!text || text === "Sinopsis no disponible" || text === "No disponible") {
    console.log("⏩ Texto no necesita traducción");
    return text;
  }

  // Si el texto es muy largo, dividirlo y traducir por partes
  if (text.length > 400) {
    console.log("📝 Texto largo detectado, dividiendo...");
    return await translateLongText(text);
  }

  try {
    console.log("🌐 Enviando solicitud de traducción...");

    const response = await fetch(
      `${TRANSLATE_API_URL}?q=${encodeURIComponent(text)}&langpair=en|es`
    );

    console.log("📨 Respuesta recibida, status:", response.status);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseData && data.responseData.translatedText) {
      console.log("✅ Traducción exitosa");
      return data.responseData.translatedText;
    } else {
      console.warn("⚠️ No se pudo traducir");
      return text;
    }
  } catch (error) {
    console.error("❌ Error en traducción:", error);
    return text;
  }
}

// Función auxiliar para textos largos
async function translateLongText(longText) {
  try {
    // Dividir el texto en oraciones
    const sentences = longText
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);
    let translatedParts = [];

    console.log(`📚 Dividido en ${sentences.length} oraciones`);

    // Traducir cada oración por separado (límite de 5 para no abusar de la API)
    for (let i = 0; i < Math.min(sentences.length, 5); i++) {
      const sentence = sentences[i].trim();
      if (sentence.length > 0) {
        console.log(
          `🔄 Traduciendo oración ${i + 1}/${Math.min(sentences.length, 5)}`
        );

        const response = await fetch(
          `${TRANSLATE_API_URL}?q=${encodeURIComponent(
            sentence
          )}&langpair=en|es`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.responseData && data.responseData.translatedText) {
            translatedParts.push(data.responseData.translatedText);
          } else {
            translatedParts.push(sentence); // Usar original si falla
          }
        } else {
          translatedParts.push(sentence); // Usar original si falla
        }

        // Pequeña pausa entre solicitudes
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    // Unir las partes traducidas
    const result =
      translatedParts.join(". ") + (sentences.length > 5 ? "..." : "");
    console.log("✅ Texto largo traducido por partes");
    return result;
  } catch (error) {
    console.error("❌ Error traduciendo texto largo:", error);
    // Si falla, devolver versión recortada del original
    return (
      longText.substring(0, 300) +
      "... [Texto muy largo - usar versión completa en inglés]"
    );
  }
}

// Función para alternar traducción (HACER GLOBAL)
window.toggleTranslation = async function () {
  console.log("🔄 Botón de traducción clickeado");

  translationsEnabled = !translationsEnabled;
  const button = document.getElementById("translateBtn");

  console.log("🎚️ Estado de traducción:", translationsEnabled);

  if (translationsEnabled) {
    button.innerHTML = "🌍 Traducción: ON";
    button.classList.add("active"); // Agregar clase active
    console.log("🚀 Iniciando traducción...");
    await translateCurrentMovie();

    // Efecto visual de confeti
    createConfetti();
  } else {
    button.innerHTML = "🌍 Traducir a Español";
    button.classList.remove("active"); // Remover clase active
    console.log("↩️ Restaurando texto original");
    resetToOriginalText();
  }
};

// Función para efecto de confeti (opcional)
function createConfetti() {
  const colors = ["#ec4899", "#a78bfa", "#f472b6", "#c084fc", "#34d399"];
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = Math.random() * 2 + 1 + "s";
      document.body.appendChild(confetti);

      // Remover después de la animación
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }, i * 100);
  }
}

// Función para traducir la película actual
async function translateCurrentMovie() {
  const modalBody = document.getElementById("modal-body");
  const plotElement = modalBody.querySelector(".plot p");

  if (plotElement && !plotElement.classList.contains("translated")) {
    const originalText =
      plotElement.getAttribute("data-original") || plotElement.textContent;
    plotElement.setAttribute("data-original", plotElement.textContent);

    plotElement.innerHTML = "<em>Traduciendo...</em>";
    const translatedText = await translateToSpanish(originalText);
    plotElement.textContent = translatedText;
    plotElement.classList.add("translated");
  }
}

// Función para resetear al texto original
function resetToOriginalText() {
  const modalBody = document.getElementById("modal-body");
  const plotElement = modalBody.querySelector(".plot p");

  if (plotElement && plotElement.classList.contains("translated")) {
    const originalText = plotElement.getAttribute("data-original");
    if (originalText) {
      plotElement.textContent = originalText;
      plotElement.classList.remove("translated");
    }
  }
}

// Inicializar modal
function initModal() {
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

// Función para buscar películas
async function searchMovies(query) {
  clearPopularSection();

  if (!query.trim()) {
    showMessage("Por favor ingresa un término de búsqueda");
    return;
  }

  loading.style.display = "block";
  moviesContainer.innerHTML = "";

  try {
    const response = await fetch(
      `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    loading.style.display = "none";

    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      showMessage("❌ No se encontraron películas. Intenta con otro nombre.");
    }
  } catch (error) {
    loading.style.display = "none";
    showMessage("❌ Error al buscar películas. Revisa tu conexión.");
    console.error("Error:", error);
  }
}

// Función para mostrar películas
function displayMovies(movies) {
  moviesContainer.innerHTML = movies
    .map((movie) => {
      // Validar y limpiar datos
      const safeMovieId = movie.imdbID || "unknown";
      const safeTitle = movie.Title || "Sin título";
      const safePoster =
        movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/300x450/cccccc/666666?text=Poster+No+Disponible";
      const safeYear = movie.Year || "N/A";
      const safeType = movie.Type || "movie";

      return `
        <div class="movie-card" onclick="showMovieDetails('${safeMovieId}')">
          <img src="${safePoster}" 
               alt="${safeTitle}"
               onerror="this.src='https://via.placeholder.com/300x450/cccccc/666666?text=Poster+No+Disponible'">
          <h3>${safeTitle}</h3>
          <p><strong>Año:</strong> ${safeYear}</p>
          <p><strong>Tipo:</strong> ${safeType}</p>
          <button class="btn-favorite" onclick="event.stopPropagation(); addToFavorites('${safeMovieId}', '${safeTitle}', '${safePoster}', '${safeYear}')">
            ❤️ Agregar a Favoritos
          </button>
        </div>
      `;
    })
    .join("");
}

// Función para mostrar mensajes
function showMessage(message) {
  moviesContainer.innerHTML = `<div class="message">${message}</div>`;
}

// Verificar si el usuario está logueado
async function checkSession() {
  try {
    const response = await fetch("controllers/check_session.php");
    const result = await response.json();

    if (!result.logged_in) {
      alert("Debes iniciar sesión para usar esta función");
      window.location.href = "login.html";
      return false;
    }

    // Actualizar información del usuario en el header
    if (result.user_name) {
      // Actualizar nombre en el header principal
      document.getElementById("userName").textContent = result.user_name;

      // Actualizar nombre en el dropdown
      const dropdownUserName = document.getElementById("dropdownUserName");
      if (dropdownUserName) {
        dropdownUserName.textContent = result.user_name;
      }

      // Generar avatar con iniciales
      updateUserAvatar(result.user_name, result.user_email);
    }

    return true;
  } catch (error) {
    console.error("Error verificando sesión:", error);
    return false;
  }
}

// Función para generar avatar con iniciales
function updateUserAvatar(userName, userEmail) {
  const avatar = document.getElementById("userAvatar");
  const profileAvatar = document.querySelector(".profile-avatar");

  if (!userName) return;

  // Obtener iniciales del nombre
  const initials = getUserInitials(userName);

  // Crear avatar con iniciales
  const avatarHTML = `<span class="avatar-text">${initials}</span>`;

  if (avatar) {
    avatar.innerHTML = avatarHTML;
    avatar.classList.add("online"); // Agregar estado online
  }

  if (profileAvatar) {
    profileAvatar.innerHTML = avatarHTML;
  }

  // Actualizar email si está disponible
  if (userEmail) {
    const emailElement = document.getElementById("userEmail");
    if (emailElement) {
      emailElement.textContent = userEmail;
    }
  }
}

// Función para obtener iniciales del nombre
function getUserInitials(fullName) {
  return fullName
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("")
    .substring(0, 2);
}
// Función para mostrar el modal con la información
function displayMovieModal(movie) {
  const modalBody = document.getElementById("modal-body");

  // Limpiar datos para evitar errores
  const safeTitle = (movie.Title || "Sin título").replace(/'/g, "\\'");
  const safePoster =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450/cccccc/666666?text=Poster+No+Disponible";
  const safeYear = movie.Year || "N/A";
  const safeGenre = movie.Genre || "No disponible";
  const safeRuntime = movie.Runtime || "No disponible";
  const safeDirector = movie.Director || "No disponible";
  const safeActors = movie.Actors || "No disponible";
  const safeRated = movie.Rated || "No disponible";
  const safePlot = movie.Plot !== "N/A" ? movie.Plot : "Sinopsis no disponible";

  modalBody.innerHTML = `
    <div class="movie-details">
      <img src="${safePoster}" alt="${safeTitle}">
      <div class="movie-info">
        <h2>${safeTitle} (${safeYear})</h2>
        <div class="movie-meta">
          <p><strong>Género:</strong> ${safeGenre}</p>
          <p><strong>Duración:</strong> ${safeRuntime}</p>
          <p><strong>Director:</strong> ${safeDirector}</p>
          <p><strong>Actores:</strong> ${safeActors}</p>
          <p><strong>Clasificación:</strong> ${safeRated}</p>
          ${
            movie.Ratings && movie.Ratings.length > 0
              ? `<div class="rating"><strong>Rating:</strong> ${movie.Ratings[0].Value}</div>`
              : ""
          }
        </div>
      </div>
    </div>
    <div class="plot">
      <h3>Sinopsis</h3>
      <p>${safePlot}</p>
    </div>
    <div class="modal-actions">
      <button class="btn-favorite" onclick="addToFavorites('${
        movie.imdbID
      }', '${safeTitle}', '${safePoster}', '${safeYear}')">
        ❤️ Agregar a Favoritos
      </button>
      <button class="btn-translate" id="translateBtn" onclick="toggleTranslation()">
        🌍 Traducir a Español
      </button>
    </div>
  `;

  // Resetear estado de traducción
  translationsEnabled = false;
  const translateButton = document.getElementById("translateBtn");
  if (translateButton) {
    translateButton.innerHTML = "🌍 Traducir a Español";
    translateButton.style.background = "#3498db";
  }

  modal.style.display = "block";
}
/*

// Función para mostrar el modal con la información
function displayMovieModal(movie) {
  const modalBody = document.getElementById("modal-body");

  // Limpiar datos para evitar errores
  const safeTitle = (movie.Title || "Sin título").replace(/'/g, "\\'");
  const safePoster =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450/cccccc/666666?text=Poster+No+Disponible";
  const safeYear = movie.Year || "N/A";
  const safeGenre = movie.Genre || "No disponible";
  const safeRuntime = movie.Runtime || "No disponible";
  const safeDirector = movie.Director || "No disponible";
  const safeActors = movie.Actors || "No disponible";
  const safeRated = movie.Rated || "No disponible";
  const safePlot = movie.Plot !== "N/A" ? movie.Plot : "Sinopsis no disponible";

  modalBody.innerHTML = `
    <div class="movie-details">
      <img src="${safePoster}" alt="${safeTitle}">
      <div class="movie-info">
        <h2>${safeTitle} (${safeYear})</h2>
        <div class="movie-meta">
          <p><strong>Género:</strong> ${safeGenre}</p>
          <p><strong>Duración:</strong> ${safeRuntime}</p>
          <p><strong>Director:</strong> ${safeDirector}</p>
          <p><strong>Actores:</strong> ${safeActors}</p>
          <p><strong>Clasificación:</strong> ${safeRated}</p>
          ${
            movie.Ratings && movie.Ratings.length > 0
              ? `<div class="rating"><strong>Rating:</strong> ${movie.Ratings[0].Value}</div>`
              : ""
          }
        </div>
      </div>
    </div>
    <div class="plot">
      <h3>Sinopsis</h3>
      <p>${safePlot}</p>
    </div>
    <button class="btn-favorite" onclick="addToFavorites('${
      movie.imdbID
    }', '${safeTitle}', '${safePoster}', '${safeYear}')">
      ❤️ Agregar a Favoritos
    </button>
  `;

  modal.style.display = "block";
}
*/
// Event Listeners
searchBtn.addEventListener("click", () => {
  searchMovies(searchInput.value);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchMovies(searchInput.value);
  }
});

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", async function () {
  console.log("Dashboard cargado");
  await checkSession();
  initModal();
  // ✅ AGREGAR ESTA LÍNEA
  loadPopularMovies();
});
