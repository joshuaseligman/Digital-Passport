// Initialize the map variables
const map = L.map('map').setView([25, 0], 2);
let marker = undefined;
const bounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

// Grab the appropriate content from the webpage
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
            // Reset map if user clicks in the middle of nowhere  
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

        // Get the lattitude and longitude of the city for consistent data
        service.geocode({
            'in': `countryCode:${loc['countryCode']}`,
            'qq': `city=${loc['city']};state=${loc['state']}`
        }, (location) => {
            const cityPos = location['items'][0].position;

            // Don't do anything if the city search filter is not active
            if (filterButtons.length > 0 && !filterButtons[0].classList.contains('active')) {
                return;
            } else {
                // Get the best nearby city to the inputted location
                fetch(`/cities/nearby?state=${formData[1].value}&country=${formData[2].value}&lat=${cityPos.lat}&lng=${cityPos.lng}`)
                .then((res) => res.json())
                .then((data) => {
                    betterNearbyCity = data;
                });
            }

            // Set the data on the page if the fields exist
            if (postLat !== null && postLng !== null) {
                postLat.value = cityPos.lat;
                postLng.value = cityPos.lng;
            }
        }, alert);

        // Reset the filter each time the user clicks on the map
        if (filterButtons.length > 0) {
            resetFilter(loc);
        }
    }, alert);
});

// Function that resets the search filter
function resetFilter(location) {
    // Make sure each button is deactivated
    for (const btn of filterButtons) {
        btn.classList.remove('active');
    }

    let madeActive = false;

    // Determine the first valid field of the location and set that to be the filter
    if (location['city'] === undefined) {
        filterButtons[0].style.display = 'none'; // No city, no city filter
    } else {
        filterButtons[0].style.display = 'inline-block'; // Else, show the city filter and activate it
        filterButtons[0].classList.add('active');
        madeActive = true;
    }
    if (location['state'] === undefined) {
        filterButtons[1].style.display = 'none'; // No state, no state filter
    } else {
        filterButtons[1].style.display = 'inline-block'; // Else, show the state filter button
        if (!madeActive) { // Activate the state button if the city filter button was not already activated
            filterButtons[1].classList.add('active');
            madeActive = true;
        }
    }
    if (location['countryCode'] === undefined) {
        filterButtons[2].style.display = 'none'; // No country, no country filter
    } else {
        filterButtons[2].style.display = 'inline-block'; // Else, show the country filter button
        if (!madeActive) { // Activate the country filter if neither of the other buttons were activated
            filterButtons[2].classList.add('active');
        }
    }
}

// Get all of the map-related forms
for (const mapForm of mapForms) {
    // Event listener for when the form gets submitted
    mapForm.addEventListener('submit', (e) => {
        // If the city filter is not activated or if there is not a better nearby city, do nothing
        if (filterButtons.length > 0 && !filterButtons[0].classList.contains('active') || betterNearbyCity.length === 0) {
            return;
        }
        // Check to make sure that the user wants to use the selected location or if they want
        // to use the nearby location with more posts in it
        if (confirm(`${formData[0].value} is close to ${betterNearbyCity[0]} but has fewer posts. Would you like to use ${betterNearbyCity[0]} instead of ${formData[0].value}?`)) {
            // If the user chooses to change location, update all of the appropriate information
            formData[0].value = betterNearbyCity[0];
            if (postLat !== null && postLng !== null) {
                postLat.value = betterNearbyCity[1][0].lat;
                postLng.value = betterNearbyCity[1][0].lng;
            }
        }
    });
}

// Get the popular location element on the page
const popularLocations = document.querySelectorAll('.popular-location');
if (popularLocations.length > 0) {
    // Get the top 3 locations
    fetch('/cities/popular')
    .then((res) => res.json())
    .then((data) => {
        // Iterate through each popular location and set the webpage data to the fetched information
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

            // Event listener for when a popular location is clicked
            popularLocations[i].addEventListener('click', (e) => {
                // Make the map think is was clicked at the spot of the selected location
                map.fire('click', {
                    latlng: L.latLng(data[i][3][0].lat, data[i][3][0].lng)
                })
            });
        }
    });
}