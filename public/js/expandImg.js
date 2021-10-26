const expandBtn = document.querySelector('.expand');
const header = document.querySelector('#expandText');
const img = document.querySelector('.post-coverimg');
let isExpanded = false;

expandBtn.addEventListener('click', function() {
    if (!isExpanded) {
        img.style.maxHeight = 'none';
        header.style.paddingTop = '22.5%'
        header.textContent = 'Collapse ∧';
        console.log("test message");
        isExpanded = true;
    }
    else {
        img.style.maxHeight = '200px';
        header.style.paddingTop = '7.5%';
        header.textContent = 'Expand ∨';
        isExpanded = false;
    }
});