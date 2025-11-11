// JavaScript for browse dogs page

const API_URL = 'data/dogs.json';
let allDogs = [];
let selectedDogs = [];
let filteredDogs = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadDogs();
    setupEventListeners();
});

// Load all dogs from API
async function loadDogs() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        allDogs = data.dogs;
        filteredDogs = [...allDogs];
        
        // Display all dogs initially
        displayDogs(filteredDogs);
    } catch (error) {
        console.error('Error loading dogs:', error);
        document.getElementById('dogs-container').innerHTML = '<p class="text-center">Unable to load dogs. Please try again later.</p>';
    }
}

// Set up event listeners for filters and buttons
function setupEventListeners() {
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    document.getElementById('proceed-btn').addEventListener('click', proceedToMeeting);
}

// Apply filters to dogs
function applyFilters() {
    const sizeFilter = document.getElementById('size-filter').value;
    const ageFilter = document.getElementById('age-filter').value;
    const locationFilter = document.getElementById('location-filter').value;
    const genderFilter = document.getElementById('gender-filter').value;
    
    filteredDogs = allDogs.filter(dog => {
        // Size filter
        if (sizeFilter !== 'all' && dog.size !== sizeFilter) return false;
        
        // Age filter
        if (ageFilter !== 'all') {
            const age = dog.age.toLowerCase();
            if (ageFilter === 'puppy' && !age.includes('puppy') && !age.includes('year') && parseInt(age) > 1) return false;
            if (ageFilter === 'young' && !(parseInt(age) >= 1 && parseInt(age) <= 3)) return false;
            if (ageFilter === 'adult' && !(parseInt(age) >= 3 && parseInt(age) <= 8)) return false;
            if (ageFilter === 'senior' && !(parseInt(age) > 8)) return false;
        }
        
        // Location filter
        if (locationFilter !== 'all' && dog.location !== locationFilter) return false;
        
        // Gender filter
        if (genderFilter !== 'all' && dog.gender !== genderFilter) return false;
        
        return true;
    });
    
    displayDogs(filteredDogs);
}

// Clear all filters
function clearFilters() {
    document.getElementById('size-filter').value = 'all';
    document.getElementById('age-filter').value = 'all';
    document.getElementById('location-filter').value = 'all';
    document.getElementById('gender-filter').value = 'all';
    
    filteredDogs = [...allDogs];
    displayDogs(filteredDogs);
}

// Display dogs in the grid
function displayDogs(dogs) {
    const container = document.getElementById('dogs-container');
    
    if (dogs.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="max-w-md mx-auto">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No dogs found</h3>
                    <p class="text-gray-500">Try adjusting your filters to see more results.</p>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = dogs.map(dog => `
        <div class="dog-card ${selectedDogs.includes(dog.id) ? 'selected color-step-1' : ''}">
            <div class="card-image-container">
                <img src="${dog.image}" alt="${dog.name}" class="w-full h-48 object-cover">
                <div class="absolute top-3 right-3">
                    <span class="status-badge ${dog.adopted ? 'status-adopted' : 'status-available'}">
                        ${dog.adopted ? 'Adopted' : 'Available'}
                    </span>
                </div>
            </div>
            <div class="p-5">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-xl font-bold text-gray-900">${dog.name}</h3>
                    <span class="text-sm font-medium px-2 py-1 rounded-full ${getGenderColor(dog.gender)}">
                        ${dog.gender === 'male' ? '♂' : '♀'} ${dog.gender}
                    </span>
                </div>
                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                        ${dog.breed}
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        ${dog.age}
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        ${dog.location}, Nairobi
                    </div>
                </div>
                <p class="text-sm text-gray-600 mb-4 line-clamp-2">${dog.description}</p>
                <button class="w-full select-dog-btn ${selectedDogs.includes(dog.id) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'} text-white px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center" data-id="${dog.id}">
                    ${selectedDogs.includes(dog.id) ? 
                        '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Selected' : 
                        'Select Dog'}
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to select buttons
    document.querySelectorAll('.select-dog-btn').forEach(button => {
        button.addEventListener('click', function() {
            const dogId = parseInt(this.getAttribute('data-id'));
            toggleDogSelection(dogId);
        });
    });
}

// Helper function for gender colors
function getGenderColor(gender) {
    return gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800';
}

// Toggle selection of a dog
function toggleDogSelection(dogId) {
    const index = selectedDogs.indexOf(dogId);
    
    if (index === -1) {
        // Add to selection if less than 3
        if (selectedDogs.length < 3) {
            selectedDogs.push(dogId);
        } else {
            alert('You can only select up to 3 dogs at a time.');
            return;
        }
    } else {
        // Remove from selection
        selectedDogs.splice(index, 1);
    }
    
    // Update display
    displayDogs(filteredDogs);
    updateSelectedCounter();
}

// Update the selected dogs counter and button
function updateSelectedCounter() {
    const counter = document.getElementById('selected-counter');
    const countElement = document.getElementById('selected-count');
    
    countElement.textContent = selectedDogs.length;
    
    if (selectedDogs.length > 0) {
        counter.classList.remove('hidden');
    } else {
        counter.classList.add('hidden');
    }
}

// Proceed to meeting page with selected dogs
function proceedToMeeting() {
    if (selectedDogs.length === 0) {
        alert('Please select at least one dog to proceed.');
        return;
    }
    
    // Store selected dogs in sessionStorage for the next page
    sessionStorage.setItem('selectedDogs', JSON.stringify(selectedDogs));
    window.location.href = 'meeting.html';
}