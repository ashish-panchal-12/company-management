<?php
include 'config.php';
$action = $_REQUEST['action'] ?? '';

if ($action === 'add' || $action === 'update') {
    $name = trim($_POST['name'] ?? '');
    $desc = trim($_POST['description'] ?? '');
    if (!$name) { echo json_encode(["success"=>false,"message"=>"Name required"]); exit; }
    if ($action === 'add') {
        $stmt = $conn->prepare("INSERT INTO departments (name, description) VALUES (?, ?)");
        $stmt->bind_param("ss", $name, $desc);
        $ok = $stmt->execute();
        echo json_encode(["success"=>$ok, "message"=>$ok ? "Department added successfully" : $stmt->error]);
        $stmt->close();
        exit;
    } else {
        $id = intval($_POST['id'] ?? 0);
        $stmt = $conn->prepare("UPDATE departments SET name=?, description=? WHERE id=?");
        $stmt->bind_param("ssi", $name, $desc, $id);
        $ok = $stmt->execute();
        echo json_encode(["success"=>$ok, "message"=>$ok ? "Department updated" : $stmt->error]);
        $stmt->close();
        exit;
    }
}

if ($action === 'delete') {
    $id = intval($_POST['id'] ?? 0);
    $stmt = $conn->prepare("DELETE FROM departments WHERE id = ?");
    $stmt->bind_param("i", $id);
    $ok = $stmt->execute();
    echo json_encode(["success"=>$ok, "message"=>$ok ? "Department deleted" : $stmt->error]);
    $stmt->close();
    exit;
}

// list
$result = $conn->query("SELECT * FROM departments ORDER BY id DESC");
$data = [];
while ($row = $result->fetch_assoc()) $data[] = $row;
echo json_encode($data);
?>
