<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// ========================================
// 🗄️ Database Connection
// ========================================
$con = mysqli_connect("localhost", "root", "", "API");


// If connection fails, return an error as JSON and stop script
if (!$con) {
    echo json_encode(["error" => "Database Connection failed: " . mysqli_connect_error()]);
    exit;
}


// ========================================
// ⚙️ Detect HTTP Method & Input Data
// ========================================
// Determine the request method (GET, POST, PUT, DELETE, etc.)
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"),  associative: true);


// ========================================
// 📄 GET Request → Read All Data
// ========================================
if ($method === 'GET') {
    $sql = "SELECT * FROM data";
    $result = mysqli_query($con, $sql);

    if ($result) {
        $response = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $response [] =$row;
        }
        echo json_encode($response, JSON_PRETTY_PRINT);
    } else {
        echo json_encode(["error" => "Query failed: " . mysqli_error($con)]);
    }

// ========================================
// ➕ POST Request → Insert New Data
// ========================================
}elseif($method == 'POST'){
    if(!empty($input['name']) && !empty($input['username']) && !empty($input['email'])){
        $name = mysqli_real_escape_string($con, $input['name']);
        $username = mysqli_real_escape_string($con, $input['username']);
        $email = mysqli_real_escape_string($con, $input['email']);
        $phone = mysqli_real_escape_string($con, $input['phone'] ?? '');
        $website = mysqli_real_escape_string($con, $input['website']  ?? '');

        $sql = "INSERT INTO data (name, username, email, phone, website) 
        VALUES ('$name', '$username', '$email', '$phone', '$website')";

        $result = mysqli_query($con, $sql);

        if($result){
            echo json_encode(["success" => true, "message" => "User added successfully"]);
        }else{
            echo json_encode(["error" => "Insert failed: " . mysqli_error($con)]);
        }
    } else {
        echo json_encode(["error" => "Missing required fields"]);
     }

// ========================================
// ✏️ PUT Request → Update Existing Data
// ========================================    
}elseif($method === 'PUT'){
    if (! empty($input['id'])) {
    $id       = intval($input['id']);
    $name     = mysqli_real_escape_string($con, $input['name'] ?? '');
    $username = mysqli_real_escape_string($con, $input['username'] ?? '');
    $email    = mysqli_real_escape_string($con, $input['email'] ?? '');
    $phone    = mysqli_real_escape_string($con, $input['phone'] ?? '');
    $website  = mysqli_real_escape_string($con, $input['website'] ?? '');

    $sql = "UPDATE data
                SET name='$name', username='$username', email='$email', phone='$phone', website='$website'
                WHERE id=$id";

    if (mysqli_query($con, $sql)) {
        echo json_encode(["success" => "User updated successfully"]);
    } else {
        echo json_encode(["error" => "Update failed: " . mysqli_error($con)]);
    }
} else {
    echo json_encode(["error" => "Missing ID for update"]);
}





// ========================================
// ❌ DELETE Request → Delete Record by ID
// ========================================
}elseif($method === 'DELETE'){
    if (! empty($input['id'])){
        $id = intval($input['id']);

        $sql = "DELETE FROM data WHERE id = $id";

        if (mysqli_query($con, $sql)){
            echo json_encode(["success" => "User deleted successfully"]);
        }else{
            echo json_encode(["error" => "Delete failed: " . mysqli_error($con)]);
        }
    }else{
        echo json_encode(["error" => "Missing ID for delete"]);
    }
}elseif($method === 'OPTION'){
    http_response_code(200);
} 
else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>