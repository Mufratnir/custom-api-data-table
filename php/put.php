<?php
require_once "connection.php";

if ($method === 'PUT') {
    try {
        $input = json_decode(file_get_contents("php://input"), true);
        $tablename = "data"; // your actual table name

        
        $id = $input['id'];
        $name = $input['name'];
        $useName = $input['username'];
        $email = $input['email'];
        $phone = $input['phone'];
        $website = $input['website'];

        $stmt = $conn->prepare("UPDATE $tablename 
            SET name = :name, username = :username, email = :email, phone = :phone, website = :website 
            WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':username', $useName);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':website', $website);
        $stmt->execute();

        echo json_encode(["message" => $stmt->rowCount() . " record(s) updated successfully"]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Invalid request method"]);
}
?>