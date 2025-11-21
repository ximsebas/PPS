<?php
session_start();
include 'database.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Debes iniciar sesión']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $favorite_id = $_POST['favorite_id'] ?? '';

    if (empty($favorite_id)) {
        echo json_encode(['success' => false, 'message' => 'ID de favorito no proporcionado']);
        exit;
    }

    try {
        // Verificar que el favorito pertenece al usuario
        $stmt = $pdo->prepare("DELETE FROM usuarios_favoritos WHERE id = ? AND usuario_id = ?");
        $stmt->execute([$favorite_id, $user_id]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Favorito eliminado']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Favorito no encontrado']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al eliminar favorito']);
    }
}
?>