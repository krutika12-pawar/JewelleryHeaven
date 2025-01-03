document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Save message to Firebase
    saveMessage(name, email, message);
});

// Function to save message to Firebase
function saveMessage(name, email, message) {
    const messagesRef = ref(db, 'messages'); // Reference to 'messages' node
    const newMessageRef = push(messagesRef); // Create a new message reference

    set(newMessageRef, {
        name: name,
        email: email,
        message: message
    })
        .then(() => {
            console.log('Message sent successfully!');
            document.getElementById('contactForm').reset(); // Reset form after submission
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
}