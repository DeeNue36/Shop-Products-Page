fetch('./assets/data.json')
.then(response => response.json())
.then(data => {
    console.log(data);
    let productElements = document.getElementById("products");
    let html = "";
    data.forEach(products => {
        html += 
        `
            <div class="product-cards">
                <img src="${products.image.desktop}" 
                    class="product-img"
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
});

function handleAddToCart(event) {
    //used to identify the specific button that was clicked
    // event.target refers to the element that triggered the event
    const button = event.target.closest('button');

    //Finds the nearest .product-cards container that encloses this button. 
    const productCard = button.closest('.product-cards');

    //searches the product-cards container for the element that has the class "quantity"
    const quantityDiv = productCard.querySelector('.quantity');
    
    // hide add to cart button and display the increment & decrement button on click
    button.style.display = 'none';
    quantityDiv.style.display = 'flex';

    const increaseButton = quantityDiv.querySelector('.increase-quantity');
    const decreaseButton = quantityDiv.querySelector('.decrease-quantity');
    const quantityValue = quantityDiv.querySelector('.quantity-value');

    let quantity = 1;
    
    increaseButton.addEventListener('click', () => {
        quantity++;
        quantityValue.innerText = quantity;
    });

    decreaseButton.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityValue.innerText = quantity;
        } else {
            quantityDiv.style.display = 'none';
            button.style.display = 'flex';
        }
    });
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