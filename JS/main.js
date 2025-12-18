// Classe Item
class itemClass {
    constructor(id, name, category, quantity, price, dateEntry) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.price = price;
        this.dateEntry = dateEntry;
    }
}
// Variável global para itens
let arrayOfItems = JSON.parse(localStorage.getItem('items')) || [];

 // Configura botão de adicionar (se existir)
    const addButton = document.querySelector('.add-button');
    if (addButton) {
        addButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateItemInput()) {
                addItemtoArray(itemClass, arrayOfItems);
            }
        });
    }

      // Configura botões do dashboard (se existirem)
    const dashboardButtons = document.querySelectorAll('.dashboard-actions a');
    dashboardButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('Navegando para:', this.href);
        });
    });

// Menu ativo
function setActiveMenu() {
    const menuItems = document.querySelectorAll('.sidebar .item');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    menuItems.forEach(item => {
        const link = item.querySelector('a');
        const href = link.getAttribute('href').replace('./', '');
        item.classList.toggle('active', href === currentPage);
    });
}

    console.log('Sistema StockCloud carregado');

        // Configura menu ativo
        setActiveMenu();
