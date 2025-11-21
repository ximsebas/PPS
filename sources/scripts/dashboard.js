// API Key de OMDB
const API_KEY = "eaa6e858";
const API_URL = "https://www.omdbapi.com/";

// Elementos del DOM
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const moviesContainer = document.getElementById("movies-container");
const loading = document.getElementById("loading");
const modal = document.getElementById("movieModal");
const closeBtn = document.querySelector(".close");

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

    // Actualizar nombre de usuario en el header
    if (result.user_name) {
      document.getElementById("userName").textContent = result.user_name;
    }

    return true;
  } catch (error) {
    console.error("Error verificando sesión:", error);
    return false;
  }
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
    <button class="btn-favorite" onclick="addToFavorites('${
      movie.imdbID
    }', '${safeTitle}', '${safePoster}', '${safeYear}')">
      ❤️ Agregar a Favoritos
    </button>
  `;

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
});
