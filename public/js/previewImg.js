const imgInput = document.querySelector('#img-input');
const previewImg = document.querySelector('#img-preview');

imgInput.onchange = (e) => {
    const [file] = imgInput.files;
    if (file) {
        previewImg.src = URL.createObjectURL(file);
        previewImg.style.display = 'inline';
    }
};