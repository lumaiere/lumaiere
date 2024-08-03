document.addEventListener("DOMContentLoaded", function() {
    const artDisplay = document.getElementById("art-display");
    const galleryView = document.getElementById("gallery-view");
    const galleryLinks = document.getElementById("gallery-links");

    const maxArtFiles = 100;
    const artFiles = [];
    let currentIndex = 0;
    let intervalId;
    let isClicked = false;
    let startX = 0;

    const urlParams = new URLSearchParams(window.location.search);
    const galleryType = urlParams.get('gallery') || 'main'; // Default to 'main' gallery

    async function imageExists(src) {
        return new Promise(resolve => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
        });
    }

    function showImage(index) {
        const img = new Image();
        img.src = artFiles[index];
        img.classList.add('fade'); // Add class for fade effect

        img.onload = function() {
            artDisplay.innerHTML = '';
            artDisplay.appendChild(img);
            adjustImageSize(img);
            setTimeout(() => {
                img.style.opacity = '1'; // Fade in the image
            }, 100);
        };
    }

    function loadInitialImage() {
        let initialImgSrc;
        switch (galleryType) {
            case 'lake':
                initialImgSrc = 'serene_lake/art1.jpg';
                break;
            case 'laugh':
                initialImgSrc = 'share-a-laugh-with-friends/art1.jpg';
                break;
            case 'avenues':
                initialImgSrc = 'avenues/art1.jpg';
                break;
            case 'impressionist':
                initialImgSrc = 'impressionist/art1.jpg';
                break;
            default:
                initialImgSrc = 'main/art1.jpg';
                break;
        }
        const initialImg = new Image();
        initialImg.src = initialImgSrc; // Load the first image based on gallery type
        initialImg.classList.add('fade'); // Add class for fade effect

        initialImg.onload = function() {
            artDisplay.innerHTML = '';
            artDisplay.appendChild(initialImg);
            adjustImageSize(initialImg);
            setTimeout(() => {
                initialImg.style.opacity = '1'; // Fade in the image
            }, 100);
        };
    }

    async function loadArtFiles() {
        for (let i = 1; i <= maxArtFiles; i++) {
            let fileName;
            switch (galleryType) {
                case 'lake':
                    fileName = `serene_lake/art${i}.jpg`;
                    break;
                case 'laugh':
                    fileName = `share-a-laugh-with-friends/art${i}.jpg`;
                    break;
                case 'avenues':
                    fileName = `avenues/art${i}.jpg`;
                    break;
                case 'impressionist':
                    fileName = `impressionist/art${i}.jpg`;
                    break;
                default:
                    fileName = `main/art${i}.jpg`;
                    break;
            }
            if (await imageExists(fileName)) {
                artFiles.push(fileName);
            }
        }
        if (artFiles.length > 0) {
            startAutoRotation();
            loadGallery();
        } else {
            console.error('No art files found.');
        }
    }

    function lazyLoadImage(index) {
        const img = new Image();
        img.src = artFiles[index];
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
            lazyLoadImage(currentIndex + 1);
        }, 500); // Reduced time to 1 second for fading effect
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
            lazyLoadImage(currentIndex - 1);
        }, 500); // Reduced time to 1 second for fading effect
    }

    function loadGallery() {
        artFiles.forEach((file, index) => {
            const galleryImg = new Image();
            galleryImg.src = file;
            galleryImg.alt = `Artwork ${index + 1}`;
            galleryImg.addEventListener('click', function() {
                isClicked = true;
                clearInterval(intervalId); // Clear any existing interval
                showImageForDuration(index, 30000);
                scrollToTop();
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
            adjustImageSize(img);
            setTimeout(() => {
                img.style.opacity = '1';
            }, 100);
        };

        setTimeout(() => {
            isClicked = false;
            startAutoRotation();
        }, duration);
    }

    function startAutoRotation() {
        clearInterval(intervalId); // Clear any existing interval
        intervalId = setInterval(showNextImage, 4000);
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
        adjustImageSize();
    });

    function adjustImageSize(img = null) {
        if (!img) {
            img = artDisplay.querySelector('img');
        }
        if (img) {
            const parentWidth = artDisplay.clientWidth;
            const parentHeight = artDisplay.clientHeight;
            const maxWidth = parentWidth * 0.95; // 95% of parent width to leave 5% whitespace on each side
            const maxHeight = parentHeight * 0.95; // 95% of parent height to leave 5% whitespace on each side

            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;

            const widthRatio = maxWidth / imgWidth;
            const heightRatio = maxHeight / imgHeight;
            const scale = Math.min(widthRatio, heightRatio, 1);

            img.style.width = imgWidth * scale + 'px';
            img.style.height = imgHeight * scale + 'px';
            img.style.position = 'absolute';
            img.style.top = '50%';
            img.style.left = '50%';
            img.style.transform = 'translate(-50%, -50%)'; // Center both horizontally and vertically
        }
    }

    loadInitialImage();
    requestAnimationFrame(loadArtFiles);

    // Event listeners for arrow keys
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            clearInterval(intervalId); // Clear any existing interval
            showNextImage();
            startAutoRotation();
        } else if (event.key === 'ArrowLeft') {
            clearInterval(intervalId); // Clear any existing interval
            showPrevImage();
            startAutoRotation();
        }
    });

    // Touch event listeners for swipe gestures
    artDisplay.addEventListener('touchstart', function(event) {
        startX = event.touches[0].clientX;
    });

    artDisplay.addEventListener('touchmove', function(event) {
        if (!startX) return;

        const endX = event.touches[0].clientX;
        const diffX = startX - endX;

        if (Math.abs(diffX) > 50) { // Swipe threshold
            if (diffX > 0) {
                // Swiped left
                clearInterval(intervalId);
                showNextImage();
                startAutoRotation();
            } else {
                // Swiped right
                clearInterval(intervalId);
                showPrevImage();
                startAutoRotation();
            }
            startX = 0; // Reset startX
        }
    });

    artDisplay.addEventListener('touchend', function() {
        startX = 0; // Reset startX
    });
});