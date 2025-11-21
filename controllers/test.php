<?php
include 'database.php';
echo "✅ Conexión a MySQL exitosa!<br>";

// Probar consulta
$stmt = $pdo->query("SELECT COUNT(*) as total FROM Usuarios");
$result = $stmt->fetch();
echo "✅ Usuarios en la base de datos: " . $result['total'];
?>