<?php
/**
 * =============================================
 * ARCHIVO: database.php
 * DESCRIPCIÓN: Configuración de conexión a base de datos MySQL
 * FUNCIONALIDADES:
 * - Establece conexión PDO con MySQL
 * - Configura manejo de errores
 * - Proporciona objeto $pdo para consultas
 * =============================================
 */

// Configuración de conexión a MySQL
$host = 'localhost';
$dbname = 'proyecto_interfacesdb';
$username = 'root';
$password = '';  // Por defecto en XAMPP está vacío

try {
    // Crear conexión PDO (PHP Data Objects)
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    // Configurar PDO para mostrar errores
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // echo "Conexión exitosa"; // Puedes descomentar para probar
} catch(PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>