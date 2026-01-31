export { addItemtoArray, validateItemInput};
import { category, value } from './category.js';

function addItemtoArray(ItemClass, arrayOfItems) {
    let id = parseInt(localStorage.getItem('codigo')) || 1;
    localStorage.setItem('codigo', parseInt(id) + 1);
    let name = document.querySelector('#item-name').value;
    let category = document.querySelector('#category').value;
    let quantity = parseInt(document.querySelector('#quantity').value);
    let price = parseFloat(
        (document.querySelector('#unit-price').value || '').toString().replace(',', '.')
    );
    let entryDate = new Date().toLocaleDateString("pt-BR");
    let newItem = new ItemClass(id, name, category, quantity, price, entryDate);
    arrayOfItems.push(newItem);
    localStorage.setItem('items', JSON.stringify(arrayOfItems));
    Swal.fire({
        icon: 'success',
        title: 'Item adicionado com sucesso!',
    });
    document.querySelector('#item-name').value = "";
}


function addCategoriesToSelect(category, value) {
    let categorySelect = document.querySelector('#category');
    for (let cat of category){
        let option = document.createElement('option');
        option.value = value[category.indexOf(cat)];
        option.textContent = cat;
        categorySelect.appendChild(option);
    }
}
addCategoriesToSelect(category, value);
function validateItemInput(){
    let name = document.querySelector('#item-name').value;
    let quantity = parseInt(document.querySelector('#quantity').value);
    let price = parseFloat(
        (document.querySelector('#unit-price').value || '').toString().replace(',', '.')
    );
    let category = document.querySelector('#category').value;
    let isValid = true;
    if (name.trim() === "") {
        document.querySelector('.error-item-name').textContent = "Nome do item não pode estar vazio.";
        isValid = false;
    }
    if (quantity <= 0 || isNaN(quantity)) {
        document.querySelector('.error-quantity').textContent = "Quantidade deve ser um número positivo.";
        isValid = false;
    }
    if (price <= 0 || isNaN(price)) {
        document.querySelector('.error-unit-price').textContent = "Preço deve ser um número positivo.";
        isValid = false;
    }
    if (category === "") {
        document.querySelector('.error-category').textContent = "Por favor, selecione uma categoria válida.";
        isValid = false;
    }
    if (name.trim() !== "") {
        document.querySelector('.error-item-name').textContent = "";
    }
    if (quantity > 0 && !isNaN(quantity)) {
        document.querySelector('.error-quantity').textContent = "";
    }
    if (price > 0 && !isNaN(price)) {
        document.querySelector('.error-unit-price').textContent = "";
    }
    if (category !== "") {
        document.querySelector('.error-category').textContent = "";
    }
    return isValid;
}
