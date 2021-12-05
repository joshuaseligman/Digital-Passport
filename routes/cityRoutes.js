const express = require('express');
const router = express.Router();

const db = require('../db');

router.get('/popular', async (req, res) => {
    const options = {};
    const locations = await db.getPosts(
        options, 
        {   _id: 0, 
            location: 1
        }
    );
    const locCounts = getTotals(locations);

    let topCounts = [];
    for (const [country, stateProp] of Object.entries(locCounts)) {
        for (const [stateKey, cityProp] of Object.entries(locCounts[country])) {
            for (const [cityKey, location] of Object.entries(locCounts[country][stateKey])) {
                topCounts.push([country, stateKey, cityKey, location]);
            }
        }
    }

    for (let i = topCounts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = topCounts[i];
        topCounts[i] = topCounts[j];
        topCounts[j] = temp;
    }

    topCounts.sort((city1, city2) => {
        return city1[3][1] - city2[3][1];
    });

    res.send(topCounts.slice(-3).reverse());
});

router.get('/nearby', async (req, res) => {
    const options = {
        "location.country": req.query.country,
        "location.state": req.query.state,
    };
    const locations = await db.getPosts(
        options, 
        {   _id: 0, 
            location: 1
        }
    );
    const locCounts = getTotals(locations);

    let bestNearbyCity = [];
    let cityCount = 0;
    try {
        for (const [city, location] of Object.entries(locCounts[req.query.country][req.query.state])) {
            const lng1 = req.query.lng * Math.PI / 180;
            const lng2 = location[0].lng * Math.PI / 180;
            const lat1 = req.query.lat * Math.PI / 180;
            const lat2 = location[0].lat * Math.PI / 180;

            // Haversine formula from https://www.geeksforgeeks.org/program-distance-two-points-earth/
            const dlng = lng2 - lng1;
            const dlat = lat2 - lat1;
            const a = Math.pow(Math.sin(dlat / 2), 2)
                    + Math.cos(lat1) * Math.cos(lat2)
                    * Math.pow(Math.sin(dlng / 2), 2);
                
            const c = 2 * Math.asin(Math.sqrt(a));
    
            // Radius of earth in miles
            const r = 3956;

            const dist = c * r;

            if (dist === 0) {
                cityCount = location[1];
            } else if (dist <= 25 && (bestNearbyCity.length === 0 || location[1] > bestNearbyCity[1][1])) {
                bestNearbyCity = [city, location];
            }
            if (bestNearbyCity.length > 0 && cityCount >= bestNearbyCity[1][1]) {
                bestNearbyCity = [];
            }
        }
    } catch (err) {}
    res.send(bestNearbyCity);
});

function getTotals(locs) {
    const counts = {};
    for (const l of locs) {
        const loc = l.location
        if (counts[loc.country] === undefined) {
            counts[loc.country] = {};
            counts[loc.country][loc.state] = {};
            counts[loc.country][loc.state][loc.city] = [loc.position, 1];
        } else if (counts[loc.country][loc.state] === undefined) {
            counts[loc.country][loc.state] = {};
            counts[loc.country][loc.state][loc.city] = [loc.position, 1];
        } else if (counts[loc.country][loc.state][loc.city] === undefined) {
            counts[loc.country][loc.state][loc.city] = [loc.position, 1];
        } else {
            counts[loc.country][loc.state][loc.city][1]++;
        }
    }
    return counts;
}

module.exports = router;