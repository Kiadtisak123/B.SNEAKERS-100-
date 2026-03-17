const API_URL = "https://script.google.com/macros/s/AKfycbyNrYbGnEsbklqG5kdHiCWXsdqTfhSyQZQnKSe-ztAAIMIPOzahb7f5If7-VXgekFx7/exec";

async function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    try {
        const response = await fetch(`${API_URL}?t=${new Date().getTime()}`);
        const products = await response.json();
        
        // ถ้าดึงข้อมูลมาได้ แต่เป็นอาเรย์ว่าง
        if (products.length === 0) {
            grid.innerHTML = '<p style="text-align:center; padding:20px;">ไม่มีสินค้าในระบบ</p>';
            return;
        }

        grid.innerHTML = products.map(p => {
            // 1. จัดการรูปภาพ (ดึงรูปแรกออกมา)
            const displayImg = p.image_url ? p.image_url.split(',')[0].trim() : '';
            
            // 2. จัดการราคา (ลบอักขระที่ไม่ใช่ตัวเลขออกก่อนแปลง เพื่อป้องกัน NaN)
            const cleanPrice = p.price ? String(p.price).replace(/[^0-9.]/g, '') : '0';
            const formattedPrice = Number(cleanPrice).toLocaleString();

            return `
            <div class="card">
                <div class="card-img-container" style="position:relative; width:100%; padding-top:100%; background:#222;">
                    <img src="${displayImg}" 
                         alt="${p.name}" 
                         onerror="this.src='https://via.placeholder.com/400?text=No+Image'"
                         style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="card-body">
                    <h3>${p.name || 'ไม่มีชื่อสินค้า'}</h3>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <p style="color:#888; font-size:12px;">Size: ${p.sizes || '-'}</p>
                        <p style="color:#888; font-size:12px;">Stock: ${p.stock || 0}</p>
                    </div>
                    <div class="price">฿${formattedPrice}</div>
                </div>
            </div>`;
        }).join('');

    } catch (error) {
        console.error("Error:", error);
        grid.innerHTML = '<p style="text-align:center; padding:20px; color:red;">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
    }
}

// เรียกใช้ฟังก์ชัน
renderProducts();
