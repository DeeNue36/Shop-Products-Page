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
                    <button type="button" class="add-product"> 
                        <img src="assets/images/icon-add-to-cart.svg" 
                            alt="add-to-cart"
                        >
                        Add to Cart
                    </button>
                    <span class="product-category">${products.category}</span>
                    <p class="product-name">${products.name}</p>
                    <h4 class="product-price">$${parseFloat(products.price).toFixed(2)}</h4>
                </div>
            `;
            productElements.innerHTML = html;
        });
    });