// 1. ลิงก์ API ล่าสุดที่เชื่อมกับ Google Sheets ของคุณแล้ว
const API_URL = "https://script.google.com/macros/s/AKfycbxgV7RVwyXcMB6lHb6vTv-wGwoiz9guy_g5e38kGj3AUIil1s1snlsWbnx9yrFJd_p3ZQ/exec";

// 2. ฟังก์ชันดึงสินค้ามาแสดง (รองรับสินค้าใหม่ GG และเทสระบบ)
async function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    try {
        // ดึงข้อมูลสดใหม่โดยไม่ใช้ Cache ด้วยการต่อท้ายเวลาปัจจุบัน
        const response = await fetch(`${API_URL}?t=${new Date().getTime()}`);
        const products = await response.json();
        
        console.log("Data loaded:", products); // ดูข้อมูลใน F12

        if (!products || products.length === 0) {
            grid.innerHTML = '<p style="text-align:center; padding:40px; width:100%;">ไม่พบข้อมูลสินค้าในระบบ</p>';
            return;
        }

        grid.innerHTML = products.map(p => {
            // ดึงรูปภาพ (ถ้ามีหลายรูปให้เอาตัวแรก)
            const displayImg = p.image_url ? p.image_url.split(',')[0].trim() : 'https://via.placeholder.com/400?text=No+Image';
            
            // ฟอร์แมตราคาให้มีคอมม่า
            const rawPrice = String(p.price || '0').replace(/[^0-9.]/g, '');
            const formattedPrice = Number(rawPrice).toLocaleString();

            return `
            <div class="card">
                <div style="position:relative; width:100%; padding-top:100%; background:#222;">
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
        console.error("Error:", error);
        grid.innerHTML = '<p style="text-align:center; padding:20px; color:red; width:100%;">❌ โหลดข้อมูลล้มเหลว (ตรวจสอบ API)</p>';
    }
}

// 3. ฟังก์ชันเช็คสิทธิ์แอดมิน (เรียกปุ่มบวกสีแดงกลับมา)
function checkAuth() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const adminFab = document.getElementById('adminFab'); // ปุ่มบวกสีแดง
    const loginLink = document.getElementById('loginLink');
    const userDisplay = document.getElementById('userDisplay');
    const logoutBtn = document.getElementById('logoutBtn');

    if (user) {
        // ซ่อนปุ่ม "เข้าสู่ระบบ" เดิม
        if (loginLink) loginLink.style.display = 'none';
        
        // แสดงชื่อผู้ใช้ที่ล็อกอิน
        if (userDisplay) {
            userDisplay.style.display = 'flex';
            const nameText = document.getElementById('userNameText');
            if (nameText) nameText.innerText = user.username;
        }
        
        // แสดงปุ่ม Logout
        if (logoutBtn) logoutBtn.style.display = 'flex';
        
        // --- ส่วนสำคัญ: ถ้าเป็นแอดมิน ให้แสดงปุ่มบวกสีแดง ---
        if (adminFab && user.role === 'admin') {
            adminFab.style.display = 'flex';
        }
    }
}

// ฟังก์ชันออกจากระบบ
function handleLogout() {
    localStorage.removeItem("currentUser");
    location.reload();
}

// 4. เริ่มทำงานเมื่อหน้าเว็บพร้อม
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    checkAuth();
});
