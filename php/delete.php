<?php
require_once "connection.php";

if ($method == "DELETE") {
  try {
    $id = $input['id'];

    $stmt = $conn->prepare("DELETE FROM $tablename WHERE id = :id");
    $stmt->bindParam(':id', $id);
    
    $stmt->execute();

    echo "Record deleted successfully";
  } catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
  }
} else {
  exit();
}
?>