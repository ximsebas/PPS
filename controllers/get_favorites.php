<?php
session_start();
include 'database.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Debes iniciar sesión']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    $stmt = $pdo->prepare("SELECT * FROM usuarios_favoritos WHERE usuario_id = ? ORDER BY fecha_agregado DESC");
    $stmt->execute([$user_id]);
    $favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'favorites' => $favorites
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener favoritos: ' . $e->getMessage()
    ]);
}
?>