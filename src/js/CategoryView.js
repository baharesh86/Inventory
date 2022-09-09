import Storage from "./Storage.js";

const toggleAddCategory = document.querySelector(".toggle-add-category");
const addCategoryFormBg = document.querySelector(".add-category-form-bg");
const addCategoryForm = document.querySelector(".add-category-form");
const addedCategoryMassage = document.querySelector(".added-massage");

const categoryTitle = document.querySelector("#category-title");

const addNewCategoryBtn = document.querySelector(".add-category-btn");
const cancelAddCategory = document.querySelector(".cancel-btn");
const pError = document.querySelector(".category-input-error");



class CategoryView {
    constructor() {
        addNewCategoryBtn.addEventListener("click", (e) => { this.addNewCategory(e) });
        toggleAddCategory.addEventListener("click", (e) => { this.showAddCategory(e) });
        cancelAddCategory.addEventListener("click", (e) => { this.closeAddCategory(e) });
        this.categories = [];
    }

    addNewCategory(e) {
        e.preventDefault();
        let title = categoryTitle.value;

        // check input
        if (!title) {
            pError.style.display = "block";
            return;
        };

        // save category to local storage
        Storage.saveCategory({ title });

        // update local storage
        this.categories = Storage.getAllCategories();

        // update DOM
        this.createCategoriesList();

        // reset
        categoryTitle.value = "";
        addCategoryForm.style.display = "none";
        addCategoryFormBg.style.display = "none";
        pError.style.display = "none";

        // show add category massage
        addedCategoryMassage.innerHTML = "Category added successfully !";
        addedCategoryMassage.style.transform = "translateX(0%)"
        setTimeout(() => {
            addedCategoryMassage.style.transform = "translateX(-200%)"
        }, 4000);
    }

    setApp() {
        this.categories = Storage.getAllCategories();
        categoryTitle.value = "";
    }

    createCategoriesList() {
        let result = `<option value="defaule" selected disabled>Select a category :</option>`;
        this.categories.forEach((category) => {
            result += `<option value="${category.id}">${category.title}</option>`
        });
        const categoriesDOM = document.querySelector("#product-category");
        categoriesDOM.innerHTML = result;
    }

    showAddCategory(e) {
        e.preventDefault();
        addCategoryFormBg.style.display = "flex";
        addCategoryForm.style.display = "flex";
    }

    closeAddCategory(e) {
        e.preventDefault();
        addCategoryFormBg.style.display = "none";
        addCategoryForm.style.display = "none";
        pError.style.display = "none";
    }
}

export default new CategoryView();