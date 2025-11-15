// JavaScript for adoption paperwork page

const API_URL = '/api';
let adoptionDog = null;
let currentUser = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadAdoptionDog();
    setupFormListener();
});

// Check if user is authenticated
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to submit adoption paperwork');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Not authenticated');
        }
        
        const data = await response.json();
        currentUser = data.user;
        
        // Pre-fill form with user data if available
        if (currentUser) {
            document.getElementById('full-name').value = currentUser.name || '';
            if (currentUser.address) {
                document.getElementById('address').value = currentUser.address.street || '';
                document.getElementById('city').value = currentUser.address.city || '';
                document.getElementById('state').value = currentUser.address.state || '';
                document.getElementById('zip').value = currentUser.address.zip || '';
            }
        }
    } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}

// Load the dog being adopted using MongoDB _id
async function loadAdoptionDog() {
    try {
        // Get dog ID from session storage (now MongoDB _id)
        const dogId = sessionStorage.getItem('adoptionDogId');
        if (!dogId) {
            alert('No dog selected for adoption. Please start the process again.');
            return;
        }
        
        // Load dog data from API using MongoDB _id
        const response = await fetch(`${API_URL}/browse/${dogId}`);
        const data = await response.json();
        
        if (data.success) {
            adoptionDog = data.dog;
            
            if (!adoptionDog) {
                alert('Dog information not found. Please start the process again.');
                return;
            }
            
            // Display dog information
            displayAdoptionDog();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading adoption dog:', error);
        // Fallback: try to get from all dogs
        await loadAdoptionDogFallback();
    }
}

// Fallback method to load adoption dog
async function loadAdoptionDogFallback() {
    try {
        const dogId = sessionStorage.getItem('adoptionDogId');
        if (!dogId) return;
        
        const response = await fetch(`${API_URL}/browse/all`);
        const data = await response.json();
        
        if (data.success) {
            // Find dog by MongoDB _id
            adoptionDog = data.dogs.find(dog => dog._id === dogId);
            
            if (adoptionDog) {
                displayAdoptionDog();
            } else {
                alert('Dog information not found. Please start the process again.');
            }
        }
    } catch (error) {
        console.error('Error in fallback loading:', error);
        alert('Error loading dog information. Please try again.');
    }
}

// Display the dog being adopted
function displayAdoptionDog() {
    const container = document.getElementById('adoption-dog-info');
    
    if (!adoptionDog) {
        container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-red-600">Unable to load dog information.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="flex flex-col items-center">
            <img src="${adoptionDog.image}" alt="${adoptionDog.name}" class="w-full h-48 object-cover rounded-lg mb-4">
            <div class="text-center">
                <h3 class="text-xl font-bold text-gray-800">${adoptionDog.name}</h3>
                <p class="text-sm text-gray-600">${adoptionDog.breed} • ${adoptionDog.age} • ${adoptionDog.size}</p>
                <p class="text-xs text-gray-500 mt-1">${adoptionDog.location}, Nairobi</p>
                <p class="mt-3 text-sm text-gray-700">${adoptionDog.description}</p>
                <div class="mt-3 ${adoptionDog.adopted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} px-3 py-1 rounded-full text-xs font-medium inline-block">
                    ${adoptionDog.adopted ? 'Already Adopted' : 'Available for Adoption'}
                </div>
            </div>
        </div>
    `;
}

// Set up form submission listener
function setupFormListener() {
    document.getElementById('adoption-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitAdoption();
    });
}

// Submit adoption application
async function submitAdoption() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to submit adoption application');
        window.location.href = 'login.html';
        return;
    }

    if (!adoptionDog) {
        alert('No dog selected for adoption. Please start the process again.');
        return;
    }

    if (adoptionDog.adopted) {
        alert('This dog has already been adopted. Please select another dog.');
        return;
    }
    
    // Get form data
    const formData = {
        personalInfo: {
            fullName: document.getElementById('full-name').value,
            dob: document.getElementById('dob').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value
        },
        homeEnvironment: {
            housing: document.getElementById('housing').value,
            ownRent: document.getElementById('own-rent').value,
            yard: document.getElementById('yard').value,
            fenced: document.getElementById('fenced').value
        },
        familyPets: {
            adults: document.getElementById('adults').value,
            children: document.getElementById('children').value,
            otherPets: document.getElementById('other-pets').value,
            petsFixed: document.getElementById('pets-fixed').value
        },
        previousExperience: {
            previousDog: document.getElementById('previous-dog').value,
            previousDogFate: document.getElementById('previous-dog-fate').value
        },
        agreements: {
            agreeCare: document.getElementById('agree-care').checked,
            agreeReturn: document.getElementById('agree-return').checked,
            agreeHomecheck: document.getElementById('agree-homecheck').checked,
            agreeTerms: document.getElementById('agree-terms').checked
        }
    };
    
    // Validate required fields
    if (!validateForm(formData)) {
        return;
    }
    
    // Validate all agreements are checked
    if (!formData.agreements.agreeCare || !formData.agreements.agreeReturn || 
        !formData.agreements.agreeHomecheck || !formData.agreements.agreeTerms) {
        alert('Please agree to all adoption terms and conditions.');
        return;
    }
    
    try {
        // Submit adoption application to backend
        const response = await fetch(`${API_URL}/adoption/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                dogId: adoptionDog._id, // Using MongoDB _id
                applicationData: formData
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Show success message
            showSuccessMessage();
            
            // Clear session storage
            sessionStorage.removeItem('adoptionDogId');
            sessionStorage.removeItem('selectedDogs');
            
            // Redirect to user profile after delay
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 3000);
            
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error submitting adoption:', error);
        alert('Error submitting adoption application. Please try again.');
    }
}

