let cartCount = 0; //? Global variable which keeps track of the cart count(Your cart(0))
const cart = {}; //? Global variable object which stores product quantities based on their id
const productPrice = {}; //? Global variable object which stores the product prices defined in data.json
let data = []; //? Global variable which basically stores the array of products in data.json

fetch('./assets/data.json')
.then(response => response.json())
.then(jsonData => {
    data = jsonData; //* Assigns the fetched data to the global variable "data"
    console.log(data);
    let productElements = document.getElementById("products");
    let html = "";
    data.forEach(products => {
        productPrice[products.id] = products.price; //* gets the product id, its equivalent price and stores it in productPrice
        html += 
        `
            <div class="product-cards" data-id='${products.id}'>
                <img src="${products.image.desktop}" 
                    class="product-img"
                    id="product-image"
                    alt="${products.name}-desktop"
                >
                <button type="button" class="add-product" id="add-to-cart"> 
                    <img src="assets/images/icon-add-to-cart.svg" 
                        alt="add-to-cart"
                    >
                    Add to Cart
                </button>
                <div class="quantity" id="quantities">
                    <button type="button" class="decrease-quantity" id="decrease-quantity">
                        <svg xmlns="http://www.w3.org/2000/svg" class="minus" width="10" height="8" viewBox="0 0 10 2">
                            <path d="M0 .375h10v1.25H0V.375Z" fill-rule="evenodd"/>
                        </svg>
                    </button>

                    <span class="quantity-value" id="quantity-value">1</span>
                    
                    <button type="button" class="increase-quantity" id="increase-quantity">
                        <svg xmlns="http://www.w3.org/2000/svg" class="add" width="10" height="10" viewBox="0 0 10 10">
                            <path d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
                            fill-rule="evenodd"/>
                        </svg>
                    </button>
                </div>
                <span class="product-category">${products.category}</span>
                <p class="product-name">${products.name}</p>
                <h4 class="product-price">$${parseFloat(products.price).toFixed(2)}</h4>
            </div>
        `;
    });
    productElements.innerHTML = html;

    //! Add event listeners for dynamically added elements

    //? Passes the parameter 'button' to each of the add to cart buttons
    document.querySelectorAll('.add-product').forEach(button => {
        //* The parameter 'button' then calls the function 'handleAddToCart' when it is clicked 
        button.addEventListener('click', handleAddToCart);
    });

    //? Passes the parameter 'button' to each of the plus buttons
    document.querySelectorAll('.increase-quantity').forEach(button => {
        //* The parameter 'button' then calls the function 'handleIncreaseQuantity' when it is clicked
        button.addEventListener('click', handleIncreaseQuantity);
    });

    //? Passes the parameter 'button' to each of the minus buttons
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        //* The parameter 'button' then calls the function 'handleDecreaseQuantity' when it is clicked
        button.addEventListener('click', handleDecreaseQuantity);
    });

});

//! Function for the add to cart button which handles adding products to cart
function handleAddToCart(event) {
    //! Deprecated -- do not use
    //! const id = parseInt(event.target.parentElement.getAttribute('data-id'));
    //! updateCartCount(id, 'increase');
    //! toggleButtonState(event.target, true);

    const target = event.target;

    //* Checks if the event targeted is an image and if so it targets the parent element of the image which is the add to cart button, otherwise it uses the event target itself which is the add to cart button
    const button = target.tagName === 'IMG'? target.parentNode : target;
    const id = parseInt(button.closest('.product-cards').getAttribute('data-id'));
    console.log(id);
    updateCartCount(id, 'increase');
    toggleButtonState(button, true); //? changes button from add to cart to increment & decrement button
    displayAddedProducts();
    onCartUpdate();
}

//! Toggle button states and image border
function toggleButtonState(button, isVisible) {

    //* Button and isVisible have been passed as parameters to the function
    //* Button in this context varies depending on which function toggleButtonState function is called in and has the parameter button
    //* Basically it is used to toggle the visibility of a button and its associated content (mostly the add to cart button)
    //* When the button is clicked in the function it is called in, the button is set to 'none' if isVisible is 'true' and 'flex' if isVisible is 'false'
    button.style.display = isVisible ? 'none' : 'flex';

    //* finds the closest element with the class 'product-cards' and queries for the class 'quantity'
    const quantityDiv = button.closest('.product-cards').querySelector('.quantity');

    //* it then sets the display of the class 'quantity' to 'flex' if isVisible is 'true' and 'none' if isVisible is false
    quantityDiv.style.display = isVisible ? 'flex' : 'none';

    //* Sets the border of the class 'product-img' to a dashed border if isVisible is 'true' and 'none' if isVisible is 'false'
    const imageBorder = button.closest('.product-cards').querySelector('.product-img');
    imageBorder.style.border = isVisible ? '2px dashed #c73a0f' : 'none';
}

//! Handles increasing quantity on "+" button click
function handleIncreaseQuantity(event) {
    const id = parseInt(event.target.closest('.product-cards').getAttribute('data-id'));
    updateCartCount(id, 'increase');
    displayAddedProducts();
    onCartUpdate();
}

