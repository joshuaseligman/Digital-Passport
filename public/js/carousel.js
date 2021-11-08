// Directory for the images on the carousel
const carouselImgsDir = '../res/landing-carousel/carousel';

// Grab the elements on the page
const carouselButtons = document.querySelectorAll('.img-btn');
const mainImg = document.querySelector('#sample-main');
const sideImgs = document.querySelectorAll('.sample-side');

// First image in the middle
let curMain = 2;

// Event for the left arrow
carouselButtons[0].addEventListener('click', () => {
    // Move the current image over and check for going beyond the boundary
    curMain++;
    if (curMain > 5) {
        curMain = 1;
    }

    // Change the sources of each of the images
    sideImgs[0].src = mainImg.src;
    mainImg.src = sideImgs[1].src;
    sideImgs[1].src = carouselImgsDir + ((curMain === 5) ? 1: curMain + 1) + '.jpg';
});

// Event for the right arrow
carouselButtons[1].addEventListener('click', () => {
    // Move the current image over and check for going beyond the boundary
    curMain--;
    if (curMain < 1) {
        curMain = 5;
    }

    // Change the sources of each of the images
    sideImgs[1].src = mainImg.src;
    mainImg.src = sideImgs[0].src;
    sideImgs[0].src = carouselImgsDir + ((curMain === 1) ? 5 : curMain - 1) + '.jpg';
});