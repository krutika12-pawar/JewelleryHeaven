
// Firebase functions import
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, child, get, set, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

//Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6rEwRW4bGKzJomDiLhErs8tBToSxZkbQ",
    authDomain: "the-jewel-box-d54b8.firebaseapp.com",
    databaseURL: "https://the-jewel-box-d54b8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "the-jewel-box-d54b8",
    storageBucket: "the-jewel-box-d54b8.firebasestorage.app",
    messagingSenderId: "739181072665",
    appId: "1:739181072665:web:c7e08376586f7858287588",
    measurementId: "G-E4BKBM1GXV"
};

// Firebase Initialize
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const dbRef = ref(db);
const signupForm = document.getElementById('signupForm');

// firebase functions to access globally
window.db = db;
window.ref = ref;
window.get = get;
window.child = child;
window.push = push;
window.set = set;
window.checkEmailExists = checkEmailExists;

// to get DOM elements
let fname = document.getElementById('first_name');
let lname = document.getElementById('last_name');
let phoneNo = document.getElementById('phone_number');
let emailId = document.getElementById('email_id');
let password = document.getElementById('password');
let confirmPassword = document.getElementById('confirm_password');
let signUpButton = document.getElementById('signup_button');

// To add customer sign in information in database
async function addData() {
    if (!await validateForm()) {
        return;
    }

    try {
        // Create user in Firebase Authentication
        const auth = getAuth(app);
        const userCredential = await createUserWithEmailAndPassword(auth, emailId.value, password.value);
        const user = userCredential.user;

        // Get current customer count
        const snapshot = await get(child(dbRef, 'CustomerCount'));
        const currentCount = (snapshot.exists() ? snapshot.val() : 0) + 1;

        // Customer information object for database
        const customerData = {
            name: { firstName: fname.value, lastName: lname.value },
            phoneNumber: phoneNo.value,
            emailId: emailId.value,
            password: password.value,
            confirmPassword: confirmPassword.value
        };

        // Add customer data to Realtime Database
        await set(ref(db, 'Customers/' + currentCount), customerData);

        // Update customer count after every customer signup
        await set(ref(db, 'CustomerCount'), currentCount);

        document.getElementById('signupForm').reset();
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Registration successful! Sign in using email id and password';
        successMessage.style.cssText = 'position: fixed; top: 20px; right: -220px; transform: translateX(-50%); background-color: #4CAF50; color: white; padding: 15px; border-radius: 5px; z-index: 1000;';
        document.body.appendChild(successMessage);

        // Hide signup form and show signin form
        document.getElementById('popupContainer').style.display = 'none';

        // Remove success message and show signin form after 5 seconds
        setTimeout(() => {
            document.body.removeChild(successMessage);
            document.getElementById('signinPopupContainer').style.display = 'block';
        }, 5000);
    } catch (error) {
        console.error("Registration error:", error);
        alert('Registration failed: ' + error.message);
    }
}

// to check if entered email is already exists in firebase database
function checkEmailExists(email) {
    return get(child(dbRef, 'Customers'))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const customers = snapshot.val();
                return Object.values(customers).some(customer => customer.emailId === email);
            }
            return false;
        })
        .catch((error) => {
            console.error(error);
            return false;
        });
}

// for form submission 
document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (await validateForm()) {
        console.log('Form is valid, ready to submit');
        addData();
    }
});

// to set error message
const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error-message');
    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}

// success msg
const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error-message');
    errorDisplay.innerText = '';
    inputControl.classList.remove('error');
    inputControl.classList.add('success');
}

// regex to check email valid or invalid
const isValidEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// regex to check password
const isValidPassword = password => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
}

