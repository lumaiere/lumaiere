document.addEventListener("DOMContentLoaded", function() {
    const artDisplay = document.getElementById("art-display");
    const galleryView = document.getElementById("gallery-view");

    const maxArtFiles = 100;
    const artFiles = [];
    let currentIndex = 0;
    let intervalId;
    let isClicked = false;

    function imageExists(src) {
        return new Promise(resolve => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
        });
    }

    async function loadArtFiles() {
        for (let i = 1; i <= maxArtFiles; i++) {
            const fileName = `art${i}.jpg`;
            if (await imageExists(fileName)) {
                artFiles.push(fileName);
            }
        }
        if (artFiles.length > 0) {
            preloadImages();
            loadGallery();
        } else {
            console.error('No art files found.');
        }
    }

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

    function showImage(index) {
        const img = new Image();
        img.src = artFiles[index];
        img.classList.add('fade'); // Add class for fade effect

        img.onload = function() {
            artDisplay.innerHTML = '';
            artDisplay.appendChild(img);
            setTimeout(() => {
                img.style.opacity = '1'; // Fade in the image
            }, 100);
        };
    }

    function showNextImage() {
        if (isClicked) return;

        const currentImg = artDisplay.querySelector('img');
        if (currentImg) {
            currentImg.style.opacity = '0';
        }
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % artFiles.length;
            showImage(currentIndex);
        }, 1000); // Reduced time to 1 second for fading effect
    }

    function showPrevImage() {
        if (isClicked) return;

        const currentImg = artDisplay.querySelector('img');
        if (currentImg) {
            currentImg.style.opacity = '0';
        }

        setTimeout(() => {
            currentIndex = (currentIndex - 1 + artFiles.length) % artFiles.length;
            showImage(currentIndex);
        }, 1000); // Reduced time to 1 second for fading effect
    }

    function loadGallery() {
        artFiles.forEach((file, index) => {
            const galleryImg = new Image();
            galleryImg.src = file;
            galleryImg.alt = `Artwork ${index + 1}`;
            galleryImg.addEventListener('click', function() {
                isClicked = true;
                clearInterval(intervalId);
                scrollToTop();
                showImageForDuration(index, 30000);
            });
            galleryView.appendChild(galleryImg);
        });
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function showImageForDuration(index, duration) {
        const img = new Image();
        img.src = artFiles[index];
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

    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;

        if (scrollTop > 0) {
            galleryView.style.opacity = '1';
            artDisplay.style.opacity = '0';
        } else {
            galleryView.style.opacity = '0';
            artDisplay.style.opacity = '1';
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerHeight < window.innerWidth) {
            artDisplay.style.flexDirection = 'row';
        } else {
            artDisplay.style.flexDirection = 'column';
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            clearInterval(intervalId);
            showNextImage();
            intervalId = setInterval(nextImage, 4000);
        } else if (event.key === 'ArrowLeft') {
            clearInterval(intervalId);
            showPrevImage();
            intervalId = setInterval(nextImage, 4000);
        }
    });

    loadArtFiles();
});
