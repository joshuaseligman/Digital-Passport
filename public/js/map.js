// Initialize the map variables
const map = L.map('map').setView([25, 0], 2);
let marker = undefined;
const bounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

// Grab the appropriate images from the webpage
const info = document.querySelectorAll('.info');
const formData = document.querySelectorAll('.location-form-data');
const locationSelection = document.querySelector('#location-selection');
const filterButtons = document.querySelectorAll('.search-filter-btn');

// Create the reverse geocoding api variable
const platform = new H.service.Platform({
    'apikey': 'PgNfIZMslRqRWI_dxJLtyptKNZINHNcgDpsM5lsQO1c'
});
const service = platform.getSearchService();

// Set up the map
L.tileLayer('https://api.mapbox.com/styles/v1/{username}/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    minZoom: 2,
    maxZoom: 18,
    zoomOffset: -1,
    username: 'joshyankfan01',
    id: 'ckud4bw6xa0hs17mktixatxuq',
    tileSize: 512,
    maxBounds: bounds,
    accessToken: 'pk.eyJ1Ijoiam9zaHlhbmtmYW4wMSIsImEiOiJja3U4bXh4dmEyZmV4Mm5uaTEzNjk2c2w5In0.Mk0ce1C_XTpg1scZ3wWTGg'
}).addTo(map);

map.on('drag', () => {
    map.panInsideBounds(bounds, { animate: false });
});

// Event for when the user clicks on the map
map.on('click', (e) => {
    // If the marker doesn't exist, create it
    if (marker === undefined) {
        marker = L.marker(e.latlng).addTo(map);
    } else {
        // Change the location of the marker if it already exists
        marker.setLatLng(e.latlng);
    }
    // Move the map view to the marker
    map.setView(e.latlng, 12);

    // Do the reverse geocode calculation
    service.reverseGeocode({
        'at': `${e.latlng['lat']},${e.latlng['lng']}`
    }, (result) => {
        // Set the variables accordingly on the page
        let loc;
        try {
            loc = result['items'][0]['address'];
        } catch (err) {     
            map.setView(L.latLng(25, 0), 2);
            map.removeLayer(marker);
            marker = undefined;
            return;
        }

        info[0].textContent = loc['city'];
        if (loc['state'] !== undefined && loc['city'] !== undefined) {
            info[0].textContent += ', ';
        }
        formData[0].value = loc['city'];

        info[1].textContent = loc['state'];
        if (loc['countryCode'] !== undefined && (loc['city'] !== undefined || loc['state'] !== undefined)) {
            info[1].textContent += ', ';
        }
        formData[1].value = loc['state'];

        info[2].textContent = loc['countryCode'];
        formData[2].value = loc['countryCode'];

        locationSelection.style.display = 'flex';

        resetFilter(loc);

    }, alert);
});

function resetFilter(location) {
    for (const btn of filterButtons) {
        btn.classList.remove('active');
    }

    let madeActive = false;

    if (location['city'] === undefined) {
        filterButtons[0].style.display = 'none';
    } else {
        filterButtons[0].style.display = 'inline-block';
        filterButtons[0].classList.add('active');
        madeActive = true;
    }
    if (location['state'] === undefined) {
        filterButtons[1].style.display = 'none';
    } else {
        filterButtons[1].style.display = 'inline-block';
        if (!madeActive) {
            filterButtons[1].classList.add('active');
            madeActive = true;
        }
    }
    if (location['countryCode'] === undefined) {
        filterButtons[2].style.display = 'none';
    } else {
        filterButtons[2].style.display = 'inline-block';
        if (!madeActive) {
            filterButtons[2].classList.add('active');
        }
    }
}