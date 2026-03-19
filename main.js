// 1. ใช้ลิงก์ล่าสุดที่เชื่อมกับ Apps Script ตัวใหม่ของคุณ
const API_URL = "https://script.google.com/macros/s/AKfycbzkEtsrDDM2-jOz5DDTd7ObyFDH3VEepUaKF6oegTCq1K8sZpbRpnRKJibRLZ8y6b-T/exec";

// 2. ฟังก์ชันดึงสินค้า (เพิ่มระบบป้องกัน Cache เพื่อให้สินค้าใหม่ขึ้นทันที)
async function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    try {
        // เพิ่ม ?t=... เพื่อให้บราวเซอร์ดึงข้อมูลใหม่จาก Google Sheets ทุกครั้งที่เปิดหน้าเว็บ
        const response = await fetch(`${API_URL}?t=${new Date().getTime()}`);
        const products = await response.json();
        
        if (!products || products.length === 0) {
            grid.innerHTML = '<p style="text-align:center; padding:40px; width:100%;">ไม่พบข้อมูลสินค้า (ลองเพิ่มสินค้าใน AppSheet)</p>';
            return;
        }

        grid.innerHTML = products.map(p => {
            // ดึงรูปภาพแรกมาแสดง
            const displayImg = p.image_url ? p.image_url.split(',')[0].trim() : 'https://via.placeholder.com/400?text=No+Image';
            
            // จัดการเรื่องราคา (ลบตัวอักษรที่ไม่ใช่ตัวเลขออก)
            const rawPrice = String(p.price || '0').replace(/[^0-9.]/g, '');
            const formattedPrice = Number(rawPrice).toLocaleString();

            return `
            <div class="card">
                <div class="card-img-container" style="position:relative; width:100%; padding-top:100%; background:#222;">
                    <img src="${displayImg}" 
                         alt="${p.name}" 
                         onerror="this.src='https://via.placeholder.com/400?text=Image+Error'"
                         style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="card-body">
                    <h3 style="margin-bottom:10px; font-size:18px;">${p.name || 'ไม่มีชื่อสินค้า'}</h3>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; color:#888; font-size:12px;">
                        <span>Size: ${p.sizes || '-'}</span>
                        <span>Stock: ${p.stock || 0}</span>
                    </div>
                    <div class="price" style="color:#e60023; font-size:22px; font-weight:bold;">฿${formattedPrice}</div>
                </div>
            </div>`;
        }).join('');
    } catch (error) {
        console.error("Error fetching products:", error);
        grid.innerHTML = '<p style="text-align:center; padding:20px; color:red; width:100%;">โหลดข้อมูลไม่สำเร็จ (ตรวจสอบการตั้งค่า API)</p>';
    }
}

// 3. ฟังก์ชันเช็คสถานะการล็อกอิน
function checkAuth() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const adminFab = document.getElementById('adminFab');
    const loginLink = document.getElementById('loginLink');
    const userDisplay = document.getElementById('userDisplay');
    const logoutBtn = document.getElementById('logoutBtn');

    if (user) {
        if (loginLink) loginLink.style.display = 'none';
        if (userDisplay) {
            userDisplay.style.display = 'flex';
            document.getElementById('userNameText').innerText = user.username;
        }
        if (logoutBtn) logoutBtn.style.display = 'flex';
        // แสดงปุ่มแอดมินถ้าเป็น admin
        if (adminFab && user.role === 'admin') adminFab.style.display = 'flex';
    }
}

function handleLogout() {
    localStorage.removeItem("currentUser");
    location.reload();
}

// เรียกใช้งานเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    checkAuth();
});
