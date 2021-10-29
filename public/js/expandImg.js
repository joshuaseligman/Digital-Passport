const expandBtn = document.querySelector('.expand');
const header = document.querySelector('#expandText');
const img = document.querySelector('.post-coverimg');
let isExpanded = false;

expandBtn.addEventListener('click', function() {
    if (!isExpanded) {
        img.style.maxHeight = '60rem';
        header.style.paddingTop = '22.5%'
        header.textContent = 'Collapse ∧';
        isExpanded = true;
    }
    else {
        img.style.maxHeight = '12.5rem';
        header.style.paddingTop = '7.5%';
        header.textContent = 'Expand ∨';
        isExpanded = false;
    }
});