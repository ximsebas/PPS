
      // Función para cargar favoritos
      async function loadFavorites() {
        const loading = document.getElementById("loading");
        const favoritesContainer = document.getElementById(
          "favorites-container"
        );
        const noFavorites = document.getElementById("no-favorites");

        loading.style.display = "block";
        favoritesContainer.innerHTML = "";

        try {
          const response = await fetch("controllers/get_favorites.php");
          const result = await response.json();

          loading.style.display = "none";

          if (result.success && result.favorites.length > 0) {
            displayFavorites(result.favorites);
          } else {
            noFavorites.style.display = "block";
          }
        } catch (error) {
          loading.style.display = "none";
          favoritesContainer.innerHTML =
            '<div class="message">❌ Error al cargar favoritos</div>';
          console.error("Error:", error);
        }
      }

      // Función para mostrar favoritos
      function displayFavorites(favorites) {
        const favoritesContainer = document.getElementById(
          "favorites-container"
        );

        favoritesContainer.innerHTML = favorites
          .map((favorite) => {
            return `
            <div class="movie-card">
                <img src="${
                  favorite.poster ||
                  "https://via.placeholder.com/300x450/cccccc/666666?text=Poster+No+Disponible"
                }" 
                     alt="${favorite.pelicula_titulo}"
                     onerror="this.src='https://via.placeholder.com/300x450/cccccc/666666?text=Poster+No+Disponible'">
                <h3>${favorite.pelicula_titulo}</h3>
                <p><strong>Año:</strong> ${favorite.ano || "N/A"}</p>
                <p><strong>Agregado:</strong> ${new Date(
                  favorite.fecha_agregado
                ).toLocaleDateString("es-ES")}</p>
                <button class="btn-remove-theme" onclick="removeFromFavorites(${
                  favorite.id
                })">
                    <svg class="trash-icon" viewBox="0 0 24 24" width="18" height="18">
                        <path d="M3 6h18l-2 14H5L3 6zm4 0V4a2 2 0 012-2h6a2 2 0 012 2v2"/>
                        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    Eliminar
                </button>
            </div>
        `;
          })
          .join("");
      }

      // Función para eliminar de favoritos
      async function removeFromFavorites(favoriteId) {
        if (
          !confirm(
            "¿Estás seguro de que quieres eliminar esta película de favoritos?"
          )
        ) {
          return;
        }

        try {
          const response = await fetch("controllers/remove_favorite.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `favorite_id=${favoriteId}`,
          });

          const result = await response.json();

          if (result.success) {
            alert("Película eliminada de favoritos");
            loadFavorites(); // Recargar la lista
          } else {
            alert("Error al eliminar de favoritos");
          }
        } catch (error) {
          alert("Error al eliminar de favoritos");
          console.error("Error:", error);
        }
      }

      // Cargar favoritos al abrir la página
      document.addEventListener("DOMContentLoaded", loadFavorites);