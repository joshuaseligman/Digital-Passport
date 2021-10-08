const postArea = document.querySelector('#posts-area');

const overlapPostArea = document.querySelector('#overlap-post-area');
overlapPostArea.style.height = postArea.offsetHeight + 'px';
overlapPostArea.style.marginTop = '-' + overlapPostArea.style.height;
overlapPostArea.style.width = postArea.offsetWidth + 'px';
overlapPostArea.addEventListener('click', toggleOverlapPostArea);


const postBody = document.querySelector("#post-body");
const postBg = document.querySelector("#overlap-post");
postBg.style.height = postBody.offsetHeight + "px";

function toggleOverlapPostArea(event) {
    if (event.target.id == 'overlap-post-area') {
        const index = window.location.href.indexOf("cur=");
        const postIndex = window.location.href.substring(index + 4);
        window.location.replace(`/postSelection#post${postIndex}`);
    }
}