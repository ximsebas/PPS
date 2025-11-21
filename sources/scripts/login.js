$(document).ready(function () {
  $(document).on("submit", "#loginForm", (e) => {
    e.preventDefault();
    login();
  });

  const login = () => {
    $.ajax({
      type: "POST",
      url: "controllers/login.php",
      data: $("#loginForm").serialize(),
      dataType: "json",
    }).done((response) => {
      if (response.success) {
        $("#message").html(
          '<p style="color: green;">¡Login exitoso! Redirigiendo...</p>'
        );
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1500);
      } else {
        $("#message").html(
          `<p style="color: red;">Error: ${response.message}</p>`
        );
      }
    });
  };

  /*
    document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {
        e.preventDefault();
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Mostrar mensaje de carga
        document.getElementById("message").innerHTML =
        '<p style="color: blue;">Verificando credenciales...</p>';

        try {
        const response = await fetch("controllers/login.php", {
            method: "POST",
            headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `email=${encodeURIComponent(
            email
            )}&password=${encodeURIComponent(password)}`,
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById("message").innerHTML =
            '<p style="color: green;">¡Login exitoso! Redirigiendo...</p>';
            setTimeout(() => {
            window.location.href = "dashboard.html";
            }, 1500);
        } else {
            document.getElementById(
            "message"
            ).innerHTML = `<p style="color: red;">Error: ${result.message}</p>`;
        }
        } catch (error) {
        document.getElementById("message").innerHTML =
            '<p style="color: red;">Error de conexión</p>';
        console.error("Error:", error);
        }
    });

*/
});
