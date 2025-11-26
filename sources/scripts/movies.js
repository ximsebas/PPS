/**
 * =============================================
 * ARCHIVO: movies.js
 * DESCRIPCIÓN: Clase para búsqueda y gestión de películas
 * FUNCIONALIDADES:
 * - Búsqueda en API de OMDB
 * - Visualización de resultados
 * - Manejo de paginación
 * - Gestión de errores
 * =============================================
 */

// Configuración de la API
const API_KEY = "eaa6e858";
const API_URL = "https://www.omdbapi.com/";

/**
 * Clase principal para búsqueda de películas
 */
class MovieSearch {
  constructor() {
    this.currentPage = 1;
  }

  /**
   * Busca películas en la API de OMDB
   * @async
   * @param {string} query - Término de búsqueda
   * @param {number} page - Número de página
   */
  async searchMovies(query, page = 1) {
    try {
      const response = await fetch(
        `${API_URL}?apikey=${API_KEY}&s=${query}&page=${page}`
      );
      const data = await response.json();

      if (data.Response === "True") {
        this.displayMovies(data.Search);
      } else {
        this.showError("No se encontraron películas");
      }
    } catch (error) {
      this.showError("Error al buscar películas");
    }
  }

  /**
   * Muestra las películas en el contenedor
   * @param {Array} movies - Array de objetos de películas
   */
  displayMovies(movies) {
    const container = document.getElementById("movies-container");
    container.innerHTML = movies
      .map(
        (movie) => `
            <div class="movie-card">
                <img src="${
                  movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"
                }" 
                     alt="${movie.Title}">
                <h3>${movie.Title}</h3>
                <p>Año: ${movie.Year}</p>
                <button onclick="addToFavorites(${movie.imdbID}, '${
          movie.Title
        }')">
                    ♡ Favoritos
                </button>
            </div>
        `
      )
      .join("");
  }

  /**
   * Muestra mensajes de error
   * @param {string} message - Mensaje de error
   */
  showError(message) {
    const container = document.getElementById("movies-container");
    container.innerHTML = `<div class="error">${message}</div>`;
  }
}

// Inicializar buscador de películas
const movieSearch = new MovieSearch();
