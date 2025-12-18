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