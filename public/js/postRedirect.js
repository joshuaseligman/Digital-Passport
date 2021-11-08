// Get the posts
const profilePosts = document.querySelectorAll('.post');

// For each post on the page, set the click event to make the browser go to its location on the page
for (const post of profilePosts) {
    post.addEventListener('click', () => {
        window.location.replace(window.location + `#${post.id}`);
    });
}