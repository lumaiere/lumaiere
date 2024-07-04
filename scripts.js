document.addEventListener("DOMContentLoaded", function() {
    const artDisplay = document.getElementById("art-display");
    const galleryView = document.getElementById("gallery-view");

    let currentIndex = 0;
    let intervalId;
    let isClicked = false;
    let validArtFiles = [];

    function preloadImages() {
        fetchArtFiles()
            .then(files => {
                validArtFiles = files.filter(file => file.match(/^art\d+\.jpg$/i));
                return Promise.all(validArtFiles.map(file => loadImage(file)));
            })
            .then(() => {
                showNextImage();
                intervalId = setInterval(nextImage, 4000);
            })
            .catch(error => console.error('Error loading images:', error));
    }

    function fetchArtFiles() {
        return new Promise((resolve, reject) => {
            fetch('./')
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const links = Array.from(doc.querySelectorAll('a')).map(a => a.getAttribute('href'));
                    resolve(links);
                })
                .catch(error => reject(error));
        });
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
