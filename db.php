<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "sneaker_shop";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("เชื่อมต่อฐานข้อมูลไม่สำเร็จ");
}

$conn->set_charset("utf8mb4");