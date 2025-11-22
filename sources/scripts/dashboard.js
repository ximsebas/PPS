// API Key de OMDB
const API_KEY = "eaa6e858";
const API_URL = "https://www.omdbapi.com/";

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

// ===== LISTA DE PELÍCULAS ACTUALES (2022-2024) =====
const POPULAR_CURRENT_MOVIES = [
  // 2024
  "Dune: Part Two",
  "Kingdom of the Planet of the Apes",
  "Furiosa: A Mad Max Saga",
  "Deadpool & Wolverine",
  "Joker: Folie à Deux",
  "Gladiator 2",
  "Beetlejuice Beetlejuice",
  "Inside Out 2",
  "Venom 3",
  "The Karate Kid",
  "Mufasa: The Lion King",
  "Sonic the Hedgehog 3",
  "Ballad of Songbirds and Snakes",
  "Mean Girls Musical",
  "The Fall Guy",

  // 2023
  "Barbie",
  "Oppenheimer",
  "Spider-Man: Across the Spider-Verse",
  "The Super Mario Bros. Movie",
  "Guardians of the Galaxy Vol. 3",
  "John Wick: Chapter 4",
  "The Little Mermaid",
  "Fast X",
  "Transformers: Rise of the Beasts",
  "The Flash",
  "Indiana Jones and the Dial of Destiny",
  "The Hunger Games: The Ballad of Songbirds and Snakes",
  "Wonka",
  "Aquaman and the Lost Kingdom",
  "The Marvels",
  "Mission: Impossible Dead Reckoning",
  "Elemental",
  "The Creator",
  "Napoleon",
  "Killers of the Flower Moon",

  // 2022
  "Avatar: The Way of Water",
  "Top Gun: Maverick",
  "Black Panther: Wakanda Forever",
  "Doctor Strange in the Multiverse of Madness",
  "Thor: Love and Thunder",
  "Minions: The Rise of Gru",
  "The Batman",
  "Jurassic World Dominion",
  "Elvis",
  "Smile",
  "Everything Everywhere All at Once",
  "Nope",
  "Bullet Train",
  "Black Adam",
  "Puss in Boots: The Last Wish",
];

// ===== FUNCIONALIDAD PELÍCULA DEL DÍA =====

// Elementos del DOM
const randomMovieBtn = document.getElementById("randomMovieBtn");

// Lista de series específicas populares y actuales
const POPULAR_CURRENT_SERIES = [
  // Series Amazon Prime
  "The Summer I Turned Pretty",
  "The Lord of the Rings The Rings of Power",
  "The Boys",
  "Invincible",
  "Reacher",
  "Jack Ryan",
  "The Marvelous Mrs. Maisel",

  // Series Netflix
  "Stranger Things",
  "Wednesday",
  "Bridgerton",
  "The Witcher",
  "Outer Banks",
  "Cobra Kai",
  "Emily in Paris",
  "Virgin River",
  "Ginny and Georgia",
  "Shadow and Bone",
  "You",
  "Lucifer",
  "The Crown",
  "Sex Education",
  "Never Have I Ever",
  "Heartstopper",
  "Daisy Jones & The Six",

  // Series HBO Max
  "The Last of Us",
  "House of the Dragon",
  "The White Lotus",
  "Succession",
  "Euphoria",
  "The Sex Lives of College Girls",
  "Hacks",
  "Peacemaker",

  // Series Disney+
  "The Mandalorian",
  "Loki",
  "WandaVision",
  "The Falcon and the Winter Soldier",
  "Hawkeye",
  "She-Hulk",
  "Ms. Marvel",
  "Moon Knight",
  "Andor",

  // Series Apple TV+
  "Ted Lasso",
  "Severance",
  "The Morning Show",
  "For All Mankind",
  "Slow Horses",
];

