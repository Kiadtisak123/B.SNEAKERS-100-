const API_URL = "https://script.google.com/macros/s/AKfycbyNrYbGnEsbklqG5kdHiCWXsdqTfhSyQZQnKSe-ztAAIMIPOzahb7f5If7-VXgekFx7/exec";

// ดึงข้อมูลสินค้ามาแสดงผล
async function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    try {
        const response = await fetch(`${API_URL}?t=${new Date().getTime()}`);
        const products = await response.json();
        
        if (!products || products.length === 0) {
            grid.innerHTML = '<p style="text-align:center; padding:40px; width:100%;">ยังไม่มีสินค้าในสต็อก</p>';
            return;
        }

        grid.innerHTML = products.map(p => {
            const displayImg = p.image_url ? p.image_url.split(',')[0].trim() : 'https://via.placeholder.com/400?text=No+Image';
            const price = Number(String(p.price).replace(/[^0-9.]/g, '')).toLocaleString();

            return `
            <div class="card">
                <img src="${displayImg}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400?text=Image+Error'">
                <div class="card-body">
                    <h3 style="font-size:18px; margin-bottom:8px;">${p.name || 'สินค้าไม่มีชื่อ'}</h3>
                    <p style="color:#888; font-size:13px; margin-bottom:12px;">ไซส์: ${p.sizes || '-'} | เหลือ: ${p.stock || 0}</p>
                    <div class="price" style="color:#e60023; font-size:22px; font-weight:bold;">฿${price}</div>
                </div>
            </div>`;
        }).join('');
    } catch (err) {
        grid.innerHTML = '<p style="text-align:center; color:red; width:100%;">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
    }
}

// เช็คสถานะการเข้าสู่ระบบ
function checkAuth() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const elements = {
        login: document.getElementById('loginLink'),
        display: document.getElementById('userDisplay'),
        name: document.getElementById('userNameText'),
        logout: document.getElementById('logoutBtn'),
        admin: document.getElementById('adminFab')
    };

    if (user) {
        if (elements.login) elements.login.style.display = 'none';
        if (elements.display) elements.display.style.display = 'flex';
        if (elements.name) elements.name.innerText = user.username;
        if (elements.logout) elements.logout.style.display = 'flex';
        if (elements.admin && user.role === 'admin') elements.admin.style.display = 'flex';
    }
}

function handleLogout() {
    localStorage.removeItem("currentUser");
    location.reload();
}

// รันเมื่อโหลดหน้าเว็บสำเร็จ
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    checkAuth();
});
