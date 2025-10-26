<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "API";
$tablename = "data";
// ========================================
// 🗄️ Database Connection
// ========================================
try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname",$username, $password);
        $conn ->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $input = json_decode(file_get_contents("php://input"),true);
        $method = $_SERVER['REQUEST_METHOD'];
} catch (PDOException $e) {
        echo json_encode(['error'=> $e->getMessage()]);
}
 