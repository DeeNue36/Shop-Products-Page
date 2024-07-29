let cartCount = 0; // Global variable to keep track of the cart count(Your cart(0))
const cart = {}; // Object to store product quantities

fetch('./assets/data.json')
.then(response => response.json())
.then(data => {
    console.log(data);
    let productElements = document.getElementById("products");
    let html = "";
    data.forEach(products => {
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
}

//Toggles button state from add to cart to increment & decrement button
//Handles increasing quantity on "+" button click
function handleIncreaseQuantity(event) {
    const id = parseInt(event.target.closest('.product-cards').getAttribute('data-id'));
    updateCartCount(id, 'increase');
    displayAddedProducts();
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

    //displays empty cart message once cartCount(Your Cart(0,1,2,3)) is exactly Your cart(0) i.e when there is no product in the cart
    if (cartCount === 0){
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

//Update cart count(Your Cart(0)) and quantity(increment & decrement button value)
function updateCartCount(id, operation, quantity = 1) {
    // cart and cartCount are global variables
    //cart is used to store the value of the product quantities being added
    //cartCount is used to keep track of the cart count (Your cart(0,1,2,etc))

    const prevValue = cart[id] || 0; //retrieves the previous quantity of the product from the cart object using the id or the previous value is 0

    let value = prevValue;

    if(operation === 'increase') {
        value += quantity;
        cartCount += quantity;
        // cartCount = cartCount + quantity;
    }
    else if(value > 0 && operation === 'decrease') {
        value -= quantity;
        cartCount -= quantity;
        // cartCount = cartCount - quantity;
    }
    cart[id] = value; //updates the object cart with the new value
    // console.log(cartCount, operation, value);

    //Update cart value i.e the html element Your cart(0)
    const cartAmount = document.getElementById('cart-quantity');
    cartAmount.innerText = cartCount;

    //Update the quantity value(increment & decrement button) by first calling the parent element with its data-id
    const productCards = document.querySelector(`.product-cards[data-id='${id}']`);
    //using the parent element with its data-id we call the increment & decrement button and update its span value
    const quantityAmount = productCards.querySelector('#quantity-value');
    // const quantityAmount = document.getElementById('quantity-value');
    quantityAmount.innerText = value;
}

//Toggle button states
function toggleButtonState(button, isVisible) {
    button.style.display = isVisible ? 'none' : 'flex';

    const quantityDiv = button.closest('.product-cards').querySelector('.quantity');
    quantityDiv.style.display = isVisible ? 'flex' : 'none';

    const imageBorder = button.closest('.product-cards').querySelector('.product-img');
    imageBorder.style.border = isVisible ? '2px dashed #c73a0f' : 'none';
}

//Display added products in cart
function displayAddedProducts() {
    fetch('./assets/data.json')
      .then(response => response.json())
      .then(data => {
        const cartContents = document.querySelector('.cart-contents');
        cartContents.innerHTML = ''; // clear cart-contents
  
        Object.keys(cart).forEach((id) => {
        // console.log('Searching for product with id:', id);
        if (cart[id] > 0) {
            const product = data.find((item) => item.id == parseInt(id));  
            // console.log('Product found:', product);
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

{/* <div class="order-total">
                <p>
                    Order Total
                </p>

                <h3 class="total-price">
                    $${(cart[id] * product.price).toFixed(2)}
                </h3>
              </div>

              <div class="checkout">

                <span class="carbon-neutral">
                    <svg xmlns="http://www.w3.org/2000/svg" class="carbon-neutral-icon" width="21" height="20" viewBox="0 0 21 20">
                        <path d="M8 18.75H6.125V17.5H8V9.729L5.803 8.41l.644-1.072 2.196 1.318a1.256 1.256 0 0 1 .607 1.072V17.5A1.25 1.25 0 0 1 8 18.75Z" fill-rule="evenodd" />
                        <path d="M14.25 18.75h-1.875a1.25 1.25 0 0 1-1.25-1.25v-6.875h3.75a2.498 2.498 0 0 0 2.488-2.747 2.594 2.594 0 0 0-2.622-2.253h-.99l-.11-.487C13.283 3.56 11.769 2.5 9.875 2.5a3.762 3.762 0 0 0-3.4 2.179l-.194.417-.54-.072A1.876 1.876 0 0 0 5.5 5a2.5 2.5 0 1 0 0 5v1.25a3.75 3.75 0 0 1 0-7.5h.05a5.019 5.019 0 0 1 4.325-2.5c2.3 0 4.182 1.236 4.845 3.125h.02a3.852 3.852 0 0 1 3.868 3.384 3.75 3.75 0 0 1-3.733 4.116h-2.5V17.5h1.875v1.25Z" fill-rule="evenodd" />
                    </svg>
                    This is a&nbsp;<b>carbon-neutral</b>&nbsp;delivery
                </span>

                <button type="button" class="confirm-order">
                    Confirm Order
                </button> */}

// document.addEventListener("DOMContentLoaded", ()=>{
//     const quantityBtn = document.getElementById('quantities');
//     // const cartBtn = document.getElementById('add-to-cart');
//     const decrease = document.querySelector('.decrease-quantity');
//     const increase = document.querySelector('.increase-quantity');
//     const quantityValue = document.querySelector('.quantity-value');

//     let a = 1;
//     increase.addEventListener("click", ()=>{
//         a++;
//         // a=(a < 10) ? "0" + a : a;
//         quantityValue.innerText = a;
//     });


//     decrease.addEventListener("click", ()=>{
//         if(a > 0){
//             a--;
//             // a=(a < 10) ? "0" + a : a;
//         }
//         else{
//             quantityBtn.style.display = "none";
//             // cartBtn.style.display = "block";
//         }
//         quantityValue.innerText = a;
//     });
// });