// favorites.js - Manejo de la página de favoritos

// Función para verificar sesión y cargar información del usuario
async function checkSession() {
  try {
    const response = await fetch("controllers/check_session.php");
    const result = await response.json();

    if (!result.logged_in) {
      alert("Debes iniciar sesión para ver tus favoritos");
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

      // Actualizar email si está disponible
      if (result.user_email) {
        const emailElement = document.getElementById("userEmail");
        if (emailElement) {
          emailElement.textContent = result.user_email;
        }
      }

      // Generar avatar con iniciales
      updateUserAvatar(result.user_name);
    }

    return true;
  } catch (error) {
    console.error("Error verificando sesión:", error);
    return false;
  }
}

// Función para generar avatar con iniciales
function updateUserAvatar(userName) {
  const avatar = document.getElementById("userAvatar");
  const profileAvatar = document.querySelector(".profile-avatar");

  if (!userName) return;

  // Obtener iniciales del nombre
  const initials = getUserInitials(userName);

  // Crear avatar con iniciales
  const avatarHTML = `<span class="avatar-text">${initials}</span>`;

  if (avatar) {
    avatar.innerHTML = avatarHTML;
    avatar.classList.add("online");
  }

  if (profileAvatar) {
    profileAvatar.innerHTML = avatarHTML;
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

// Función para cargar favoritos
async function loadFavorites() {
  const loading = document.getElementById("loading");
  const favoritesContainer = document.getElementById("favorites-container");
  const noFavorites = document.getElementById("no-favorites");

  loading.style.display = "block";
  favoritesContainer.innerHTML = "";
  noFavorites.style.display = "none";

  try {
    const response = await fetch("controllers/get_favorites.php");
    const result = await response.json();

    loading.style.display = "none";

    if (result.success && result.favorites && result.favorites.length > 0) {
      displayFavorites(result.favorites);
      // Opcional: Actualizar contador en el header
      updateFavoritesCount(result.favorites.length);
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
  const favoritesContainer = document.getElementById("favorites-container");

  favoritesContainer.innerHTML = favorites
    .map((favorite) => {
      // Validar y limpiar datos
      const safeId = favorite.id || favorite.favorite_id || 0;
      const safeTitle =
        favorite.pelicula_titulo || favorite.movie_title || "Sin título";
      const safePoster =
        favorite.poster ||
        favorite.movie_poster ||
        "https://via.placeholder.com/300x450/cccccc/666666?text=Poster+No+Disponible";
      const safeYear = favorite.ano || favorite.movie_year || "N/A";
      const safeDate = favorite.fecha_agregado
        ? new Date(favorite.fecha_agregado).toLocaleDateString("es-ES")
        : "Fecha desconocida";

      return `
                <div class="movie-card">
                    <img src="${safePoster}" 
                         alt="${safeTitle}"
                         onerror="this.src='https://via.placeholder.com/300x450/cccccc/666666?text=Poster+No+Disponible'">
                    <h3>${safeTitle}</h3>
                    <p><strong>Año:</strong> ${safeYear}</p>
                    <p><strong>Agregado:</strong> ${safeDate}</p>
                    <button class="btn-remove-theme" onclick="removeFromFavorites(${safeId})">
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
      alert("Error al eliminar de favoritos: " + (result.message || ""));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al eliminar de favoritos");
  }
}

// Función opcional para mostrar contador de favoritos
function updateFavoritesCount(count) {
  const headerTitle = document.querySelector(".dashboard-header h1");
  const existingCount = document.querySelector(".favorites-count");

  if (existingCount) {
    existingCount.remove();
  }

  const countBadge = document.createElement("span");
  countBadge.className = "favorites-count";
  countBadge.textContent = count;
  headerTitle.appendChild(countBadge);
}

// Cargar favoritos al abrir la página
document.addEventListener("DOMContentLoaded", async function () {
  console.log("Favorites page loaded");

  // Primero verificar la sesión
  const isLoggedIn = await checkSession();

  if (isLoggedIn) {
    // Si está logueado, cargar los favoritos
    loadFavorites();
  }
});
