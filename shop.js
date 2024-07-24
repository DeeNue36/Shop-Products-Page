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
        button.addEventListener('click', handleAddToCart);
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
    //checks if the event target is an image and if so it targets the parent element of the image which is the add to cart button, otherwise it uses the event target itself
    const button = target.tagName === 'IMG'? target.parentNode : target;
    const id = parseInt(button.closest('.product-cards').getAttribute('data-id'));
    console.log(id);
    updateCartCount(id, 'increase');
    toggleButtonState(button, true); //toggles button state from add to cart to increment & decrement button
}

// function changeButtonState(event, id) {
//     //used to identify the specific button that was clicked
//     // event.target refers to the element that triggered the event
//     const button = event.target;

//     //Finds the nearest product cards container that encloses the button that is clicked.
//     //When a button is clicked find the nearest product cards container
//     const productCard = button.closest('.product-cards');

//     //searches the product-cards container for the element that has the class "quantity"
//     const quantityDiv = productCard.querySelector('.quantity');
    
//     //Selects the product image in the product cards container
//     const imageBorder = productCard.querySelector('.product-img');

//     const value = cart[id] || 0;
//     console.log(value);
//     if (value >=1){
//         // hide add to cart button and display the increment & decrement button on click
//         button.style.display = 'none';
//         quantityDiv.style.display = 'flex';
//         imageBorder.style.border = '2px dashed #c73a0f';
//     }
//     else{
//         button.style.display = 'flex';
//         quantityDiv.style.display = 'none';
//         imageBorder.style.border = 'none';
//     }
// }

//Handles increasing quantity on "+" button click
function handleIncreaseQuantity(event) {
    const id = parseInt(event.target.closest('.product-cards').getAttribute('data-id'));
    updateCartCount(id, 'increase');
}

//Handles increasing quantity on "-" button click
function handleDecreaseQuantity(event) {
    const id = parseInt(event.target.closest('.product-cards').getAttribute('data-id'));
    updateCartCount(id, 'decrease');
    const button = event.target.closest('.product-cards').querySelector('.add-product');
    if (cart[id] === 0) {
        toggleButtonState(button, false); //reverts button back to the add to cart button
    }
}

//Update cart count(Your Cart(0)) and quantity(increment & decrement button value)
function updateCartCount(id, operation, quantity = 1) {
    // cart and cartCount are global variables
    const prevValue = cart[id] || 0;

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
    cart[id] = value;
    // console.log(cartCount, operation, value);

    //Update cart value
    const cartAmount = document.getElementById('cart-quantity');
    cartAmount.innerText = cartCount;

    //Update quantity value(increment & decrement button)
    const productCards = document.querySelector(`.product-cards[data-id='${id}']`);
    //increment & decrement span value
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

document.addEventListener("DOMContentLoaded", () => {
    // Additional initialization if necessary
});

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