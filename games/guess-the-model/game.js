document.addEventListener('DOMContentLoaded', (event) => {
    const imagesContainer = document.getElementById('images-container');
    const resultDiv = document.getElementById('result');

    const images = [
        {src: '../../eponymous/art1.jpg', model: 'Gemini'},
        {src: '../../eponymous/art2.jpg', model: 'ChatGPT'},
        {src: '../../eponymous/art3.jpg', model: 'ChatGPT'},
        {src: '../../eponymous/art4.jpg', model: 'NightCafe'},
        {src: '../../eponymous/art5.jpg', model: 'NightCafe'},
        {src: '../../eponymous/art6.jpg', model: 'NightCafe'},
        {src: '../../eponymous/art7.jpg', model: 'Grok'},
        {src: '../../eponymous/art8.jpg', model: 'Deep Dream Generator'},
        {src: '../../eponymous/art9.jpg', model: 'Grok'},
        {src: '../../eponymous/art10.jpg', model: 'NightCafe'},
        {src: '../../eponymous/art11.jpg', model: 'Gemini'},
        {src: '../../eponymous/art12.jpg', model: 'Deep Dream Generator'},
        {src: '../../eponymous/art13.jpg', model: 'NightCafe'},
        {src: '../../eponymous/art14.jpg', model: 'Gemini'},
        {src: '../../eponymous/art15.jpg', model: 'Grok'},
        {src: '../../eponymous/art16.jpg', model: 'Deep Dream Generator'},
        {src: '../../eponymous/art17.jpg', model: 'ChatGPT'},
    ];

    let currentImageIndex = 0;
    let selectedModels = new Array(images.length).fill(null);

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showImage(index) {
        if (index >= images.length) {
            document.getElementById('model-buttons').style.display = 'none';
            displayResults();
            return;
        }

        const imgElement = document.createElement('img');
        imgElement.src = images[index].src;
        imgElement.classList.add('enlarged'); // Ensure this line is present
        imagesContainer.innerHTML = '';
        imagesContainer.appendChild(imgElement);
        document.getElementById('model-buttons').style.display = 'block';

        document.querySelectorAll('#model-buttons button').forEach(button => {
            button.onclick = function() {
                let selectedModel = this.getAttribute('data-model');
                selectedModels[index] = selectedModel;
                imgElement.className = selectedModel.toLowerCase().replace(' ', '-');
                imgElement.classList.remove('enlarged');
                document.getElementById('model-buttons').style.display = 'none';
                currentImageIndex++;
                showImage(currentImageIndex);
            };
        });
    }

    function displayResults() {
        let correctGuesses = 0;
        let imagesHtml = '<div class="results-grid">';
        images.forEach((img, index) => {
            if (selectedModels[index] === img.model) {
                correctGuesses++;
                imagesHtml += `
                    <div class="result-item correct">
                        <img src="${img.src}" alt="Image">
                        <div class="overlay">Correctly guessed!<br>${img.model}</div>
                    </div>`;
            } else {
                imagesHtml += `
                    <div class="result-item incorrect">
                        <img src="${img.src}" alt="Image">
                        <div class="overlay">Incorrectly guessed!<br>Guessed: ${selectedModels[index]}</div>
                    </div>`;
            }
        });
        imagesHtml += '</div>';
        resultDiv.innerHTML = `You guessed ${correctGuesses} out of ${images.length} correctly!<br>${imagesHtml}`;

        // Hide the "Guess the AI model" text and the little image
        const guessText = document.getElementById('guess-text');
        const guessImage = document.getElementById('images-container');
        if (guessText) guessText.style.display = 'none';
        if (guessImage) guessImage.style.display = 'none';
    }

    function setupGame() {
        shuffle(images);
        showImage(currentImageIndex);
    }

    // Call setupGame to initialize the game
    setupGame();
});