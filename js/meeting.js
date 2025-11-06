// JavaScript for meeting scheduling page

const API_URL = 'data/dogs.json';
let selectedDogs = [];
let allDogs = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadSelectedDogs();
    setupFormListener();
});

// Load selected dogs from session storage
async function loadSelectedDogs() {
    try {
        // Get selected dog IDs from session storage
        const storedSelection = sessionStorage.getItem('selectedDogs');
        if (!storedSelection) {
            alert('No dogs selected. Please go back and select dogs first.');
            return;
        }
        
        selectedDogs = JSON.parse(storedSelection);
        
        // Load all dogs data
        const response = await fetch(API_URL);
        const data = await response.json();
        allDogs = data.dogs;
        
        // Display selected dogs
        displaySelectedDogs();
    } catch (error) {
        console.error('Error loading selected dogs:', error);
    }
}

// Display selected dogs
function displaySelectedDogs() {
    const container = document.getElementById('selected-dogs-list');
    
    const selectedDogData = allDogs.filter(dog => selectedDogs.includes(dog.id));
    
    if (selectedDogData.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">No dogs selected</p>';
        return;
    }
    
    container.innerHTML = selectedDogData.map(dog => `
        <div class="dog-card border-2 border-green-300 bg-white rounded-xl overflow-hidden">
            <div class="relative">
                <img src="${dog.image}" alt="${dog.name}" class="w-full md:w-50 h-48 object-cover r">
                
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg text-gray-900 mb-1">${dog.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${dog.breed} • ${dog.age}</p>
                <div class="flex items-center text-xs text-gray-500">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    </svg>
                    ${dog.location}
                </div>
            </div>
        </div>
    `).join('');
}

// Set up form submission listener
function setupFormListener() {
    document.getElementById('meeting-form').addEventListener('submit', function(e) {
        e.preventDefault();
        scheduleMeeting();
    });
}

// Schedule meeting and proceed to paperwork
function scheduleMeeting() {
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        location: document.getElementById('location').value,
        notes: document.getElementById('notes').value,
        selectedDogs: selectedDogs
    };
    
    // Validate date is in the future
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate <= today) {
        alert('Please select a future date for the meeting.');
        return;
    }
    
    // Store meeting details in sessionStorage
    sessionStorage.setItem('meetingDetails', JSON.stringify(formData));
    
    // For this demo, we'll just proceed with the first selected dog
    if (selectedDogs.length > 0) {
        sessionStorage.setItem('adoptionDogId', selectedDogs[0]);
    }
    
    // Show success message and redirect
    alert('Meeting scheduled successfully! You will receive a confirmation email shortly.');
    window.location.href = 'paperwork.html';
}