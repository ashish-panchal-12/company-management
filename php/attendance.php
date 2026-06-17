<?php
include 'config.php';
header('Content-Type: application/json; charset=utf-8');
$action = $_REQUEST['action'] ?? '';

if ($action === 'mark' || $action === 'update') {
    $emp_id = intval($_POST['employee_id'] ?? 0);
    $date = $_POST['date'] ?? null;
    $status = $_POST['status'] ?? 'Present';
    if (!$emp_id || !$date) { echo json_encode(["success"=>false,"message"=>"Employee ID and date required"]); exit; }

    if ($action === 'mark') {
        $stmt = $conn->prepare("INSERT INTO attendance (employee_id,date,status) VALUES (?,?,?)");
        $stmt->bind_param("iss", $emp_id, $date, $status);
        $ok = $stmt->execute();
        echo json_encode(["success"=>$ok, "message"=>$ok ? "Attendance marked" : $stmt->error]);
        $stmt->close();
        exit;
    } else {
        $id = intval($_POST['id'] ?? 0);
        if (!$id) { echo json_encode(["success"=>false,"message"=>"ID required"]); exit; }
        $stmt = $conn->prepare("UPDATE attendance SET employee_id=?, date=?, status=? WHERE id=?");
        $stmt->bind_param("issi", $emp_id, $date, $status, $id);
        $ok = $stmt->execute();
        echo json_encode(["success"=>$ok, "message"=>$ok ? "Attendance updated" : $stmt->error]);
        $stmt->close();
        exit;
    }
}

if ($action === 'delete') {
    $id = intval($_POST['id'] ?? 0);
    if (!$id) { echo json_encode(["success"=>false,"message"=>"ID required"]); exit; }
    $stmt = $conn->prepare("DELETE FROM attendance WHERE id=?");
    $stmt->bind_param("i", $id);
    $ok = $stmt->execute();
    echo json_encode(["success"=>$ok, "message"=>$ok ? "Attendance deleted" : $stmt->error]);
    $stmt->close();
    exit;
}

// list attendance with employee name
$sql = "SELECT a.*, e.name AS employee_name FROM attendance a LEFT JOIN employees e ON a.employee_id = e.id ORDER BY a.date DESC, a.id DESC";
$result = $conn->query($sql);
$data = [];
if ($result) {
    while ($row = $result->fetch_assoc()) $data[] = $row;
}
echo json_encode($data);
?>