// JavaScript for browse dogs page

const API_URL = '/api/browse';
let allDogs = [];
let selectedDogs = []; // This will now store MongoDB _ids
let filteredDogs = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadDogs();
    setupEventListeners();
});

// Load all dogs from API
async function loadDogs() {
    try {
        const endpoint = `${API_URL}/all`;
        const res = await fetch(endpoint);
        const data = await res.json();
        
        if (data.success) {
            allDogs = data.dogs;
            filteredDogs = [...allDogs];
            
            // Display all dogs initially
            displayDogs(filteredDogs);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading dogs:', error);
        document.getElementById('dogs-container').innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-red-600">Unable to load dogs. Please try again later.</p>
                <p class="text-sm text-gray-500 mt-2">Error: ${error.message}</p>
            </div>
        `;
    }
}

// Set up event listeners for filters and buttons
function setupEventListeners() {
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    document.getElementById('proceed-btn').addEventListener('click', proceedToMeeting);
}

// Apply filters to dogs
async function applyFilters() {
    const sizeFilter = document.getElementById('size-filter').value;
    const ageFilter = document.getElementById('age-filter').value;
    const locationFilter = document.getElementById('location-filter').value;
    const genderFilter = document.getElementById('gender-filter').value;
    
    try {
        // Build query parameters
        const params = new URLSearchParams();
        
        if (sizeFilter !== 'all') params.append('size', sizeFilter);
        if (ageFilter !== 'all') params.append('age', ageFilter);
        if (locationFilter !== 'all') params.append('location', locationFilter);
        if (genderFilter !== 'all') params.append('gender', genderFilter);
        
        const endpoint = `${API_URL}/filter?${params.toString()}`;
        const res = await fetch(endpoint);
        const data = await res.json();
        
        if (data.success) {
            filteredDogs = data.dogs;
            displayDogs(filteredDogs);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error applying filters:', error);
        alert('Error applying filters. Please try again.');
    }
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
        <div class="dog-card bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow ${selectedDogs.includes(dog._id) ? 'ring-2 ring-blue-500' : ''}">
            <div class="card-image-container relative">
                <img src="${dog.image}" alt="${dog.name}" class="w-full h-48 object-cover">
                <div class="absolute top-3 right-3">
                    <span class="status-badge ${dog.adopted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} px-2 py-1 rounded-full text-xs font-medium">
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
                <button class="w-full select-dog-btn ${selectedDogs.includes(dog._id) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'} text-white px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center" data-id="${dog._id}">
                    ${selectedDogs.includes(dog._id) ? 
                        '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Selected' : 
                        'Select Dog'}
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to select buttons
    document.querySelectorAll('.select-dog-btn').forEach(button => {
        button.addEventListener('click', function() {
            const dogId = this.getAttribute('data-id');
            toggleDogSelection(dogId);
        });
    });
}

// Helper function for gender colors
function getGenderColor(gender) {
    return gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800';
}

// Toggle selection of a dog - NOW USING MONGODB _id
function toggleDogSelection(dogId) {
    const index = selectedDogs.indexOf(dogId);
    
    if (index === -1) {
        // Add to selection if less than 3
        if (selectedDogs.length < 3) {
            selectedDogs.push(dogId);
            saveSelectedDogsToProfile();
        } else {
            alert('You can only select up to 3 dogs at a time.');
            return;
        }
    } else {
        // Remove from selection
        selectedDogs.splice(index, 1);
        saveSelectedDogsToProfile();
    }
    
    // Update display
    displayDogs(filteredDogs);
    updateSelectedCounter();
}

// Save selected dogs to user profile - SIMPLIFIED
async function saveSelectedDogsToProfile() {
    const token = localStorage.getItem('token');
    if (!token) return; // Only save if user is logged in
    
    try {
        const response = await fetch(`${API_URL}/user/save-selected-dogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                dogIds: selectedDogs // This now contains MongoDB _ids
            })
        });
        
        const data = await response.json();
        if (!data.success) {
            console.error('Error saving selected dogs:', data.message);
        } else {
            console.log('✅ Selected dogs saved to profile');
        }
    } catch (error) {
        console.error('Error saving selected dogs:', error);
    }
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
    // Now storing MongoDB _ids instead of numeric IDs
    sessionStorage.setItem('selectedDogs', JSON.stringify(selectedDogs));
    
    // Also store the first dog for paperwork
    if (selectedDogs.length > 0) {
        sessionStorage.setItem('adoptionDogId', selectedDogs[0]);
    }
    
    window.location.href = 'meeting.html';
}