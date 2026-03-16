const API_URL = "https://script.google.com/macros/s/AKfycbylpGWJGupVu4BGwdYY7Riq7HbjxtwQdDDDdE9Q3BfU9PBzl99bfVZDvaBH-3g-yaUM/exec";

// 1. ฟังก์ชันดึงข้อมูลสินค้ามาแสดง
async function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    try {
        const response = await fetch(API_URL + "?sheet=products");
        const products = await response.json();
        
        grid.innerHTML = products.map(p => `
            <div class="card" onclick="goToDetail('${p.id}')">
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
    }
}

// 2. ฟังก์ชันตรวจสอบสิทธิ์แอดมิน (เชื่อมกับ login.html)
function checkAdminAccess() {
    // ดึงค่าจากคีย์ currentUser ที่บันทึกไว้ใน login.html
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const adminFab = document.getElementById('adminFab');

    if (adminFab) {
        // ถ้าเป็น admin ให้แสดงปุ่มจัดการระบบ
        if (user && user.role === 'admin') {
            adminFab.style.display = 'flex';
        } else {
            adminFab.style.display = 'none';
        }
    }
}

// 3. ฟังก์ชันตรวจสอบการล็อกอินทั่วไป
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

// 4. ฟังก์ชันออกจากระบบ
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

// เรียกใช้ฟังก์ชันทั้งหมดเมื่อเปิดหน้าเว็บ
renderProducts();
checkAuth();
checkAdminAccess();
