<?php
// ตั้งค่าการเชื่อมต่อฐานข้อมูล
$host = "localhost";
$user = "root";
$pass = "";
$db   = "sneaker_shop";

// สร้างการเชื่อมต่อ
$conn = new mysqli($host, $user, $pass, $db);

// ตรวจสอบการเชื่อมต่อ
if ($conn->connect_error) {
    // ในฐานะ Developer เราอยากรู้ error แต่ไม่ควรแสดงให้ลูกค้าเห็นตรงๆ
    // จึงใช้คำสั่ง die พร้อมแจ้งเตือนสั้นๆ
    die("ขออภัย! ระบบเชื่อมต่อฐานข้อมูลขัดข้อง: " . $conn->connect_error);
}

// ตั้งค่าชุดอักขระให้รองรับภาษาไทยและ Emoji (utf8mb4)
if (!$conn->set_charset("utf8mb4")) {
    printf("Error loading character set utf8mb4: %s\n", $conn->error);
}

// (เพิ่มเติม) ตั้งค่า Timezone ให้เป็นเวลาประเทศไทย 
// เพื่อให้เวลาสั่งซื้อในฐานข้อมูลตรงกับเวลาจริงในไทย
date_default_timezone_set("Asia/Bangkok");
?>