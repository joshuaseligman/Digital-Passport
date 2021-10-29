const commentsArea = document.querySelector('.reply');
const commentsBtn = document.querySelector('#comments-btn');

function toggleComments() {
    if (commentsArea.style.display === 'none') {
        commentsArea.style.display = 'flex';
        commentsBtn.textContent = 'Hide Comments';
    } else {
        commentsArea.style.display = 'none';
        commentsBtn.textContent = 'Show Comments';
    }
}