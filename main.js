// เปลี่ยน API_URL ให้ตรงกับที่ใช้ใน admin.html
const API_URL = "https://script.google.com/macros/s/AKfycbw9BFnG_IVCN9PIrn4S7csjiVEf3ZuBphdyUjDOGdlmoFieAnZPU5xNCKJNM9wo2UkP/exec";

// 1. ดึงและแสดงรายการสินค้า
async function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    try {
        // เพิ่ม t=${new Date().getTime()} เพื่อบังคับให้ดึงข้อมูลใหม่เสมอ (สดจาก Google Sheets)
        const response = await fetch(`${API_URL}?t=${new Date().getTime()}`);
        const products = await response.json();
        
        if (products.length === 0) {
            grid.innerHTML = '<p style="text-align:center; padding:20px; color:#aaa;">ยังไม่มีสินค้าในสต็อก</p>';
            return;
        }

        grid.innerHTML = products.map(p => {
            // จัดการเรื่องรูปภาพ: ถ้ามีหลายรูป (คั่นด้วยคอมม่า) ให้เอาเฉพาะรูปแรกมาโชว์
            const displayImg = p.image_url ? p.image_url.split(',')[0] : 'https://via.placeholder.com/400?text=No+Image';
            
            return `
            <div class="card">
                <div class="card-img-container" style="position:relative; padding-top:100%; overflow:hidden;">
                    <img src="${displayImg}" alt="${p.name}" 
                         onerror="this.src='https://via.placeholder.com/400?text=No+Image'"
                         style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="card-body" style="padding:15px;">
                    <h3 style="margin-bottom:8px; font-size:1.1rem;">${p.name || 'ไม่มีชื่อสินค้า'}</h3>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="color:#888; font-size:12px;">Size: ${p.sizes || '-'}</span>
                        <span style="font-size:12px; color: ${p.stock > 0 ? '#4CAF50' : '#FF5252'}">
                            ${p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                    <div class="price" style="margin-top:10px; color:#e60023; font-weight:bold; font-size:1.2rem;">
                        ฿${Number(p.price || 0).toLocaleString()}
                    </div>
                </div>
            </div>`;
        }).join('');
            
        // เก็บลง LocalStorage สำรองไว้
        localStorage.setItem('sneaker_prods', JSON.stringify(products));
    } catch (error) {
        console.error("ดึงข้อมูลไม่สำเร็จ:", error);
        grid.innerHTML = '<p style="text-align:center; padding:20px; color:red;">ไม่สามารถเชื่อมต่อข้อมูลได้ กรุณารีเฟรชอีกครั้ง</p>';
    }
}

// 2. เช็คสิทธิ์และแสดงปุ่มแอดมิน (Floating Action Button)
function checkAdminAccess() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const adminFab = document.getElementById('adminFab');

    if (adminFab) {
        // แสดงปุ่มแอดมินเฉพาะตอนที่ล็อกอินเป็น admin เท่านั้น
        if (user && user.role === 'admin') {
            adminFab.style.display = 'flex';
        } else {
            adminFab.style.display = 'none';
        }
    }
}

// 3. ตรวจสอบสถานะการเข้าสู่ระบบ
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.getElementById('loginLink');
    const userDisplay = document.getElementById('userDisplay');
    const userNameText = document.getElementById('userNameText');
    const logoutBtn = document.getElementById('logoutBtn');

    if (user) {
        if (loginLink) loginLink.style.display = 'none';
        if (userDisplay) userDisplay.style.display = 'flex';
        if (userNameText) userNameText.innerText = user.username;
        if (logoutBtn) logoutBtn.style.display = 'block';
    }
}

// 4. ออกจากระบบ
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.reload(); // รีโหลดเพื่อให้หน้าเว็บแสดงผลสำหรับผู้ใช้ทั่วไป
}

// เริ่มการทำงาน
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    checkAuth();
    checkAdminAccess();
});
