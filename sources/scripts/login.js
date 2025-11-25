/**
 * =============================================
 * ARCHIVO: Login.js
 * DESCRIPCIÓN: Manejo del formulario de inicio de sesión
 * FUNCIONALIDADES:
 * - Validación de campos en frontend
 * - Autenticación mediante AJAX
 * - Manejo de estados de carga
 * - Redirección tras login exitoso
 * =============================================
 */

// login.js - Manejo del formulario de login

document.addEventListener("DOMContentLoaded", function () {
  console.log("🔐 Formulario de login inicializado");

  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  // Usar jQuery para compatibilidad con código existente
  $(loginForm).on("submit", handleLogin);
});

/**
 * Maneja el envío del formulario de login
 * @param {Event} e - Evento de submit del formulario
 */
function handleLogin(e) {
  e.preventDefault();

  const submitBtn = document.querySelector(".btn-login");
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Validaciones del frontend
  if (!validateLoginForm(email, password)) {
    return;
  }

  // Mostrar estado de carga
  setButtonLoading(submitBtn, true);
  clearMessages();

  // Usar jQuery para la petición AJAX
  $.ajax({
    type: "POST",
    url: "controllers/login.php",
    data: $(this).serialize(),
    dataType: "json",
  })
    .done(function (response) {
      if (response.success) {
        showMessage("✅ " + response.message, "success");

        // Redirigir después de éxito
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1500);
      } else {
        showMessage("❌ " + response.message, "error");
      }
    })
    .fail(function () {
      showMessage("❌ Error de conexión. Intenta nuevamente.", "error");
    })
    .always(function () {
      setButtonLoading(submitBtn, false);
    });
}

/**
 * Valida los datos del formulario de login
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {boolean} - True si la validación es exitosa
 */
function validateLoginForm(email, password) {
  clearMessages();

  if (!email || !password) {
    showMessage("❌ Todos los campos son requeridos", "error");
    return false;
  }

  if (!isValidEmail(email)) {
    showMessage("❌ Ingresa un email válido", "error");
    return false;
  }

  return true;
}

/**
 * Valida formato de email usando expresión regular
 * @param {string} email - Email a validar
 * @returns {boolean} - True si el email es válido
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Muestra mensajes de feedback al usuario
 * @param {string} message - Texto del mensaje
 * @param {string} type - Tipo de mensaje ('success' o 'error')
 */
function showMessage(message, type) {
  const messageDiv = document.getElementById("message");
  const color = type === "success" ? "#10b981" : "#ef4444";
  const bgColor =
    type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)";
  const borderColor = type === "success" ? "#10b981" : "#ef4444";

  messageDiv.innerHTML = `
        <div class="message-alert" style="color: ${color}; 
               background: ${bgColor}; 
               border: 1px solid ${borderColor};
               padding: 1rem; 
               border-radius: 12px; 
               margin: 1rem 0;
               text-align: center;
               font-weight: 600;">
            ${message}
        </div>
    `;
}

/**
 * Limpia todos los mensajes de la interfaz
 */
function clearMessages() {
  const messageDiv = document.getElementById("message");
  messageDiv.innerHTML = "";
}

/**
 * Controla el estado de carga del botón de envío
 * @param {HTMLElement} button - Elemento del botón
 * @param {boolean} isLoading - Estado de carga
 */
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.classList.add("loading");
    button.disabled = true;
  } else {
    button.classList.remove("loading");
    button.disabled = false;
  }
}

/**
 * Función para autocompletar campos de prueba (solo desarrollo)
 */
function fillTestCredentials() {
  // Solo en desarrollo - remover en producción
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    document.getElementById("email").value = "test@example.com";
    document.getElementById("password").value = "password123";
    console.log("🔧 Credenciales de prueba cargadas (solo desarrollo)");
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  // Opcional: Autocompletar credenciales de prueba en desarrollo
  // fillTestCredentials();
});

// Exportar funciones para testing
window.Login = {
  handleLogin,
  validateLoginForm,
  isValidEmail,
};
