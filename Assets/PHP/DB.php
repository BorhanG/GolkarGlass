<?php
$servername = "localhost";
$username = "root";   // default for XAMPP/WAMP
$password = "";       // default is empty
$dbname = "golkar glass";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "msg" => "DB connection failed: " . $conn->connect_error]);
    exit;
}
