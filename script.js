// to open sign up popup on clicking sign in button

$(document).on('click', '#signUpButton', function () {
    showSignupPopup();
});

function showSignupPopup() {
    document.getElementById('popupContainer').style.display = 'block';
}

$(document).on('click', '#closePopup', function () {
    closeSignupPopup();
});

function closeSignupPopup() {
    const popupContainer = document.getElementById('popupContainer');
    if (popupContainer) {
        popupContainer.style.display = 'none';
    }
}


// sign in pop up open and close

$(document).on('click', '#signInButton', function () {
    showSigninPopup();
});

function showSigninPopup() {
    document.getElementById('signinPopupContainer').style.display = 'block';
}

$(document).on('click', '#closeSigninPopup', function () {
    closeSigninPopup();
});

function closeSigninPopup() {
    const signinPopupContainer = document.getElementById('signinPopupContainer');
    if (signinPopupContainer) {
        signinPopupContainer.style.display = 'none';
    }
}

window.addEventListener('click', function (event) {
    if (event.target === popupContainer || event.target === signinPopupContainer) {
        closeSignupPopup();
        closeSigninPopup();
    }
});



//button redirection from home page banners

function redirectToEarrings() {
    window.location.href = 'earrings.html';
}
function redirectToRings() {
    window.location.href = 'rings.html';
}
function redirectToPendants() {
    window.location.href = 'pendant.html';
}
function redirectToBangles() {
    window.location.href = 'bangles.html';
}
function redirectToAnklet() {
    window.location.href = 'anklet.html';
}
function redirectToBridalCollection() {
    window.location.href = 'bridal-collection.html';
}
function redirectToHomepage() {
    window.location.href = 'homePage.html';
}



// search

function searchContent() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const items = document.querySelectorAll('.menu-item');

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchInput)) {
            item.style.display = ''; // Show item if it matches
        } else {
            item.style.display = 'none'; // Hide item if it doesn't match
        }
    });
}

// testimonial section

const testimonials = [
    {
        text: "I absolutely love my new jewelry! The quality is amazing, and the customer service was top-notch!",
        name: "- Sarah J."
    },
    {
        text: "The gold exchange program was so easy to use. I got a great deal on my new ring!",
        name: "- John D."
    },
    {
        text: "I received my order quickly, and the pieces are even more beautiful in person!",
        name: "- Emily R."
    },
    {
        text: "Fantastic experience! The staff was very helpful in choosing the perfect piece.",
        name: "- Michael T."
    }
];

let currentIndex = 0;

function changeTestimonial(direction) {
    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = testimonials.length - 1; // Loop to the last testimonial
    } else if (currentIndex >= testimonials.length) {
        currentIndex = 0; // Loop to the first testimonial
    }

    document.getElementById("testimonial-text").innerText = testimonials[currentIndex].text;
    document.getElementById("customer-name").innerText = testimonials[currentIndex].name;
}

// Automatic slider functionality
setInterval(() => {
    changeTestimonial(1);
}, 5000);

// Initialize the first testimonial
changeTestimonial(0);

// category slider


const container = document.querySelector('.cat-img-container');
const images = document.querySelectorAll('.img-box');
const totalImages = images.length;
let currentCatIndex = 0;

function slideImages() {
    currentCatIndex++;
    if (currentCatIndex >= totalImages) {
        currentCatIndex = 0; 
    }
    const offset = -currentCatIndex * (images[0].clientWidth + 20);
    container.style.transform = `translateX(${offset}px)`;
}

setInterval(slideImages, 2000);


// redirection of gifts options

function redirectToGifts() {
    window.location.href = 'gifts.html';
}

