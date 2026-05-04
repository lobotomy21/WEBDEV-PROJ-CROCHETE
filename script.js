// CROCHET MARKETPLACE - JAVASCRIPT dlkafjdlka;skf aniamlkadlfkadflalaldflallllllll chuhcubangbang bububu


// Product Data
const products = [
    { id: 1, name: 'CROCHETED SWEATER', price: 500, category: 'clothing', image: 'images/sweater.png', description: 'A cozy crocheted sweater perfect for cooler days.' },
    { id: 2, name: 'BOOTIES', price: 250, category: 'footwear', image: 'images/booties.png', description: 'Soft handmade baby booties for comfort and style.' },
    { id: 3, name: 'CROCHETED KEYCHAIN', price: 50, category: 'accessories', image: 'images/flower.png', description: 'A charming crocheted keychain to brighten every bag.' },
    { id: 4, name: 'BAG', price: 400, category: 'accessories', image: 'images/basket.png', description: 'A durable crochet basket bag made for everyday use.' },
    { id: 5, name: 'SCARF', price: 350, category: 'clothing', image: 'images/sweater.png', description: 'A soft sculpted scarf to keep you warm in style.' },
    { id: 6, name: 'HAT', price: 200, category: 'clothing', image: 'images/flower.png', description: 'A cute handmade hat with a crocheted finish.' },
    { id: 7, name: 'BLANKET', price: 800, category: 'home', image: 'images/basket.png', description: 'A warm blanket perfect for cozy home nights.' },
    { id: 8, name: 'COASTER SET', price: 150, category: 'home', image: 'images/flower.png', description: 'A pretty coaster set finished in crochet detail.' }
];

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentSellerImage = '';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Update cart count in navigation
    updateCartCount();
    
    // Page-specific initialization
    if (currentPage === 'shop.html' || currentPage === '') {
        initializeShopPage();
    } else if (currentPage === 'login.html') {
        initializeLoginPage();
    } else if (currentPage === 'sellers.html') {
        initializeSellersPage();
    } else if (currentPage === 'product.html') {
        initializeProductPage();
    } else if (currentPage === 'cart.html') {
        initializeCartPage();
    }
}


// SHOP PAGE FUNCTIONS


function initializeShopPage() {
    // Add search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Add filter functionality
    const filterButtons = document.querySelectorAll('.sidebar-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterProducts(this.textContent);
        });
    });

    // Render seller-uploaded products THEN attach cart buttons to ALL cards
    renderShopProducts();
    addCartButtons();
}

function renderShopProducts() {
    const sellerProducts = getSellerProducts();
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid || sellerProducts.length === 0) return;

    sellerProducts.forEach(product => {
        const card = createProductCard(product);
        productGrid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('a');
    card.href = `product.html?id=${product.id}`;
    card.className = 'product-card';
    card.dataset.productId = product.id;

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'product-image';

    const image = document.createElement('img');
    image.src = product.image || 'images/flower.png';
    image.alt = product.name;
    image.className = 'product-thumb';

    imageWrapper.appendChild(image);
    card.appendChild(imageWrapper);

    const info = document.createElement('div');
    info.className = 'product-info';

    const name = document.createElement('p');
    name.className = 'product-name';
    name.textContent = product.name.toUpperCase();

    const price = document.createElement('p');
    price.className = 'product-price';
    price.textContent = `PHP${product.price}`;

    info.appendChild(name);
    info.appendChild(price);
    card.appendChild(info);

    return card;
}

function getSellerProducts() {
    return JSON.parse(localStorage.getItem('sellerProducts')) || [];
}

function saveSellerProducts(items) {
    localStorage.setItem('sellerProducts', JSON.stringify(items));
}

function initializeCartPage() {
    renderCartPage();

    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty. Add items before checking out.');
                return;
            }
            showSuccessMessage('Checkout feature is coming soon!');
        });
    }
}

