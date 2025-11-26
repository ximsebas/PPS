<?php
$host = 'localhost';
$dbname = 'proyecto_interfacesdb';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    error_log("Error de conexión a la Base de Datos: " . $e->getMessage());
    die("Error de conexión a la base de datos");
}
?>