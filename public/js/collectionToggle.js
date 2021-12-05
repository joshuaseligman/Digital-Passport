// Get the form for adding and removing to collection
const collectionForm = document.querySelector('.collection-form');

// Event listener for when the form is submitted
collectionForm.addEventListener('submit', (e) => {
    // Prevent the page from reloading
    e.preventDefault();
    
    // Have a POST request to update the user's collection
    fetch(collectionForm.action, {
        'method': 'POST'
    })
    .then(() => {
        window.location = window.location.href;
    });
});