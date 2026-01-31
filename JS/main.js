import { addItemtoArray, validateItemInput } from './addItem.js';
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

// Tema escuro
const themeToggle = document.querySelector('.theme-toggle');
const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

function applyTheme(isDark) {
    document.body.classList.toggle('theme-dark', isDark);

    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', String(isDark));
        const icon = themeToggle.querySelector('i');
        const label = themeToggle.querySelector('span');

        if (icon) {
            icon.className = isDark ? 'bx bx-sun' : 'bx bx-moon';
        }

        if (label) {
            label.textContent = isDark ? 'Modo claro' : 'Modo escuro';
        }
    }
}

applyTheme(storedTheme ? storedTheme === 'dark' : prefersDark);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDarkNow = !document.body.classList.contains('theme-dark');
        applyTheme(isDarkNow);
        localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
    });
}

window.addEventListener('storage', (event) => {
    if (event.key === 'theme') {
        applyTheme(event.newValue === 'dark');
    }
});

 // Configura botão de adicionar (se existir)
    const addButton = document.querySelector('.add-button');
    if (addButton) {
        addButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateItemInput(arrayOfItems)) {
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
