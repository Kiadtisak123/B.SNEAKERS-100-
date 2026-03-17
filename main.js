const API_URL = "https://script.google.com/macros/s/AKfycbyNrYbGnEsbklqG5kdHiCWXsdqTfhSyQZQnKSe-ztAAIMIPOzahb7f5If7-VXgekFx7/exec";

// 1. ฟังก์ชันแสดงสินค้า
async function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    try {
        grid.innerHTML = '<p style="text-align:center; width:100%;">กำลังโหลดสินค้า...</p>';
        const response = await fetch(`${API_URL}?t=${new Date().getTime()}`);
        const products = await response.json();
        
        if (!products || products.length === 0) {
            grid.innerHTML = '<p style="text-align:center; width:100%;">ไม่พบข้อมูลสินค้า</p>';
            return;
        }

        grid.innerHTML = products.map(p => {
            const displayImg = p.image_url ? p.image_url.split(',')[0].trim() : '';
            const cleanPrice = p.price ? String(p.price).replace(/[^0-9.]/g, '') : '0';
            const formattedPrice = Number(cleanPrice).toLocaleString();

            return `
            <div class="card">
                <img src="${displayImg}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400?text=No+Image'">
                <div class="card-body">
                    <h3>${p.name || 'ไม่มีชื่อสินค้า'}</h3>
                    <div style="display:flex; justify-content:space-between; color:#888; font-size:12px; margin-bottom:10px;">
                        <span>Size: ${p.sizes || '-'}</span>
                        <span>Stock: ${p.stock || 0}</span>
                    </div>
                    <div class="price">฿${formattedPrice}</div>
                </div>
            </div>`;
        }).join('');
    } catch (error) {
        console.error("Error:", error);
        grid.innerHTML = '<p style="text-align:center; width:100%; color:red;">โหลดสินค้าไม่สำเร็จ</p>';
    }
}

// 2. ฟังก์ชันเช็คการล็อกอิน (แก้ไขให้ตรงกับ index.html ของคุณ)
function checkAuth() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const loginLink = document.getElementById('loginLink');
    const userDisplay = document.getElementById('userDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminFab = document.getElementById('adminFab');

    if (user) {
        if (loginLink) loginLink.style.display = 'none';
        if (userDisplay) {
            userDisplay.style.display = 'flex';
            document.getElementById('userNameText').innerText = user.username;
        }
        if (logoutBtn) logoutBtn.style.display = 'flex';
        
        // ถ้าเป็น admin ให้แสดงปุ่มเหลือง
        if (adminFab && user.role === 'admin') {
            adminFab.style.display = 'flex';
        }
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (userDisplay) userDisplay.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (adminFab) adminFab.style.display = 'none';
    }
}

// 3. ฟังก์ชันออกจากระบบ
function handleLogout() {
    localStorage.removeItem("currentUser");
    window.location.reload();
}

// เรียกใช้งานเมื่อไฟล์โหลด
renderProducts();
checkAuth();