//! Handles decreasing quantity on "-" button click
function handleDecreaseQuantity(event) {
    const id = parseInt(event.target.closest('.product-cards').getAttribute('data-id')); //* Gets the ID of the closest parent element 'product-card' which is used to identify the specific product in the cart

    updateCartCount(id, 'decrease'); //* decreases the quantity on "-" button click

    const button = event.target.closest('.product-cards').querySelector('.add-product'); //* gets the element with the class 'add-product'(add to cart button) and targets the closest element with the class 'product-cards'

    //? Checks if each of the product quantities is 0
    if (cart[id] === 0) {
        toggleButtonState(button, false); //? the add to cart button now has the property 'display:none' this means the parameter isVisible is 'true' so this reverts back to the add to cart button by setting the property to 'display:flex' which means the parameter isVisible is 'false'

        //* Get the element with the class 'cart-contents' which is the div that contains ALL the products added to the cart
        const cartContents = document.querySelector('.cart-contents');

        //* Gets the element with the class 'added-products-container' which is the container div of the INDIVIDUAL added products and also gets its ID
        const addedProductsContainer = cartContents.querySelector(`.added-products-container[data-id="${id}"]`);

        addedProductsContainer.remove(); //* remove the container of the INDIVIDUAL product from the DOM
    }
    else{
        displayAddedProducts();
    }
    onCartUpdate();
}

//! Update cart count(Your Cart(0)) and quantity(increment & decrement button value)
function updateCartCount(id, operation, quantity = 1) {
    //? cart and cartCount are global variables
    //? cart is used to store the value of the product quantities being added
    //? cartCount is used to keep track of the cart count (Your cart(0,1,2,etc))

    const prevValue = cart[id] || 0; //* retrieves the previous quantity of the product from the cart object using the id or the previous value is 0

    let value = prevValue;

    if(operation === 'increase') {
        value += quantity;
        //! cartCount += quantity; => NOW HANDLED BY onCartUpdate function
        // cartCount = cartCount + quantity;
    }
    else if(value > 0 && operation === 'decrease') {
        value -= quantity;
        //! cartCount -= quantity; => NOW HANDLED BY onCartUpdate function
        //! cartCount = cartCount - quantity;
    }

    cart[id] = value; //* Updates the cart object with the new value using the id of the product

    //* Update the quantity of the product(increment & decrement button) by first calling the parent element with its data-id
    const productCards = document.querySelector(`.product-cards[data-id='${id}']`);
    
    //* Using the parent element with its data-id we call the increment & decrement button and update its span value
    const quantityAmount = productCards.querySelector('#quantity-value'); //? OR const quantityAmount = document.getElementById('quantity-value');

    quantityAmount.innerText = value;

    //! Update cart value i.e the html element Your cart(0) => NOW HANDLED BY onCartUpdate function
    //* const cartAmount = document.getElementById('cart-quantity');
    //* cartAmount.innerText = cartCount; 
}

//! Updates the cart at every instance
function onCartUpdate(){
    const checkoutContainer =  document.getElementById('checkout-container');

    let totalPrice = 0; //* used to calculate the total price

    let cartCount = 0; //* cartCount is re-initialized in this block to prevent any issues with the global variable cartCount. Used to update the element 'Your cart(0)'

    //? loops/iterates through the keys of the object cart and gets the ID's
    for(const id of Object.keys(cart)){
        const quantity = cart[id]; //* gets each of the products in the cart using their id
        const price = productPrice[id]; //* gets the price of each of the products using their id's
        totalPrice += quantity * price; //* calculates the total price of all products in the cart
        cartCount += quantity; //* gets the number of products in the cart and updates+ the html element "Your Cart(0)"
    }

    if (cartCount < 1){
        checkoutContainer.style.display = 'none'; //* hides the delivery message and checkout button
        emptyCartMessage();
    }
    else{
        checkoutContainer.style.display = 'block'; //* displays the delivery message and checkout button
    }

    //? Update total price
    const totalPriceElement = document.getElementById('total-price-value');
    totalPriceElement.textContent = totalPrice.toFixed(2);

    //? Update cart value i.e the html element Your cart(0)
    const cartAmount = document.getElementById('cart-quantity');
    cartAmount.innerText = cartCount;
}

//! Displays empty cart message once cartCount(Your Cart(0,1,2,3)) is exactly Your cart(0) i.e when there is no product in the cart
function emptyCartMessage() {
    if (cartCount === 0 || Object.values(cart).every(value => value === 0)) {
        const cartContents = document.querySelector('.cart-contents');
        cartContents.innerHTML = `
            <div class="cart-contents" id="cart-contents">
                <img src="assets/images/illustration-empty-cart.svg"
                    class="empty-cart"
                    alt="empty-cart"
                >
                <p class="empty-cart-message">
                    Your added items will appear here
                </p>
            </div>
        `;
    }
}

