const collectionForm = document.querySelector('.collection-form');

collectionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(collectionForm.action);
    fetch(collectionForm.action, {
        'method': 'POST'
    })
    .then(() => {
        window.location = window.location.href;
    });
});