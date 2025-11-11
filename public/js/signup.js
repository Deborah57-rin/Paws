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
    
    // Add fade out effect first
    if (showForm === 'login') {
        signupForm.style.opacity = '0';
        setTimeout(() => {
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            setTimeout(() => {
                loginForm.style.opacity = '1';
            }, 50);
        }, 300);
    } else {
        loginForm.style.opacity = '0';
        setTimeout(() => {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            setTimeout(() => {
                signupForm.style.opacity = '1';
            }, 50);
        }, 300);
    }
}

// Prevent form submission for demo (remove in production)
document.getElementById('signup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your form submission logic here
});

document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your form submission logic here
});