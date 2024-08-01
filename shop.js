let cartCount = 0; // Global variable to keep track of the cart count(Your cart(0))
const cart = {}; // Object to store product quantities
const productPrice = {}; //Object which stores the product prices

fetch('./assets/data.json')
.then(response => response.json())
.then(data => {
    console.log(data);
    let productElements = document.getElementById("products");
    let html = "";
    data.forEach(products => {
        productPrice[products.id] = products.price; //gets the product id and its equivalent price and stores it in productPrice
        console.log(productPrice);
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

    // Add event listeners for dynamically added elements
    document.querySelectorAll('.add-product').forEach(button => {
        button.addEventListener('click',handleAddToCart);
    });

    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', handleIncreaseQuantity);
    });

    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', handleDecreaseQuantity);
    });

});

function handleAddToCart(event) {
    // const id = parseInt(event.target.parentElement.getAttribute('data-id'));
    // updateCartCount(id, 'increase');
    // toggleButtonState(event.target, true);

    const target = event.target;
    //checks if the event target is an image and if so it targets the parent element of the image which is the add to cart button, otherwise it uses the event target itself which is the button
    const button = target.tagName === 'IMG'? target.parentNode : target;
    const id = parseInt(button.closest('.product-cards').getAttribute('data-id'));
    console.log(id);
    updateCartCount(id, 'increase');
    toggleButtonState(button, true); //toggles button state from add to cart to increment & decrement button
    displayAddedProducts();
    onCartUpdate();
}

//Toggle button states
function toggleButtonState(button, isVisible) {
    button.style.display = isVisible ? 'none' : 'flex';

    const quantityDiv = button.closest('.product-cards').querySelector('.quantity');
    quantityDiv.style.display = isVisible ? 'flex' : 'none';

    const imageBorder = button.closest('.product-cards').querySelector('.product-img');
    imageBorder.style.border = isVisible ? '2px dashed #c73a0f' : 'none';
}

//Handles increasing quantity on "+" button click
function handleIncreaseQuantity(event) {
    const id = parseInt(event.target.closest('.product-cards').getAttribute('data-id'));
    updateCartCount(id, 'increase');
    displayAddedProducts();
    onCartUpdate();
}

//Handles decreasing quantity on "-" button click
function handleDecreaseQuantity(event) {
    const id = parseInt(event.target.closest('.product-cards').getAttribute('data-id'));
    updateCartCount(id, 'decrease');
    const button = event.target.closest('.product-cards').querySelector('.add-product');

    if (cart[id] === 0) {
        toggleButtonState(button, false); //reverts button back to the add to cart button
        const cartContents = document.querySelector('.cart-contents');
        const addedProductsContainer = cartContents.querySelector(`.added-products-container[data-id="${id}"]`);
        addedProductsContainer.remove(); // remove the container from the DOM
    }
    else{
        displayAddedProducts();
    }
    onCartUpdate();
}

//Update cart count(Your Cart(0)) and quantity(increment & decrement button value)
function updateCartCount(id, operation, quantity = 1) {
    // cart and cartCount are global variables
    //cart is used to store the value of the product quantities being added
    //cartCount is used to keep track of the cart count (Your cart(0,1,2,etc))

    const prevValue = cart[id] || 0; //retrieves the previous quantity of the product from the cart object using the id or the previous value is 0

    let value = prevValue;

    if(operation === 'increase') {
        value += quantity;
        // cartCount += quantity; => now handled by onCartUpdate function
        // cartCount = cartCount + quantity;
    }
    else if(value > 0 && operation === 'decrease') {
        value -= quantity;
        // cartCount -= quantity; => now handled by onCartUpdate function
        // cartCount = cartCount - quantity;
    }

    cart[id] = value; //updates the cart oject with the new value based on the id of the product 

    //Update cart value i.e the html element Your cart(0) => now handled by onCartUpdate function
    // const cartAmount = document.getElementById('cart-quantity');
    // cartAmount.innerText = cartCount; 

    //Update the quantity of the product(increment & decrement button) by first calling the parent element with its data-id
    const productCards = document.querySelector(`.product-cards[data-id='${id}']`);
    //using the parent element with its data-id we call the increment & decrement button and update its span value
    const quantityAmount = productCards.querySelector('#quantity-value');
    // OR const quantityAmount = document.getElementById('quantity-value');
    quantityAmount.innerText = value; 
}

function onCartUpdate(){
    const checkoutContainer =  document.getElementById('checkout-container');

    let totalPrice = 0;
    let cartCount = 0; //cartCount is re-initialized in this block to prevent any issues with the global variable cartCount

    //loops or iterates through the keys of the cart object and gets the id's
    for(const id of Object.keys(cart)){
        const quantity = cart[id]; // gets each of the products in the cart using their id
        const price = productPrice[id]; // gets the price of each of the products using their id's
        totalPrice += quantity * price; // calculates the total price of all products in the cart
        cartCount += quantity; // gets the number of products in the cart and uses it to update the html element "Your Cart(0)"
    }

    if (cartCount < 1){
        checkoutContainer.style.display = 'none';
        emptyCartMessage();
    }
    else{
        checkoutContainer.style.display = 'block';
    }

    //Update total price
    const totalPriceElement = document.getElementById('total-price-value');
    totalPriceElement.textContent = totalPrice.toFixed(2);

    //Update cart value i.e the html element Your cart(0)
    const cartAmount = document.getElementById('cart-quantity');
    cartAmount.innerText = cartCount;
}

//displays empty cart message once cartCount(Your Cart(0,1,2,3)) is exactly Your cart(0) i.e when there is no product in the cart
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

//Display added products in cart
function displayAddedProducts() {
    fetch('./assets/data.json')
      .then(response => response.json())
      .then(data => {
        const cartContents = document.querySelector('.cart-contents');
        cartContents.innerHTML = ''; // clear cart-contents
  
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
                
                // Add event listener to remove-product button
                document.addEventListener('click', (event) => {
                    if (event.target.closest('.remove-container')) {
                        const id = event.target.closest('.added-products-container').getAttribute('data-id');
                        updateCartCount(id, 'decrease', cart[id]); // Remove all quantities of the product
                        event.target.closest('.added-products-container').remove(); // Remove the container from the DOM

                        // Change the button of the deleted product back to "Add to Cart"
                        const productCards = document.querySelector(`.product-cards[data-id="${id}"]`);
                        const addToCartButton = productCards.querySelector('.add-product');
                        toggleButtonState(addToCartButton, false);

                        // Checks if the cart is empty and displays a message
                        // emptyCartMessage(); => this is now being called in the onCartUpdate function
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

document.addEventListener("DOMContentLoaded", () => {
    // Additional initialization if necessary
});



