
      // API Key de OMDB - QUE YA FUNCIONABA
      const API_KEY = "eaa6e858";
      const API_URL = "https://www.omdbapi.com/";

      // Elementos del DOM
      const searchInput = document.getElementById("searchInput");
      const searchBtn = document.getElementById("searchBtn");
      const moviesContainer = document.getElementById("movies-container");
      const loading = document.getElementById("loading");
      const modal = document.getElementById("movieModal");
      const closeBtn = document.querySelector(".close");

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
            showMessage(
              "❌ No se encontraron películas Intenta con otro nombre."
            );
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
            // Escapar correctamente todos los campos
            const safeMovieId = movie.imdbID
              .replace(/'/g, "\\'")
              .replace(/"/g, '\\"');
            const safeTitle = movie.Title.replace(/'/g, "\\'").replace(
              /"/g,
              '\\"'
            );
            const safePoster = (
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450/cccccc/666666?text=Poster+No+Disponible"
            )
              .replace(/'/g, "\\'")
              .replace(/"/g, '\\"');
            const safeYear = movie.Year.replace(/'/g, "\\'").replace(
              /"/g,
              '\\"'
            );

            return `
            <div class="movie-card" onclick="showMovieDetails('${safeMovieId}')">
                <img src="${safePoster}" 
                     alt="${movie.Title}"
                     onerror="this.src='https://via.placeholder.com/300x450/cccccc/666666?text=Poster+No+Disponible'">
                <h3>${movie.Title}</h3>
                <p><strong>Año:</strong> ${movie.Year}</p>
                <p><strong>Tipo:</strong> ${movie.Type}</p>
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

      // Función agregar a favoritos - VERSIÓN FUNCIONAL
      async function addToFavorites(
        movieId,
        movieTitle,
        moviePoster,
        movieYear
      ) {
        // Verificar sesión primero
        const isLoggedIn = await checkSession();
        if (!isLoggedIn) return;

        console.log("=== DEBUG ADD TO FAVORITES ===");
        console.log("Movie ID:", movieId, "Type:", typeof movieId);
        console.log("Movie Title:", movieTitle);
        console.log("Movie Poster:", moviePoster);
        console.log("Movie Year:", movieYear);

        // SOLUCIÓN TEMPORAL: Si movieId es inválido, usar timestamp como ID
        if (
          !movieId ||
          movieId === "undefined" ||
          movieId === "null" ||
          movieId === "0"
        ) {
          console.warn("⚠️ Movie ID inválido, usando ID temporal");
          movieId = Date.now(); // ID único basado en timestamp
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
          alert("❌ Error al agregar a favoritos");
          console.error("Error:", error);
        }
      }

      // Función para actualizar la UI después de agregar favorito
      function updateFavoritesUI() {
        // Aquí puedes actualizar botones o indicadores visuales
        console.log("UI actualizada - película agregada a favoritos");
      }

      // Verificar sesión al cargar la página
      document.addEventListener("DOMContentLoaded", async function () {
        await checkSession();
      });

      // Función para mostrar detalles de la película
      async function showMovieDetails(movieId) {
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
      }

      // Función para mostrar el modal con la información
      function displayMovieModal(movie) {
        const modalBody = document.getElementById("modal-body");
        const safeTitle = movie.Title.replace(/'/g, "\\'");

        modalBody.innerHTML = `
                <div class="movie-details">
                    <img src="${
                      movie.Poster !== "N/A"
                        ? movie.Poster
                        : "https://via.placeholder.com/300x450/cccccc/666666?text=Poster+No+Disponible"
                    }" 
                         alt="${movie.Title}">
                    <div class="movie-info">
                        <h2>${movie.Title} (${movie.Year})</h2>
                        <div class="movie-meta">
                            <p><strong>Género:</strong> ${movie.Genre}</p>
                            <p><strong>Duración:</strong> ${movie.Runtime}</p>
                            <p><strong>Director:</strong> ${movie.Director}</p>
                            <p><strong>Actores:</strong> ${movie.Actors}</p>
                            <p><strong>Clasificación:</strong> ${
                              movie.Rated
                            }</p>
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
                    <p>${
                      movie.Plot !== "N/A"
                        ? movie.Plot
                        : "Sinopsis no disponible"
                    }</p>
                </div>
                <button class="btn-favorite" onclick="addToFavorites('${
                  movie.imdbID
                }', '${safeTitle}', '${movie.Poster}', '${movie.Year}')">
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
      initModal();