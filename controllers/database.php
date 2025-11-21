<?php
$host = 'localhost';
$dbname = 'proyecto_interfacesdb';
$username = 'root';
$password = '';  // Por defecto en XAMPP está vacío

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Conexión exitosa"; // Puedes descomentar para probar
} catch(PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>