const carouselImgsDir = '../res/landing-carousel/carousel';

const carouselButtons = document.querySelectorAll('.img-btn');
const mainImg = document.querySelector('#sample-main');
const sideImgs = document.querySelectorAll('.sample-side');

let curMain = 2;

carouselButtons[0].addEventListener('click', () => {
    curMain++;
    if (curMain > 5) {
        curMain = 1;
    }

    sideImgs[0].src = mainImg.src;
    mainImg.src = sideImgs[1].src;
    sideImgs[1].src = carouselImgsDir + ((curMain === 5) ? 1: curMain + 1) + '.jpg';
});

carouselButtons[1].addEventListener('click', () => {
    curMain--;
    if (curMain < 1) {
        curMain = 5;
    }

    sideImgs[1].src = mainImg.src;
    mainImg.src = sideImgs[0].src;
    sideImgs[0].src = carouselImgsDir + ((curMain === 5) ? 1: curMain + 1) + '.jpg';
});