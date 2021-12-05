// Get the image objects on the page
const imgInput = document.querySelector('#img-input');
const previewImg = document.querySelector('#img-preview');

// Event listener for when the user uploads an image
imgInput.onchange = (e) => {
    // Get the file
    const [file] = imgInput.files;
    if (file) {
        // Show the image preview
        previewImg.src = URL.createObjectURL(file);
        previewImg.style.display = 'inline';
    }
};