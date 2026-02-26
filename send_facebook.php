<?php
require "db.php";

$orderId = $_GET["order_id"];

// ดึงข้อมูลออเดอร์
$order = $conn->query("SELECT * FROM orders WHERE id=$orderId")->fetch_assoc();
$items = $conn->query("SELECT * FROM order_items WHERE order_id=$orderId");

$text = "ออเดอร์ใหม่\n";
$text .= "ชื่อ: {$order['customer_name']}\n";
$text .= "ที่อยู่: {$order['address']}\n";
$text .= "ยอดรวม: {$order['total_price']} บาท\n\n";
$text .= "รายการสินค้า:\n";

while ($i = $items->fetch_assoc()) {
    $text .= "- {$i['product_name']} x{$i['qty']}\n";
}

/* ===== ใส่ TOKEN เพจตรงนี้ ===== */
$PAGE_TOKEN = "PUT_PAGE_ACCESS_TOKEN_HERE";

/* ===== PSID ลูกค้า (ต้องใช้ระบบจริงถึงจะมี) ===== */
$PSID = "USER_PSID";

/* ===== ส่งข้อความ ===== */
$url = "https://graph.facebook.com/v18.0/me/messages?access_token=".$PAGE_TOKEN;

$data = [
    "recipient" => ["id"=>$PSID],
    "message"   => ["text"=>$text]
];

$options = [
    "http" => [
        "header"  => "Content-Type: application/json",
        "method"  => "POST",
        "content" => json_encode($data),
    ],
];

$context = stream_context_create($options);
file_get_contents($url, false, $context);