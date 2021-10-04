const map = L.map('map').setView([25, 0], 2);
let marker = undefined;

const info = document.querySelectorAll('.info');
const nearbyLocations = [];

L.tileLayer('https://api.mapbox.com/styles/v1/{username}/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    username: 'joshyankfan01',
    id: 'ckud4bw6xa0hs17mktixatxuq',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoiam9zaHlhbmtmYW4wMSIsImEiOiJja3U4bXh4dmEyZmV4Mm5uaTEzNjk2c2w5In0.Mk0ce1C_XTpg1scZ3wWTGg'
}).addTo(map);

map.on('click', (e) => {
    if (marker === undefined) {
        marker = L.marker(e.latlng).addTo(map);
    } else {
        marker.setLatLng(e.latlng);
    }
    map.setView(e.latlng, 12);

    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${e.latlng['lat']}&longitude=${e.latlng['lng']}&localityLanguage=en`)
    .then(response => response.json())
    .then(data => {
        info[0].textContent = data['city'] !== '' ? data['city'] : data['locality'];
        info[1].textContent = data['principalSubdivision'];
        info[2].textContent = data['countryCode'];

        getNearbyCities(e.latlng);
    });
});

function getNearbyCities(latLong) {
    for (let i = nearbyLocations.length - 1; i >= 0; i--) {
        nearbyLocations.pop();
    }

    const fiveMilesInDeg = 10 / 69;
    
    for (let lat = latLong['lat'] - fiveMilesInDeg; lat < latLong['lat'] + fiveMilesInDeg; lat += 0.03) {
        for (let long = latLong['lng'] - fiveMilesInDeg; long < latLong['lng'] + fiveMilesInDeg; long += 0.03) {
            fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`)
            .then(response => response.json())
            .then(data => {
                let location = data['city'] !== '' ? data['city'] : data['locality'];
                if (location !== info[0].textContent) {
                    if (nearbyLocations.indexOf(location) === -1) {
                        nearbyLocations.push(location);
                    }
                }
            });
        }
    }
}