document.addEventListener('DOMContentLoaded', () => {
    const totalAmount = localStorage.getItem('totalCartAmount');
    const totalAmountElement = document.getElementById('totalAmount');

    // Display total cart amount in the payment page
    if (totalAmount) {
        totalAmountElement.textContent = `${parseFloat(totalAmount).toFixed(2)}`;
    } else {
        totalAmountElement.textContent = '£0.00';
    }

    const paymentForm = document.getElementById('paymentForm');
    if (!paymentForm) {
        console.log('Payment form not found!');
        return;
    }

    const cardDetails = document.getElementById('cardDetails');
    const creditCardRadio = document.getElementById('creditCard');
    const paypalRadio = document.getElementById('paypal');

    //  form submit 
    paymentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const addressFields = addressForm.querySelectorAll('input');
        let addressValid = true;
        addressFields.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'red'; 
                addressValid = false;
            } else {
                input.style.borderColor = ''; 
            }
        });

        if (!addressValid) {
            alert('Please fill in all shipping address fields.');
            return;
        }
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        if (selectedMethod === 'card') {
            const cardNumber = document.getElementById('cardNumber').value;
            const cardHolder = document.getElementById('cardHolder').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;

            if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
                alert('Please fill in all card details.');
                return;
            }

            alert('Payment successful using card!');
            window.location.href = 'homePage.html';

        } else if (selectedMethod === 'paypal') {
            console.log('PayPal selected');
            alert('Redirecting to PayPal...');
            window.open('https://www.paypal.com', '_blank');
        }

        // clear the cart and redirect to a success page
        localStorage.removeItem('cart');
    });

    // payment method change and toggle card details visibility
    paymentForm.addEventListener('change', (event) => {
        if (event.target === creditCardRadio) {
            cardDetails.style.display = 'block';
            const requiredInputs = cardDetails.querySelectorAll('input[required]');
            requiredInputs.forEach(input => input.setAttribute('required', true));
        } else if (event.target === paypalRadio) {
            cardDetails.style.display = 'none';
            const requiredInputs = cardDetails.querySelectorAll('input[required]');
            requiredInputs.forEach(input => input.removeAttribute('required'));
        }
    });
});
