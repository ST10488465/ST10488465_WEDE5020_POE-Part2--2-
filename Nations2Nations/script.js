// script.js - All JavaScript functionality for Nations2Nations website

// Main initialization function that runs when the page loads
document.addEventListener("DOMContentLoaded", function () {
  console.log("Nations2Nations website initialized");

  // Set the active state in navigation menu
  setActiveNavigation();

  // Initialize lazy loading for images to improve performance
  initializeLazyLoading();

  // Initialize features specific to the current page
  initializePageSpecificFeatures();

  // Initialize cart functionality
  initializeCart();
});

// Function to highlight the current page in navigation
function setActiveNavigation() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (
      linkHref === currentPage ||
      (currentPage === "index.html" && linkHref === "index.html")
    ) {
      link.parentElement.classList.add("active");
    }
  });
}

// Lazy loading implementation for images
function initializeLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src && img.src !== img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.add("loaded");
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => {
      if (!img.dataset.src) {
        img.dataset.src = img.src;
      }
      imageObserver.observe(img);
    });
  }
}

// Shopping cart functionality
let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
let isCartVisible = false;

function initializeCart() {
  createCartContainer();
  updateCartDisplay();

  // Add event listener for cart toggle button
  const cartToggle = document.getElementById("cart-toggle");
  if (cartToggle) {
    cartToggle.addEventListener("click", toggleCart);
  }
}

function createCartContainer() {
  // Remove existing cart container if it exists
  const existingCart = document.getElementById("cart-container");
  if (existingCart) {
    existingCart.remove();
  }

  // Create shopping cart display
  const cartContainer = document.createElement("div");
  cartContainer.id = "cart-container";
  cartContainer.style.display = "none";
  cartContainer.innerHTML = `
        <div class="cart-header">
            <h3>Shopping Cart</h3>
            <button id="close-cart" class="close-cart-btn">&times;</button>
        </div>
        <div id="cart-items"></div>
        <div id="cart-total">Total: R0.00</div>
        <button id="checkout-btn">Proceed to Checkout</button>
    `;
  document.body.appendChild(cartContainer);

  // Add event listeners for cart functionality
  document.getElementById("close-cart").addEventListener("click", toggleCart);
  document
    .getElementById("checkout-btn")
    .addEventListener("click", proceedToCheckout);
}

function toggleCart() {
  const cartContainer = document.getElementById("cart-container");
  isCartVisible = !isCartVisible;
  cartContainer.style.display = isCartVisible ? "block" : "none";
}

function addToCart(productName, productPrice) {
  // Check if product already exists in cart
  const existingProductIndex = shoppingCart.findIndex(
    (item) => item.name === productName
  );

  if (existingProductIndex > -1) {
    // Update quantity if product exists
    shoppingCart[existingProductIndex].quantity += 1;
  } else {
    // Add new product to cart
    shoppingCart.push({
      name: productName,
      price: parseFloat(productPrice),
      quantity: 1,
    });
  }

  // Save to localStorage
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

  // Update cart display
  updateCartDisplay();

  // Show notification
  showCartNotification(productName);
}

