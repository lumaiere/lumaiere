document.addEventListener("DOMContentLoaded", function() {
    const artDisplay = document.getElementById("art-display");
    const header = document.querySelector("header");

    // Array to hold the file names
    const artFiles = [
        'art1.jpg',
        'art2.jpg',
        'art3.jpg',
        'art4.jpg',
        'art5.jpg',
        'art6.jpg',
        'art7.jpg',
        'art8.jpg',
        'art9.jpg'
    ];

    let currentIndex = 0;

    function showNextImage() {
        // Remove the current image
        artDisplay.innerHTML = '';

        // Create a new image element
        const img = document.createElement("img");
        img.src = artFiles[currentIndex];
        img.alt = `Artwork ${currentIndex + 1}`;

        // Append the image to the display
        artDisplay.appendChild(img);

        // Update the index for the next image
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