// Función para mostrar el contenido aleatorio (UNIFICADA)
function displayRandomContent(content, type) {
  const safeId = content.imdbID || "unknown";
  const safeTitle = content.Title || "Sin título";
  const safePoster =
    content.Poster !== "N/A"
      ? content.Poster
      : "https://via.placeholder.com/300x450/cccccc/666666?text=Poster+No+Disponible";
  const safeYear = content.Year || "N/A";

  // Escapar caracteres especiales para el HTML
  const escapedTitle = safeTitle.replace(/'/g, "\\'").replace(/"/g, '\\"');
  const escapedPoster = safePoster.replace(/'/g, "\\'").replace(/"/g, '\\"');

  const isMovie = type === "movie";
  const cardClass = isMovie ? "movie-card featured" : "series-card featured";
  const badgeClass = isMovie
    ? "featured-badge movie-badge"
    : "featured-badge series-badge";
  const badgeText = isMovie
    ? "⭐ Película Recomendada"
    : "📺 Serie Recomendada";
  const headerText = isMovie
    ? "🎬 ¡Tu Película del Día!"
    : "📺 ¡Tu Serie del Día!";
  const headerDescription = isMovie
    ? "Una selección especial de cine actual para ti"
    : "Una serie perfecta para maratonear";

  moviesContainer.innerHTML = `
        <div class="random-result-header">
            <h2>${headerText}</h2>
            <p>${headerDescription}</p>
        </div>
        
        <div class="${cardClass}" onclick="showMovieDetails('${safeId}')">
            <div class="${badgeClass}">${badgeText}</div>
            <img src="${safePoster}" 
                 alt="${safeTitle}"
                 onerror="this.src='https://via.placeholder.com/300x450/cccccc/666666?text=Poster+No+Disponible'">
            <h3>${safeTitle}</h3>
            <p><strong>Año:</strong> ${safeYear}</p>
            <p><strong>Tipo:</strong> ${isMovie ? "Película" : "Serie"}</p>
            <button class="btn-favorite" onclick="event.stopPropagation(); addToFavorites('${safeId}', '${escapedTitle}', '${escapedPoster}', '${safeYear}')">
                ❤️ Agregar a Favoritos
            </button>
        </div>
        
        <div class="random-actions">
            <button class="btn-favorites random-btn ${
              isMovie ? "" : "series-btn"
            }" onclick="${isMovie ? "getRandomMovie()" : "getRandomSeries()"}">
                <span class="btn-icon">${isMovie ? "🔄" : "📺"}</span>
                Otra ${isMovie ? "Película" : "Serie"} Aleatoria
            </button>
        </div>
    `;
}

// Función para efecto de confeti temático
function createConfettiEffect(type) {
  const isMovie = type === "movie";
  const colors = isMovie
    ? ["#ec4899", "#f472b6", "#a78bfa", "#c084fc", "#f59e0b"]
    : ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ec4899", "#f472b6"];

  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = Math.random() * 1.5 + 1.5 + "s";
      confetti.style.width = Math.random() * 8 + 6 + "px";
      confetti.style.height = Math.random() * 8 + 6 + "px";
      document.body.appendChild(confetti);

      // Remover después de la animación
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 2500);
    }, i * 150);
  }
}

// ===== FUNCIÓN ACTUALIZADA PARA PELÍCULA DEL DÍA =====
async function getRandomMovie() {
  console.log("🎲 Buscando Película del Día...");

  const button = document.getElementById("randomMovieBtn");
  if (!button) {
    console.error("❌ No se encontró el botón de película aleatoria");
    return;
  }

  button.classList.add("loading");
  button.innerHTML = '<span class="btn-icon">⏳</span>Buscando película...';

  clearPopularSection();
  moviesContainer.innerHTML = "";
  loading.style.display = "block";

  try {
    // Seleccionar película aleatoria de la lista de películas actuales
    const randomMovie =
      POPULAR_CURRENT_MOVIES[
        Math.floor(Math.random() * POPULAR_CURRENT_MOVIES.length)
      ];
    console.log(`🔍 Buscando película específica: "${randomMovie}"`);

    // Buscar la película específica
    const searchURL = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
      randomMovie
    )}&type=movie`;
    const response = await fetch(searchURL);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("📊 Respuesta de API:", data);

    loading.style.display = "none";
    button.classList.remove("loading");
    button.innerHTML = '<span class="btn-icon">🎬</span>Película del Día';

    if (data.Response === "True" && data.Search && data.Search.length > 0) {
      // Encontrar el resultado más relevante
      const bestMatch = findBestMatch(data.Search, randomMovie);

      if (bestMatch) {
        console.log(
          "🎉 Película actual encontrada:",
          bestMatch.Title,
          "(",
          bestMatch.Year,
          ")"
        );
        displayRandomContent(bestMatch, "movie");
        createConfettiEffect("movie");
      } else {
        showMessage(
          "❌ No se pudo encontrar información de la película. Intenta nuevamente."
        );
      }
    } else {
      showMessage("❌ Película no encontrada. Intenta con otra opción.");
    }
  } catch (error) {
    console.error("❌ Error buscando película:", error);
    loading.style.display = "none";
    button.classList.remove("loading");
    button.innerHTML = '<span class="btn-icon">🎬</span>Película del Día';
    showMessage("❌ Error al buscar película. Revisa tu conexión.");
  }
}

// ===== FUNCIÓN PARA SERIE DEL DÍA =====
async function getRandomSeries() {
  console.log("🎲 Buscando Serie del Día...");

  const button = document.getElementById("randomSeriesBtn");
  if (!button) {
    console.error("❌ No se encontró el botón de serie aleatoria");
    return;
  }

  button.classList.add("loading");
  button.innerHTML = '<span class="btn-icon">⏳</span>Buscando serie...';

  clearPopularSection();
  moviesContainer.innerHTML = "";
  loading.style.display = "block";

  try {
    // Seleccionar serie aleatoria de la lista
    const randomSeries =
      POPULAR_CURRENT_SERIES[
        Math.floor(Math.random() * POPULAR_CURRENT_SERIES.length)
      ];
    console.log(`🔍 Buscando serie específica: "${randomSeries}"`);

    // Buscar la serie específica
    const searchURL = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
      randomSeries
    )}&type=series`;
    const response = await fetch(searchURL);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("📊 Respuesta de API:", data);

    loading.style.display = "none";
    button.classList.remove("loading");
    button.innerHTML = '<span class="btn-icon">📺</span>Serie del Día';

    if (data.Response === "True" && data.Search && data.Search.length > 0) {
      // Encontrar el resultado más relevante
      const bestMatch = findBestMatch(data.Search, randomSeries);

      if (bestMatch) {
        console.log("🎉 Serie encontrada:", bestMatch.Title);
        displayRandomContent(bestMatch, "series");
        createConfettiEffect("series");
      } else {
        showMessage(
          "❌ No se pudo encontrar información de la serie. Intenta nuevamente."
        );
      }
    } else {
      showMessage("❌ Serie no encontrada. Intenta con otra opción.");
    }
  } catch (error) {
    console.error("❌ Error buscando serie:", error);
    loading.style.display = "none";
    button.classList.remove("loading");
    button.innerHTML = '<span class="btn-icon">📺</span>Serie del Día';
    showMessage("❌ Error al buscar serie. Revisa tu conexión.");
  }
}

