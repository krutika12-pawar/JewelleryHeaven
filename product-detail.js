// Define functions globally
function openProductPopup(element) {
    const popup = document.getElementById('productPopup');
    const productDetails = document.getElementById('productDetails');

    if (!popup || !productDetails) {
        console.error('Popup or product details element not found');
        return;
    }

    const name = element.querySelector('h3').textContent;
    const price = element.querySelector('p').textContent;
    const image = element.querySelector('img').src;

    productDetails.innerHTML = `
        <img class="product-img" src="${image}" alt="${name}">
        <h2>${name}</h2>
        <p>${price}</p>
        <button onclick="addToCart('${name}', '${price}', '${image}')">Add to Cart</button>
    `;

    popup.style.display = 'block';
}

function closeProductPopup() {
    const popup = document.getElementById('productPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

function addToCart(name, price, image) {
    if (!isUserLoggedIn()) {
        closeProductPopup();
        showSignInPopup("Please sign in to add items to your cart");
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the item is already in the cart
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartCount();
    closeProductPopup();
}



// Close the popup when clicking outside of it
window.onclick = function (event) {
    const popup = document.getElementById('productPopup');
    if (event.target === popup) {
        closeProductPopup();
    }
}

// Add event listener to close button
document.addEventListener('DOMContentLoaded', function () {
    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', closeProductPopup);
    }

    // Add click event listeners to all collection items
    const collectionItems = document.querySelectorAll('.collection-item');
    collectionItems.forEach(item => {
        item.addEventListener('click', function () {
            openProductPopup(this);
        });
    });
    updateCartCount();
    displayCartCount();
});


function displayCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('navbarCartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
    // Update localStorage with the new count
    localStorage.setItem('cartCount', cartCount);
}

function updateCartCount() {
    const cartCount = localStorage.getItem('cartCount') || '0';
    const count = cartCount.length;
    const cartCountElement = document.getElementById('navbarCartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = count > 0 ? 'inline-block' : 'none';
    }
    console.log('Cart count updated:', count);
}

