<?php
/**
 * =============================================
 * ARCHIVO: init_database.php
 * DESCRIPCIÓN: Script de inicialización de base de datos
 * USO: Ejecutar UNA SOLA VEZ para crear tablas
 * ACCESO: http://localhost/proyecto_interfaces/init_database.php
 * =============================================
 */

$host = 'localhost';
$db   = 'proyecto_interfacesdb';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    // Crear tabla usuarios
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            nombre VARCHAR(255) NOT NULL,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
    ");

    // Crear tabla usuarios_favoritos
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS usuarios_favoritos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario_id INT NOT NULL,
            pelicula_id VARCHAR(255),
            pelicula_titulo VARCHAR(255),
            poster VARCHAR(255),
            ano VARCHAR(50),
            fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
    ");

    echo "<h2> Base de datos inicializada correctamente</h2>";
    echo "<p> Tablas creadas/verificadas: usuarios, usuarios_favoritos</p>";
    echo "<p> <strong>Ahora puedes usar la aplicación normalmente</strong></p>";

} catch (\PDOException $e) {
    echo "<h2>❌ Error en la inicialización</h2>";
    echo "<p><strong>Error:</strong> " . $e->getMessage() . "</p>";
    echo "<p>⚠️ Verifica que la base de datos 'proyecto_interfacesdb' existe</p>";
}
?>