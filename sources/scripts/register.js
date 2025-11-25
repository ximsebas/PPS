/**
 * =============================================
 * ARCHIVO: register.js
 * DESCRIPCIÓN: Gestión del formulario de registro de usuarios
 * FUNCIONALIDADES:
 * - Validación de datos en frontend
 * - Registro mediante API
 * - Manejo de estados de carga
 * - Redirección automática tras registro
 * =============================================
 */

// register.js - Manejo del formulario de registro

document.addEventListener("DOMContentLoaded", function () {
  console.log("📝 Formulario de registro inicializado");

  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return;

  registerForm.addEventListener("submit", handleRegister);
});

/**
 * Maneja el envío del formulario de registro
 * @async
 * @param {Event} e - Evento de submit del formulario
 */
async function handleRegister(e) {
  e.preventDefault();

  const submitBtn = document.querySelector(".btn-login");
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Validaciones del frontend
  if (!validateForm(nombre, email, password)) {
    return;
  }

  // Mostrar estado de carga
  setButtonLoading(submitBtn, true);
  clearMessages();

  try {
    const response = await fetch("controllers/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `nombre=${encodeURIComponent(nombre)}&email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`,
    });

    const result = await response.json();

    if (result.success) {
      showMessage("✅ " + result.message, "success");
      registerForm.reset();

      // Redirigir después de éxito
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);
    } else {
      showMessage("❌ " + result.message, "error");
    }
  } catch (error) {
    console.error("Error en registro:", error);
    showMessage("❌ Error de conexión. Intenta nuevamente.", "error");
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

/**
 * Valida los datos del formulario de registro
 * @param {string} nombre - Nombre del usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {boolean} - True si la validación es exitosa
 */
function validateForm(nombre, email, password) {
  clearMessages();

  if (!nombre || !email || !password) {
    showMessage("❌ Todos los campos son requeridos", "error");
    return false;
  }

  if (password.length < 6) {
    showMessage("❌ La contraseña debe tener al menos 6 caracteres", "error");
    return false;
  }

  if (!isValidEmail(email)) {
    showMessage("❌ Ingresa un email válido", "error");
    return false;
  }

  return true;
}

/**
 * Valida formato de email
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

// Exportar funciones para testing
window.Register = {
  handleRegister,
  validateForm,
  isValidEmail,
};
