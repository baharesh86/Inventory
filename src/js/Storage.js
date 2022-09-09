export const products = [];
export const categories = [];


export default class Storage {
    static getAllCategories() {
        const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
        //  sort categories
        const sortedCategories = savedCategories.sort((a, b) => {
            return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1;
        });
        return sortedCategories;
    }

    static saveCategory(categoryToSave) {
        const savedCategories = this.getAllCategories();
        const existedItem = savedCategories.find((c) => { c.id === categoryToSave.id });
        if (existedItem) {
            // update(edit) category
            existedItem.title = categoryToSave.title;

        } else {
            // creat a new category
            categoryToSave.id = new Date().getTime();
            categoryToSave.createdAt = new Date().toISOString();
            savedCategories.push(categoryToSave);
        }
        localStorage.setItem("categories", JSON.stringify(savedCategories));
    }

    
    static getAllProducts(value = "newest") {
        const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
        return savedProducts.sort((a, b) => {
            if (value == "newest") {
                return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1;
            } else if (value == "oldest") {
                return new Date(a.createdAt) < new Date(b.createdAt) ? -1 : 1;
            }
        });
    }

    static saveProduct(productToSave) {
        const savedProducts = this.getAllProducts();
        const existedItem = savedProducts.find((p) =>  p.id == productToSave.id );
        if (existedItem) {
            // edit
            existedItem.title = productToSave.title;
            existedItem.quantity = productToSave.quantity;
            existedItem.category = productToSave.category;
        } else {
            // new
            productToSave.id = new Date().getTime();
            productToSave.createdAt = new Date().toISOString();
            savedProducts.push(productToSave);

        };
        localStorage.setItem("products", JSON.stringify(savedProducts));
    }

    static deleteProduct(id) {
        const savedProducts = this.getAllProducts();
        const filteredProducts = savedProducts.filter((product) => product.id !== parseInt(id));
        localStorage.setItem("products", JSON.stringify(filteredProducts));
    }
}