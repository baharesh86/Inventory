import CategoryView from "./CategoryView.js";
import ProductView from "./ProductView.js";

document.addEventListener("DOMContentLoaded", () => {
    // setApp
    CategoryView.setApp();
    ProductView.setApp();

    // caetgory view
    CategoryView.createCategoriesList();
    ProductView.createdProductsList(ProductView.products);

    // search products
    ProductView.searchProducts();
});