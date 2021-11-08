// Get the elements on the page
const expandBtn = document.querySelector('.expand');
const header = document.querySelector('#expandText');
const img = document.querySelector('.post-coverimg');

// Create a variable to tell if the image is expanded
let isExpanded = false;

// Event for when they choose to click on the image to expand or retract the image
expandBtn.addEventListener('click', function() {
    // If expanded make the image larger
    if (!isExpanded) {
        img.style.maxHeight = '60rem';
        header.style.paddingTop = '22.5%'
        header.textContent = 'Collapse ∧';
        isExpanded = true;
    } else {
        // Else make the image smaller
        img.style.maxHeight = '12.5rem';
        header.style.paddingTop = '7.5%';
        header.textContent = 'Expand ∨';
        isExpanded = false;
    }
});