// script.js

// Sample products
const products = [
    {
        id: 1,
        name: "Premium Car Seat Covers",
        price: 14489,
        image: "71lnSCyAI9L._AC_UF894,1000_QL80_.jpg",
        category: "Interior",
        description: "High-quality leather seat covers for ultimate comfort and style"
    },
    {
        id: 2,
        name: "LED Headlight Kit",
        price: 20930,
        image: "6X-White-9005-H11-LED-Headlights-High-Low-H11-H8-Fog-Light-Bulbs-Kit_ffced9b7-068f-4076-a44f-6a0732d6b420.4284acc0cb5d4270d13e49100cfef8e3.jpeg.jpg",
        category: "Exterior",
        description: "9005+H11/H8+H9 LED headlights for superior visibility"
    },
    {
        id: 3,
        name: "Wireless Phone Charger",
        price: 6440,
        image: "61-0co+zBCL.jpg",
        category: "Electronics",
        description: "Fast PD30W QC3.0 wireless charging for your devices"
    },
    {
        id: 4,
        name: "All-Weather Floor Mats",
        price: 9660,
        image: "81stNKZdeLL.jpg",
        category: "Interior",
        description: "Durable rubber mats that protect your car's interior"
    },
    {
        id: 5,
        name: "Steering Wheel Cover",
        price: 4025,
        image: "71bPFuA9mBL.jpg",
        category: "Interior",
        description: "Comfortable grip and stylish design for better driving experience"
    },
    {
        id: 6,
        name: "Car Vacuum Cleaner",
        price: 8050,
        image: "www.autozone.com_shop-and-garage-tools_vacuum-cleaner-and-components_p_armor-all-utility-vacuum-2-5-gallon_110468_0_0.png.jpg",
        category: "Cleaning",
        description: "Armor All 2.5-gallon utility vacuum for spotless interiors"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let lastOrder = JSON.parse(localStorage.getItem('lastOrder')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Format JMD currency
function formatJMD(amount) {
    return `JMD $${amount.toLocaleString('en-JM')}`;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    // Display products on homepage and products page
    if (document.querySelector('.products-grid')) {
        displayProducts(products);
    }

    // Update cart count
    updateCartCount();

    // Display cart items if on cart page
    if (document.getElementById('cart-items')) {
        displayCartItems();
    }

    // Display checkout items if on checkout page
    if (document.getElementById('checkout-items')) {
        displayCheckoutItems();
    }

    // Display invoice items if on invoice page
    if (document.getElementById('invoice-items')) {
        displayInvoiceItems();
    }

    // Update profile display
    updateProfileDisplay();

    // Add event listeners to buttons
    addEventListeners();

    // Add clear cart button listener
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Add print invoice button listener
    const printInvoiceBtn = document.getElementById('print-invoice');
    if (printInvoiceBtn) {
        printInvoiceBtn.addEventListener('click', printInvoice);
    }
});

// Update profile display based on login status
function updateProfileDisplay() {
    const profileLink = document.querySelector('.profile-link');
    if (!profileLink) return;

    if (currentUser) {
        // User is logged in - show name and profile
        profileLink.innerHTML = `
            <a href="#" class="profile-icon logged-in">
                <i class="fas fa-user-circle"></i>
                <span>Hello, ${currentUser.name.split(' ')[0]}</span>
            </a>
            <div class="profile-dropdown">
                <a href="#" class="dropdown-item" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </a>
            </div>
        `;

        // Add logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    } else {
        // User is not logged in - show login link
        profileLink.innerHTML = `
            <a href="login.html" class="profile-icon">
                <i class="fas fa-user-circle"></i>
                <span>Login</span>
            </a>
        `;
    }
}

// Handle user logout
function handleLogout(e) {
    e.preventDefault();
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateProfileDisplay();
    showNotification('Logged out successfully!');

    // Redirect to home page after logout
    setTimeout(() => {
        if (window.location.pathname.includes('login.html') ||
            window.location.pathname.includes('register.html')) {
            window.location.href = 'index.html';
        }
    }, 1000);
}

// Handle user registration
function handleRegister(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('fullname'),
        email: formData.get('email'),
        username: formData.get('username')
    };

    // Save user to localStorage
    currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    showNotification('Registration successful! Welcome, ' + userData.name + '!');

    // Update profile display
    updateProfileDisplay();

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Handle user login
function handleLogin(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = formData.get('username');

    // For demo purposes, create a simple user object
    // In a real app, you would verify credentials from a server
    const userData = {
        name: username.charAt(0).toUpperCase() + username.slice(1), // Capitalize first letter
        email: username + '@example.com',
        username: username
    };

    // Save user to localStorage
    currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    showNotification('Login successful! Welcome back, ' + userData.name + '!');

    // Update profile display
    updateProfileDisplay();

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Display products in the grid
function displayProducts(products) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card bounce';

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWNmZGZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${formatJMD(product.price)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });
}

// Add event listeners
function addEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }

        // Quantity controls
        if (e.target.classList.contains('quantity-btn')) {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            const isIncrease = e.target.classList.contains('increase');
            updateQuantity(itemId, isIncrease);
        }

        // Remove item
        if (e.target.classList.contains('remove-item')) {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(itemId);
        }
    });

    // Form submissions
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update UI
    updateCartCount();

    // Show confirmation
    showNotification(`${product.name} added to cart!`);
}

