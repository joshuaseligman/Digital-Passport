const profilePosts = document.querySelectorAll('.post');

for (const post of profilePosts) {
    post.addEventListener('click', () => {
        window.location.replace(window.location + `#${post.id}`);
    });
}