function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  if (!cartItems || !cartTotal || !cartCount) return;

  cartItems.innerHTML = "";
  let total = 0;
  let itemCount = 0;

  // Add each item to cart display
  shoppingCart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    itemCount += item.quantity;

    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">R${item.price.toFixed(2)} x ${
      item.quantity
    }</span>
            </div>
            <div class="cart-item-total">R${itemTotal.toFixed(2)}</div>
            <button class="remove-from-cart" data-index="${index}">Remove</button>
        `;
    cartItems.appendChild(itemElement);
  });

  // Update total price and cart count
  cartTotal.textContent = `Total: R${total.toFixed(2)}`;
  cartCount.textContent = itemCount;

  // Add event listeners to remove buttons
  document.querySelectorAll(".remove-from-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const index = parseInt(this.dataset.index);
      removeFromCart(index);
    });
  });
}

function removeFromCart(index) {
  shoppingCart.splice(index, 1);
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  updateCartDisplay();
}

function proceedToCheckout() {
  if (shoppingCart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const total = shoppingCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  alert(
    `Thank you for your order! Total: R${total.toFixed(
      2
    )}\n\nThis is a demo - in a real site, this would proceed to payment.`
  );

  // Clear cart after checkout
  shoppingCart = [];
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  updateCartDisplay();
  toggleCart();
}

// Show notification when product is added to cart
function showCartNotification(productName) {
  // Remove existing notification if any
  const existingNotification = document.querySelector(".cart-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = "cart-notification";
  notification.textContent = `✓ ${productName} added to cart!`;
  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Products page functionality
function initializeProductsPage() {
  // Add search and filter functionality
  addSearchFilter();

  // Add shopping cart functionality to "Add to Cart" buttons
  addCartFunctionality();
}

// Search and filter products
function addSearchFilter() {
  const filterBtn = document.getElementById("filterBtn");
  const searchInput = document.getElementById("productSearch");
  const categoryFilter = document.getElementById("categoryFilter");

  if (filterBtn && searchInput && categoryFilter) {
    // Use debounced search for better performance
    const debouncedFilter = debounce(filterProducts, 300);

    filterBtn.addEventListener("click", filterProducts);
    searchInput.addEventListener("input", debouncedFilter);
    categoryFilter.addEventListener("change", filterProducts);

    // Initial filter to show all products
    filterProducts();
  }
}

// Filter products based on search term and category
function filterProducts() {
  const searchTerm = document
    .getElementById("productSearch")
    .value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const products = document.querySelectorAll(".product-card");
  let visibleCount = 0;

  products.forEach((product) => {
    const productName = product
      .querySelector(".product-name")
      .textContent.toLowerCase();
    const productDescription = product
      .querySelector(".product-description")
      .textContent.toLowerCase();
    const productCategory = product.dataset.category;

    let matchesSearch =
      productName.includes(searchTerm) ||
      productDescription.includes(searchTerm);
    let matchesCategory = category === "all" || category === productCategory;

    // Show or hide product based on filters
    if (matchesSearch && matchesCategory) {
      product.style.display = "block";
      visibleCount++;
    } else {
      product.style.display = "none";
    }
  });

  // Show message if no products found
  showNoProductsMessage(visibleCount === 0);
}

function showNoProductsMessage(show) {
  let message = document.getElementById("no-products-message");

  if (show && !message) {
    message = document.createElement("div");
    message.id = "no-products-message";
    message.className = "no-products-message";
    message.textContent = "No products found matching your criteria.";
    document.querySelector("main").appendChild(message);
  } else if (!show && message) {
    message.remove();
  }
}

// Shopping cart functionality for product pages
function addCartFunctionality() {
  // Add click events to all "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productName = this.dataset.product;
      const productPrice = parseFloat(this.dataset.price);

      addToCart(productName, productPrice);
    });
  });
}

// Gallery lightbox functionality for image viewing
function initializeGalleryLightbox() {
  // Create the lightbox HTML structure if it doesn't exist
  let lightbox = document.getElementById("lightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close">&times;</span>
                <img src="" alt="Lightbox Image">
                <div class="lightbox-caption"></div>
            </div>
        `;
    document.body.appendChild(lightbox);
  }

  // Get lightbox elements
  const lightboxImg = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const closeBtn = lightbox.querySelector(".close");

  // Add click event to each gallery image
  const galleryImages = document.querySelectorAll(".gallery-image");
  galleryImages.forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", function () {
      lightbox.style.display = "flex";
      lightboxImg.src = this.src;
      lightboxCaption.textContent = this.alt;
    });
  });

  // Close lightbox when close button is clicked
  closeBtn.addEventListener("click", function () {
    lightbox.style.display = "none";
  });

  // Close lightbox when clicking outside the image
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  });

  // Close lightbox with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.style.display === "flex") {
      lightbox.style.display = "none";
    }
  });
}

