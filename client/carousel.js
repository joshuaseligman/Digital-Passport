const carouselButtons = document.querySelectorAll('.img-btn');
const mainImg = document.querySelector('#sample-main');
const sideImgs = document.querySelectorAll('.sample-side')

console.log(carouselButtons[0]);

carouselButtons[0].addEventListener('click', () => {
    let tempSrc = sideImgs[0].src;
    sideImgs[0].src = mainImg.src;
    mainImg.src = sideImgs[1].src;
    sideImgs[1].src = tempSrc;
});

carouselButtons[1].addEventListener('click', () => {
    let tempSrc = sideImgs[1].src;
    sideImgs[1].src = mainImg.src;
    mainImg.src = sideImgs[0].src;
    sideImgs[0].src = tempSrc;
});