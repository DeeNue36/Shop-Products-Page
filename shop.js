let cartCount = 0; //* Global variable. Updates the HTML Element(Your cart(0). Stores and keeps track of ALL product quantities being added to the cart 

const cart = {}; //* Global variable. Uses the ID of EACH INDIVIDUAL product to store and keep track of its quantity 

const productPrice = {}; //* Global variable. Stores the product prices defined in data.json

let data = []; //* Global variable. Stores the array of the products in data.json

//! Fetches the products data and displays list of products
fetch('./assets/data.json')
.then(response => response.json())
.then(jsonData => {
    data = jsonData; //* Assigns the fetched data to the global variable "data"

    //* Displays the product cards in its parent HTML Element 'products'
    let productElements = document.getElementById("products");
    let html = "";
    data.forEach(products => {

        //* creates an object to store the product id and its price
        productPrice[products.id] = products.price;

        html += 
        `
            <div class="product-cards" data-id='${products.id}'>
                <img src="${products.image.desktop}" 
                    class="product-img"
                    id="product-image"
                    alt="${products.name}-desktop"
                >
                <img src="${products.image.tablet}" 
                    class="product-img-tablet"
                    id="product-image"
                    alt="${products.name}-tablet"
                >
                <img src="${products.image.mobile}" 
                    class="product-img-mobile"
                    id="product-image"
                    alt="${products.name}-mobile"
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
    //! toggleProductCardButtonState(event.target, true);

    const target = event.currentTarget;

    //* Checks if the event targeted is an image and if so it targets the parent element of the image which is the add to cart button, otherwise it uses the event target itself which is the add to cart button
    const button = target.tagName === 'IMG'? target.parentNode : target;

    const productCards = button.closest('.product-cards');
    const id = parseInt(productCards.getAttribute('data-id'));

    updateCartCount(id, 'increase');
    toggleProductCardButtonState(button, true); //? changes button from add to cart to increment & decrement button
    displayAddedProducts();
    onCartUpdate();
}

//! Set image border style
function setBorderStyle(element, isVisible) {
    /**
     ** Sets the border style of an element based on visibility.
     ** @param {HTMLElement} element - The element to set the border style.
     ** @param {boolean} isVisible - The visibility state to determine the border style.
    */
    element.style.border = isVisible ? '2px dashed #c73a0f' : 'none';
}

//! Toggle button states
function toggleProductCardButtonState(button, isVisible) {
    /** 
     ** Toggles the visibility of a button and its associated content.
     ** @param {HTMLElement} button - The button element to toggle.
     ** @param {boolean} isVisible - The visibility state to set (true for hidden, false for visible).
    */
    button.style.display = isVisible ? 'none' : 'flex';

    //* Gets the closest element with the class 'product-cards' which then gets the class 'quantity'(parent container of the increment & decrement button)
    const productCards = button.closest('.product-cards');
    const quantityDiv = productCards.querySelector('.quantity');

    //* Sets the display of the class 'quantity' to 'flex' if isVisible is 'true' and 'none' if isVisible is false
    if (quantityDiv) {
        quantityDiv.style.display = isVisible ? 'flex' : 'none';
    }

    //* Sets the border of the product images to a dashed border if isVisible is 'true' and 'none' if isVisible is 'false'
    //? Desktop product image
    setBorderStyle(productCards.querySelector('.product-img'), isVisible);

    //? Tablet product image
    setBorderStyle(productCards.querySelector('.product-img-tablet'), isVisible);

    //? Mobile product image
    setBorderStyle(productCards.querySelector('.product-img-mobile'), isVisible);
}

//! Handles increasing quantity on "+" button click
function handleIncreaseQuantity(event) {
    // Get the product id from the event target
    const id = parseInt(event.target.closest('.product-cards').getAttribute('data-id'));

    // Increase the quantity of the product in the cart
    updateCartCount(id, 'increase');

    // Display the updated list of added products
    displayAddedProducts();

    // Update the cart and checkout information
    onCartUpdate();
}

//! Handles decreasing quantity on "-" button click
function handleDecreaseQuantity(event) {
    //* When the user clicks on the "-" button it first targets the closest 'product-cards' HTML Element
    const productCard = event.target.closest('.product-cards');

    //* Gets the id of the 'product-cards' HTML Element
    const id = parseInt(productCard.getAttribute('data-id'));

    //* Decreases the quantity on "-" button click
    updateCartCount(id, 'decrease');

    //* Gets the element with the class 'add-product'(add to cart button) and targets the closest element with the class 'product-cards'
    const button = productCard.querySelector('.add-product');

    //? Checks if each of the product quantities is 0
    if (cart[id] === 0) {

        //? the add to cart button currently has the property 'display:none' meaning the parameter isVisible is 'true' so this displays the add to cart button by setting the property to 'display:flex' which means the parameter isVisible is 'false'
        toggleProductCardButtonState(button, false); 

        //* Get the element with the class 'cart-contents' which is the div that contains ALL the products added to the cart
        const cartContents = document.querySelector('.cart-contents');

        //* Gets the HTML Element with the class 'added-products-container' which is the container div of the INDIVIDUAL added products and also gets its ID
        const addedProductsContainer = cartContents.querySelector(`.added-products-container[data-id="${id}"]`);

        if(addedProductsContainer){
            //* remove the container of the INDIVIDUAL product from the DOM
            addedProductsContainer.remove();
        }
    }
    else{
        displayAddedProducts();
    }
    onCartUpdate();
}

//! Update cart count(Your Cart(0)) and quantity(increment & decrement button value)
function updateCartCount(id, operation, quantity = 1) {
    //? cart and cartCount are global variables
    //? cart is used to store the value of the individual product quantities being added
    //? cartCount is used to keep track of the cart count (Your cart(0,1,2,etc))

    //* retrieves the previous quantity of the product from the cart object using the id or the previous value is 0
    const prevValue = cart[id] || 0;

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

    //* Updates the cart object with the new value/quantity of the product using the id of the product
    cart[id] = value;
    console.log(cart);

    //* Calls the 'product-cards' HTML Element and its data-id
    const productCards = document.querySelector(`.product-cards[data-id='${id}']`);
    
    //* Updates the value of the HTML Element 'quantity-value'(increment and decrement button) for the specific product
    //? OR const quantityAmount = document.getElementById('quantity-value');
    const quantityAmount = productCards.querySelector('#quantity-value'); 
    quantityAmount.innerText = value;

    //! Update cart value i.e the html element Your cart(0) => NOW HANDLED BY onCartUpdate function
    //! const cartAmount = document.getElementById('cart-quantity');
    //! cartAmount.innerText = cartCount; 
}

//! Updates the cart at every instance
function onCartUpdate(){
    const checkoutContainer =  document.getElementById('checkout-container');

    let totalPrice = 0; //* used to calculate the total price

    let cartCount = 0; //* cartCount is re-initialized in this block to prevent any issues with the global variable cartCount. Used to update the element 'Your cart(0)'

    //? loops/iterates through the keys of the object cart and gets the ID's
    for(const id of Object.keys(cart)){
        const quantity = cart[id]; //* gets each of the products in the cart using their ID's and initializes it to "quantity"
        const price = productPrice[id]; //* gets the price of each of the products using their ID's and initializes it to "price"
        totalPrice += quantity * price; //* calculates the total price of all products in the cart
        cartCount += quantity; //* updates the html element "Your Cart(0)"
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

    //? Update mini cart values
    const miniCartIcon = document.getElementById('mini-cart-value');
    const miniCartIconMobile = document.getElementById('mini-cart-value-mobile');
    miniCartIcon.innerText = cartCount;
    miniCartIconMobile.innerText = cartCount;
    
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
                        toggleProductCardButtonState(addToCartButton, false);

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

//! Confirm an order and display modal with the list of products bought, quantity, prices and overall total price 
const confirmOrder = document.getElementById('confirm-order');
const modal = document.querySelector('.modal-container');
confirmOrder.addEventListener('click', () => {
    //* display the modal 
    modal.classList.remove('hide');
    modal.classList.add('show');

    //* Get the added products from the cart
    const boughtProducts = Object.keys(cart).map(id => {
        const product = data.find(item => item.id == parseInt(id));
        // console.log(data);
        return {
            id,
            name: product.name,
            price: product.price,
            quantity: cart[id],
            thumbnail: product.image.thumbnail
        };
    }).filter(product => product.quantity > 0); //* Filter out products with 0 quantity
    
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

    //* Close the modal  
    const closeModal = document.querySelector('.close-modal-icon');
    closeModal.addEventListener('click', () => {
        
        //* Resets the modal
        modal.classList.add('hide');
        modal.classList.remove('show');
        modalContent.innerHTML = ' ';
    });

    //* Start a new order
    const newOrder = document.querySelector('#new-order');
    newOrder.addEventListener('click', () => {

        //* Reset the cart and product quantities
        //! cart = {}; -- does not work since I used const to declare the cart variable, another way to clear the cart would be to change the const to let --
        //* window.location.reload(); OR use this to reload the page
        Object.keys(cart).forEach(key => delete cart[key]);
        cartCount = 0;

        //* Reset the product quantities in the DOM(default value of the increment/decrement button)
        document.querySelectorAll('.quantity-value').forEach(quantity => {
            quantity.innerText = 1;
        });

        //* Reset the add to cart buttons
        document.querySelectorAll('.add-product').forEach(button => {
            toggleProductCardButtonState(button, false);
        });

        //* Reset the cart contents
        document.querySelector('.cart-contents').innerHTML = '';

        //* Reset the checkout container
        document.getElementById('checkout-container').style.display = 'none';

        //* Hide the modal & clear the modal
        modal.classList.add('hide');
        modal.classList.remove('show');
        modalContent.innerHTML = '';

        //* Update the cart count and total price
        onCartUpdate();
    })

});

//todo: display a spinning loader OR a confirmation message in the modal when start new order button is clicked then after an inter val the modal should disappear and the page should be reset to the initial state

document.addEventListener("DOMContentLoaded", () => {
    //* Additional initialization if necessary
});



