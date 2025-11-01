// This is to add the shopping cart functionality.
let shoppingCart = [];

document.addEventListener('DOMContentLoaded', function() {
    // This is to add search and filter functionality.
    addSearchFilter();
    
    // This is to add accordion functionality to categories
    addAccordions();
    
    // Add cart functionality
    addCartFunctionality();
});

function addSearchFilter() {
    // Create search and filter elements
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-filter-container';
    searchContainer.innerHTML = `
        <input type="text" id="productSearch" placeholder="Search products...">
        <select id="categoryFilter">
            <option value="all">All Categories</option>
            <option value="technology">Technology</option>
            <option value="clothing">Clothing</option>
            <option value="hair">Hair Products</option>
        </select>
        <button id="filterBtn">Filter</button>
    `;
    
    // Insert before the main content
    const main = document.querySelector('main');
    main.insertBefore(searchContainer, main.firstChild);
    
    // This code is for the search filter functionality
    const filterBtn = document.getElementById('filterBtn');
    const searchInput = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    
    filterBtn.addEventListener('click', filterProducts);
    searchInput.addEventListener('keyup', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
}

function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const products = document.querySelectorAll('main h3');
    
    products.forEach(product => {
        const productText = product.textContent.toLowerCase();
        const productSection = product.closest('h1, h2').textContent.toLowerCase();
        
        let matchesSearch = productText.includes(searchTerm);
        let matchesCategory = category === 'all' || 
            (category === 'technology' && productSection.includes('technology')) ||
            (category === 'clothing' && productSection.includes('clothing')) ||
            (category === 'hair' && productSection.includes('hair'));
        
        const productContainer = product.parentElement;
        if (matchesSearch && matchesCategory) {
            productContainer.style.display = 'block';
        } else {
            productContainer.style.display = 'none';
        }
    });
}

function addAccordions() {
    // This is the code to convert product categories to accordions
    const categories = document.querySelectorAll('main h1');
    
    categories.forEach(category => {
        if (category.textContent === 'Technology' || 
            category.textContent === 'Clothing' || 
            category.textContent === 'Hair Products') {
            
            //The accordion button
            const accordionBtn = document.createElement('button');
            accordionBtn.className = 'accordion-btn';
            accordionBtn.innerHTML = `${category.textContent} <span class="accordion-icon">+</span>`;
            
            //This is the accordion content container
            const accordionContent = document.createElement('div');
            accordionContent.className = 'accordion-content';
            
            // This code moves all content until next h1 into accordion content
            let nextElement = category.nextElementSibling;
            while (nextElement && nextElement.tagName !== 'H1') {
                const temp = nextElement;
                nextElement = nextElement.nextElementSibling;
                accordionContent.appendChild(temp);
            }
            
            // Replace category with accordion structure
            category.parentNode.insertBefore(accordionBtn, category);
            category.parentNode.insertBefore(accordionContent, accordionBtn.nextSibling);
            category.remove();
            
            // Add click event to toggle accordion
            accordionBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                const icon = this.querySelector('.accordion-icon');
                
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    icon.textContent = '+';
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                    icon.textContent = '-';
                }
            });
        }
    });
}

function addCartFunctionality() {
    //This is the code to add "Add to Cart" buttons to products
    const products = document.querySelectorAll('main h3');
    
    products.forEach(product => {
        const priceElement = product.nextElementSibling;
        if (priceElement && priceElement.textContent.includes('Price:')) {
            const addToCartBtn = document.createElement('button');
            addToCartBtn.className = 'add-to-cart';
            addToCartBtn.textContent = 'Add to Cart';
            addToCartBtn.dataset.product = product.textContent;
            addToCartBtn.dataset.price = priceElement.textContent.replace('Price: ', '').replace('R', '');
            
            priceElement.parentNode.insertBefore(addToCartBtn, priceElement.nextSibling);
            
            addToCartBtn.addEventListener('click', function() {
                const productName = this.dataset.product;
                const productPrice = parseFloat(this.dataset.price);
                
                shoppingCart.push({
                    name: productName,
                    price: productPrice
                });
                
                updateCartDisplay();
                showCartNotification(productName);
            });
        }
    });
    
    //cart display code.
    const cartContainer = document.createElement('div');
    cartContainer.id = 'cart-container';
    cartContainer.innerHTML = `
        <h3>Shopping Cart</h3>
        <div id="cart-items"></div>
        <div id="cart-total">Total: R0.00</div>
        <button id="checkout-btn">Checkout</button>
    `;
    document.body.appendChild(cartContainer);
    
    //This is the checkout functionality
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (shoppingCart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Thank you for your order! This is a demo - in a real site, this would proceed to payment.');
        shoppingCart = [];
        updateCartDisplay();
    });
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = '';
    let total = 0;
    
    shoppingCart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>R${item.price.toFixed(2)}</span>
        `;
        cartItems.appendChild(itemElement);
        total += item.price;
    });
    
    cartTotal.textContent = `Total: R${total.toFixed(2)}`;
}

function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `${productName} added to cart!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
