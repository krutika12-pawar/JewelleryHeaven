document.addEventListener('DOMContentLoaded', function () {
    // localStorage.removeItem('cart');
    updateCartCount();
    displayCartCount();
    displayCartItems();
    updateCartStatus();

    const checkoutButton = document.getElementById('checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function () {
            // Redirect to payment page in a new tab
            window.location.href = 'payment.html';
        });
    }

    document.addEventListener('navbarLoaded', updateCartCount);

});

function updateCartStatus() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutButton = document.getElementById('checkout-btn');

    // Enable or disable checkout button based on cart length
    if (checkoutButton) {
        if (cart.length === 0) {
            checkoutButton.disabled = true;
            checkoutButton.style.cursor = 'not-allowed';
        } else {
            checkoutButton.disabled = false;
            checkoutButton.style.cursor = 'pointer';
        }
    }
}

function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const totalAmountElement = document.getElementById('totalAmount');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    let totalCartAmount = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        if (totalAmountElement) {
            totalAmountElement.textContent = '0.00';
        }
    } else {
        let cartHTML = '';

        cart.forEach(item => {
            // Remove currency symbol and price lable and convert to number
            const itemPrice = parseFloat(item.price.replace('Price: £', '').trim());
            const itemQuantity = parseInt(item.quantity, 10);

            //  price or quantity is (invalid)
            if (isNaN(itemPrice) || isNaN(itemQuantity)) {
                console.error(`Invalid data for item: ${item.name}, price: ${item.price}, quantity: ${item.quantity}`);
                return;
            }

            const itemTotal = itemPrice * itemQuantity;
            totalCartAmount += itemTotal;

            // Append item details to the cart HTML
            cartHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>Price: £${itemPrice.toFixed(2)}</p>
                        <p>Quantity: ${itemQuantity}</p> 
                        <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
                    </div>
                </div>
            `;
        });

        // Update the cart HTML and total amount
        cartContainer.innerHTML = cartHTML;
        if (totalAmountElement) {
            totalAmountElement.textContent = totalCartAmount.toFixed(2);
        }
    }
    // Store totalCartAmount in localStorage
    localStorage.setItem('totalCartAmount', totalCartAmount);
}

updateCartCount();
displayCartCount();

function removeFromCart(name) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart count after removing an item
    updateCartCount();
    displayCartCount();
    displayCartItems();
}

