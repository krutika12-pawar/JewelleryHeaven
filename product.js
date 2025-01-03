document.addEventListener('DOMContentLoaded', function () {
    const wishlistIcons = document.querySelectorAll('.wishlist-icon');
    const messageElement = document.createElement('div');
    messageElement.id = 'wishlist-message';
    messageElement.className = 'wishlist-message';
    document.body.appendChild(messageElement);

    console.log('Number of wishlist icons found:', wishlistIcons.length);

    wishlistIcons.forEach(icon => {
        icon.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (!isUserLoggedIn()) {
                showSignInPopup("Please sign in to add items to your wishlist");
                return;
            }

            const productItem = this.closest('.collection-item');
            if (!productItem) {
                console.error('Could not find parent .collection-item');
                return;
            }

            const product = {
                id: productItem.dataset.productId,
                name: productItem.querySelector('h3').textContent,
                price: productItem.querySelector('p').textContent.replace('Price: £', ''),
                image: productItem.querySelector('img').src
            };
            toggleWishlistItem(product, this);
        });
    });

    // Create a message element for success notifications
    messageElement.id = 'wishlist-message';
    document.body.appendChild(messageElement);
});

function toggleWishlistItem(product, iconElement) {
    console.log('Toggling wishlist item:', product);
    let wishlist = [];
    try {
        wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
        wishlist = [];
    }

    if (!product || !product.id) {
        console.error('Invalid product data:', product);
        showMessage('Error: Unable to update wishlist.', 'error');
        return;
    }

    wishlist = wishlist.filter(item => item && item.id);

    const index = wishlist.findIndex(item => item.id === product.id);
    if (index === -1) {
        // Add to wishlist
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        console.log('Product added to wishlist');
        showMessage(`${product.name} has been added to your wishlist!`, 'added');
        iconElement.classList.add('active');
    } else {
        // Remove from wishlist
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        console.log('Product removed from wishlist');
        showMessage(`${product.name} has been removed from your wishlist!`, 'removed');
        iconElement.classList.remove('active');
    }
    updateWishlistCount();
}

function updateWishlistIcon(iconElement, productId) {
    let wishlist = [];
    try {
        wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
        return;
    }

    if (wishlist.some(item => item.id === productId)) {
        iconElement.classList.add('active');
    } else {
        iconElement.classList.remove('active');
    }
}

function showMessage(message, type) {
    const messageElement = document.getElementById('wishlist-message');
    messageElement.textContent = message;
    messageElement.className = 'wishlist-message';

    if (type === 'added') {
        messageElement.classList.add('added');
    } else if (type === 'removed') {
        messageElement.classList.add('removed');
    }

    messageElement.style.display = 'block';
    messageElement.style.opacity = '1';

    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 300);
    }, 3000);
}

function isUserLoggedIn() {
    return localStorage.getItem('userLoggedIn') === 'true';
}

function setUserLoggedIn(token) {
    localStorage.setItem('userToken', token);
}

function showSignInPopup() {
    const signinPopup = document.getElementById('signinPopupContainer');
    if (signinPopup) {
        signinPopup.style.display = 'block';
    } else {
        console.error('Sign-in popup element not found');
    }
}

function showSignInPopup(message) {
    const signinPopup = document.getElementById('signinPopupContainer');
    const signinMessage = document.getElementById('signinMessage');

    if (signinPopup && signinMessage) {
        signinMessage.textContent = message || "Sign in and become a part of our luxurious community";
        signinPopup.style.display = 'block';
    } else {
        console.error('Sign-in popup elements not found');
    }
}