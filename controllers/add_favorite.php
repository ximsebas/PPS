<?php
session_start();
include 'database.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Verificar que el usuario está logueado
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Debes iniciar sesión']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $pelicula_id = $_POST['movie_id'] ?? '';
    $pelicula_titulo = $_POST['movie_title'] ?? '';
    $pelicula_poster = $_POST['movie_poster'] ?? '';
    $pelicula_ano = $_POST['movie_year'] ?? '';

    // DEBUG
    error_log("Datos recibidos - User: $user_id, Movie ID: $pelicula_id, Title: $pelicula_titulo");

    // VALIDACIÓN SIMPLIFICADA - Aceptar cualquier ID (incluso strings)
    if (empty($pelicula_id) || empty($pelicula_titulo)) {
        echo json_encode(['success' => false, 'message' => 'Datos de película incompletos']);
        exit;
    }

    try {
        // Verificar si ya existe en favoritos
        $stmt = $pdo->prepare("SELECT id FROM usuarios_favoritos WHERE usuario_id = ? AND pelicula_id = ?");
        $stmt->execute([$user_id, $pelicula_id]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Esta película ya está en tus favoritos']);
        } else {
            // Insertar en favoritos
            $stmt = $pdo->prepare("INSERT INTO usuarios_favoritos (usuario_id, pelicula_id, pelicula_titulo, poster, ano, fecha_agregado) VALUES (?, ?, ?, ?, ?, NOW())");
            
            if ($stmt->execute([$user_id, $pelicula_id, $pelicula_titulo, $pelicula_poster, $pelicula_ano])) {
                echo json_encode(['success' => true, 'message' => 'Agregado a favoritos']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al insertar en la base de datos']);
            }
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>