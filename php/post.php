<?php
require_once "connection.php";

if ($method == "POST") {
        try {
                $name = $input['name'];
                $useName = $input['username'];
                $email = $input['email'];
                $phone = $input['phone'];
                $website = $input['website'];
                
                $stmt = $conn->prepare("INSERT INTO $tablename (name, username, email, phone, website) VALUE (:name, :username, :email, :phone, :website)");
                $stmt->bindParam(':name', $name);
                $stmt->bindParam(':username', $useName);
                $stmt->bindParam(':email', $email);
                $stmt->bindParam(':phone', $phone);
                $stmt->bindParam(':website', $website);
                $stmt->execute();
               
               
               $lastId = $conn ->lastInsertId();
               

               echo json_encode(['status'=> 'success', 'id' => $lastId]);

               
        }catch (PDOException $e) {
                echo json_encode(['error'=> $e->getMessage()]);
        }
}else{
        exit();
}
?>