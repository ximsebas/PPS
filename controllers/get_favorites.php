<?php
/**
 * =============================================
 * ARCHIVO: get_favorites.php
 * DESCRIPCIÓN: Obtiene la lista de favoritos del usuario
 * FUNCIONALIDADES:
 * - Recupera películas/series favoritas
 * - Ordena por fecha de agregado (más reciente primero)
 * - Retorna formato JSON para frontend
 * =============================================
 */

session_start();
include 'database.php';

// Headers para API
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Verificar autenticación
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Debes iniciar sesión']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    // Consultar favoritos del usuario ordenados por fecha
    $stmt = $pdo->prepare("SELECT * FROM usuarios_favoritos WHERE usuario_id = ? ORDER BY fecha_agregado DESC");
    $stmt->execute([$user_id]);
    $favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Retornar resultados en formato JSON
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