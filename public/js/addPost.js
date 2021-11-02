// Initialize the form variables
const map = L.map('map').setView([25, 0], 2);
let marker = undefined;

// Get the information for the page
const info = document.querySelectorAll('.location');
const formData = document.querySelectorAll('.location-form');

// Initialize the reverse geocoding api
const platform = new H.service.Platform({
    'apikey': 'PgNfIZMslRqRWI_dxJLtyptKNZINHNcgDpsM5lsQO1c'
});
const service = platform.getSearchService();

// Initialize the map
L.tileLayer('https://api.mapbox.com/styles/v1/{username}/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    username: 'joshyankfan01',
    id: 'ckud4bw6xa0hs17mktixatxuq',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoiam9zaHlhbmtmYW4wMSIsImEiOiJja3U4bXh4dmEyZmV4Mm5uaTEzNjk2c2w5In0.Mk0ce1C_XTpg1scZ3wWTGg'
}).addTo(map);

// Event for when the map is clicked
map.on('click', (e) => {
    // If the marker is undefined, initialize it
    if (marker === undefined) {
        marker = L.marker(e.latlng).addTo(map);
    } else {
        // Change it's position if it already exists
        marker.setLatLng(e.latlng);
    }
    // Move the map appropriately
    map.setView(e.latlng, 12);

    // Do the reverse geocode calculation
    service.reverseGeocode({
        'at': `${e.latlng['lat']},${e.latlng['lng']}`
    }, (result) => {
        // Get the information and store in approrpiate variables on the page
        const loc = result['items'][0]['address'];
        info[0].textContent = loc['city'];
        formData[0].value = loc['city'];
        info[1].textContent = loc['state'];
        formData[1].value = loc['state'];
        info[2].textContent = loc['countryCode'];
        formData[2].value = loc['countryCode'];
    }, alert);
});