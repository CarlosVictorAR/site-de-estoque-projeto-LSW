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
            let categories = ['Eletronicos', 'Roupas', 'Casa & Jardim', 'Livros', 'Brinquedos'];
            let values = ['eletronicos', 'roupas', 'casa-e-jardim', 'livros', 'brinquedos'];
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
searchInput.addEventListener('keyup', () => {
    let filter = searchInput.value.toLowerCase();
    let filteredItems = arrayOfItems.filter(item => 
        item.name.toLowerCase().includes(filter) || 
        item.category.toLowerCase().includes(filter)
    );
    criarInventario(filteredItems);
});
criarInventario(arrayOfItems);