// to validate the whole form
const validateForm = async () => {
    let isValid = true;
    const nameValue = fname.value.trim();
    const lnameValue = lname.value.trim();
    const phoneValue = phoneNo.value.trim();
    const emailValue = emailId.value.trim();
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    if (nameValue === '') {
        setError(fname, 'Please enter your first name.');
        isValid = false;
    } else {
        setSuccess(fname);
    }

    if (lnameValue === '') {
        setError(lname, 'Please enter your last name.');
        isValid = false;
    } else {
        setSuccess(lname);
    }

    if (phoneValue === '') {
        setError(phoneNo, 'Please enter your phone number.');
        isValid = false;
    } else if (!/^\d+$/.test(phoneValue)) {
        setError(phoneNo, 'Phone number must contain only digits');
        isValid = false;
    } else if (phoneValue.length < 10) {
        setError(phoneNo, 'Phone number must be at least 10 digits long');
        isValid = false;
    } else {
        setSuccess(phoneNo);
    }

    if (emailValue === '') {
        setError(emailId, 'Please enter your email address.');
        isValid = false;
    } else if (!isValidEmail(emailValue)) {
        setError(emailId, 'Provide a valid email address');
        isValid = false;
    } else {
        try {
            const exists = await checkEmailExists(emailValue);
            if (exists) {
                setError(emailId, 'This email is already registered.');
                isValid = false;
            } else {
                setSuccess(emailId);
            }
        }
        catch (error) {
            console.error("Error checking email:", error);
            setError(emailId, 'An error occurred. Please try again.');
            isValid = false;
        }
        // alert("Something went wrong.")
        // setSuccess(emailId);

    }

    if (passwordValue === '') {
        setError(password, 'Please enter password.');
        isValid = false;
    } else if (!isValidPassword(passwordValue)) {
        // console.log('Password value:', passwordValue);
        setError(password, 'Password must be at least 8 characters long and include uppercase, lowercase, number and special character');
        isValid = false;
    } else {
        setSuccess(password);
    }

    if (confirmPasswordValue === '') {
        setError(confirmPassword, 'Please enter confirm password');
        isValid = false;
    } else if (confirmPasswordValue !== passwordValue) {
        setError(confirmPassword, "Passwords don't match");
        isValid = false;
    } else {
        setSuccess(confirmPassword);
    }
    return isValid;
}


// sign in form validations

const auth = getAuth(app);

const signinForm = document.getElementById('signinForm');
const signinEmailId = document.getElementById('signin_email_id');
const signinPassword = document.getElementById('signin_password');
const signInButton = document.getElementById('signin_button');


document.getElementById('signinForm').addEventListener('submit', function (e) {
    e.preventDefault();
    signin();
});


function validateSigninForm() {
    let isValid = true;

    if (!signinEmailId.value.trim()) {
        setError(signinEmailId, 'Email Id is required');
        isValid = false;
    } else if (!isValidEmail(signinEmailId.value.trim())) {
        setError(signinEmailId, 'Provide a valid email address');
        isValid = false;
    } else {
        setSuccess(signinEmailId);
    }

    if (!signinPassword.value.trim()) {
        setError(signinPassword, 'Password is required');
        isValid = false;
    } else {
        setSuccess(signinPassword);
    }

    return isValid;
}


function checkEmailPasswordExists(email, password) {
    return get(child(dbRef, 'Customers'))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const customers = snapshot.val();
                return Object.values(customers).some(customer =>
                    customer.emailId === email && customer.password === password);
            }
            return false;
        })
        .catch((error) => {
            console.error("Error checking email and password:", error);
            return false;
        });
}

async function signin() {
    const emailValue = signinEmailId.value.trim();
    const passwordValue = signinPassword.value.trim();

    if (!validateSigninForm()) {
        return;
    }

    try {
        const userExists = await checkEmailPasswordExists(emailValue, passwordValue);
        if (userExists) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, emailValue, passwordValue);
                const user = userCredential.user;
                console.log('User signed in:', user);

                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userToken', user.uid);
                saveUserData(user.uid);


                // Get user details from the database
                const customerSnapshot = await get(child(dbRef, 'Customers'));
                if (customerSnapshot.exists()) {
                    const customers = customerSnapshot.val();
                    // Find the customer by email
                    const customer = Object.values(customers).find(customer => customer.emailId === emailValue);
                    if (customer) {
                        // Show success message
                        setSuccess(signinEmailId);
                        setSuccess(signinPassword);
                        const successMessage = document.createElement('div');
                        successMessage.textContent = 'Successfully signed in!';
                        successMessage.style.cssText = 'position: fixed; top: 20px; right: -80px; transform: translateX(-50%); background-color: #4CAF50; color: white; padding: 15px; border-radius: 5px; z-index: 1000;';
                        document.body.appendChild(successMessage);

                        // Redirect user on home page after successful sign in
                        document.getElementById('signinPopupContainer').style.display = 'none';

                        // Remove success message and show signin form after 5 seconds
                        setTimeout(() => {
                            document.body.removeChild(successMessage);
                        }, 600);
                    }
                }
            } catch (error) {
                console.error("Firebase Auth error:", error);
                setError(signinEmailId, 'An error occurred during authentication. Please try again.');
            }
        } else {
            setError(signinEmailId, 'Invalid email or password');
        }
    } catch (error) {
        console.error("Sign-in error:", error);
        setError(signinEmailId, 'An error occurred. Please try again.');
    }
}


