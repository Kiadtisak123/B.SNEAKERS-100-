const API_URL = "https://script.google.com/macros/s/AKfycbxdGPcw23_02YxGxOQyhMfompZxt_f-5BJW0ZYgRQ4LkuJjzDEsFu97EkYnk3BPOh_W/exec";

async function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    try {
        const response = await fetch(`${API_URL}?t=${new Date().getTime()}`);
        const products = await response.json();
        
        grid.innerHTML = products.map(p => {
            const displayImg = p.image_url ? p.image_url.split(',')[0] : 'https://via.placeholder.com/400?text=No+Image';
            return `
            <div class="card">
                <img src="${displayImg}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400?text=No+Image'">
                <div class="card-body">
                    <h3>${p.name || 'ไม่มีชื่อสินค้า'}</h3>
                    <p style="color:#888; font-size:12px;">Size: ${p.sizes || '-'}</p>
                    <div class="price">฿${Number(p.price || 0).toLocaleString()}</div>
                </div>
            </div>`;
        }).join('');
    } catch (error) {
        console.error("Error:", error);
        grid.innerHTML = '<p style="text-align:center; padding:20px;">ไม่สามารถโหลดสินค้าได้</p>';
    }
}

renderProducts();
