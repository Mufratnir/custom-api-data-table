<?php
require_once "connection.php";

if ($method == "GET") {
        try {
               $stmt = $conn->prepare("SELECT id, name, username,  email, phone, website FROM $tablename");
               $stmt->execute();
               
               
               $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
               

               header('content-Type: application/json');
               echo json_encode($result);
        }catch (PDOException $e) {
                echo json_encode(['error'=> $e->getMessage()]);
        }
}else{
        exit();
}
?>