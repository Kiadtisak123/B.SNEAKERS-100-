// main.js
const API_URL = "https://script.google.com/macros/s/AKfycbylpGWJGupVu4BGwdYY7Riq7HbjxtwQdDDDdE9Q3BfU9PBzl99bfVZDvaBH-3g-yaUM/exec";

// 1. ดึงและแสดงรายการสินค้า (แก้ไขตรงนี้เพื่อให้ดึงข้อมูลใหม่ทุกครั้ง)
async function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    try {
        // เพิ่ม ?t=${new Date().getTime()} เพื่อป้องกันการติด Cache ของ Browser
        const response = await fetch(`${API_URL}?sheet=products&t=${new Date().getTime()}`);
        const products = await response.json();
        
        grid.innerHTML = products.map(p => `
            <div class="card">
                <img src="${p.image_url}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400?text=No+Image'">
                <div class="card-body">
                    <h3>${p.name}</h3>
                    <p style="color:#888; font-size:12px;">Size: ${p.sizes}</p>
                    <div class="price">฿${Number(p.price).toLocaleString()}</div>
                </div>
            </div>`).join('');
            
        localStorage.setItem('sneaker_prods', JSON.stringify(products));
    } catch (error) {
        console.error("ดึงข้อมูลไม่สำเร็จ:", error);
        grid.innerHTML = '<p style="text-align:center; padding:20px;">ไม่สามารถโหลดสินค้าได้ในขณะนี้</p>';
    }
}

// 2. เช็คสิทธิ์และแสดงปุ่มแอดมิน
function checkAdminAccess() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const adminFab = document.getElementById('adminFab');

    if (adminFab) {
        if (user && user.role === 'admin') {
            adminFab.style.display = 'flex';
        } else {
            adminFab.style.display = 'none';
        }
    }
}

// 3. ตรวจสอบสถานะการเข้าสู่ระบบทั่วไป
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.getElementById('loginLink');
    const userDisplay = document.getElementById('userDisplay');
    const userNameText = document.getElementById('userNameText');
    const logoutBtn = document.getElementById('logoutBtn');
    const orderLink = document.getElementById('orderLink');

    if (user) {
        if (loginLink) loginLink.style.display = 'none';
        if (userDisplay) userDisplay.style.display = 'flex';
        if (userNameText) userNameText.innerText = user.username;
        if (logoutBtn) logoutBtn.style.display = 'flex';
        if (orderLink) orderLink.style.display = 'block';
    }
}

// 4. ออกจากระบบ
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = "index.html";
}

// เรียกใช้ฟังก์ชันทันที
renderProducts();
checkAuth();
checkAdminAccess();
