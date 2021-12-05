// Initialize the map variables
const map = L.map('map').setView([25, 0], 2);
let marker = undefined;
const bounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

// Grab the appropriate images from the webpage
const info = document.querySelectorAll('.info');
const formData = document.querySelectorAll('.location-form-data');
const locationSelection = document.querySelector('#location-selection');
const filterButtons = document.querySelectorAll('.search-filter-btn');
const postLat = document.querySelector('#post-lat');
const postLng = document.querySelector('#post-lng');
const mapForms = document.querySelectorAll('.map-form');

let betterNearbyCity = [];

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

        service.geocode({
            'in': `countryCode:${loc['countryCode']}`,
            'qq': `city=${loc['city']};state=${loc['state']}`
        }, (location) => {
            const cityPos = location['items'][0].position;
            if (filterButtons.length > 0 && !filterButtons[0].classList.contains('active')) {
                return;
            } else {
                fetch(`/cities/nearby?state=${formData[1].value}&country=${formData[2].value}&lat=${cityPos.lat}&lng=${cityPos.lng}`)
                .then((res) => res.json())
                .then((data) => {
                    betterNearbyCity = data;
                });
            }
            if (postLat !== null && postLng !== null) {
                postLat.value = cityPos.lat;
                postLng.value = cityPos.lng;
            }
        }, alert);

        if (filterButtons.length > 0) {
            resetFilter(loc);
        }
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

for (const mapForm of mapForms) {
    mapForm.addEventListener('submit', (e) => {
        if (filterButtons.length > 0 && !filterButtons[0].classList.contains('active') || betterNearbyCity.length === 0) {
            return;
        }
        if (confirm(`${formData[0].value} is close to ${betterNearbyCity[0]} but has fewer posts. Would you like to use ${betterNearbyCity[0]} instead of ${formData[0].value}?`)) {
            formData[0].value = betterNearbyCity[0];
            if (postLat !== null && postLng !== null) {
                postLat.value = betterNearbyCity[1][0].lat;
                postLng.value = betterNearbyCity[1][0].lng;
            }
        }
    });
}

const popularLocations = document.querySelectorAll('.popular-location');
if (popularLocations.length > 0) {
    fetch('/cities/popular')
    .then((res) => res.json())
    .then((data) => {
        for (let i = 0; i < data.length; i++) {
            popularLocations[i].textContent = data[i][2];
            if (data[i][1] !== 'undefined' && data[i][2] !== 'undefined') {
                popularLocations[i].textContent += ', ';
            }

            popularLocations[i].textContent += (data[i][1] !== 'undefined') ? data[i][1] : '';
            if (data[i][0] !== 'undefined' && (data[i][2] !== 'undefined' || data[i][1] !== 'undefined')) {
                popularLocations[i].textContent += ', ';
            }
            popularLocations[i].textContent += data[i][0];

            popularLocations[i].addEventListener('click', (e) => {
                map.fire('click', {
                    latlng: L.latLng(data[i][3][0].lat, data[i][3][0].lng)
                })
            });
        }
    });
}