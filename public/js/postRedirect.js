// Get the posts
const profilePosts = document.querySelectorAll('.post');

// For each post on the page, set the click event to make the browser go to its location on the page
for (const post of profilePosts) {
    post.addEventListener('click', () => {
        // If there is already an ID, remove it from the URL
        let newURL = window.location.href.split('#');
        if (newURL.length > 1) {
            newURL.pop();
        }
        // Add the new ID and redirect
        newURL.push(post.id);
        window.location.replace(newURL.join('#'));
    });
}