function updateQuantity(itemId, isIncrease) {
    const item = cart.find(item => item.id === itemId);
    if (!item) return;

    if (isIncrease) {
        item.quantity += 1;
    } else {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(itemId);
            return;
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();

    showNotification('Item removed from cart');
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    const cartSubtotalContainer = document.getElementById('cart-subtotal');
    const cartTaxContainer = document.getElementById('cart-tax');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartTotalContainer) cartTotalContainer.textContent = formatJMD(0);
        if (cartSubtotalContainer) cartSubtotalContainer.textContent = formatJMD(0);
        if (cartTaxContainer) cartTaxContainer.textContent = formatJMD(0);
        return;
    }

    cartItemsContainer.innerHTML = '';

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWNmZGZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzZjNzU4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-price">${formatJMD(item.price)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
            <div class="cart-item-total">
                ${formatJMD(itemTotal)}
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    if (cartSubtotalContainer) cartSubtotalContainer.textContent = formatJMD(subtotal);
    if (cartTaxContainer) cartTaxContainer.textContent = formatJMD(tax);
    if (cartTotalContainer) cartTotalContainer.textContent = formatJMD(total);
}

// Display checkout items
function displayCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutSubtotalContainer = document.getElementById('checkout-subtotal');
    const checkoutTaxContainer = document.getElementById('checkout-tax');
    const checkoutTotalContainer = document.getElementById('checkout-total');

    if (!checkoutItemsContainer) return;

    if (cart.length === 0) {
        checkoutItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (checkoutSubtotalContainer) checkoutSubtotalContainer.textContent = formatJMD(0);
        if (checkoutTaxContainer) checkoutTaxContainer.textContent = formatJMD(0);
        if (checkoutTotalContainer) checkoutTotalContainer.textContent = formatJMD(0);
        return;
    }

    checkoutItemsContainer.innerHTML = '';

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.style.cssText = 'display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #e5e7eb;';

        checkoutItem.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <div>Qty: ${item.quantity}</div>
            </div>
            <div>${formatJMD(itemTotal)}</div>
        `;

        checkoutItemsContainer.appendChild(checkoutItem);
    });

    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    if (checkoutSubtotalContainer) checkoutSubtotalContainer.textContent = formatJMD(subtotal);
    if (checkoutTaxContainer) checkoutTaxContainer.textContent = formatJMD(tax);
    if (checkoutTotalContainer) checkoutTotalContainer.textContent = formatJMD(total);
}

// Display invoice items
function displayInvoiceItems() {
    const invoiceItemsContainer = document.getElementById('invoice-items');
    const invoiceSubtotalContainer = document.getElementById('invoice-subtotal');
    const invoiceTaxContainer = document.getElementById('invoice-tax');
    const invoiceTotalContainer = document.getElementById('invoice-total');
    const invoiceDateContainer = document.getElementById('invoice-date');

    if (!invoiceItemsContainer) return;

    // Set invoice date
    if (invoiceDateContainer) {
        const today = new Date();
        invoiceDateContainer.textContent = today.toLocaleDateString();
    }

    const invoiceItems = lastOrder.length > 0 ? lastOrder : cart;

    if (invoiceItems.length === 0) {
        invoiceItemsContainer.innerHTML = '<tr><td colspan="4" class="empty-cart">No items in invoice</td></tr>';
        if (invoiceSubtotalContainer) invoiceSubtotalContainer.textContent = formatJMD(0);
        if (invoiceTaxContainer) invoiceTaxContainer.textContent = formatJMD(0);
        if (invoiceTotalContainer) invoiceTotalContainer.textContent = formatJMD(0);
        return;
    }

    invoiceItemsContainer.innerHTML = '';

    let subtotal = 0;

    invoiceItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const invoiceRow = document.createElement('tr');

        invoiceRow.innerHTML = `
            <td>${item.name}</td>
            <td>${formatJMD(item.price)}</td>
            <td>${item.quantity}</td>
            <td>${formatJMD(itemTotal)}</td>
        `;

        invoiceItemsContainer.appendChild(invoiceRow);
    });

    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    if (invoiceSubtotalContainer) invoiceSubtotalContainer.textContent = formatJMD(subtotal);
    if (invoiceTaxContainer) invoiceTaxContainer.textContent = formatJMD(tax);
    if (invoiceTotalContainer) invoiceTotalContainer.textContent = formatJMD(total);
}

// Clear cart function
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
    showNotification('Cart cleared');
}

// Print invoice function
function printInvoice() {
    window.print();
    lastOrder = [];
    localStorage.removeItem('lastOrder');
}

// Handle checkout
function handleCheckout(e) {
    e.preventDefault();

    // Save current cart as lastOrder before clearing
    lastOrder = [...cart];
    localStorage.setItem('lastOrder', JSON.stringify(lastOrder));

    showNotification('Order placed successfully!');

    // Clear cart after saving the order
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Redirect to invoice page
    setTimeout(() => {
        window.location.href = 'invoice.html';
    }, 1500);
}

// Utility functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #065f46;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add slide animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .bounce {
        animation: bounceIn 0.6s ease;
    }
    
    /* Profile dropdown styles */
    .profile-link {
        position: relative;
    }
    
    .profile-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        min-width: 150px;
        display: none;
        z-index: 1000;
    }
    
    .profile-link:hover .profile-dropdown {
        display: block;
    }
    
    .dropdown-item {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        text-decoration: none;
        color: #1f2937;
        transition: background-color 0.3s ease;
    }
    
    .dropdown-item:hover {
        background-color: #ecfdf5;
    }
    
    .dropdown-item i {
        margin-right: 0.5rem;
        color: #065f46;
    }
    
    .logged-in {
        background-color: #065f46 !important;
        color: white !important;
    }
    
    .logged-in i {
        color: white !important;
    }
`;
document.head.appendChild(style);