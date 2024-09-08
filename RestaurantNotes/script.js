document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');

    document.getElementById('addRestaurant').addEventListener('click', function() {
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
        
        const filteredRestaurants = filter 
            ? restaurants.filter(resto => resto.name.toLowerCase().includes(filter.toLowerCase()))
            : restaurants;

        filteredRestaurants.forEach((resto, index) => {
            const div = document.createElement('div');
            div.className = 'restaurant';
            div.innerHTML = `<h3>${resto.name}</h3>
                             <textarea class="note" data-index="${index}" placeholder="Enter your notes here...">${resto.notes}</textarea>
                             <button class="delete-btn" onclick="deleteRestaurant(${index})">Delete</button>`;
            listDiv.appendChild(div);
        });

        // Add event listeners for notes
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
        const filter = searchInput.value;
        loadRestaurants(filter);
    }

    function deleteRestaurant(index) {
        let restaurants = JSON.parse(localStorage.getItem('restaurants'));
        const deletedRestaurant = restaurants.splice(index, 1)[0];
        localStorage.setItem('restaurants', JSON.stringify(restaurants));
        loadRestaurants();

        // Undo functionality
        setTimeout(() => {
            if (confirm("Do you want to undo the deletion?")) {
                restaurants.splice(index, 0, deletedRestaurant);
                localStorage.setItem('restaurants', JSON.stringify(restaurants));
                loadRestaurants();
            }
        }, 100); // Immediate prompt for undo
    }

    // Initial load
    loadRestaurants();
});

window.searchRestaurants = searchRestaurants;
window.deleteRestaurant = deleteRestaurant;