document.addEventListener('DOMContentLoaded', function () {
    updateWishlistCount();
    document.addEventListener('navbarLoaded', updateWishlistCount);
    const wishlistContainer = document.getElementById('wishlist-items');
    const checkoutBtn = document.getElementById('checkout-btn');

    function renderWishlistItems() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlistContainer.innerHTML = '';

        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
            checkoutBtn.style.display = 'none';
        } else {
            wishlist.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('wishlist-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>Price: £${item.price}</p>
                        <button class="remove-btn" data-id="${item.id}">Remove</button>
                    </div>
                `;
                wishlistContainer.appendChild(itemElement);
            });
            checkoutBtn.style.display = 'block';
        }
        updateWishlistCount();
    }
    renderWishlistItems();

    wishlistContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-btn')) {
            const productId = e.target.getAttribute('data-id');
            removeFromWishlist(productId);
            renderWishlistItems();
        }
    });

    function removeFromWishlist(productId) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist = wishlist.filter(item => item.id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
    }

    // Move all wishlist items to the cart when the button is clicked
    checkoutBtn.addEventListener('click', function () {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Add all wishlist items to the cart
        wishlist.forEach(item => {
            if (!item.quantity) {
                item.quantity = 1;  
            }
            cart.push(item);
        });

        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.removeItem('wishlist');
        window.location.href = 'cart.html';
    });
});


function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const count = wishlist.length;
    const countElement = document.getElementById('navbarWishlistCount');
    if (countElement) {
        countElement.textContent = count > 0 ? count : 0;
        countElement.style.display = count > 0 ? 'inline-block' : 'none';
    }
    console.log('Wishlist count updated:', count);
}