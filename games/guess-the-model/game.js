document.addEventListener('DOMContentLoaded', (event) => {
    const imagesContainer = document.getElementById('images-container');
    const submitButton = document.getElementById('submit-guesses');
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
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let selectedModels = new Array(images.length).fill(null);
    let correctAnswers = new Array(images.length).fill(null);

    function setupGame() {
        shuffle(images);
        imagesContainer.innerHTML = '';
        images.forEach((img, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = img.src;
            imgElement.onclick = function() {
                // Toggle between models or implement a selection mechanism
                let currentModel = selectedModels[index];
                let models = ['Gemini', 'ChatGPT', 'Grok', 'NightCafe', 'Deep Dream Generator'];
                let nextModelIndex = (models.indexOf(currentModel) + 1) % models.length;
                selectedModels[index] = models[nextModelIndex];
                this.className = selectedModels[index].toLowerCase().replace(' ', '-');
            };
            imagesContainer.appendChild(imgElement);
        });
    }

    setupGame();

    submitButton.onclick = function() {
        let correctGuesses = 0;
        for(let i = 0; i < images.length; i++) {
            if (selectedModels[i] === images[i].model) {
                correctGuesses++;
                correctAnswers[i] = true;
            } else {
                correctAnswers[i] = false;
            }
        }

        resultDiv.innerHTML = `You guessed ${correctGuesses} out of ${images.length} correctly!`;
        // Reveal correct answers
        let imagesHtml = '';
        images.forEach((img, index) => {
            imagesHtml += `<div>${img.src} was made by ${correctAnswers[index] ? '<span style="color:green;">Correctly guessed!</span>' : '<span style="color:red;">Incorrectly guessed. It was ' + img.model + '</span>'}</div>`;
        });
        resultDiv.innerHTML += '<br>' + imagesHtml;

        // Enable social sharing
        let shareButton = document.createElement('button');
        shareButton.textContent = 'Share Your Score';
        shareButton.onclick = function() {
            // This is a placeholder for actual social media sharing functionality.
            // Real implementation would involve actual APIs or share dialogs.
            alert('Sharing functionality would go here. Your score: ' + correctGuesses);
        };
        resultDiv.appendChild(shareButton);
    };

    // Reset game functionality can be added here if needed
});