// Contact page map functionality
function initializeContactMaps() {
  // Initialize Cape Town map
  initializeMap(
    "capeTownMapInner",
    -33.9249,
    18.4241,
    "Nations2Nations Cape Town"
  );

  // Initialize Johannesburg map
  initializeMap(
    "johannesburgMapInner",
    -26.08324363237866,
    27.87616991317245,
    "Nations2Nations Johannesburg"
  );
}

// Initialize a single map with given coordinates
function initializeMap(mapId, lat, lng, popupText) {
  const mapContainer = document.getElementById(mapId);
  if (!mapContainer) return;

  mapContainer.innerHTML = `
        <iframe 
            width="100%" 
            height="100%" 
            frameborder="0" 
            scrolling="no" 
            marginheight="0" 
            marginwidth="0" 
            src="https://www.openstreetmap.org/export/embed.html?bbox=${
              lng - 0.01
            }%2C${lat - 0.01}%2C${lng + 0.01}%2C${
    lat + 0.01
  }&layer=mapnik&marker=${lat}%2C${lng}"
            style="border: 1px solid #ccc"
            title="${popupText}">
        </iframe>
        <br/>
        <small>
            <a href="https://www.openstreetmap.org/?mlat=${lat}&amp;mlon=${lng}#map=15/${lat}/${lng}" target="_blank">View Larger Map</a>
        </small>
    `;
}

// Form validation for contact forms
function initializeFormValidation() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;
      const inputs = form.querySelectorAll(
        "input[required], textarea[required], select[required]"
      );

      // Remove any previous error messages
      form.querySelectorAll(".error-message").forEach((msg) => msg.remove());
      form
        .querySelectorAll(".error")
        .forEach((input) => input.classList.remove("error"));

      // Check each required field
      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add("error");

          // Create and display error message
          const errorMsg = document.createElement("span");
          errorMsg.className = "error-message";
          errorMsg.textContent = "This field is required";
          input.parentNode.appendChild(errorMsg);
        }
      });

      // Validate email format if email field exists
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
          isValid = false;
          emailInput.classList.add("error");
          const errorMsg = document.createElement("span");
          errorMsg.className = "error-message";
          errorMsg.textContent = "Please enter a valid email address";
          emailInput.parentNode.appendChild(errorMsg);
        }
      }

      // If form is valid, show success message and reset form
      if (isValid) {
        const submitBtn = form.querySelector(".submit-btn");
        const originalText = submitBtn.textContent;

        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
          alert(
            "Thank you! Your message has been sent successfully. We will get back to you soon."
          );
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 1500);
      }
    });
  });
}

// Initialize features based on current page
function initializePageSpecificFeatures() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  console.log("Initializing features for page:", currentPage);

  // Initialize features for specific pages
  switch (currentPage) {
    case "index.html":
    case "":
      // Home page specific features
      console.log("Initializing home page features");
      break;

    case "products.html":
      console.log("Initializing products page features");
      initializeProductsPage();
      break;

    case "gallery.html":
      console.log("Initializing gallery page features");
      initializeGalleryLightbox();
      break;

    case "contact.html":
      console.log("Initializing contact page features");
      initializeContactMaps();
      initializeFormValidation();
      break;

    case "about.html":
      console.log("Initializing about page features");
      // About page specific features can be added here
      break;

    default:
      console.log("Initializing default page features");
      break;
  }

  // Initialize form validation on all pages that have forms
  if (document.querySelector("form")) {
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
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Service Worker for caching - improves performance for returning visitors
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) =>
        console.log("Service Worker registered successfully")
      )
      .catch((error) =>
        console.log("Service Worker registration failed:", error)
      );
  });
}