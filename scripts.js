document.addEventListener("DOMContentLoaded", function() {
    const artGrid = document.getElementById("art-grid");

    // Number of art files
    const numberOfArtFiles = 7;

    // Iterate and create img elements for each art file
    for (let i = 1; i <= numberOfArtFiles; i++) {
        const img = document.createElement("img");
        img.src = `art${i}.jpg`;
        img.alt = `Artwork ${i}`;
        artGrid.appendChild(img);
    }
});
