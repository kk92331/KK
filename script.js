// Inicjalizacja ikon Lucide
lucide.createIcons();

// Animacje przewijania
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('revealed'); });
}, { threshold: 0.1 });
document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

// Zarządzanie Magazynem
let warehouseData = [
    { id: 1, name: "Sektor A1", size: 500 }
];
const MAX_CAPACITY = 5000;

function renderWarehouse() {
    const grid = document.getElementById('warehouse-grid');
    const freeSpaceEl = document.getElementById('free-space');
    const bar = document.getElementById('progress-bar');
    
    if(!grid) return;

    const used = warehouseData.reduce((acc, item) => acc + item.size, 0);
    const free = MAX_CAPACITY - used;
    
    freeSpaceEl.innerText = free;
    bar.style.width = (used / MAX_CAPACITY * 100) + '%';
    
    grid.innerHTML = warehouseData.map(item => `
        <div class="unit">
            <strong>${item.name}</strong><br>${item.size} m²
            <button onclick="removeUnit(${item.id})">×</button>
        </div>
    `).join('');
}

function addUnit() {
    const nameIn = document.getElementById('itemName');
    const sizeIn = document.getElementById('itemSize');
    const size = parseInt(sizeIn.value);

    if(!nameIn.value || isNaN(size)) return alert("Wypełnij dane!");
    
    const used = warehouseData.reduce((acc, item) => acc + item.size, 0);
    if(used + size > MAX_CAPACITY) return alert("Brak wolnego miejsca!");

    warehouseData.push({ id: Date.now(), name: nameIn.value, size: size });
    nameIn.value = ''; sizeIn.value = '';
    renderWarehouse();
}

function removeUnit(id) {
    warehouseData = warehouseData.filter(i => i.id !== id);
    renderWarehouse();
}

// Start
renderWarehouse();