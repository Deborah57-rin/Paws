// JavaScript for meeting scheduling page

const API_URL = '/api';
let selectedDogs = []; // This now contains MongoDB _ids
let allDogs = [];
let currentUser = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadSelectedDogs();
    setupFormListener();
});

// Check if user is authenticated
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to schedule a meeting');
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
        
        // Pre-fill form with user data
        if (currentUser) {
            document.getElementById('name').value = currentUser.name || '';
            document.getElementById('email').value = currentUser.email || '';
            document.getElementById('phone').value = currentUser.phone || '';
        }
    } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}

// Load selected dogs from user's saved progress
async function loadSelectedDogs() {
    try {
        const token = localStorage.getItem('token');
        
        // First try to get from user profile
        const response = await fetch(`${API_URL}/user/adoption-progress`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.progress.selectedDogs && data.progress.selectedDogs.length > 0) {
                selectedDogs = data.progress.selectedDogs.map(dog => dog._id);
                allDogs = data.progress.selectedDogs;
                displaySelectedDogs();
                return;
            }
        }
        
        // Fallback to session storage
        const storedSelection = sessionStorage.getItem('selectedDogs');
        if (storedSelection) {
            selectedDogs = JSON.parse(storedSelection);
            await loadDogsData();
        } else {
            alert('No dogs selected. Please go back and select dogs first.');
            return;
        }
    } catch (error) {
        console.error('Error loading selected dogs:', error);
        // Fallback to session storage
        const storedSelection = sessionStorage.getItem('selectedDogs');
        if (storedSelection) {
            selectedDogs = JSON.parse(storedSelection);
            await loadDogsData();
        } else {
            alert('No dogs selected. Please go back and select dogs first.');
        }
    }
}

// Load dogs data from API using MongoDB _ids
async function loadDogsData() {
    try {
        // Get all dogs and filter by selected IDs
        const response = await fetch(`${API_URL}/browse/all`);
        const data = await response.json();
        
        if (data.success) {
            allDogs = data.dogs.filter(dog => selectedDogs.includes(dog._id));
            displaySelectedDogs();
        }
    } catch (error) {
        console.error('Error loading dogs data:', error);
    }
}

// Display selected dogs
function displaySelectedDogs() {
    const container = document.getElementById('selected-dogs-list');
    
    if (allDogs.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">No dogs selected</p>';
        return;
    }
    
    container.innerHTML = allDogs.map(dog => `
        <div class="dog-card border-2 border-green-300 bg-white rounded-xl overflow-hidden">
            <div class="relative">
                <img src="${dog.image}" alt="${dog.name}" class="w-full h-48 object-cover">
                <div class="absolute top-2 right-2">
                    <span class="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        ${dog.adopted ? 'Adopted' : 'Available'}
                    </span>
                </div>
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
async function scheduleMeeting() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to schedule a meeting');
        window.location.href = 'login.html';
        return;
    }

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        location: document.getElementById('location').value,
        notes: document.getElementById('notes').value
    };
    
    // Validate date is in the future
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate <= today) {
        alert('Please select a future date for the meeting.');
        return;
    }
    
    try {
        // Save meeting to database
        const response = await fetch(`${API_URL}/meeting/schedule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                dogIds: selectedDogs, // This contains MongoDB _ids
                meetingDetails: formData
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store first dog ID for paperwork
            if (selectedDogs.length > 0) {
                sessionStorage.setItem('adoptionDogId', selectedDogs[0]);
            }
            
            alert('Meeting scheduled successfully! You will receive a confirmation email shortly.');
            window.location.href = 'paperwork.html';
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error scheduling meeting:', error);
        alert('Error scheduling meeting. Please try again.');
    }
}