// Listen for auth state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in, fetch user data from the database
        // const emailValue = user.email;
        await displayUserName(user.email);

        // Show the logout button
        document.getElementById('logoutButton').style.display = 'inline';
        document.getElementById('signInButton').style.display = 'none';
        document.getElementById('signUpButton').style.display = 'none';

    } else {
        // User is not signed in, hide username and reset UI
        document.getElementById('userGreeting').style.display = 'none';
        document.getElementById('userName').textContent = '';
        document.getElementById('signInButton').style.display = 'inline';
        document.getElementById('signUpButton').style.display = 'inline';
        document.getElementById('logoutButton').style.display = 'none';
    }
});

// Function to display the username after sign-in
async function displayUserName(email) {
    try {
        // Get user details from the database
        const customerSnapshot = await get(child(dbRef, 'Customers'));
        if (customerSnapshot.exists()) {
            const customers = customerSnapshot.val();
            const customer = Object.values(customers).find(customer => customer.emailId === email);
            if (customer) {
                const firstName = customer.name.firstName;

                // Convert first name to uppercase
                const capitalizedFirstName = firstName.toUpperCase();

                // Display username in navbar
                document.getElementById('userGreeting').style.display = 'inline';
                document.getElementById('userName').textContent = capitalizedFirstName;

                // Hide sign-in and sign-up buttons
                document.getElementById('signInButton').style.display = 'none';
                document.getElementById('signUpButton').style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
}

// Logout functionality

document.getElementById('logoutButton').addEventListener('click', logout);

function logout() {
    const auth = getAuth(app);
    const user = auth.currentUser;
    localStorage.removeItem('userToken');
    localStorage.removeItem('userLoggedIn');

    if (user) {
        removeUserData(user.uid);
    }

    // Call signOut() to log the user out of Firebase Authentication
    signOut(auth).then(() => {
        // Sign-out successful
        console.log('User signed out successfully');
        // Create a success message
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Successfully signed out!';
        successMessage.style.cssText = 'position: fixed; top: 20px; right: -80px; transform: translateX(-50%); background-color: #4CAF50; color: white; padding: 15px; border-radius: 5px; z-index: 1000;';
        document.body.appendChild(successMessage);
        // Remove success message after 3 seconds
        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 600);


        // Hide user greeting and logout button, and show sign-in/sign-up buttons
        document.getElementById('userGreeting').style.display = 'none';
        document.getElementById('userName').textContent = ''; // Clear username
        document.getElementById('logoutButton').style.display = 'none';
        // document.getElementById('signInButton').style.display = 'inline';
        // document.getElementById('signUpButton').style.display = 'inline';
        document.getElementById('button-container').style.display = 'none';

        // Clear local storage
        localStorage.removeItem('cart');
        localStorage.removeItem('wishlist');

    }).catch((error) => {
        // An error happened during sign out
        console.error('Error during sign out:', error);
    });
}


// to save cart and wishlist data on sign in
function saveUserData(userId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    set(ref(db, `users/${userId}/cart`), cart);
    set(ref(db, `users/${userId}/wishlist`), wishlist);
}

function removeUserData(userId) {
    set(ref(db, `users/${userId}`), null);
}
