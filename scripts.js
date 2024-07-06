document.addEventListener("DOMContentLoaded", function() {
    const artDisplay = document.getElementById("art-display");
    const galleryView = document.getElementById("gallery-view");

    const totalImages = 100; // Maximum number of images
    const artFiles = [];
    let currentIndex = 0;
    let intervalId;
    let isClicked = false;

    function preloadImages() {
        const loadPromises = [];

        for (let i = 1; i <= totalImages; i++) {
            const file = `art${i}.jpg`;
            loadPromises.push(
                loadImage(file).then(img => artFiles.push(file)).catch(err => console.error(err))
            );
        }

        Promise.all(loadPromises)
            .then(() => {
                if (artFiles.length > 0) {
                    showNextImage();
                    intervalId = setInterval(nextImage, 4000);
                    loadGallery();
                } else {
                    console.error('No images to display');
                }
            })
            .catch(error => console.error('Error loading images:', error));
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        });
    }

    function showNextImage() {
        if (isClicked) return;

        const img = new Image();
        img.src = artFiles[currentIndex];
        img.classList.add('fade'); // Add class for fade effect

        img.onload = function() {
            artDisplay.innerHTML = '';
            artDisplay.appendChild(img);
            setTimeout(() => {
                img.style.opacity = '1'; // Fade in the image
            }, 100);
        };

        currentIndex = (currentIndex + 1) % artFiles.length;
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
        artFiles.forEach((file, index) => {
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

    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;

        if (scrollTop > 0) {
            // Scrolled down, show gallery view and hide art display
            galleryView.style.opacity = '1';
            artDisplay.style.opacity = '0';
        } else {
            // At the top, show art display and hide gallery view
            galleryView.style.opacity = '0';
            artDisplay.style.opacity = '1';
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerHeight < window.innerWidth) {
            // Landscape orientation
            artDisplay.style.flexDirection = 'row';
        } else {
            // Portrait orientation
            artDisplay.style.flexDirection = 'column';
        }
    });
});
