const API_URL = "https://script.google.com/macros/s/AKfycbzkEtsrDDM2-jOz5DDTd7ObyFDH3VEepUaKF6oegTCq1K8sZpbRpnRKJibRLZ8y6b-T/exec";

async function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    try {
        // เติม ?nocache= เพื่อไม่ให้บราวเซอร์ดึงหน้าเก่ามาแสดง
        const response = await fetch(`${API_URL}?nocache=${new Date().getTime()}`);
        const products = await response.json();
        
        console.log("Data from Sheets:", products); // เช็คใน Inspect (F12) ว่าข้อมูลมาไหม

        if (!products || products.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:50px;"><h2>⚠️ ไม่พบสินค้าในฐานข้อมูล</h2><p>ตรวจสอบชื่อ Sheet ใน Google Sheets ว่าชื่อ "products" หรือไม่</p></div>';
            return;
        }

        grid.innerHTML = products.map(p => {
            const displayImg = p.image_url ? p.image_url.split(',')[0].trim() : 'https://via.placeholder.com/400?text=No+Image';
            return `
            <div class="card">
                <div style="position:relative; width:100%; padding-top:100%; background:#222;">
                    <img src="${displayImg}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="card-body">
                    <h3 style="font-size:18px;">${p.name || 'ไม่มีชื่อ'}</h3>
                    <p style="color:#888;">Stock: ${p.stock || 0}</p>
                    <div class="price" style="color:#e60023; font-size:22px; font-weight:bold;">฿${Number(p.price).toLocaleString()}</div>
                </div>
            </div>`;
        }).join('');
    } catch (error) {
        grid.innerHTML = '<p style="text-align:center; color:red; width:100%;">❌ เชื่อมต่อ Google Sheets ไม่สำเร็จ</p>';
    }
}

document.addEventListener("DOMContentLoaded", renderProducts);
