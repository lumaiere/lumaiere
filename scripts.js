document.addEventListener("DOMContentLoaded", function() {
    const artDisplay = document.getElementById("art-display");
    const galleryView = document.createElement('div');
    galleryView.id = "gallery-view";
    document.body.appendChild(galleryView);
    
    // Generate an array of 100 art file names
    const artFiles = Array.from({length: 100}, (_, i) => `art${i + 1}.jpg`);

    let currentIndex = 0;
    let intervalId;
    let isClicked = false;
    const validArtFiles = [];

    function preloadImages() {
        let loadedImages = 0;
        artFiles.forEach(file => {
            const img = new Image();
            img.src = file;
            img.onload = function() {
                validArtFiles.push(file);
                loadedImages++;
                if (loadedImages === artFiles.length) {
                    // All images preloaded, start the display loop
                    showNextImage();
                    intervalId = setInterval(nextImage, 4000);
                }
            };
            img.onerror = function() {
                loadedImages++;
                if (loadedImages === artFiles.length) {
                    // All images preloaded, start the display loop
                    showNextImage();
                    intervalId = setInterval(nextImage, 4000);
                }
            };
        });
    }

    function showNextImage() {
        if (isClicked) return;

        const img = new Image();
        img.src = validArtFiles[currentIndex];
        img.classList.add('fade'); // Add class for fade effect

        img.onload = function() {
            artDisplay.innerHTML = '';
            artDisplay.appendChild(img);
            setTimeout(() => {
                img.style.opacity = '1'; // Fade in the image
            }, 100);
        };

        currentIndex = (currentIndex + 1) % validArtFiles.length;
    }

    function nextImage() {
        const currentImg = artDisplay.querySelector('img');
        if (currentImg) {
            currentImg.style.opacity = '0';
        }
        
        setTimeout(() => {
            showNextImage();
        }, 2000);
    }

    function loadGallery() {
        validArtFiles.forEach((file, index) => {
            const img = new Image();
            img.src = file;
            img.alt = `Artwork ${index + 1}`;

            img.onload = function() {
                const galleryImg = new Image();
                galleryImg.src = file;
                galleryImg.alt = `Artwork ${index + 1}`;
                galleryImg.addEventListener('click', function() {
                    isClicked = true;
                    clearInterval(intervalId);
                    scrollToTop();
                    showImageForDuration(file, 30000);
                });
                galleryView.appendChild(galleryImg);
            };
        });
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function showImageForDuration(src, duration) {
        const img = new Image();
        img.src = src;
        img.classList.add('fade');
        img.onload = function() {
            artDisplay.innerHTML = '';
            artDisplay.appendChild(img);
            setTimeout(() => {
                img.style.opacity = '1';
            }, 100);
        };

        setTimeout(() => {
            isClicked = false;
            intervalId = setInterval(nextImage, 4000);
        }, duration);
    }

    preloadImages();
    loadGallery();

    window.addEventListener('scroll', function() {
        if (window.scrollY > 0) {
            artDisplay.style.opacity = '0';
            galleryView.style.opacity = '1';
        } else {
            artDisplay.style.opacity = '1';
            galleryView.style.opacity = '0';
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerHeight < window.innerWidth) {
            // Landscape
            artDisplay.style.flexDirection = 'row';
        } else {
            // Portrait
            artDisplay.style.flexDirection = 'column';
        }
    });
});
