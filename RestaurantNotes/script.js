document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const addButton = document.getElementById('addRestaurant');
    const restaurantList = document.getElementById('restaurantList');

    addButton.addEventListener('click', function() {
        const name = prompt("Enter restaurant name:");
        if (name) {
            let restaurants = JSON.parse(localStorage.getItem('restaurants') || "[]");
            restaurants.unshift({name: name, notes: ""});
            localStorage.setItem('restaurants', JSON.stringify(restaurants));
            loadRestaurants().then(focusOnNewNote);
        }
    });

    function loadRestaurants(filter = '') {
        const restaurants = JSON.parse(localStorage.getItem('restaurants') || "[]");
        restaurantList.innerHTML = '';

        const filteredRestaurants = restaurants.filter(resto => 
            resto.name.toLowerCase().includes(filter.toLowerCase())
        );

        return new Promise(resolve => {
            filteredRestaurants.forEach((resto, index) => {
                const div = document.createElement('div');
                div.className = 'restaurant';
                div.innerHTML = `
                    <h3>${resto.name}</h3>
                    <textarea class="note" data-index="${index}" placeholder="Enter your notes here...">${resto.notes}</textarea>
                    <button class="delete-btn" data-index="${index}" data-name="${resto.name}">Delete</button>
                `;
                restaurantList.appendChild(div);
                div.querySelector('.delete-btn').addEventListener('click', function(event) {
                    event.preventDefault();
                    const index = this.getAttribute('data-index');
                    const name = this.getAttribute('data-name');
                    deleteRestaurant(index, name);
                });
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

            resolve();
        });
    }

    function focusOnNewNote() {
        const notes = document.querySelectorAll('.note');
        if (notes.length > 0) {
            notes[0].focus();
        }
    }

    function searchRestaurants() {
        const filter = searchInput.value.trim();
        loadRestaurants(filter);
    }

    function deleteRestaurant(index, name) {
        const modal = document.getElementById('deleteModal');
        const modalName = document.getElementById('modalRestaurantName');
        const confirmBtn = document.getElementById('confirmDelete');
        const cancelBtn = document.getElementById('cancelDelete');

        modalName.textContent = name;
        modal.style.display = "block";

        confirmBtn.onclick = function() {
            let restaurants = JSON.parse(localStorage.getItem('restaurants'));
            restaurants.splice(index, 1);
            localStorage.setItem('restaurants', JSON.stringify(restaurants));
            modal.style.display = "none";
            loadRestaurants();
        };

        cancelBtn.onclick = function() {
            modal.style.display = "none";
        };

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    }

    // Initial load of restaurants
    loadRestaurants();
});

// Exporting functions for global use if needed
window.searchRestaurants = searchRestaurants;