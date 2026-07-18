<?php
include("conexion.php");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo "Método no permitido.";
    exit;
}

$nombre = trim($_POST["nombre"] ?? "");
$correo = trim($_POST["correo"] ?? "");
$clave = trim($_POST["clave"] ?? "");

if ($nombre === "" || $correo === "" || $clave === "") {
    http_response_code(400);
    echo "Completa todos los campos obligatorios.";
    exit;
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Ingresa un correo electrónico válido.";
    exit;
}

if (strlen($clave) < 6) {
    http_response_code(400);
    echo "La clave debe tener mínimo 6 caracteres.";
    exit;
}

/* Verificar si el correo ya existe */
$consulta = mysqli_prepare(
    $conn,
    "SELECT Id FROM usuarios WHERE Correo = ?"
);

mysqli_stmt_bind_param($consulta, "s", $correo);
mysqli_stmt_execute($consulta);
mysqli_stmt_store_result($consulta);

if (mysqli_stmt_num_rows($consulta) > 0) {
    http_response_code(400);
    echo "Este correo ya está registrado.";
    mysqli_stmt_close($consulta);
    mysqli_close($conn);
    exit;
}

mysqli_stmt_close($consulta);

/* Proteger la contraseña */
$claveSegura = password_hash($clave, PASSWORD_DEFAULT);

/* Guardar usuario */
$stmt = mysqli_prepare(
    $conn,
    "INSERT INTO usuarios (Nombre, Correo, Clave)
     VALUES (?, ?, ?)"
);

if (!$stmt) {
    http_response_code(500);
    echo "No se pudo preparar el registro.";
    exit;
}

mysqli_stmt_bind_param(
    $stmt,
    "sss",
    $nombre,
    $correo,
    $claveSegura
);

if (mysqli_stmt_execute($stmt)) {
    echo "Registro guardado correctamente. Ya puedes iniciar sesión.";
} else {
    http_response_code(500);
    echo "Error al guardar el registro.";
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>