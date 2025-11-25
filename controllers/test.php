<?php
/**
 * =============================================
 * ARCHIVO: test.php
 * DESCRIPCIÓN: Script de prueba para verificar conexión a BD
 * FUNCIONALIDADES:
 * - Testea conexión a MySQL
 * - Verifica consultas básicas
 * - Muestra estadísticas de usuarios
 * =============================================
 */

include 'database.php';
echo "✅ Conexión a MySQL exitosa!<br>";

// Probar consulta básica a la base de datos
$stmt = $pdo->query("SELECT COUNT(*) as total FROM usuarios");
$result = $stmt->fetch();
echo "✅ usuarios en la base de datos: " . $result['total'];
?>