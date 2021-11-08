// Grab the elements from the page
const commentsArea = document.querySelector('.reply');
const commentsBtn = document.querySelector('#comments-btn');

// Function called when a button is clicked on the page
function toggleComments() {
    // If the comments area is not visible, make it visible
    if (commentsArea.style.display === 'none') {
        commentsArea.style.display = 'flex';
        commentsBtn.textContent = 'Hide Comments';
    } else {
        // Otherwise make it invisible
        commentsArea.style.display = 'none';
        commentsBtn.textContent = 'Show Comments';
    }
}