//! Display added products in cart
function displayAddedProducts() {
    fetch('./assets/data.json')
      .then(response => response.json())
      .then(data => {
        const cartContents = document.querySelector('.cart-contents');
        cartContents.innerHTML = ''; //? OR cartContents.textContent = ''; // clears cart-contents

        Object.keys(cart).forEach((id) => {
        if (cart[id] > 0) {
            const product = data.find((item) => item.id == parseInt(id));  
            if (product) {
                const html = `
                    <div class="added-products-container" data-id="${id}">
                        <div class="added-products">
                            <h5 class="added-product-name">${product.name}</h5>
                            <div class="quantity-and-prices">
                                <span class="added-quantity">${cart[id]}x</span>
                                <span class="added-price">@ $${(product.price).toFixed(2)}</span>
                                <span class="multiplied-price">$${(cart[id] * product.price).toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="remove-container">
                            <button type="button" class="remove-product">
                                <svg xmlns="http://www.w3.org/2000/svg" class="remove-icon" id="icon-remove" width="15" height="11" viewBox="0 0 10 10">
                                <path d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z" fill-rule="evenodd"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                `;
                cartContents.innerHTML += html; 
                
                //! Add event listener to remove-product button
                document.addEventListener('click', (event) => {
                    
                    if (event.target.closest('.remove-container')) {
                        //? Remove product from cart by first getting the id
                        const id = event.target.closest('.added-products-container').getAttribute('data-id');

                        updateCartCount(id, 'decrease', cart[id]); //? Remove all quantities of the product and updates the cart
                        
                        event.target.closest('.added-products-container').remove(); //? Remove the container from the DOM

                        //? Change the button of the deleted product back to "Add to Cart"
                        const productCards = document.querySelector(`.product-cards[data-id="${id}"]`);
                        const addToCartButton = productCards.querySelector('.add-product');
                        toggleButtonState(addToCartButton, false);

                        //* Checks if the cart is empty and displays a message
                        //! emptyCartMessage(); => NOW HANDLED BY onCartUpdate function
                        onCartUpdate();


                    }
                });
            }
        } 
        else {
            console.log('Product not found!');
        }
        });
      })
    .catch(error => console.error('Error fetching data:', error));
}

const confirmOrder = document.getElementById('confirm-order');
const modal = document.querySelector('.modal-container');
confirmOrder.addEventListener('click', () => {
    //* alert('Order has been confirmed');
    //* window.location.reload();
    modal.classList.remove('hide');
    modal.classList.add('show');

    //* Get the added products from the cart
    const boughtProducts = Object.keys(cart).map(id => {
        const product = data.find(item => item.id == parseInt(id));
        console.log(data);
        return {
            id,
            name: product.name,
            price: product.price,
            quantity: cart[id],
            thumbnail: product.image.thumbnail
        };
    });
    
    //? Populate the modal content
    const modalContent = document.querySelector('.modal');
    const html = `
        <div class="close-modal">
            <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="close-modal-icon">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill-rule="evenodd"/>
            </svg>
        </div>
        <div class="modal-header">
            <img src="assets/images/icon-order-confirmed.svg" class="check-mark" alt="check-mark">
            <h2 class="modal-title">Order Confirmed</h2>
            <p>We hope you enjoy your food!! (&#128521; Desserts)</p>
        </div> 

        <div class="order-summary">
            <div class="bought-products-container">
                ${boughtProducts.map(product => `
                    <div class="bought-products">
                        <div class="bought-product-image">
                            <img src="${product.thumbnail}" class="thumbnail-image" alt="${product.name}-thumbnail">
                        </div>
                        
                        <div class="bought-products-list">
                            <h5 class="bought-product-name">${product.name}</h5>

                            <div class="bought-quantities-and-prices">
                                <span class="bought-added-quantity">${product.quantity}x</span>
                                <span class="product-regular-price">@$${(product.price).toFixed(2)}</span>
                            </div>
                        </div>
                        
                    </div>
                
                    <h5 class="bought-product-price">
                        <span class="currency">$</span>
                        <span class="bought-product-price-value">${(product.quantity * product.price).toFixed(2)}</span>
                    </h5>
                    <div class="divider"></div>
                `).join('')}
            </div>
            
            <div class="modal-order-total">
                <p>Order Total</p>
                <h3 class="modal-total-price">
                    <span class="currency">$</span>
                    <span id="modal-total-value">${boughtProducts.reduce((acc, product) => acc + product.price * product.quantity, 0).toFixed(2)}</span>
                </h3>
            </div>
        </div>
        <button type="button" class="new-order" id="new-order">
            Start New Order
        </button>
    `;
    modalContent.innerHTML += html;

    const closeModal = document.querySelector('.close-modal-icon');
    closeModal.addEventListener('click', () => {
        modal.classList.add('hide');
        modal.classList.remove('show');
        modalContent.innerHTML = '';
    })
    
});

//todo: start a new order when the 'start new order' button is clicked
//todo: enable the modal to be able to scroll

document.addEventListener("DOMContentLoaded", () => {
    //* Additional initialization if necessary
});



