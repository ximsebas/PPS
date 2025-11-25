<?php
/**
 * =============================================
 * ARCHIVO: register.php
 * DESCRIPCIÓN: Maneja el registro de nuevos usuarios
 * FUNCIONALIDADES:
 * - Valida datos de registro
 * - Verifica duplicados de email
 * - Aplica hash a contraseñas
 * - Inicia sesión automáticamente
 * =============================================
 */

session_start();
include 'database.php';

// Headers para desarrollo
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtener datos del formulario
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $nombre = $_POST['nombre'] ?? '';
    
    // Validar que todos los campos estén presentes
    if (empty($email) || empty($password) || empty($nombre)) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos']);
        exit;
    }
    
    // Verificar si el usuario ya existe (email único)
    $stmt = $pdo->prepare("SELECT id FROM Usuarios WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'El email ya está registrado']);
    } else {
        // Hash de la contraseña para seguridad
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Insertar nuevo usuario en base de datos
        $stmt = $pdo->prepare("INSERT INTO Usuarios (email, password, nombre) VALUES (?, ?, ?)");
        
        if ($stmt->execute([$email, $hashedPassword, $nombre])) {
            // Iniciar sesión automáticamente después del registro
            $_SESSION['user_id'] = $pdo->lastInsertId();
            $_SESSION['user_email'] = $email;
            $_SESSION['user_name'] = $nombre;
            
            echo json_encode(['success' => true, 'message' => 'Usuario registrado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al registrar usuario']);
        }
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>