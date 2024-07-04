document.addEventListener("DOMContentLoaded", function() {
    const artDisplay = document.getElementById("art-display");
    const header = document.querySelector("header");

    // Generate an array of 100 art file names
    const artFiles = Array.from({length: 100}, (_, i) => `art${i + 1}.jpg`);

    let currentIndex = 0;

    function showNextImage() {
        // Check if the current image exists
        const img = new Image();
        img.src = artFiles[currentIndex];

        img.onload = function() {
            // If the image loads successfully, display it
            artDisplay.innerHTML = '';
            artDisplay.appendChild(img);
        };

        img.onerror = function() {
            // If the image fails to load, move to the next one immediately
            currentIndex = (currentIndex + 1) % artFiles.length;
            showNextImage();
        };

        // Update the index for the next image after 2 seconds
        currentIndex = (currentIndex + 1) % artFiles.length;
    }

    // Show the first image immediately
    showNextImage();

    // Change the image every 2 seconds
    setInterval(showNextImage, 2000);

    // Show the header when scrolling down
    window.addEventListener('scroll', function() {
        if (window.scrollY > window.innerHeight) {
            header.style.display = 'flex';
        } else {
            header.style.display = 'none';
        }
    });
});