function renderCartPage() {
    const cartList = document.querySelector('.cart-list');
    const cartItemsCount = document.querySelector('.summary-items-count');
    const cartTotal = document.querySelector('.summary-total');
    const emptyState = document.querySelector('.cart-empty');
    const cartContainer = document.querySelector('.cart-items');

    if (!cartList || !cartItemsCount || !cartTotal || !cartContainer) return;

    const grouped = cart.reduce((acc, item) => {
        const key = item.id || `${item.name}-${item.price}`;
        if (!acc[key]) {
            acc[key] = { ...item, quantity: 0 };
        }
        acc[key].quantity += 1;
        return acc;
    }, {});

    const items = Object.values(grouped);
    cartList.innerHTML = '';

    if (items.length === 0) {
        emptyState.style.display = 'block';
        cartList.style.display = 'none';
        cartTotal.textContent = 'PHP0';
        cartItemsCount.textContent = '0';
        return;
    }

    emptyState.style.display = 'none';
    cartList.style.display = 'grid';

    let total = 0;
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'cart-card';

        const image = document.createElement('img');
        // If image wasn't stored (base64 seller photo), look it up from sellerProducts by ID
        let imgSrc = item.image;
        if (!imgSrc) {
            const sellerProducts = getSellerProducts();
            const match = sellerProducts.find(p => String(p.id) === String(item.id));
            imgSrc = match ? match.image : 'images/flower.png';
        }
        image.src = imgSrc;
        image.alt = item.name;
        image.className = 'cart-card-image';

        const details = document.createElement('div');
        details.className = 'cart-card-details';

        const name = document.createElement('p');
        name.className = 'cart-card-name';
        name.textContent = item.name;

        const quantity = document.createElement('p');
        quantity.className = 'cart-card-quantity';
        quantity.textContent = `Quantity: ${item.quantity}`;

        const price = document.createElement('p');
        price.className = 'cart-card-price';
        price.textContent = `PHP${item.price * item.quantity}`;

        const removeButton = document.createElement('button');
        removeButton.className = 'btn-secondary remove-btn';
        removeButton.textContent = 'REMOVE';
        removeButton.addEventListener('click', function() {
            removeCartItem(item);
        });

        details.appendChild(name);
        details.appendChild(quantity);
        details.appendChild(price);
        details.appendChild(removeButton);

        card.appendChild(image);
        card.appendChild(details);
        cartList.appendChild(card);

        total += item.price * item.quantity;
    });

    cartItemsCount.textContent = items.reduce((sum, item) => sum + item.quantity, 0);
    cartTotal.textContent = `PHP${total}`;
}

function removeCartItem(itemToRemove) {
    // Find and remove only ONE instance of the item, not all of them
    const index = cart.findIndex(item => 
        String(item.id) === String(itemToRemove.id) &&
        item.name === itemToRemove.name &&
        item.price === itemToRemove.price
    );
    if (index !== -1) {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartPage();
    showSuccessMessage(`${itemToRemove.name} removed from cart.`);
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterProducts(category) {
    console.log('Filtering by:', category);
    // Add your filtering logic here
    showSuccessMessage('Filter applied: ' + category);
}

function addCartButtons() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        // Skip if already has an Add to Cart button
        if (card.querySelector('.add-to-cart-btn')) return;

        const addToCartBtn = document.createElement('button');
        addToCartBtn.textContent = 'ADD TO CART';
        addToCartBtn.className = 'btn-primary add-to-cart-btn';
        addToCartBtn.style.marginTop = '0.5rem';
        addToCartBtn.style.fontSize = '0.7rem';
        addToCartBtn.style.padding = '0.5rem 1rem';
        
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const product = getProductFromCard(card);
            if (product) {
                addToCart(product);
            }
        });
        
        card.appendChild(addToCartBtn);
    });
}

function getProductFromCard(card) {
    const nameElement = card.querySelector('.product-name');
    const priceElement = card.querySelector('.product-price');
    const imageElement = card.querySelector('.product-thumb, img');
    const hrefId = card.dataset.productId || new URL(card.href, window.location.origin).searchParams.get('id');

    const name = nameElement ? nameElement.textContent.trim() : 'ITEM';
    const priceText = priceElement ? priceElement.textContent.trim().replace(/[^0-9]/g, '') : '0';
    const image = imageElement ? imageElement.src : 'images/flower.png';

    return {
        id: hrefId ? Number(hrefId) : Date.now(),
        name,
        price: Number(priceText) || 0,
        image
    };
}


// CART FUNCTIONS


function addToCart(product) {
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image && product.image.startsWith('data:') ? null : (product.image || 'images/flower.png')
    };
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showSuccessMessage(`Product added to cart: ${product.name}`);
}

function updateCartCount() {
    const cartLinks = document.querySelectorAll('a[href="cart.html"]');
    cartLinks.forEach(link => {
        const count = cart.length;
        link.textContent = `CART (${count})`;
    });
}

function showSuccessMessage(message) {
    // Remove any existing success messages to prevent pile-up
    document.querySelectorAll('.success-message').forEach(el => el.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}


// LOGIN PAGE FUNCTIONS


function initializeLoginPage() {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Sign up form
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Social login buttons
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.textContent;
            showSuccessMessage(`Logging in with ${provider}...`);
        });
    });
}

// Helper: get registered users from localStorage
function getRegisteredUsers() {
    return JSON.parse(localStorage.getItem('registeredUsers')) || [];
}

// Helper: save registered users to localStorage
function saveRegisteredUsers(users) {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
}

