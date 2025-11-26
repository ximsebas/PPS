<?php
/**
 * =============================================
 * ARCHIVO: login.php
 * DESCRIPCIÓN: Maneja el proceso de autenticación de usuarios
 * FUNCIONALIDADES:
 * - Valida credenciales de usuario
 * - Verifica contraseña con hash
 * - Inicia sesión PHP
 * =============================================
 */

session_start();
include 'database.php';

// Headers para API
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Recoger datos del formulario
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Validar campos requeridos
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos']);
        exit;
    }
    
    // Buscar usuario en base de datos
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    // Verificar credenciales
    if ($user && password_verify($password, $user['password'])) {
        // Crear sesión de usuario
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_name'] = $user['nombre'];
        
        echo json_encode(['success' => true, 'message' => 'Login exitoso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Email o contraseña incorrectos']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>