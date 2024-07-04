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
        img.classList.add('fade'); // Add class for fade effect

        img.onload = function() {
            // If the image loads successfully, display it
            artDisplay.innerHTML = '';
            artDisplay.appendChild(img);
            setTimeout(() => {
                img.style.opacity = '1'; // Fade in the image
            }, 100); // Delay to ensure image is in DOM
        };

        img.onerror = function() {
            // If the image fails to load, move to the next one immediately
            currentIndex = (currentIndex + 1) % artFiles.length;
            showNextImage();
        };

        // Update the index for the next image
        currentIndex = (currentIndex + 1) % artFiles.length;
    }

    function nextImage() {
        // Fade out the current image
        const currentImg = artDisplay.querySelector('img');
        if (currentImg) {
            currentImg.style.opacity = '0';
        }
        
        setTimeout(() => {
            showNextImage(); // Show the next image after the fade-out
        }, 500); // Half a second for fade-out
    }

    // Show the first image immediately
    showNextImage();

    // Change the image every 2 seconds with a smooth fade
    setInterval(nextImage, 2000);

    // Show the header when scrolling down
    window.addEventListener('scroll', function() {
        if (window.scrollY > window.innerHeight) {
            header.style.display = 'flex';
        } else {
            header.style.display = 'none';
        }
    });
});
