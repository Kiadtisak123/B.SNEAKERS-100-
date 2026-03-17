const API_URL = "https://script.google.com/macros/s/AKfycbyNrYbGnEsbklqG5kdHiCWXsdqTfhSyQZQnKSe-ztAAIMIPOzahb7f5If7-VXgekFx7/exec";

// ฟังก์ชันดึงสินค้ามาแสดง
async function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    try {
        const response = await fetch(`${API_URL}?t=${new Date().getTime()}`);
        const products = await response.json();
        
        if (!products || products.length === 0) {
            grid.innerHTML = '<p style="text-align:center; padding:20px;">ไม่มีสินค้าในระบบ</p>';
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
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <p style="color:#888; font-size:12px;">Size: ${p.sizes || '-'}</p>
                        <p style="color:#888; font-size:12px;">Stock: ${p.stock || 0}</p>
                    </div>
                    <div class="price">฿${formattedPrice}</div>
                </div>
            </div>`;
        }).join('');
    } catch (error) {
        console.error("Error:", error);
        grid.innerHTML = '<p style="text-align:center; padding:20px; color:red;">โหลดสินค้าไม่สำเร็จ</p>';
    }
}

// ฟังก์ชันเช็คสถานะล็อกอิน (เพื่อให้ปุ่มต่างๆ แสดงผลถูก)
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

// เรียกใช้งาน
renderProducts();
checkAuth();
