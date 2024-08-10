document.addEventListener("DOMContentLoaded", function() {
    const promptMagicGallery = document.getElementById("prompt-magic-gallery");
    const fullscreenPopup = document.getElementById("fullscreen-popup");
    const popupImage = document.getElementById("popup-image");
    const closePopup = document.querySelector(".close-popup");

    const promptMagicFiles = [
        "a barber", "a clown", "a dolphin", "a man", "a priest", "a rabbi",
        "a surfer shooting the tube of a massive 20 foot wave while a dolphin jumps out in front of him",
        "a surfer", "a woman", "a face", "a tree", "an Imam", "bad", "dark", "good",
        "hate", "heaven", "hell", "light", "love", "stepping into infinity", "the ultimate boss"
    ];

    function loadPromptMagicGallery() {
        promptMagicGallery.innerHTML = '';
        promptMagicFiles.forEach(file => {
            const item = document.createElement('div');
            item.className = 'prompt-magic-item';
            
            const img = new Image();
            img.src = `prompt-magic/${file}.jpg`;
            img.alt = file;
            img.addEventListener('load', () => {
                item.appendChild(img);
                const p = document.createElement('p');
                p.textContent = file;
                item.appendChild(p);
                promptMagicGallery.appendChild(item);
            });
            img.addEventListener('error', () => {
                console.error(`Failed to load image: ${file}.jpg`);
            });
            img.addEventListener('click', () => showFullscreenImage(img.src));
        });
        promptMagicGallery.style.opacity = '1';
    }

    function showFullscreenImage(src) {
        popupImage.src = src;
        fullscreenPopup.classList.remove('hidden');
    }

    closePopup.addEventListener('click', () => {
        fullscreenPopup.classList.add('hidden');
    });

    loadPromptMagicGallery();
});