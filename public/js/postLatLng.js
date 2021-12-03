const postLat = document.querySelector('#post-lat');
const postLng = document.querySelector('#post-lng');
const locationFormData = document.querySelectorAll('.location-form-data');
const form = document.querySelector('#addPostForm');

form.addEventListener('submit', (e) => {
    service.geocode({
        'in': `countryCode:${locationFormData[2].value}`,
        'qq': `city=${locationFormData[0].value};state=${locationFormData[1].value}`
    }, (loc) => {
        postLat.value = loc['items'][0].position.lat;
        postLng.value = loc['items'][0].position.lng;
    }, alert);
});
