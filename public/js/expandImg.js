const expandBtn = document.querySelector('.expand');
const img = document.querySelector('.post-coverimg');
let isExpanded = false;

expandBtn.addEventListener('click', function() {
    // if (!isExpanded) {
        img.style.maxHeight = 'none';
        expandBtn.textContent = 'Collapse <br> ʌ';
        console.log("test message");
        isExpanded = true;
    // }
    // else {
    //     img.style.maxHeight = '20%';
    //     expandBtn.textContent = 'Expand <br> v';
    //     isExpanded = true;
    // }
});