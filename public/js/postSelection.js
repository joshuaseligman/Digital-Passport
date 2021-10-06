const postArea = document.querySelector('#posts-area');

for (let i = 1; i <= 9; i++) {
    const post = document.createElement('img');
    post.src = `/res/posts-imgs/post${i}.jpg`;
    post.classList.add('post-link');

    postArea.appendChild(post);
}

const posts = document.querySelectorAll('.post-link');
posts[0].addEventListener('click', () => {
    overlapPostArea.style.display = 'none';
});
// for (let j = 0; j < posts.length; j++) {
    
// }

const overlapPostArea = document.querySelector('#overlap-post-area');
overlapPostArea.style.height = postArea.offsetHeight + 'px';