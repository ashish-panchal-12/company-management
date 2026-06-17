<?php
include 'config.php';
header('Content-Type: application/json; charset=utf-8');
$action = $_REQUEST['action'] ?? '';

if ($action === 'add' || $action === 'update') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $dept = $_POST['department_id'] !== '' ? intval($_POST['department_id']) : null;
    $pos = trim($_POST['position'] ?? '');
    $sal = $_POST['salary'] !== '' ? floatval($_POST['salary']) : null;
    $date = $_POST['date_joined'] ?: null;

    if (!$name || !$email) { echo json_encode(["success"=>false,"message"=>"Name and email required"]); exit; }

    if ($action === 'add') {
        $stmt = $conn->prepare("INSERT INTO employees (name,email,phone,department_id,position,salary,date_joined) VALUES (?,?,?,?,?,?,?)");
        $stmt->bind_param("ssssdds", $name, $email, $phone, $dept, $pos, $sal, $date);
        $ok = $stmt->execute();
        echo json_encode(["success"=>$ok,"message"=>$ok ? "Employee added" : $stmt->error]);
        $stmt->close();
        exit;
    } else {
        $id = intval($_POST['id'] ?? 0);
        if (!$id) { echo json_encode(["success"=>false,"message"=>"ID required"]); exit; }
        $stmt = $conn->prepare("UPDATE employees SET name=?,email=?,phone=?,department_id=?,position=?,salary=?,date_joined=? WHERE id=?");
        $stmt->bind_param("ssssddsi", $name, $email, $phone, $dept, $pos, $sal, $date, $id);
        $ok = $stmt->execute();
        echo json_encode(["success"=>$ok,"message"=>$ok ? "Employee updated" : $stmt->error]);
        $stmt->close();
        exit;
    }
}

if ($action === 'delete') {
    $id = intval($_POST['id'] ?? 0);
    if (!$id) { echo json_encode(["success"=>false,"message"=>"ID required"]); exit; }
    $stmt = $conn->prepare("DELETE FROM employees WHERE id=?");
    $stmt->bind_param("i", $id);
    $ok = $stmt->execute();
    echo json_encode(["success"=>$ok, "message"=>$ok ? "Employee deleted" : $stmt->error]);
    $stmt->close();
    exit;
}

// list employees with department name
$sql = "SELECT e.*, d.name AS department FROM employees e LEFT JOIN departments d ON e.department_id = d.id ORDER BY e.id DESC";
$result = $conn->query($sql);
$data = [];
if ($result) {
    while ($row = $result->fetch_assoc()) $data[] = $row;
}
echo json_encode($data);
?>