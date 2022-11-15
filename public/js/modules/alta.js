import productController from '/js/controllers/products.js';

console.log('🆗: Módulo PageAlta cargado.');

class PageAlta {

    static form 
    static fields
    static btnCreate
    static btnUpdate
    static btnCancel

    static validators = {
        'name' : /^[A-ZÁÉÍÓÚÑ][a-z0-9áéíóúüñÁÉÍÓÚÜÑ\.,'"\ \/\-_\\]{0,30}$/, //Debe comenzar con mayúscula/ Máximo 30 caracteres / Puede contener letras y/o números / Obligatorio
        'price' : /^[0-9]{1,6}\.?[0-9]{1,2}$/,// Ingresar sólo números / Utilizar punto para separar los centavos / Maximo 2 decimales
        'stock' : /^[1-9]{1,5}$/, //Debe ser mayor o igual a 0 / Ingresar sólo números sin decimales
        'brand' : /^[A-ZÁÉÍÓÚÑ][a-z0-9áéíóúüñÁÉÍÓÚÜÑ\.,'"\ \/\-_\\]{0,40}$/, //Debe comenzar con mayúscula/ Máximo 30 caracteres / Puede contener letras y/o números / Obligatorio
        'ageFrom' : /^[0-9]{0,2}$/,
        'ageUntil' : /^[0-9]{0,2}$/,
        'shortDescription' : /^.{0,80}$/,
        'longDescription' : /^.{0,2000}$/,
        'mail' : /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/,
    };

    static emptyForm() {
        PageAlta.fields.forEach(field => field.value = '');
    }

    static completeForm(product) {
        PageAlta.fields.forEach(field => {
            field.value = product[field.name];
        });
    }

    static validate(value, validator) {
        console.log(value);
        return validator.test(value);
    }

    static campos = {
        'name': false,
        'price': false,
        'stock': false,
        'brand': false,
        'ageFrom' : false,
        'ageUntil' : false,
        'shortDescription' :false,
        'longDescription' : false,
        'mail' : false
    }

    static setClassValidate (expresion, input, campo) {
			
        if(expresion.test(input.value)){
            document.getElementById(`group__${campo}`).classList.remove('main-form__grupo-incorrecto');
            document.getElementById(`group__${campo}`).classList.add('main-form__grupo-correcto');
            document.querySelector(`#group__${campo} .main-form__input-error`).classList.remove('main-form__input-error-activo');
            PageAlta.campos[campo] = true;
        } else {
            document.getElementById(`group__${campo}`).classList.add('main-form__grupo-incorrecto');
            document.getElementById(`group__${campo}`).classList.remove('main-form__grupo-correcto');
            document.querySelector(`#group__${campo} .main-form__input-error`).classList.add('main-form__input-error-activo');
            PageAlta.campos[campo] = false;
        }
    }

    static validateForm() {
        let allValidated = true;
        const productToSave = {};
        console.log('\n\n');

        for (const field of PageAlta.fields) {
            console.log(field);
            const validated = PageAlta.validate(field.value, PageAlta.validators[field.name]);
            
            PageAlta.setClassValidate(PageAlta.validators[field.name], field, field.name);
            
            console.log(field.name, validated);
            if (!validated) {
                allValidated = false;
                break;
            } else {
                productToSave[field.name] = field.value;
            }
        }
        console.log('allValidated:', allValidated);

        if (!allValidated) {
            return false;
        }
        return productToSave;
    }

    static async saveProduct(product) {
        const savedProduct = await productController.saveProduct(product);
        const products = await productController.getProducts();
        console.log(`Ahora hay ${products.length} productos`);    
        //PageAlta.renderTemplateTable(products);
        console.log(savedProduct);
        return savedProduct;
    }

    static async updateProduct(product) {
        const updatedProduct = await productController.updateProduct(product.id, product);
        const products = await productController.getProducts();
        console.log(`Ahora hay ${products.length} productos`); 
        console.log(updatedProduct);   
        //PageAlta.renderTemplateTable(products);
        return updatedProduct;
    }

    static async addFormEvents() {
        
        PageAlta.form.addEventListener('submit', async e => {
            e.preventDefault();

            const productToSave = PageAlta.validateForm();
            if (productToSave) {
                const savedProduct = await PageAlta.saveProduct(productToSave);
                console.log('savedProduct:', savedProduct);
                PageAlta.emptyForm();
            }
        });

        this.btnCancel.addEventListener('click', e => {
            PageAlta.emptyForm();
            PageAlta.btnCreate.disabled = false;
            PageAlta.btnUpdate.disabled = true;
            PageAlta.btnCancel.disabled = true;
        });

        this.btnUpdate.addEventListener('click', async e => {
            const productToSave = PageAlta.validateForm();
            if (productToSave) {
                const updatedProduct = await PageAlta.updateProduct(productToSave);
                console.log('updatedProduct:', updatedProduct);
            }
            PageAlta.emptyForm();
            PageAlta.btnCreate.disabled = false;
            PageAlta.btnUpdate.disabled = true;
            PageAlta.btnCancel.disabled = true;

        });
    }

    static async renderTemplateTable(products) {
        const hbsFile = await fetch('templates/products-table.hbs').then(r => r.text());
        const template = Handlebars.compile(hbsFile);
        const html = template({ products });
        document.querySelector('.products-table__container').innerHTML = html;
    }

    static async addTableEvents() {
        const deleteProduct = async (e) => {
            if (!confirm('¿Estás seguro de querer eliminar el producto?')) {
                return;
            }
            const row = e.target.closest('tr');
            const id = row.dataset.id;
            const deletedProduct = await productController.deleteProduct(id);
            console.log('Producto eliminado:', deletedProduct);
            // row.remove();
            const products = await productController.getProducts();
            console.log(`Aún quedan ${products.length} productos`);    
            PageAlta.renderTemplateTable(products);
        };

        const editProduct = async e => {
            const row = e.target.closest('tr');
            const id = row.dataset.id;
            const name = row.querySelector('.products-table__name').innerHTML;
            const price = row.querySelector('.products-table__price').innerHTML;
            const description = row.querySelector('.products-table__description').innerHTML;
            const productToEdit = {};
            productToEdit.id = id;
            productToEdit.name = name;
            productToEdit.price = price;
            productToEdit.shortDescription = description;
            PageAlta.completeForm(productToEdit);
            PageAlta.btnCreate.disabled = true;
            PageAlta.btnUpdate.disabled = false;
            PageAlta.btnCancel.disabled = false;
        };

        document.querySelector('.products-table__container').addEventListener('click', e => {
            if (e.target.classList.contains('products-table__btn-delete')) {
                deleteProduct(e);
                return;
            }
            if (e.target.classList.contains('products-table__btn-edit')) {
                editProduct(e);
                return;
            }
        });
    }

    static async init () {
        console.log('PageAlta.init()');

        PageAlta.form = document.querySelector('.main-form-product');
        PageAlta.fields = PageAlta.form.querySelectorAll('.main-form-product__input, textarea');
        PageAlta.btnCreate = PageAlta.form.querySelector('#btn-create');
        PageAlta.btnUpdate = PageAlta.form.querySelector('#btn-update');
        PageAlta.btnCancel = PageAlta.form.querySelector('#btn-cancel');

        PageAlta.addFormEvents();
    
        const products = await productController.getProducts();
        console.log(`Se encontraron ${products.length} productos`);
        
        await PageAlta.renderTemplateTable(products);
        PageAlta.addTableEvents();
    }
}

export default PageAlta;
