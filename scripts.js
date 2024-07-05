document.addEventListener("DOMContentLoaded", function() {
    const artDisplay = document.getElementById("art-display");
    const galleryView = document.getElementById("gallery-view");

    const artFiles = [
        "art1.jpg",
        "art2.jpg",
        "art3.jpg",
        "art4.jpg",
        "art5.jpg",
        "art6.jpg",
        "art7.jpg",
        "art8.jpg",
        "art9.jpg",
        "art10.jpg",
    ];

    let currentIndex = 0;
    let intervalId;
    let isClicked = false;

    function preloadImages() {
        Promise.all(artFiles.map(file => loadImage(file)))
            .then(() => {
                showNextImage();
                intervalId = setInterval(nextImage, 4000);
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
    loadGallery();

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
