const postArea = document.querySelector('#posts-area');

const overlapPostArea = document.querySelector('#overlap-post-area');
overlapPostArea.style.height = postArea.offsetHeight + 'px';
overlapPostArea.style.marginTop = '-' + overlapPostArea.style.height;
overlapPostArea.style.width = postArea.offsetWidth + 'px';
overlapPostArea.addEventListener('click', toggleOverlapPostArea);

function toggleOverlapPostArea(event) {
    if (event.target.id == 'overlap-post-area') {
        window.location.replace(`/postSelection`);
    }
}


