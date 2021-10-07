const postArea = document.querySelector('#posts-area');

for (let i = 1; i <= 9; i++) {
    const post = document.createElement('img');
    post.src = `/res/posts-imgs/post${i}.jpg`;
    post.classList.add('post-link');

    postArea.appendChild(post);
}

const posts = document.querySelectorAll('.post-link');
let visible = false;

for (let j = 0; j < posts.length; j++) {
    posts[j].addEventListener('click', toggleOverlapPostArea);
}

const overlapPostArea = document.querySelector('#overlap-post-area');
overlapPostArea.style.height = postArea.offsetHeight + 'px';
overlapPostArea.style.marginTop = '-' + overlapPostArea.style.height;
overlapPostArea.style.width = postArea.offsetWidth + 'px';
overlapPostArea.addEventListener('click', toggleOverlapPostArea);

function toggleOverlapPostArea(event) {
    if (visible) {
        if (event.target.id == 'overlap-post-area') {
            overlapPostArea.style.display = 'none';
        }
    } else {
        overlapPostArea.style.display = 'flex';
    }
    visible = !visible;
}