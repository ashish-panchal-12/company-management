
<?php
// ---------------- DEBUG SETTINGS ----------------
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// ------------------------------------------------

// Always send JSON output
header('Content-Type: application/json; charset=utf-8');

// Include database connection
require_once __DIR__ . '/config.php';

// Get action (add / update / delete / list)
$action = $_REQUEST['action'] ?? '';

try {

    // ---------- ADD or UPDATE PROJECT ----------
    if ($action === 'add' || $action === 'update') {
        $name = trim($_POST['name'] ?? '');
        $desc = trim($_POST['description'] ?? '');
        $start = $_POST['start_date'] ?? null;
        $end = $_POST['end_date'] ?? null;
        $status = trim($_POST['status'] ?? '');
        $dept_id = intval($_POST['department_id'] ?? 0);

        if (!$name) {
            echo json_encode(["success" => false, "message" => "Project name is required"]);
            exit;
        }

        if ($action === 'add') {
            $stmt = $conn->prepare("INSERT INTO projects (name, description, start_date, end_date, status, department_id)
                                    VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssi", $name, $desc, $start, $end, $status, $dept_id);
            $ok = $stmt->execute();
            echo json_encode(["success" => $ok, "message" => $ok ? "Project added successfully!" : $stmt->error]);
            $stmt->close();
            exit;
        } else {
            $id = intval($_POST['id'] ?? 0);
            if (!$id) {
                echo json_encode(["success" => false, "message" => "Project ID required"]);
                exit;
            }

            $stmt = $conn->prepare("UPDATE projects SET name=?, description=?, start_date=?, end_date=?, status=?, department_id=? WHERE id=?");
            $stmt->bind_param("sssssii", $name, $desc, $start, $end, $status, $dept_id, $id);
            $ok = $stmt->execute();
            echo json_encode(["success" => $ok, "message" => $ok ? "Project updated successfully!" : $stmt->error]);
            $stmt->close();
            exit;
        }
    }

    // ---------- DELETE PROJECT ----------
    if ($action === 'delete') {
        $id = intval($_POST['id'] ?? 0);
        if (!$id) {
            echo json_encode(["success" => false, "message" => "Project ID required"]);
            exit;
        }
        $stmt = $conn->prepare("DELETE FROM projects WHERE id=?");
        $stmt->bind_param("i", $id);
        $ok = $stmt->execute();
        echo json_encode(["success" => $ok, "message" => $ok ? "Project deleted successfully!" : $stmt->error]);
        $stmt->close();
        exit;
    }

    // ---------- FETCH ALL PROJECTS ----------
    $result = $conn->query("SELECT * FROM projects ORDER BY id DESC");

    $data = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    echo json_encode($data);

} catch (Throwable $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
