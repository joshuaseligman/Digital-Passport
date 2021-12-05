// Function for when the page is first shown to the users
window.onpageshow = function(e) {
    // If the page didn't update since last time it was viewed
    if (e.persisted) {
        // Reload the page
        window.location.reload();
        // Reset all forms
        const forms = document.querySelectorAll('form');
        for (const form of forms) {
            form.reset();
        }
    }
}