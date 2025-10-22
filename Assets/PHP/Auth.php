<?php
// ---------- Force JSON output ----------
header('Content-Type: application/json');

// ---------- Start output buffering to catch any stray output ----------
ob_start();

try {
    // ---------- Start session ----------
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    // ---------- Include DB ----------
    include __DIR__ . '/DB.php'; // Make sure DB.php path is correct

    // ---------- Read JSON input ----------
    $data = json_decode(file_get_contents("php://input"), true);

    // ---------- Extract variables safely ----------
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $isSignup = $data['isSignup'] ?? false;

    // ---------- Validate fields ----------
    if (!$email || !$password || ($isSignup && !$name)) {
        echo json_encode(["success" => false, "msg" => "تمام فیلدها باید پر شوند"]);
        exit;
    }

    // ---------- Handle Signup ----------
    if ($isSignup) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            echo json_encode(["success" => false, "msg" => "این ایمیل قبلا ثبت شده است"]);
            exit;
        }
        $stmt->close();

        $hashed = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $email, $hashed);
        if ($stmt->execute()) {
            $_SESSION['user'] = $email;
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "msg" => "خطا در ثبت نام"]);
        }
        $stmt->close();
    } else {
        // ---------- Handle Login ----------
        $stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($user = $result->fetch_assoc()) {
            if (password_verify($password, $user['password'])) {
                $_SESSION['user'] = $email;
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false, "msg" => "رمز عبور اشتباه است"]);
            }
        } else {
            echo json_encode(["success" => false, "msg" => "کاربری با این ایمیل یافت نشد"]);
        }
        $stmt->close();
    }

    // Close DB connection
    $conn->close();
} catch (Exception $e) {
    echo json_encode(["success" => false, "msg" => "خطای سرور: " . $e->getMessage()]);
}

// ---------- Flush any stray output and end ----------
ob_end_flush();
exit;
