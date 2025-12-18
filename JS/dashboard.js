// array global dos produtos

let arrayOfItems = JSON.parse(localStorage.getItem('items')) || [];

// atualiza os dados do dashboard

let totalItems = document.querySelector('.total-items');
let lowStockItems = document.querySelector('.low-stock-items');
let totalStockValue = document.querySelector('.total-stock-value');


function updateDashboard(){
    let totalCount = arrayOfItems.length;
    let lowStockCount = arrayOfItems.filter(item => item.quantity > 0 && item.quantity <= 5).length;
    let stockValue = arrayOfItems.reduce((total, item) => total + (item.quantity * item.price), 0);
    
    totalItems.textContent = totalCount;
    lowStockItems.textContent = lowStockCount;
    totalStockValue.textContent = `R$ ${stockValue.toFixed(2).toString().replace('.', ',')}`;
    
}

updateDashboard();