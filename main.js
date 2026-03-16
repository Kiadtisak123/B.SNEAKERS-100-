// URL สำหรับเชื่อมต่อกับ Google Apps Script ของคุณ
const API_URL = "https://script.google.com/macros/s/AKfycbylpGWJGupVu4BGwdYY7Riq7HbjxtwQdDDDdE9Q3BfU9PBzl99bfVZDvaBH-3g-yaUM/exec";

async function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    try {
        // ดึงข้อมูลสินค้าจากแท็บ products ใน Google Sheets
        const response = await fetch(API_URL + "?sheet=products");
        const products = await response.json();
        
        // วาดสินค้าลงในตาราง
        grid.innerHTML = products.map(p => `
            <div class="card" onclick="goToDetail('${p.id}')">
                <img src="${p.image_url}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400?text=No+Image'">
                <div class="card-body">
                    <h3>${p.name}</h3>
                    <p style="color:#888; font-size:12px;">Size: ${p.sizes}</p>
                    <div class="price">฿${Number(p.price).toLocaleString()}</div>
                </div>
            </div>`).join('');
            
        // เก็บข้อมูลลงในเครื่องเพื่อสำรองไว้
        localStorage.setItem('sneaker_prods', JSON.stringify(products));
    } catch (error) {
        console.error("ดึงข้อมูลไม่สำเร็จ:", error);
        grid.innerHTML = '<p style="text-align:center; padding:20px;">ไม่สามารถเชื่อมต่อฐานข้อมูลได้ในขณะนี้</p>';
    }
}

// เรียกใช้ฟังก์ชันทันทีที่โหลดหน้าเว็บ
renderProducts();