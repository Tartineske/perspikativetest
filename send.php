<?php

if (!empty($_POST['message'])) {

  $message = trim($_POST['message']);
  $date = date("d/m/Y H:i");
  $ip = $_SERVER['REMOTE_ADDR'];

  $to = "perspikative@gmail.com";
  $subject = "Nouveau message – Perspikative";

  $body = "Message reçu depuis Perspikative\n\n";
  $body .= "Date : $date\n";
  $body .= "IP : $ip\n\n";
  $body .= "Message :\n$message";

  $headers = "From: Perspikative <nathan.mistigry@yahoo.com>\r\n";
  $headers .= "Reply-To: nathan.mistigry@yahoo.com\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8";

  mail($to, $subject, $body, $headers);

  header("Location: merci.html");
  exit;
}

?>