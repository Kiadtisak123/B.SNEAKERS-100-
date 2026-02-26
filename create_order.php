<?php
require "db.php";

// รับข้อมูล JSON จาก Frontend
$data = json_decode(file_get_contents("php://input"), true);

// ตรวจสอบว่ามีข้อมูลส่งมาจริงหรือไม่
if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit;
}

$name    = $data["name"];
$address = $data["address"];
$method  = $data["method"];
$total   = $data["total"];
$slip    = $data["slip"] ?? ""; // เผื่อกรณีไม่มีสลิป (เช่น เก็บเงินปลายทาง)
$cart    = $data["cart"];

// 1. บันทึกออเดอร์หลัก
$stmt = $conn->prepare("INSERT INTO orders (customer_name, address, payment_method, total_price, slip_path) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssis", $name, $address, $method, $total, $slip);
$stmt->execute();

$order_id = $stmt->insert_id;

// 2. เตรียม Statement สำหรับบันทึกรายการสินค้า และ ตัดสต็อก
$itemStmt = $conn->prepare("INSERT INTO order_items (order_id, product_name, qty, price) VALUES (?, ?, ?, ?)");
$stockStmt = $conn->prepare("UPDATE products SET stock = stock - ? WHERE name = ?");

foreach ($cart as $item) {
    // บันทึกรายการสินค้าที่สั่ง
    $itemStmt->bind_param("isii", $order_id, $item["name"], $item["qty"], $item["price"]);
    $itemStmt->execute();

    // ตัดสต็อกสินค้าในตาราง products (อ้างอิงจากชื่อสินค้า)
    $stockStmt->bind_param("is", $item["qty"], $item["name"]);
    $stockStmt->execute();
}

// ปิดการเชื่อมต่อ
$stmt->close();
$itemStmt->close();
$stockStmt->close();

echo json_encode([
    "status" => "success",
    "order_id" => $order_id,
    "message" => "Order created and stock updated successfully"
]);
?>