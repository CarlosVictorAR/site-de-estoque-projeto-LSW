import {category,value} from './category.js';

//validadora de input do edit
function validateItemInputEdit(name, category, quantity, price){
    let isValid = true;
    if (name.value.trim() === "") {
        isValid = false;
    }
    const quantityValue = parseFloat(quantity.value);
    if (quantityValue <= 0 || isNaN(quantityValue)) {
        isValid = false;
    }
    const priceValue = parseFloat(price.value);
    if (priceValue <= 0 || isNaN(priceValue)) {
        isValid = false;
    }
    if (category.value === "") {
        isValid = false;
    }
    return isValid;
};

//construtora de inventario
let arrayOfItems = JSON.parse(localStorage.getItem('items')) || [];
function criarInventario(itens){
    let inventoryTable = document.querySelector('.inventory-table');
    inventoryTable.innerHTML = '';
    let thead = document.createElement('thead');
    let trHead = document.createElement('tr');
    let listHeader = ['Produto','Categoria','Quantidade','Preço','Status','Editar'];
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

        let tdEdit = document.createElement('td');
        let editButton = document.createElement('button');
        editButton.textContent = '✏️';
        editButton.classList.add('btn-edit');
        editButton.dataset.itemId = arrayOfItems.indexOf(item);
        editButton.addEventListener('click', () => {
            //cria a caixa de editar
            let index = editButton.dataset.itemId;
            let editBox = document.createElement('div');
            editBox.classList.add('edit-box');

            let nameLabel = document.createElement('label');
            nameLabel.textContent = 'Nome do Item ';
            nameLabel.classList.add('forms-edit-label');
            let nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = arrayOfItems[index].name;
            nameInput.classList.add('forms-edit');
            nameLabel.appendChild(nameInput);
            editBox.appendChild(nameLabel);

            let categoryLabel = document.createElement('label');
            categoryLabel.textContent = 'Categoria ';
            categoryLabel.classList.add('forms-edit-label');
            let categorySelect = document.createElement('select');
            categorySelect.classList.add('forms-edit');
            let categories = category;
            let values = value;
            for (let category of categories){
                let option = document.createElement('option');
                option.value = values[categories.indexOf(category)];
                option.textContent = category;
                categorySelect.appendChild(option);
            }
            categorySelect.value = arrayOfItems[index].category;
            categoryLabel.appendChild(categorySelect);
            editBox.appendChild(categoryLabel);

            let quantityLabel = document.createElement('label');
            quantityLabel.textContent = 'Quantidade ';
            quantityLabel.classList.add('forms-edit-label');
            let quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = arrayOfItems[index].quantity;
            quantityInput.classList.add('forms-edit');
            quantityLabel.appendChild(quantityInput);
            editBox.appendChild(quantityLabel);

            let priceLabel = document.createElement('label');
            priceLabel.textContent = 'Preço Unitário (R$): ';
            priceLabel.classList.add('forms-edit-label');
            let priceInput = document.createElement('input');
            priceInput.type = 'number';
            priceInput.value = arrayOfItems[index].price;
            priceInput.classList.add('forms-edit');
            priceLabel.appendChild(priceInput);
            editBox.appendChild(priceLabel);

            let saveButton = document.createElement('button');
            saveButton.textContent = 'Salvar';
            saveButton.classList.add('forms-edit');
            saveButton.addEventListener('click', () => {
                if (validateItemInputEdit(nameInput, categorySelect, quantityInput, priceInput)){
                        arrayOfItems[index].name = nameInput.value;
                        arrayOfItems[index].category = categorySelect.value;
                        arrayOfItems[index].quantity = parseInt(quantityInput.value);
                        arrayOfItems[index].price = parseFloat(priceInput.value);
                        localStorage.setItem('items', JSON.stringify(arrayOfItems));
                        criarInventario(arrayOfItems);
                        document.body.removeChild(editBox);
                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Erro ao salvar. Verifique os dados inseridos.",
                    })
                }
            });
            editBox.appendChild(saveButton);
            document.body.appendChild(editBox);

            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.classList.add('delete-edit');
            deleteButton.addEventListener('click', () => {
                arrayOfItems.splice(index, 1);
                localStorage.setItem('items', JSON.stringify(arrayOfItems));
                criarInventario(arrayOfItems);
                document.body.removeChild(editBox);
            });
            editBox.appendChild(deleteButton);
        });
        tdEdit.appendChild(editButton);
        trBody.appendChild(tdEdit);

    }
    inventoryTable.appendChild(thead);
    inventoryTable.appendChild(tbody);
};


let searchInput = document.querySelector('.search-input');
const inventoryHeader = document.querySelector('.inventory-header');

let filterTypeSelect;
let filterValueInput;
let filterButton;
let clearButton;

