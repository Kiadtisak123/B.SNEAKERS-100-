<?php
header('Content-Type: application/json');

// 1. ตั้งค่าโฟลเดอร์เก็บสลิป
$uploadDir = "uploads/slips/";

// สร้างโฟลเดอร์ถ้ายังไม่มี
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// 2. ตรวจสอบว่ามีการส่งไฟล์มาหรือไม่
if (!isset($_FILES["slip"])) {
    echo json_encode([
        "status" => "error",
        "message" => "ไม่พบไฟล์สลิป กรุณาเลือกไฟล์ภาพ"
    ]);
    exit;
}

$file = $_FILES["slip"];

// 3. ตรวจสอบ Error เบื้องต้น
if ($file["error"] !== UPLOAD_ERR_OK) {
    echo json_encode([
        "status" => "error",
        "message" => "การอัปโหลดขัดข้อง (Error Code: " . $file["error"] . ")"
    ]);
    exit;
}

// 4. ตรวจสอบนามสกุลไฟล์
$allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
$fileType = mime_content_type($file["tmp_name"]); // เช็คจากเนื้อหาไฟล์จริงเพื่อความปลอดภัย

if (!in_array($fileType, $allowedTypes)) {
    echo json_encode([
        "status" => "error",
        "message" => "รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, WEBP) เท่านั้น"
    ]);
    exit;
}

// 5. จำกัดขนาดไฟล์ (5MB)
if ($file["size"] > 5 * 1024 * 1024) {
    echo json_encode([
        "status" => "error",
        "message" => "ไฟล์มีขนาดใหญ่เกินไป (จำกัดที่ 5MB)"
    ]);
    exit;
}

// 6. ตั้งชื่อไฟล์ใหม่เพื่อป้องกันชื่อซ้ำและเรื่องความปลอดภัย
$ext = pathinfo($file["name"], PATHINFO_EXTENSION);
$newName = "slip_" . date("Ymd_His") . "_" . uniqid() . "." . $ext;
$targetPath = $uploadDir . $newName;

// 7. ย้ายไฟล์จาก Buffer ไปยังโฟลเดอร์ที่กำหนด
if (move_uploaded_file($file["tmp_name"], $targetPath)) {
    // ส่งข้อมูลกลับไปให้ index.html ประมวลผลต่อ
    echo json_encode([
        "status" => "success",
        "message" => "อัปโหลดสลิปสำเร็จ",
        "file_url" => $targetPath,
        "redirect" => "index.html?status=paid" // เตรียม Link กลับหน้าแรก
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "ระบบไม่สามารถบันทึกไฟล์ได้ กรุณาลองใหม่หรือติดต่อแอดมิน"
    ]);
}