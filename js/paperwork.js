// JavaScript for adoption paperwork page

const API_URL = 'data/dogs.json';
let adoptionDog = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadAdoptionDog();
    setupFormListener();
});

// Load the dog being adopted
async function loadAdoptionDog() {
    try {
        // Get dog ID from session storage
        const dogId = sessionStorage.getItem('adoptionDogId');
        if (!dogId) {
            alert('No dog selected for adoption. Please start the process again.');
            return;
        }
        
        // Load all dogs data
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Find the specific dog
        adoptionDog = data.dogs.find(dog => dog.id === parseInt(dogId));
        
        if (!adoptionDog) {
            alert('Dog information not found. Please start the process again.');
            return;
        }
        
        // Display dog information
        displayAdoptionDog();
    } catch (error) {
        console.error('Error loading adoption dog:', error);
    }
}

// Display the dog being adopted
function displayAdoptionDog() {
    const container = document.getElementById('adoption-dog-info');
    
    container.innerHTML = `
        <div class="flex flex-col md:flex-row items-center">
            <img src="${adoptionDog.image}" alt="${adoptionDog.name}" class="w-full md:w-48 h-48 object-cover rounded-lg">
            <div class="md:ml-6 mt-4 md:mt-0">
                <h3 class="text-2xl font-bold">${adoptionDog.name}</h3>
                <p class="text-lg text-gray-700">${adoptionDog.breed} • ${adoptionDog.age} • ${adoptionDog.size}</p>
                <p class="text-gray-600 mt-2">${adoptionDog.location}</p>
                <p class="mt-3">${adoptionDog.description}</p>
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
function submitAdoption() {
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
        },
        dogId: adoptionDog.id
    };
    
    // Validate all agreements are checked
    if (!formData.agreements.agreeCare || !formData.agreements.agreeReturn || 
        !formData.agreements.agreeHomecheck || !formData.agreements.agreeTerms) {
        alert('Please agree to all adoption terms and conditions.');
        return;
    }
    
    // In a real application, you would send this data to a server
    // For this demo, we'll just show a success message
    
    // Store adoption data in sessionStorage
    sessionStorage.setItem('adoptionApplication', JSON.stringify(formData));
    
    // Show success message
    alert('Adoption application submitted successfully! Our team will review your application and contact you within 2-3 business days.');
    
    // In a real app, you would mark the dog as adopted in the database
    // For this demo, we'll just redirect to the homepage
    window.location.href = 'index.html';
}