// Validate form data
function validateForm(formData) {
    const requiredFields = [
        { field: formData.personalInfo.fullName, name: 'Full Name' },
        { field: formData.personalInfo.dob, name: 'Date of Birth' },
        { field: formData.personalInfo.address, name: 'Address' },
        { field: formData.personalInfo.city, name: 'City' },
        { field: formData.personalInfo.state, name: 'State' },
        { field: formData.personalInfo.zip, name: 'ZIP Code' },
        { field: formData.homeEnvironment.housing, name: 'Housing Type' },
        { field: formData.homeEnvironment.ownRent, name: 'Own or Rent' },
        { field: formData.homeEnvironment.yard, name: 'Yard Information' },
        { field: formData.familyPets.adults, name: 'Number of Adults' },
        { field: formData.familyPets.children, name: 'Number of Children' },
        { field: formData.familyPets.otherPets, name: 'Other Pets Information' },
        { field: formData.previousExperience.previousDog, name: 'Previous Dog Experience' }
    ];
    
    for (let required of requiredFields) {
        if (!required.field || required.field.toString().trim() === '') {
            alert(`Please fill in the ${required.name} field.`);
            return false;
        }
    }
    
    // Validate numbers
    if (formData.familyPets.adults < 1) {
        alert('There must be at least 1 adult in the household.');
        return false;
    }
    
    if (formData.familyPets.children < 0) {
        alert('Number of children cannot be negative.');
        return false;
    }
    
    return true;
}

// Show success message
function showSuccessMessage() {
    // Create success modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white p-8 rounded-xl max-w-md mx-4 text-center">
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Application Submitted!</h3>
            <p class="text-gray-600 mb-4">
                Your adoption application has been submitted successfully! 
                Our team will review your application and contact you within 2-3 business days.
            </p>
            <div class="text-sm text-gray-500">
                <p>You will be redirected to your profile shortly...</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Remove modal after 3 seconds
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 3000);
}

// Add some utility functions to enhance user experience
function formatPhoneNumber(phone) {
    // Simple phone number formatting
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

// Add input formatting if needed
document.addEventListener('DOMContentLoaded', function() {
    // Format phone number input if exists
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            const formatted = formatPhoneNumber(e.target.value);
            if (formatted !== e.target.value) {
                e.target.value = formatted;
            }
        });
    }
    
    // Add date validation for date of birth
    const dobInput = document.getElementById('dob');
    if (dobInput) {
        dobInput.addEventListener('change', function(e) {
            const selectedDate = new Date(e.target.value);
            const today = new Date();
            const minAgeDate = new Date();
            minAgeDate.setFullYear(today.getFullYear() - 18); // Must be at least 18 years old
            
            if (selectedDate > minAgeDate) {
                alert('You must be at least 18 years old to adopt a dog.');
                e.target.value = '';
            }
        });
    }
});