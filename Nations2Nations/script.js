// script.js - All JavaScript functionality for Nations2Nations website

// Main initialization function that runs when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set the active state in navigation menu
    setActiveNavigation();
    
    // Initialize lazy loading for images to improve performance
    initializeLazyLoading();
    
    // Preload important resources for faster page loading
    preloadCriticalResources();
    
    // Initialize features specific to the current page
    initializePageSpecificFeatures();
});

// Function to highlight the current page in navigation
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.parentElement.classList.add('active');
        }
    });
}

// Function to load content dynamically without page refresh
function loadContent(url, containerId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
        })
        .catch(error => console.error('Error loading content:', error));
}

// Lazy loading implementation for images
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Make sure the image loads correctly
                if (img.dataset.src && img.src !== img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        // Set data-src if not already set
        if (!img.dataset.src) {
            img.dataset.src = img.src;
        }
        imageObserver.observe(img);
    });
}

// Preload important resources to improve page speed
function preloadCriticalResources() {
    const criticalResources = [
        'css/styles.css',
        '_images/N2N_Logo.png'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.includes('.css') ? 'style' : 'image';
        document.head.appendChild(link);
    });
}

// Service Worker for caching - improves performance for returning visitors
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('Service Worker registered successfully'))
        .catch(error => console.log('Service Worker registration failed'));
}

// Form validation for contact forms and other forms
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            
            // Remove any previous error messages
            form.querySelectorAll('.error-message').forEach(msg => msg.remove());
            form.querySelectorAll('.error').forEach(input => input.classList.remove('error'));
            
            // Check each required field
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Create and display error message
                    const errorMsg = document.createElement('span');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'This field is required';
                    input.parentNode.insertBefore(errorMsg, input.nextSibling);
                }
            });
            
            // If form is valid, show success message and reset form
            if (isValid) {
                alert('Form submitted successfully!');
                form.reset();
            }
        });
    });
}

// Gallery lightbox functionality for image viewing
function initializeGalleryLightbox() {
    // Create the lightbox HTML structure
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close">&times;</span>
            <img src="" alt="Lightbox Image">
            <div class="lightbox-caption"></div>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    // Get lightbox elements
    const galleryImages = document.querySelectorAll('main img');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.close');
    
    // Add click event to each gallery image
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            lightbox.style.display = 'flex';
            lightboxImg.src = this.src;
            lightboxCaption.textContent = this.alt;
        });
    });
    
    // Close lightbox when close button is clicked
    closeBtn.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target !== lightboxImg && e.target !== lightboxCaption) {
            lightbox.style.display = 'none';
        }
    });
}

// Contact page map functionality
function initializeContactMaps() {
    const capeTownImg = document.querySelector('img[alt="Cape Town Location"]');
    const johannesburgImg = document.querySelector('img[alt="Johannesburg Location"]');
    
    if (capeTownImg && johannesburgImg) {
        // Create map container for Cape Town
        const capeTownMap = document.createElement('div');
        capeTownMap.id = 'capeTownMap';
        capeTownMap.className = 'map-container';
        capeTownMap.innerHTML = '<h4>Cape Town Location</h4><div id="capeTownMapInner" style="height: 250px;"></div>';
        
        // Create map container for Johannesburg
        const johannesburgMap = document.createElement('div');
        johannesburgMap.id = 'johannesburgMap';
        johannesburgMap.className = 'map-container';
        johannesburgMap.innerHTML = '<h4>Johannesburg Location</h4><div id="johannesburgMapInner" style="height: 250px;"></div>';
        
        // Replace static images with interactive maps
        capeTownImg.parentNode.replaceChild(capeTownMap, capeTownImg);
        johannesburgImg.parentNode.replaceChild(johannesburgMap, johannesburgImg);
        
        // Initialize both maps with their coordinates
        initializeMap('capeTownMapInner', -33.9249, 18.4241, 'Nations2Nations Cape Town');
        initializeMap('johannesburgMapInner', -26.2041, 28.0473, 'Nations2Nations Johannesburg');
    }
}

// Initialize a single map with given coordinates
function initializeMap(mapId, lat, lng, popupText) {
    const mapContainer = document.getElementById(mapId);
    mapContainer.innerHTML = `
        <iframe 
            width="100%" 
            height="100%" 
            frameborder="0" 
            scrolling="no" 
            marginheight="0" 
            marginwidth="0" 
            src="https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01}%2C${lat-0.01}%2C${lng+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lng}"
            style="border: 1px solid #ccc">
        </iframe>
        <br/>
        <small>
            <a href="https://www.openstreetmap.org/?mlat=${lat}&amp;mlon=${lng}#map=15/${lat}/${lng}">View Larger Map</a>
        </small>
    `;
}

// Shopping cart array to store products
let shoppingCart = [];

// Products page functionality
function initializeProductsPage() {
    // Add search and filter functionality
    addSearchFilter();
    
    // Add shopping cart functionality
    addCartFunctionality();
}

// Search and filter products
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

// Filter products based on search term and category
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
        
        // Show or hide product based on filters
        if (matchesSearch && matchesCategory) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Shopping cart functionality
function addCartFunctionality() {
    // Add click events to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.dataset.product;
            const productPrice = parseFloat(this.dataset.price);
            
            // Add product to shopping cart
            shoppingCart.push({
                name: productName,
                price: productPrice
            });
            
            updateCartDisplay();
            showCartNotification(productName);
        });
    });
    
    // Create shopping cart display
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

// Update the shopping cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = '';
    let total = 0;
    
    // Add each item to cart display
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
    
    // Update total price
    cartTotal.textContent = `Total: R${total.toFixed(2)}`;
}

// Show notification when product is added to cart
function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `${productName} added to cart!`;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize features based on current page
function initializePageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Initialize features for specific pages
    switch(currentPage) {
        case 'index.html':
        case '':
            // Home page specific features can be added here
            break;
            
        case 'products.html':
            initializeProductsPage();
            break;
            
        case 'gallery.html':
            initializeGalleryLightbox();
            break;
            
        case 'contact.html':
            initializeContactMaps();
            initializeFormValidation();
            break;
            
        case 'about.html':
            // About page specific features can be added here
            break;
            
        default:
            // Default initialization for other pages
            break;
    }
    
    // Initialize form validation on all pages that have forms
    if (document.querySelector('form')) {
        initializeFormValidation();
    }
}

// Utility function to limit how often a function can be called
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility function to limit function execution rate
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}