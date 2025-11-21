const API_KEY = "eaa6e858";
const API_URL = "https://www.omdbapi.com/";

class MovieSearch {
  constructor() {
    this.currentPage = 1;
  }

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
                    ♡ Favorito
                </button>
            </div>
        `
      )
      .join("");
  }

  showError(message) {
    const container = document.getElementById("movies-container");
    container.innerHTML = `<div class="error">${message}</div>`;
  }
}

// Inicializar buscador
const movieSearch = new MovieSearch();
