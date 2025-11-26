/**
 * =============================================
 * ARCHIVO: password.js
 * DESCRIPCIÓN: Gestión del formulario de cambio de contraseña
 * FUNCIONALIDADES:
 * - Validación de contraseñas en frontend
 * - Verificación de seguridad
 * - Actualización mediante API
 * - Manejo de feedback al usuario
 * =============================================
 */

// password.js - Manejo del formulario de cambio de contraseña

document.addEventListener("DOMContentLoaded", function () {
  console.log("🔐 Formulario de cambio de contraseña inicializado");

  const passwordForm = document.getElementById("changePasswordForm");
  if (!passwordForm) return;

  passwordForm.addEventListener("submit", handlePasswordChange);
});

/**
 * Maneja el proceso de cambio de contraseña
 * @async
 * @param {Event} e - Evento de submit del formulario
 */
async function handlePasswordChange(e) {
  e.preventDefault();

  const submitBtn = document.querySelector(".btn-login");
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validaciones
  if (!validatePasswordForm(currentPassword, newPassword, confirmPassword)) {
    return;
  }

  // Mostrar estado de carga
  setButtonLoading(submitBtn, true);
  clearMessages();

  try {
    const response = await fetch("controllers/change_password.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `currentPassword=${encodeURIComponent(
        currentPassword
      )}&newPassword=${encodeURIComponent(newPassword)}`,
    });

    const result = await response.json();

    if (result.success) {
      showMessage("✅ " + result.message, "success");
      document.getElementById("changePasswordForm").reset();

      // Redirigir después de éxito
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);
    } else {
      showMessage(" " + result.message, "error");
    }
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    showMessage(" Error de conexión. Intenta nuevamente.", "error");
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

/**
 * Valida el formulario de cambio de contraseña
 * @param {string} currentPassword - Contraseña actual
 * @param {string} newPassword - Nueva contraseña
 * @param {string} confirmPassword - Confirmación de nueva contraseña
 * @returns {boolean} - True si la validación es exitosa
 */
function validatePasswordForm(currentPassword, newPassword, confirmPassword) {
  clearMessages();

  if (!currentPassword || !newPassword || !confirmPassword) {
    showMessage(" Todos los campos son requeridos", "error");
    return false;
  }

  if (newPassword.length < 6) {
    showMessage(
      " La nueva contraseña debe tener al menos 6 caracteres",
      "error"
    );
    return false;
  }

  if (newPassword !== confirmPassword) {
    showMessage(" Las contraseñas no coinciden", "error");
    return false;
  }

  if (currentPassword === newPassword) {
    showMessage(" La nueva contraseña debe ser diferente a la actual", "error");
    return false;
  }

  return true;
}

// Reutilizar funciones de mensajes (las mismas que en register.js)
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

function clearMessages() {
  const messageDiv = document.getElementById("message");
  messageDiv.innerHTML = "";
}

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
window.Password = {
  handlePasswordChange,
  validatePasswordForm,
};
