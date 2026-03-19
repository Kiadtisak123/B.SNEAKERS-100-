// 1. ลิงก์ API ล่าสุดของคุณ
const API_URL = "https://script.google.com/macros/s/AKfycbxgV7RVwyXcMB6lHb6vTv-wGwoiz9guy_g5e38kGj3AUIil1s1snlsWbnx9yrFJd_p3ZQ/exec";

// 2. ฟังก์ชันดึงสินค้า
async function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    try {
        const response = await fetch(`${API_URL}?t=${new Date().getTime()}`);
        const products = await response.json();
        
        if (!products || products.length === 0) {
            grid.innerHTML = '<p style="text-align:center; padding:40px; width:100%;">ไม่พบข้อมูลสินค้า</p>';
            return;
        }

        grid.innerHTML = products.map(p => {
            const displayImg = p.image_url ? p.image_url.split(',')[0].trim() : 'https://via.placeholder.com/400?text=No+Image';
            const formattedPrice = Number(String(p.price || '0').replace(/[^0-9.]/g, '')).toLocaleString();

            return `
            <div class="card">
                <div style="position:relative; width:100%; padding-top:100%; background:#222;">
                    <img src="${displayImg}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400?text=Image+Error'"
                         style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="card-body">
                    <h3 style="font-size:18px; margin-bottom:10px;">${p.name || 'ไม่มีชื่อสินค้า'}</h3>
                    <div style="display:flex; justify-content:space-between; color:#888; font-size:12px; margin-bottom:10px;">
                        <span>Size: ${p.sizes || '-'}</span>
                        <span>Stock: ${p.stock || 0}</span>
                    </div>
                    <div class="price" style="color:#e60023; font-size:22px; font-weight:bold;">฿${formattedPrice}</div>
                </div>
            </div>`;
        }).join('');
    } catch (error) {
        grid.innerHTML = '<p style="text-align:center; padding:20px; color:red; width:100%;">โหลดข้อมูลไม่สำเร็จ</p>';
    }
}

// 3. ฟังก์ชันเช็คสถานะการล็อกอิน (เพื่อให้ปุ่มแอดมินแสดงผล)
function checkAuth() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const adminFab = document.getElementById('adminFab'); // ปุ่มแอดมิน (ปุ่มบวก)
    const loginLink = document.getElementById('loginLink');
    const userDisplay = document.getElementById('userDisplay');
    const logoutBtn = document.getElementById('logoutBtn');

    if (user) {
        if (loginLink) loginLink.style.display = 'none';
        if (userDisplay) {
            userDisplay.style.display = 'flex';
            const nameText = document.getElementById('userNameText');
            if (nameText) nameText.innerText = user.username;
        }
        if (logoutBtn) logoutBtn.style.display = 'flex';
        
        // ถ้าเป็น admin ให้แสดงปุ่ม FAB (ปุ่มบวกสีแดง)
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

// 4. เรียกใช้งานทั้งหมดเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    checkAuth();
});
