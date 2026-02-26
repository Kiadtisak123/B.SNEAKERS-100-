<?php
require "db.php";

// ตรวจสอบว่ามีการส่ง order_id มาหรือไม่
if (!isset($_GET["order_id"])) {
    die("Error: ไม่พบหมายเลขคำสั่งซื้อ");
}

$orderId = intval($_GET["order_id"]); // ใช้ intval เพื่อป้องกัน SQL Injection

// ดึงข้อมูลออเดอร์
$order_query = $conn->query("SELECT * FROM orders WHERE id = $orderId");
if ($order_query->num_rows === 0) {
    die("Error: ไม่พบข้อมูลออเดอร์ในระบบ");
}
$order = $order_query->fetch_assoc();

// ดึงรายการสินค้า
$items = $conn->query("SELECT * FROM order_items WHERE order_id = $orderId");

// จัดรูปแบบข้อความที่จะส่ง
$text = "👟 B.SNEAKERS - ออเดอร์ใหม่\n";
$text .= "--------------------------\n";
$text .= "ชื่อลูกค้า: {$order['customer_name']}\n";
$text .= "ที่อยู่: {$order['address']}\n";
$text .= "ยอดรวมสุทธิ: " . number_format($order['total_price']) . " บาท\n\n";
$text .= "📦 รายการสินค้า:\n";

while ($i = $items->fetch_assoc()) {
    $text .= "• {$i['product_name']} (x{$i['qty']})\n";
}

$text .= "\nขอบคุณที่ใช้บริการ B.SNEAKERS ครับ!";

/* ===== การตั้งค่า FACEBOOK API ===== */
// แนะนำให้เก็บ Token ไว้ในไฟล์ config หรือ Environment Variable
$PAGE_TOKEN = "PUT_PAGE_ACCESS_TOKEN_HERE"; 
$PSID = "USER_PSID"; // หมายเลข ID ของลูกค้าบน Facebook Page

/* ===== เริ่มกระบวนการส่งข้อความด้วย cURL (เสถียรกว่า file_get_contents) ===== */
$url = "https://graph.facebook.com/v18.0/me/messages?access_token=" . $PAGE_TOKEN;

$data = [
    "recipient" => ["id" => $PSID],
    "message"   => ["text" => $text]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // ปิดการเช็ค SSL ชั่วคราวหากรันบน localhost

$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
    echo "cURL Error #:" . $err;
} else {
    // ส่งสำเร็จ! สามารถส่ง User กลับไปหน้า index.html หรือหน้าสรุปคำสั่งซื้อ
    header("Location: index.html?status=success");
    exit();
}
?>