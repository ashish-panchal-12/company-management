<?php
include 'config.php';
header('Content-Type: application/json; charset=utf-8');
// provide combined data like employees and departments for populating selects
$departments = [];
$res = $conn->query("SELECT id, name FROM departments ORDER BY name ASC");
if ($res) {
    while ($r = $res->fetch_assoc()) $departments[] = $r;
}
$employees = [];
$res2 = $conn->query("SELECT id, name FROM employees ORDER BY name ASC");
if ($res2) {
    while ($r = $res2->fetch_assoc()) $employees[] = $r;
}
echo json_encode(['departments'=>$departments, 'employees'=>$employees]);
?>