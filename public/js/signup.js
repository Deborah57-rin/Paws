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
const signup_name= document.getElementById("name")
const signup_email= document.getElementById("mail")
const signup_password= document.getElementById("pass")
const signup_form=document.getElementById('signup-form')


signup_form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const names= signup_name.value.trim();
    const email= signup_email.value.trim();
    const password= signup_password.value.trim();

    const res = await fetch('/api/user/signup', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({names,email,password})

    })
    const data= await res.json();
    if (data.success) {
    toggleForms('login') 
    } 
    else {
    alert("Invalid login");
    }

});

const login_form=document.getElementById('login-form')
const login_email=document.getElementById('login-email')
const login_pass=document.getElementById('login-pass')

login_form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const mail=login_email.value.trim()
    const pass= login_pass.value.trim()

    const res= await fetch('/api/user/login', {
        method: 'POST',
        headers:{ 'Content-Type': 'application/json' },
        body:JSON.stringify({mail,pass})  

    })

    const data= await res.json();
    if (data.success) {
        localStorage.setItem("token", data.token )
        window.location.href = "index.html";  
    } 
    else {
    alert(data.message);
    }
});
