window.onpageshow = function(e) {
    if (e.persisted) {
        window.location.reload();
        const forms = document.querySelectorAll('form');
        for (const form of forms) {
            form.reset();
        }
    }
}