<?php
/**
 * =============================================
 * ARCHIVO: change_password.php
 * DESCRIPCIÓN: Maneja el cambio de contraseña de usuarios
 * FUNCIONALIDADES:
 * - Verifica identidad del usuario
 * - Valida contraseña actual
 * - Aplica hash a nueva contraseña
 * =============================================
 */

session_start();
include 'database.php';

// Headers para API
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Verificar autenticación
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Debes iniciar sesión']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $currentPassword = $_POST['currentPassword'] ?? '';
    $newPassword = $_POST['newPassword'] ?? '';

    // Validar campos requeridos
    if (empty($currentPassword) || empty($newPassword)) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos']);
        exit;
    }

    // Validar seguridad de nueva contraseña
    if (strlen($newPassword) < 6) {
        echo json_encode(['success' => false, 'message' => 'La nueva contraseña debe tener al menos 6 caracteres']);
        exit;
    }

    try {
        // Obtener datos del usuario actual
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch();

        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
            exit;
        }

        // Verificar contraseña actual
        if (!password_verify($currentPassword, $user['password'])) {
            echo json_encode(['success' => false, 'message' => 'La contraseña actual es incorrecta']);
            exit;
        }

        // Hash de la nueva contraseña para seguridad
        $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        // Actualizar contraseña en base de datos
        $stmt = $pdo->prepare("UPDATE usuarios SET password = ? WHERE id = ?");
        
        if ($stmt->execute([$hashedNewPassword, $user_id])) {
            echo json_encode(['success' => true, 'message' => 'Contraseña cambiada exitosamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar la contraseña']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>