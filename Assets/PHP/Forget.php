<?php
header("Content-Type: application/json; charset=utf-8");
include 'DB.php';
require __DIR__ . '/../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';

if (empty($email)) {
  echo json_encode(["success" => false, "msg" => "ایمیل وارد نشده است"]);
  exit;
}

$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
  $token = bin2hex(random_bytes(32));
  $expires = date("Y-m-d H:i:s", strtotime("+1 hour"));
  $stmt = $conn->prepare("UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?");
  $stmt->bind_param("sss", $token, $expires, $email);
  $stmt->execute();

  // ✅ Correct path to Reset.html
  $resetLink = "http://localhost/Website/LoginPage/Reset.html?token=" . $token;

  // --- Email sending ---
  $mail = new PHPMailer(true);
  try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'golkarborhan@gmail.com'; // ⚠️ Replace with your Gmail
    $mail->Password = 'svbe gzcx ajox vimx';   // ⚠️ Replace with your App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->CharSet = 'UTF-8';

    $mail->setFrom('yourgmail@gmail.com', 'GolkarGlass');
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = 'بازیابی رمز عبور GolkarGlass';
    $mail->Body = "
            <div style='font-family:Tahoma; direction:rtl;'>
              <p>سلام،</p>
              <p>برای بازیابی رمز عبور خود روی لینک زیر کلیک کنید:</p>
              <a href='$resetLink'>$resetLink</a>
              <p>اگر این درخواست را انجام نداده‌اید، این ایمیل را نادیده بگیرید.</p>
            </div>
        ";

    $mail->send();
    echo json_encode(["success" => true, "msg" => "ایمیل بازیابی رمز ارسال شد!", "link" => $resetLink]);
  } catch (Exception $e) {
    echo json_encode(["success" => false, "msg" => "خطا در ارسال ایمیل: {$mail->ErrorInfo}"]);
  }
} else {
  echo json_encode(["success" => false, "msg" => "کاربری با این ایمیل یافت نشد"]);
}
