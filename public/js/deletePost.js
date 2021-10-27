function deletePost() {
    fetch(window.location.pathname, {
        method: 'DELETE'
    })
    .then((res) => res.json())
    .then((data) => {
        window.location.replace('..' + data.newURL);
    })
}