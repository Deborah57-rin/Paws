// JavaScript for handling authentication form toggling

document.addEventListener('DOMContentLoaded', function() {
    // Get all toggle form links
    const toggleLinks = document.querySelectorAll('.toggle-form');
    
    // Add click event listeners to all toggle links
    toggleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const showForm = this.getAttribute('data-show');
            toggleForms(showForm);
        });
    });
});

// Function to toggle between signup and login forms
function toggleForms(showForm) {
    const signupForm = document.querySelector('.signup-form');
    const loginForm = document.querySelector('.login-form');
    
    if (showForm === 'login') {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }
}

