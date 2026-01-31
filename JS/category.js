let category = JSON.parse(localStorage.getItem('categories')) || [];
let value = JSON.parse(localStorage.getItem('value')) || [];


function addCategory(newCategory,valueItem) {
    category.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(category));
    value.push(valueItem);
    localStorage.setItem('value', JSON.stringify(value));   
}

//inicia as categorias padroes caso nao existam
if (category.length === 0){
    addCategory('Selecione uma categoria','');
    addCategory('Eletronicos','eletronicos');
    addCategory('Roupas','roupas');
    addCategory('Casa & Jardim','casa-e-jardim');
    addCategory('Livros','livros')
    addCategory('Brinquedos','brinquedos');
}
export {category, value};