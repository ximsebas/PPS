
      document
        .getElementById("registerForm")
        .addEventListener("submit", async function (e) {
          e.preventDefault();

          const nombre = document.getElementById("nombre").value;
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;

          // Mostrar mensaje de carga
          document.getElementById("message").innerHTML =
            '<p style="color: blue;">Registrando usuario...</p>';

          try {
            const response = await fetch("controllers/register.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: `nombre=${encodeURIComponent(
                nombre
              )}&email=${encodeURIComponent(
                email
              )}&password=${encodeURIComponent(password)}`,
            });

            const result = await response.json();

            if (result.success) {
              document.getElementById("message").innerHTML =
                '<p style="color: green;">¡Registro exitoso! Redirigiendo...</p>';
              setTimeout(() => {
                window.location.href = "dashboard.html";
              }, 2000);
            } else {
              document.getElementById(
                "message"
              ).innerHTML = `<p style="color: red;">Error: ${result.message}</p>`;
            }
          } catch (error) {
            document.getElementById("message").innerHTML =
              '<p style="color: red;">Error de conexión. Revisa la consola.</p>';
            console.error("Error:", error);
          }
        });