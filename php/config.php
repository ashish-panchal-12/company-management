<?php
header('Content-Type: application/json; charset=utf-8');
// Adjust credentials if necessary
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "company_management";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB connection failed: " . $conn->connect_error]);
    exit;
}
$conn->set_charset("utf8mb4");
?>
