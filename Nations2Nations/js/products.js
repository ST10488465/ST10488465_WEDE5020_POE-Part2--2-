// Shopping cart functionality
let shoppingCart = [];

document.addEventListener('DOMContentLoaded', function() {
    // Add search and filter functionality
    addSearchFilter();
    
    // Add cart functionality
    addCartFunctionality();
});

function addSearchFilter() {
    const filterBtn = document.getElementById('filterBtn');
    const searchInput = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (filterBtn && searchInput && categoryFilter) {
        filterBtn.addEventListener('click', filterProducts);
        searchInput.addEventListener('keyup', filterProducts);
        categoryFilter.addEventListener('change', filterProducts);
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productName = product.querySelector('.product-name').textContent.toLowerCase();
        const productDescription = product.querySelector('.product-description').textContent.toLowerCase();
        const productCategory = product.dataset.category;
        
        let matchesSearch = productName.includes(searchTerm) || productDescription.includes(searchTerm);
        let matchesCategory = category === 'all' || category === productCategory;
        
        if (matchesSearch && matchesCategory) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function addCartFunctionality() {
    // Add "Add to Cart" buttons to products
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.dataset.product;
            const productPrice = parseFloat(this.dataset.price);
            
            shoppingCart.push({
                name: productName,
                price: productPrice
            });
            
            updateCartDisplay();
            showCartNotification(productName);
        });
    });
    
    // Create cart display
    const cartContainer = document.createElement('div');
    cartContainer.id = 'cart-container';
    cartContainer.innerHTML = `
        <h3>Shopping Cart</h3>
        <div id="cart-items"></div>
        <div id="cart-total">Total: R0.00</div>
        <button id="checkout-btn">Checkout</button>
    `;
    document.body.appendChild(cartContainer);
    
    // Add checkout functionality
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
    
    if (!cartItems || !cartTotal) return;
    
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