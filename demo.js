const WarehouseApp = {
    limit: 5000,
    data: JSON.parse(localStorage.getItem('wh_v3')) || [{id: 1, name: 'Sektor A', size: 400}],

    init() {
        const btn = document.getElementById('addItem');
        if(btn) btn.addEventListener('click', () => this.add());
        this.render();
    },

    add() {
        const n = document.getElementById('itemName').value;
        const s = parseInt(document.getElementById('itemSize').value);
        if(!n || isNaN(s)) return alert('Wpisz nazwę i metraż');
        
        this.data.push({id: Date.now(), name: n, size: s});
        this.save();
    },

    delete(id) {
        this.data = this.data.filter(i => i.id !== id);
        this.save();
    },

    save() {
        localStorage.setItem('wh_v3', JSON.stringify(this.data));
        this.render();
    },

    render() {
        const grid = document.getElementById('warehouseGrid');
        if(!grid) return;
        const used = this.data.reduce((acc, val) => acc + val.size, 0);
        
        document.getElementById('free-space').innerText = (this.limit - used) + ' m²';
        document.getElementById('progress-inner').style.width = (used/this.limit*100) + '%';
        
        grid.innerHTML = this.data.map(i => `
            <div class="unit">
                <strong>${i.name}</strong><br>${i.size} m²
                <button onclick="WarehouseApp.delete(${i.id})">×</button>
            </div>
        `).join('');
    }
};

window.WarehouseApp = WarehouseApp;
document.addEventListener('DOMContentLoaded', () => WarehouseApp.init());