// Función para encontrar la mejor coincidencia
function findBestMatch(results, searchTerm) {
  const searchLower = searchTerm.toLowerCase();

  // Primero buscar coincidencia exacta
  const exactMatch = results.find(
    (item) => item.Title.toLowerCase() === searchLower
  );
  if (exactMatch) return exactMatch;

  // Luego buscar coincidencia parcial
  const partialMatch = results.find((item) =>
    item.Title.toLowerCase().includes(searchLower)
  );
  if (partialMatch) return partialMatch;

  // Finalmente, tomar el primer resultado con poster
  return results.find((item) => item.Poster !== "N/A") || results[0];
}

// Inicializar event listeners cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  const randomMovieBtn = document.getElementById("randomMovieBtn");
  const randomSeriesBtn = document.getElementById("randomSeriesBtn");

  if (randomMovieBtn) {
    randomMovieBtn.addEventListener("click", getRandomMovie);
    console.log("✅ Botón de Película del Día inicializado");
  } else {
    console.error("❌ No se pudo encontrar el botón de Película del Día");
  }

  if (randomSeriesBtn) {
    randomSeriesBtn.addEventListener("click", getRandomSeries);
    console.log("✅ Botón de Serie del Día inicializado");
  } else {
    console.error("❌ No se pudo encontrar el botón de Serie del Día");
  }
});

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
    .slice(0, 8);

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

const translateToSpanish = async (text) => {
  if (!text || text === "Sinopsis no disponible" || text === "No disponible") {
    console.log("⏩ Texto no necesita traducción");
    return text;
  }

  if (typeof Translator === "undefined") {
    return text;
  }
  const translator = await Translator.create({
    sourceLanguage: "en",
    targetLanguage: "es",
  });

  const translated = await translator.translate(text);
  return translated;
};

// Función para alternar traducción (HACER GLOBAL)
window.toggleTranslation = async function () {
  console.log("🔄 Botón de traducción clickeado");

  translationsEnabled = !translationsEnabled;
  const button = document.getElementById("translateBtn");

  console.log("🎚️ Estado de traducción:", translationsEnabled);

  if (translationsEnabled) {
    button.innerHTML = "🌍 Traducción: ON";
    button.classList.add("active");
    console.log("🚀 Iniciando traducción...");
    await translateCurrentMovie();

    // Efecto visual de confeti
    createConfetti();
  } else {
    button.innerHTML = "🌍 Traducir a Español";
    button.classList.remove("active");
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

  loadPopularMovies();
});
