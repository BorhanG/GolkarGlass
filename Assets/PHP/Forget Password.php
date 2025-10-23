<?php
header('Content-Type: application/json');
include __DIR__ . '/DB.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');

if (!$email) {
    echo json_encode(["success" => false, "msg" => "ایمیل الزامی است"]);
    exit;
}

// Check if user exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    // Generate token
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', time() + 3600); // 1 hour

    $stmt = $conn->prepare("UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?");
    $stmt->bind_param("sss", $token, $expires, $email);
    $stmt->execute();

    // Normally, you’d send this via email:
    $resetLink = "http://localhost/Website/LoginPage/Reset.html?token=$token";
    echo json_encode(["success" => true, "msg" => "لینک بازیابی رمز عبور:", "link" => $resetLink]);
} else {
    echo json_encode(["success" => false, "msg" => "کاربری با این ایمیل یافت نشد"]);
}

$conn->close();
