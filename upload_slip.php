<?php
header('Content-Type: application/json');

// โฟลเดอร์เก็บสลิป
$uploadDir = "uploads/";

// สร้างโฟลเดอร์ถ้ายังไม่มี
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// ตรวจว่ามีไฟล์ส่งมาหรือไม่
if (!isset($_FILES["slip"])) {
    echo json_encode([
        "status" => "error",
        "message" => "ไม่พบไฟล์สลิป"
    ]);
    exit;
}

$file = $_FILES["slip"];

// ตรวจ error
if ($file["error"] !== UPLOAD_ERR_OK) {
    echo json_encode([
        "status" => "error",
        "message" => "อัปโหลดไม่สำเร็จ"
    ]);
    exit;
}

// อนุญาตเฉพาะรูปภาพ
$allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

if (!in_array($file["type"], $allowedTypes)) {
    echo json_encode([
        "status" => "error",
        "message" => "อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น"
    ]);
    exit;
}

// จำกัดขนาดไฟล์ 5MB
if ($file["size"] > 5 * 1024 * 1024) {
    echo json_encode([
        "status" => "error",
        "message" => "ไฟล์ใหญ่เกิน 5MB"
    ]);
    exit;
}

// ตั้งชื่อไฟล์ใหม่กันชนกัน
$ext = pathinfo($file["name"], PATHINFO_EXTENSION);
$newName = "slip_" . time() . "_" . rand(1000,9999) . "." . $ext;
$targetPath = $uploadDir . $newName;

// ย้ายไฟล์
if (!move_uploaded_file($file["tmp_name"], $targetPath)) {
    echo json_encode([
        "status" => "error",
        "message" => "บันทึกไฟล์ไม่สำเร็จ"
    ]);
    exit;
}

// สำเร็จ
echo json_encode([
    "status" => "success",
    "file" => $targetPath
]);