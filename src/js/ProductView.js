import Storage from "./Storage.js";

const productsNumber = document.querySelector(".products-number");

const productTitle = document.querySelector("#product-title");
const productCategory = document.querySelector("#product-category");
const productQuantiry = document.querySelector("#product-quantity");

const addNewProductBtn = document.querySelector(".add-product-btn");

const searchInput = document.querySelector("#search");
const sort = document.querySelector("#sort");

const addedProductMassage = document.querySelector(".added-massage");
const pError = document.querySelector(".product-input-error");



class ProductView {
    constructor() {
        addNewProductBtn.addEventListener("click", (e) => { this.addNewProduct(e) });
        this.products = [];
        searchInput.addEventListener("input", (e) => { this.searchProducts(e) });
        sort.addEventListener("click", (e) => { this.sortProducts(e) });
    }

    addNewProduct(e) {
        e.preventDefault();
        let title = productTitle.value;
        let quantity = productQuantiry.value;
        let category = productCategory.value;

        // check inputs
        if (!title || !category || !quantity) {
            pError.style.display = "flex";
            return;
        } else {
            // save product
            Storage.saveProduct({ title, quantity, category });
            this.products = Storage.getAllProducts();

            // update DOM 
            this.createdProductsList(this.products);
            productsNumber.innerText = this.products.length;
            pError.style.display = "none";

            // show add product massage
            addedProductMassage.innerHTML = "Product added successfully !";
            addedProductMassage.style.transform = "translateX(0%)"
            setTimeout(() => {
                addedProductMassage.style.transform = "translateX(-200%)"
            }, 4000);

            // reset 
            document.querySelector(".product-input-error").innerHTML = "";
            productTitle.value = "";
            productCategory.value = "";
            productQuantiry.value = "";
        }
    };

    setApp() {
        // reset values
        productTitle.value = "";
        productCategory.value = "";
        productQuantiry.value = "";
        searchInput.value = "";
        const value = sort.value;

        this.products = Storage.getAllProducts(value);
        this.createdProductsList(this.products);
        productsNumber.innerText = this.products.length;
        pError.style.display = "none";
    }

    createdProductsList(products) {
        let result = "";
        const productsDOM = document.querySelector(".products");

        if (products.length == 0) {
            productsDOM.innerHTML = result;
        } else {
            products.forEach((product) => {
                const selectedCategory = Storage.getAllCategories().find((category) => category.id == product.category);
                result += `
                <div class="product-item">
                <span class="product-item-title">${product.title}</span>
    
                <div class="product-item-details">
                    <span class="date">${new Date().toLocaleDateString('en-US')}</span>
                    <spna class="sort">${selectedCategory.title}</spna>
                    <span class="number">${product.quantity}</span>
                    <i class="menu-icon fa-solid fa-ellipsis-vertical" data-id="${product.id}">
                        <div class="display" data-id="${product.id}">
                            <span class="menu-item edit" data-id="${product.id}">Edit</span>
                            <span class="menu-item delete" data-id="${product.id}">Delete</span>
                        </div>
                    </i>
                </div>
               </div> 
                `;

                productsDOM.innerHTML = result;

                // get menu btns
                const menuBtns = [ ...document.querySelectorAll(".menu-icon") ];
                menuBtns.forEach((btn) => {
                    btn.addEventListener("click", () => { this.showMenu(btn) });
                });
            });
        }


    }

    searchProducts(e) {
        const value = e.target.value.trim().toLowerCase();
        let filteredProducts = this.products.filter((product) => product.title.toLowerCase().includes(value));
        if (filteredProducts.length == 0) {
            filteredProducts = "";
        }
        this.createdProductsList(filteredProducts);
    }

    sortProducts() {
        const value = sort.value;
        this.products = Storage.getAllProducts(value);
        this.createdProductsList(this.products);
    }

    // edit & delete product
    showMenu(btn) {
        const clickedBtn = btn.childNodes[ 1 ];
        clickedBtn.classList.toggle("menu-list");
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("menu-icon")) {
                return;
            }
            else {
                clickedBtn.classList.remove("menu-list");
            }
        });

        clickedBtn.addEventListener("click", (e) => { this.menuOptions(e) });
    }

    menuOptions(e) {
        if (e.target.classList.contains("edit")) {
            this.showEditForm(e.target);

        } else if (e.target.classList.contains("delete")) {
            this.deleteProduct(e);
        }
    }

    deleteProduct(e) {
        if (this.products.length == 1) {
            const productId = e.target.dataset.id;
            const productsDOM = document.querySelector(".products");
            productsDOM.innerHTML = "";
            productsNumber.innerText = 0;
            Storage.deleteProduct(productId);
            this.products = Storage.getAllProducts();
        }
        else {
            const productId = e.target.dataset.id;
            Storage.deleteProduct(productId);
            this.products = Storage.getAllProducts();
            this.createdProductsList(this.products);
            productsNumber.innerText = this.products.length;
        }
    }

    showEditForm(btn) {
        const product = this.products.find((product) => product.id == btn.dataset.id);
        const selectedCategory = Storage.getAllCategories().find((category) => category.id == product.category);
        const allCategories = Storage.getAllCategories();

        // show edit form
        const editFormContainer = document.querySelector(".edit-form-bg");
        const editForm = document.querySelector(".edit-form");
        const saveBtn = document.querySelector(".save-edits-btn");
        editFormContainer.style.display = "flex";
        editForm.style.display = "flex";
        saveBtn.dataset.id = btn.dataset.id;

        // set form inputs value
        document.querySelector(".item-title").value = product.title;
        document.querySelector("#item-quantity").value = product.quantity;
        let result = `<option value="${selectedCategory.id}">${selectedCategory.title}</option>`;

        allCategories.forEach((category) => {
            if (category.id == selectedCategory.id) {
                document.querySelector("#item-category").innerHTML = result;
            }
            else {
                result += `<option value="${category.id}">${category.title}</option>`;
            }
        });
        document.querySelector("#item-category").innerHTML = result;
        document.querySelector(".edit-form-date").textContent = new Date(product.createdAt).toLocaleDateString('en-US');

        // cancel or save edits
        document.querySelector(".cancel-edits-btn").addEventListener("click", (e) => { this.closeEditForm(e) });
        document.querySelector(".save-edits-btn").addEventListener("click", (e) => {
            this.saveEdits(e);
        });
    }

    closeEditForm(e) {
        e.preventDefault();
        const editFormContainer = document.querySelector(".edit-form-bg");
        const editForm = document.querySelector(".edit-form");
        editFormContainer.style.display = "none";
        editForm.style.display = "none";
    }

    saveEdits(e) {
        e.preventDefault();
        const productTitle = document.querySelector(".item-title").value;
        const productQuantity = document.querySelector("#item-quantity").value;
        const productCategory = document.querySelector("#item-category");
        const productCategoryValue = productCategory.options[ productCategory.selectedIndex ].value;

        const editedProduct = this.products.find((product) => product.id == e.target.dataset.id);
        editedProduct.title = productTitle;
        editedProduct.quantity = productQuantity;
        editedProduct.category = productCategoryValue;
        Storage.saveProduct(editedProduct);
        this.products = Storage.getAllProducts();
        this.createdProductsList(this.products);
        const editFormContainer = document.querySelector(".edit-form-bg");
        const editForm = document.querySelector(".edit-form");
        editFormContainer.style.display = "none";
        editForm.style.display = "none";
    }
}

export default new ProductView();