if (inventoryHeader) {
    const filtersContainer = document.createElement('div');
    filtersContainer.classList.add('filters');

    const filterTypeGroup = document.createElement('div');
    filterTypeGroup.classList.add('filter-group');
    const filterTypeLabel = document.createElement('label');
    filterTypeLabel.textContent = 'Filtrar por';
    filterTypeSelect = document.createElement('select');
    filterTypeSelect.innerHTML = `
        <option value="name">Nome</option>
        <option value="category">Categoria</option>
        <option value="price">Preço (máximo)</option>
        <option value="low-stock">Estoque baixo</option>
    `;
    filterTypeGroup.appendChild(filterTypeLabel);
    filterTypeGroup.appendChild(filterTypeSelect);

    const filterValueGroup = document.createElement('div');
    filterValueGroup.classList.add('filter-group');
    const filterValueLabel = document.createElement('label');
    filterValueLabel.textContent = 'Valor';
    filterValueInput = document.createElement('input');
    filterValueInput.type = 'text';
    filterValueInput.placeholder = 'Digite o nome';
    filterValueGroup.appendChild(filterValueLabel);
    filterValueGroup.appendChild(filterValueInput);

    const filterActionGroup = document.createElement('div');
    filterActionGroup.classList.add('filter-group');
    const filterActionLabel = document.createElement('label');
    filterActionLabel.textContent = 'Ações';
    const actionWrapper = document.createElement('div');
    actionWrapper.style.display = 'flex';
    actionWrapper.style.gap = '10px';

    filterButton = document.createElement('button');
    filterButton.classList.add('btn', 'btn-primary');
    filterButton.type = 'button';
    filterButton.textContent = 'Filtrar';

    clearButton = document.createElement('button');
    clearButton.classList.add('btn', 'btn-secondary');
    clearButton.type = 'button';
    clearButton.textContent = 'Limpar';

    actionWrapper.appendChild(filterButton);
    actionWrapper.appendChild(clearButton);
    filterActionGroup.appendChild(filterActionLabel);
    filterActionGroup.appendChild(actionWrapper);

    filtersContainer.appendChild(filterTypeGroup);
    filtersContainer.appendChild(filterValueGroup);
    filtersContainer.appendChild(filterActionGroup);

    inventoryHeader.appendChild(filtersContainer);
}

function applyFilters() {
    let filteredItems = [...arrayOfItems];

    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (searchTerm) {
        filteredItems = filteredItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );
    }

    const filterType = filterTypeSelect ? filterTypeSelect.value : '';
    const filterValue = filterValueInput ? filterValueInput.value.trim().toLowerCase() : '';

    if (filterType === 'name' && filterValue) {
        filteredItems = filteredItems.filter(item =>
            item.name.toLowerCase().includes(filterValue)
        );
    }

    if (filterType === 'category' && filterValue) {
        filteredItems = filteredItems.filter(item =>
            item.category.toLowerCase().includes(filterValue)
        );
    }

    if (filterType === 'price' && filterValue) {
        const maxPrice = parseFloat(filterValue.replace(',', '.'));
        if (!Number.isNaN(maxPrice)) {
            filteredItems = filteredItems.filter(item =>
                Number(item.price) <= maxPrice
            );
        }
    }

    if (filterType === 'low-stock') {
        filteredItems = filteredItems.filter(item =>
            item.quantity > 0 && item.quantity <= 5
        );
    }

    criarInventario(filteredItems);
}

function updateFilterInput() {
    if (!filterTypeSelect || !filterValueInput) return;

    if (filterTypeSelect.value === 'low-stock') {
        filterValueInput.value = '';
        filterValueInput.disabled = true;
        filterValueInput.placeholder = 'Sem valor';
        return;
    }

    filterValueInput.disabled = false;

    if (filterTypeSelect.value === 'price') {
        filterValueInput.type = 'number';
        filterValueInput.placeholder = 'Ex.: 50.00';
        return;
    }

    filterValueInput.type = 'text';
    filterValueInput.placeholder = filterTypeSelect.value === 'category'
        ? 'Digite a categoria'
        : 'Digite o nome';
}

if (searchInput) {
    searchInput.addEventListener('keyup', applyFilters);
}

if (filterTypeSelect) {
    filterTypeSelect.addEventListener('change', () => {
        updateFilterInput();
        applyFilters();
    });
}

if (filterButton) {
    filterButton.addEventListener('click', applyFilters);
}

if (clearButton) {
    clearButton.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (filterTypeSelect) filterTypeSelect.value = 'name';
        if (filterValueInput) filterValueInput.value = '';
        updateFilterInput();
        criarInventario(arrayOfItems);
    });
}

updateFilterInput();
criarInventario(arrayOfItems);