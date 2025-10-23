<?php
header('Content-Type: application/json');
include __DIR__ . '/DB.php';

$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? '';
$newPassword = $data['newPassword'] ?? '';

if (!$token || !$newPassword) {
    echo json_encode(["success" => false, "msg" => "درخواست نامعتبر"]);
    exit;
}

// Check token
$stmt = $conn->prepare("SELECT id, reset_expires FROM users WHERE reset_token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    if (strtotime($user['reset_expires']) < time()) {
        echo json_encode(["success" => false, "msg" => "لینک منقضی شده است"]);
        exit;
    }

    $hashed = password_hash($newPassword, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?");
    $stmt->bind_param("si", $hashed, $user['id']);
    $stmt->execute();

    echo json_encode(["success" => true, "msg" => "رمز عبور با موفقیت تغییر یافت"]);
} else {
    echo json_encode(["success" => false, "msg" => "توکن نامعتبر است"]);
}

$conn->close();
