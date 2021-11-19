window.onpageshow = function(e) {
    if (e.persisted) {
        window.location.reload();
    }
}