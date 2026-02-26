<?php
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = $data["name"];
$address = $data["address"];
$method = $data["method"];
$total = $data["total"];
$slip = $data["slip"];
$cart = $data["cart"];

// บันทึกออเดอร์
$stmt = $conn->prepare("INSERT INTO orders (customer_name, address, payment_method, total_price, slip_path) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssis", $name, $address, $method, $total, $slip);
$stmt->execute();

$order_id = $stmt->insert_id;

// บันทึกรายการสินค้า
$itemStmt = $conn->prepare("INSERT INTO order_items (order_id, product_name, qty, price) VALUES (?, ?, ?, ?)");

foreach ($cart as $item) {
    $itemStmt->bind_param("isii", $order_id, $item["name"], $item["qty"], $item["price"]);
    $itemStmt->execute();
}

echo json_encode([
    "status" => "success",
    "order_id" => $order_id
]);