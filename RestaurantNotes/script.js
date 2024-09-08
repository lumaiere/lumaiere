document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const addButton = document.getElementById('addRestaurant');

    // Add event listener for adding a new restaurant
    addButton.addEventListener('click', function() {
        const name = prompt("Enter restaurant name:");
        if (name) {
            let restaurants = JSON.parse(localStorage.getItem('restaurants') || "[]");
            restaurants.push({name: name, notes: ""});
            localStorage.setItem('restaurants', JSON.stringify(restaurants));
            loadRestaurants();
        }
    });

    function loadRestaurants(filter = '') {
        const restaurants = JSON.parse(localStorage.getItem('restaurants') || "[]");
        const listDiv = document.getElementById('restaurantList');
        listDiv.innerHTML = '';

        const filteredRestaurants = restaurants.filter(resto => 
            resto.name.toLowerCase().includes(filter.toLowerCase())
        );

        filteredRestaurants.forEach((resto, index) => {
            const div = document.createElement('div');
            div.className = 'restaurant';
            div.innerHTML = `
                <h3>${resto.name}</h3>
                <textarea class="note" data-index="${index}" placeholder="Enter your notes here...">${resto.notes}</textarea>
                <button class="delete-btn" onclick="deleteRestaurant(${index})">Delete</button>
            `;
            listDiv.appendChild(div);
        });

        document.querySelectorAll('.note').forEach(textarea => {
            textarea.addEventListener('blur', function() {
                const index = this.getAttribute('data-index');
                const newNote = this.value;
                let restaurants = JSON.parse(localStorage.getItem('restaurants'));
                restaurants[index].notes = newNote;
                localStorage.setItem('restaurants', JSON.stringify(restaurants));
            });
        });
    }

    function searchRestaurants() {
        const filter = searchInput.value.trim();
        loadRestaurants(filter);
    }

    function deleteRestaurant(index) {
        if (confirm("Are you sure you want to delete this restaurant?")) {
            let restaurants = JSON.parse(localStorage.getItem('restaurants'));
            restaurants.splice(index, 1);
            localStorage.setItem('restaurants', JSON.stringify(restaurants));
            loadRestaurants();
        }
    }

    // Initial load of restaurants
    loadRestaurants();
});

// Exporting functions for global use if needed
window.searchRestaurants = searchRestaurants;
window.deleteRestaurant = deleteRestaurant;