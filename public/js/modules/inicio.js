import productController from '/js/controllers/products.js';
console.log('🆗: Módulo PageInicio cargado.');

class PageInicio {

    static cart = [];

    static async renderTemplateCards(products) {
        const hbsFile = await fetch('templates/inicio.hbs').then(r => r.text());
        const template = Handlebars.compile(hbsFile);
        const html = template({ products });
        document.querySelector('.cards-container').innerHTML = html;
    }

    static async renderTemplateCart(cart) {
        const hbsFile = await fetch('templates/cart.hbs').then(r => r.text());
        const template = Handlebars.compile(hbsFile);
        const html = template({cart});
        document.querySelector('.cart-modal__render').innerHTML = html;

        console.log('renderizando carrito');
    }

    static addToCart(product) {
        
        if(!PageInicio.cart.filter(prod => prod.id == product.id).length) {
            product.quantity = 1
            PageInicio.cart.push(product);
        }
        else {
            let productCart = PageInicio.cart.find(prod => prod.id == product.id)
            productCart.quantity++
        }
    }

    static async init () {
        console.log('PageInicio.init()');
        
        const products = await productController.getProducts();
        console.log(`Se encontraron ${products.length} productos`);
        
        await PageInicio.renderTemplateCards(products);

        PageInicio.renderTemplateCart(this.cart);

        
        document.querySelector('.cards-container').addEventListener('click', async e => {

            //Funcion para agregar al carrito
            const id= e.target.id;
            const productGet = await productController.getProduct(id);

            const product = {
                name: productGet.name,
                image: productGet.image,
                price: productGet.price,
                quantity: 1,
                id: productGet.id
            }

            PageInicio.addToCart(product)
        

            //Renderizo el carrito
            PageInicio.renderTemplateCart(PageInicio.cart);
        });
        
    }
}

export default PageInicio;


    //VARIABLES Modal
    const _CartBtn = document.querySelector('.img-cart-button');
    const _ModalContainer = document.querySelector('.cart-modal-container');
    const _CartModalClose = document.querySelector('.cart-modal__close');

    //Evento Mostrar Carrito
    _CartBtn.addEventListener('click', e =>{
        e.target.classList.toggle('main-header__cart-button-container--press');
        _ModalContainer.classList.toggle('cart-modal-container--show');
        
    });

    //Evento tecla escape cierra modal
    document.addEventListener('keydown', e => {

        if(e.key == 'Escape'){
            _ModalContainer.classList.remove('cart-modal-container--show');
            _CartBtn.classList.remove('main-header__cart-button-container--press');
            return
        };
        
    });

    //Evento X cerrar modal
    _CartModalClose.addEventListener('click', e =>{
            _ModalContainer.classList.remove('cart-modal-container--show');
            _CartBtn.classList.remove('main-header__cart-button-container--press');
    });