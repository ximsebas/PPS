<?php
/**
 * =============================================
 * ARCHIVO: check_session.php
 * DESCRIPCIÓN: Verifica el estado de la sesión del usuario
 * FUNCIONALIDADES:
 * - Comprueba si el usuario está autenticado
 * - Retorna información del usuario en sesión
 * - Proporciona estado de login para el frontend
 * =============================================
 */

session_start();
header('Content-Type: application/json');

// Verificar existencia de sesión activa
if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'logged_in' => true, 
        'user_id' => $_SESSION['user_id'],
        'user_name' => $_SESSION['user_name'] ?? 'Usuario',
        'user_email' => $_SESSION['user_email'] ?? 'usuario@email.com'
    ]);
} else {
    echo json_encode(['logged_in' => false]);
}
?>