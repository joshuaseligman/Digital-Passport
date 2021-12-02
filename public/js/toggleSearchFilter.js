const filterBtns = document.querySelectorAll('.search-filter-btn');
const filterInput = document.querySelector('#filter-input');

for (const filterBtn of filterButtons) {
    filterBtn.addEventListener('click', (e) => {
        for (const btn of filterButtons) {
            btn.classList.remove('active');
        }
        filterBtn.classList.add('active');
        filterInput.value = filterBtn.id;
    });
}