// Helper: show an error message (auto-removes after 3s)
function showErrorMessage(message) {
    // Remove any existing error messages first
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;

    // Style it inline so it works without extra CSS
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

function handleLogin(e) {
    e.preventDefault();

    const inputs = e.target.querySelectorAll('.login-input');
    const username = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    // Basic validation
    if (!username || !password) {
        showErrorMessage('Please fill in all fields.');
        return;
    }

    const users = getRegisteredUsers();
    const matchedUser = users.find(
        user => user.username === username && user.password === password
    );

    if (!matchedUser) {
        // Check if username even exists
        const userExists = users.find(user => user.username === username);
        if (!userExists) {
            showErrorMessage('Account not found. Please sign up first.');
        } else {
            showErrorMessage('Incorrect password. Please try again.');
        }
        return;
    }

    // Login success
    showSuccessMessage('Sign in successfully!');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function handleSignup(e) {
    e.preventDefault();

    const inputs = e.target.querySelectorAll('.login-input, .signup-input');
    const username = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    if (!username || !password) {
        showErrorMessage('Please fill in all fields.');
        return;
    }

    const users = getRegisteredUsers();
    const alreadyExists = users.find(user => user.username === username);

    if (alreadyExists) {
        showErrorMessage('Username already taken. Please choose another.');
        return;
    }

    // Register new user
    users.push({ username, password });
    saveRegisteredUsers(users);

    showSuccessMessage(`Account created for "${username}"! You can now log in.`);
    e.target.reset();
}


// SELLERS PAGE FUNCTIONS


function initializeSellersPage() {
    const sellForm = document.querySelector('.sell-form');
    if (sellForm) {
        sellForm.addEventListener('submit', handleSellItem);
    }
    
    // Image upload functionality
    const uploadBox = document.querySelector('.upload-box');
    if (uploadBox) {
        uploadBox.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = handleImageUpload;
            input.click();
        });
    }
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentSellerImage = e.target.result;
            const uploadBox = document.querySelector('.upload-box');
            uploadBox.style.backgroundImage = `url(${currentSellerImage})`;
            uploadBox.style.backgroundSize = 'cover';
            uploadBox.style.backgroundPosition = 'center';
            uploadBox.querySelector('.upload-text').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

function handleSellItem(e) {
    e.preventDefault();
    
    const formInputs = e.target.querySelectorAll('.form-input, .form-textarea');
    const itemData = {
        id: Date.now(),
        name: formInputs[0].value,
        category: formInputs[1].value,
        size: formInputs[2].value,
        price: Number(formInputs[3].value),
        description: formInputs[4].value,
        image: currentSellerImage || 'images/flower.png'
    };
    
    // Validation
    if (!itemData.name || !itemData.category || !itemData.price) {
        alert('Please fill in all required fields');
        return;
    }
    
    const sellerProducts = getSellerProducts();
    sellerProducts.push(itemData);
    saveSellerProducts(sellerProducts);

    showSuccessMessage('Your product has been posted successfully!');
    
    // Reset form
    e.target.reset();
    currentSellerImage = '';
    const uploadBox = document.querySelector('.upload-box');
    uploadBox.style.backgroundImage = '';
    uploadBox.querySelector('.upload-text').style.display = 'block';
}

// ========================================
// PRODUCT DETAIL PAGE FUNCTIONS
// ========================================

function initializeProductPage() {
    const product = getProductFromUrl();
    if (!product) return;

    populateProductDetail(product);

    const productDetails = document.querySelector('.product-details');
    if (productDetails) {
        const buyBtn = document.createElement('button');
        buyBtn.textContent = 'ADD TO CART';
        buyBtn.className = 'btn-primary';
        buyBtn.style.marginTop = '2rem';
        buyBtn.style.width = '100%';
        
        buyBtn.addEventListener('click', function() {
            const productImage = document.querySelector('.product-detail-thumb');
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: productImage ? productImage.src : product.image || 'images/flower.png'
            });
        });
        
        productDetails.appendChild(buyBtn);
    }
}

function getProductFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    if (!productId) return null;

    const allProducts = products.concat(getSellerProducts());
    return allProducts.find(item => String(item.id) === productId) || null;
}

function populateProductDetail(product) {
    const imageElement = document.querySelector('.product-detail-thumb');
    const titleElement = document.querySelector('.product-title');
    const priceElement = document.querySelector('.product-details .detail-item');
    const descriptionElement = document.querySelector('.detail-description');

    if (imageElement) {
        imageElement.src = product.image || 'images/flower.png';
        imageElement.alt = product.name;
    }
    if (titleElement) {
        titleElement.textContent = product.name.toUpperCase();
    }
    if (priceElement) {
        priceElement.textContent = `PRICE: PHP${product.price}`;
    }
    if (descriptionElement) {
        descriptionElement.textContent = product.description || 'A beautiful handmade item, ready for your home.';
    }
}


// UTILITY FUNCTIONS


function formatPrice(price) {
    return `PHP ${price}`;
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add active state to navigation
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.style.fontWeight = 'bold';
        link.style.textDecoration = 'underline';
    }
});
