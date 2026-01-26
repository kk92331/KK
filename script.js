// Konfiguracja Magazynu
const WAREHOUSE_CONFIG = {
    totalSquares: 100, // Ilość kratek w wizualizacji
    sqmPerSquare: 50,  // Ile m2 reprezentuje jedna kratka (np. 1 kratka = 50m2)
    pricePerSqm: 10,   // Cena za m2
    occupancyRate: 0.65 // Na start zajęte 65% (żeby nie było pusto)
};

let currentOccupancy = 0; // Stan bieżący w m2
const totalCapacity = WAREHOUSE_CONFIG.totalSquares * WAREHOUSE_CONFIG.sqmPerSquare;

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initWarehouse();
    updateInputListener();
});

// 1. Generowanie początkowego stanu magazynu
function initWarehouse() {
    const grid = document.getElementById('warehouse-grid');
    grid.innerHTML = ''; // Czyścimy

    // Obliczamy ile kratek ma być zajętych na start
    const occupiedSquares = Math.floor(WAREHOUSE_CONFIG.totalSquares * WAREHOUSE_CONFIG.occupancyRate);
    currentOccupancy = occupiedSquares * WAREHOUSE_CONFIG.sqmPerSquare;

    for (let i = 0; i < WAREHOUSE_CONFIG.totalSquares; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        
        // Losowo przydzielamy "zajęte" kratki
        if (i < occupiedSquares) {
            cell.classList.add('occupied');
            // Dodajemy losową klasę dla różnorodności wizualnej (symulacja różnych klientów)
            cell.classList.add(Math.random() > 0.5 ? 'client-a' : 'client-b');
            cell.title = "Miejsce zajęte przez klienta kontraktowego";
        } else {
            cell.classList.add('free');
            cell.title = "Wolna przestrzeń - Dostępna od zaraz";
        }
        
        grid.appendChild(cell);
    }

    updateStatusUI();
}

// 2. Nasłuchiwanie wpisywania, aby pokazać cenę dynamicznie
function updateInputListener() {
    const areaInput = document.getElementById('areaSize');
    const priceCard = document.getElementById('price-card');
    const totalPriceEl = document.getElementById('total-price');

    areaInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        if (val > 0) {
            priceCard.style.display = 'block';
            const cost = val * WAREHOUSE_CONFIG.pricePerSqm;
            totalPriceEl.textContent = cost.toLocaleString('pl-PL');
        } else {
            priceCard.style.display = 'none';
        }
    });
}

// 3. Główna funkcja: Dodawanie towaru
function calculateAndAdd() {
    const name = document.getElementById('goodsType').value;
    const size = parseInt(document.getElementById('areaSize').value);

    // Walidacja
    if (!name || !size) return alert("Wypełnij wszystkie pola!");
    
    const freeSpace = totalCapacity - currentOccupancy;
    if (size > freeSpace) {
        return alert(`Niestety, brakuje miejsca! Dostępne tylko ${freeSpace} m².`);
    }

    // Obliczamy ile kratek zajmie ten towar
    // Math.ceil - nawet mały towar zajmuje min. 1 kratkę w wizualizacji
    const squaresNeeded = Math.ceil(size / WAREHOUSE_CONFIG.sqmPerSquare);

    // Znajdź wolne kratki w DOM
    const cells = document.querySelectorAll('.grid-cell');
    let allocated = 0;

    // Animacja dodawania
    for (let cell of cells) {
        if (allocated >= squaresNeeded) break;
        
        if (!cell.classList.contains('occupied') && !cell.classList.contains('new-item')) {
            cell.classList.remove('free');
            cell.classList.add('new-item'); // Kolor niebieski
            cell.title = `TWÓJ TOWAR: ${name} (${size}m²)`;
            allocated++;
        }
    }

    // Aktualizacja zmiennych
    currentOccupancy += size;
    updateStatusUI();

    // Feedback dla użytkownika
    alert(`Sukces! Zarezerwowano ${size}m² dla: ${name}.\nSzacowany koszt: ${size * WAREHOUSE_CONFIG.pricePerSqm} PLN netto/msc.`);
    
    // Reset formularza (opcjonalnie)
    // document.getElementById('warehouseForm').reset();
    // document.getElementById('price-card').style.display = 'none';
}

// 4. Aktualizacja pasków postępu i tekstów
function updateStatusUI() {
    const percentage = Math.min(100, Math.round((currentOccupancy / totalCapacity) * 100));
    const freeSpace = totalCapacity - currentOccupancy;

    // Pasek
    document.getElementById('progress-fill').style.width = `${percentage}%`;
    
    // Kolor paska w zależności od zapełnienia
    const fillEl = document.getElementById('progress-fill');
    if(percentage > 90) fillEl.style.background = '#dc2626'; // Czerwony
    else if(percentage > 70) fillEl.style.background = '#f59e0b'; // Pomarańczowy
    else fillEl.style.background = 'linear-gradient(90deg, #2563eb, #1d4ed8)'; // Niebieski

    // Teksty
    document.getElementById('capacity-text').innerText = `${percentage}%`;
    document.getElementById('space-left-info').innerText = `Dostępne: ${freeSpace.toLocaleString()} m² z ${totalCapacity.toLocaleString()} m²`;
}