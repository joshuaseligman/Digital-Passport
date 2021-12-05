// Get the buttons and the filter input on the page
const filterBtns = document.querySelectorAll('.search-filter-btn');
const filterInput = document.querySelector('#filter-input');

// Iterate through each button
for (const filterBtn of filterButtons) {
    // Event listener for when the button is clicked
    filterBtn.addEventListener('click', (e) => {
        // Make sure none of the buttons are active before setting up the new one
        for (const btn of filterButtons) {
            btn.classList.remove('active');
        }
        // Set the clicked button to be active
        filterBtn.classList.add('active');
        // Update the inputted value in the form
        filterInput.value = filterBtn.id;
    });
}