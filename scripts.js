document.addEventListener("DOMContentLoaded", function() {
    const artDisplay = document.getElementById("art-display");
    const galleryView = document.getElementById("gallery-view");

    const maxArtFiles = 100;
    const artFiles = [];
    let currentIndex = 0;
    let intervalId;
    let isClicked = false;

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
        const initialImg = new Image();
        initialImg.src = 'art1.jpg'; // Assuming the first image is 'art1.jpg'
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
            const fileName = `art${i}.jpg`;
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
            img.style.display = 'block';
            img.style.margin = 'auto';
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
});
