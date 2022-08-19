<?php

$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_SPECIAL_CHARS);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS);
// Varios destinatarios
$para  = 'arrejoria.work@gmail.com';

// título
$título = 'Nuevo mensaje desde tu portfolio - Contacto';

// mensaje
$mensaje = '
<html>
<head>
  <title>Formulario de contacto</title>
</head>
<body>
  <table>
    <tr>
      <th>Datos del usuario</th>
    </tr>
    <tr>
      <td>Nombre:</td>
      <td>'. $name .'</td>
    </tr>
    <tr>
      <td>Email:</td>
      <td>'. $email .'</td>
    </tr>
    <tr>
      <td>Asunto:</td>
      <td>'. $subject .'</td>
    </tr>
    <tr>
      <td>Mensaje:</td>
      <td>'. $message .'</td>
    </tr>
  </table>
</body>
</html>
';

// Para enviar un correo HTML, debe establecerse la cabecera Content-type
$cabeceras  = 'MIME-Version: 1.0' . "\r\n";
$cabeceras .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

// Cabeceras adicionales
$cabeceras .= 'To: ARR /DEV>  <arrejoria.work@gmail.com>' . "\r\n";
$cabeceras .= 'From: '. $name .' <'. $email .'>' . "\r\n";

// Enviarlo
mail($para, $título, $mensaje, $cabeceras);
?>

