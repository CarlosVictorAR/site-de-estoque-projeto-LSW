//construtora de inventario
let arrayOfItems = JSON.parse(localStorage.getItem('items')) || [];
function criarInventario(itens){
    let inventoryTable = document.querySelector('.inventory-table');
    inventoryTable.innerHTML = '';
    let thead = document.createElement('thead');
    let trHead = document.createElement('tr');
    let listHeader = ['Produto','Categoria','Quantidade','Preço','Status'];
    for (let headerText of listHeader){
        let th = document.createElement('th');
        th.textContent = headerText;
        trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    let tbody = document.createElement('tbody');
    for (let item of itens){
        let trBody = document.createElement('tr');
        let tdName = document.createElement('td');
        tdName.textContent = item.name;
        trBody.appendChild(tdName);

        let tdCategory = document.createElement('td');

        tdCategory.textContent = item.category.split('-').join(' ');
        tdCategory.style.textTransform = 'capitalize';

        trBody.appendChild(tdCategory);

        let tdQuantity = document.createElement('td');
        tdQuantity.textContent = item.quantity;
        trBody.appendChild(tdQuantity);

        let tdPrice = document.createElement('td');
        tdPrice.textContent = item.price;
        trBody.appendChild(tdPrice);    
        
        let tdStatus = document.createElement('td');
        if (item.quantity > 5){
            tdStatus.textContent = 'Em Estoque';
        } else if (item.quantity <= 5 && item.quantity > 0){
            tdStatus.textContent = 'Estoque Baixo';
        } else {
            tdStatus.textContent = 'Fora de Estoque';
        }
        trBody.appendChild(tdStatus);
        tbody.appendChild(trBody);

        
    }
    inventoryTable.appendChild(thead);
    inventoryTable.appendChild(tbody);
};


let searchInput = document.querySelector('.search-input');
searchInput.addEventListener('keyup', () => {
    let filter = searchInput.value.toLowerCase();
    let filteredItems = arrayOfItems.filter(item => 
        item.name.toLowerCase().includes(filter) || 
        item.category.toLowerCase().includes(filter)
    );
    criarInventario(filteredItems);
});
criarInventario(arrayOfItems);

