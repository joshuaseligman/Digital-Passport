const express = require('express');
const router = express.Router();

const db = require('../db');

// GET for obtaining the 3 most populated cities in the databse
router.get('/popular', async (req, res) => {
    // Get the location of each post
    const locations = await db.getPosts(
        {}, 
        {   _id: 0, 
            location: 1
        }
    );
    // Determine how many posts belong to each city
    const locCounts = getTotals(locations);

    // Create an array that stores the information for each city in the database
    // Basically just change locCounts into an array
    let topCounts = [];
    for (const [country, stateProp] of Object.entries(locCounts)) {
        for (const [stateKey, cityProp] of Object.entries(locCounts[country])) {
            for (const [cityKey, location] of Object.entries(locCounts[country][stateKey])) {
                topCounts.push([country, stateKey, cityKey, location]);
            }
        }
    }

    // Randomize the list so ties are not biased towards a specific location
    for (let i = topCounts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = topCounts[i];
        topCounts[i] = topCounts[j];
        topCounts[j] = temp;
    }

    // Order the list based on the number of posts
    topCounts.sort((city1, city2) => {
        return city1[3][1] - city2[3][1];
    });

    // Send the list of the top 3 cities
    res.send(topCounts.slice(-3).reverse());
});

// GET for determining if there is a city nearby (<= 25 miles) that has more posts than the inputted city
router.get('/nearby', async (req, res) => {
    // Get locations of posts within the inputted country and state
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
    
    // Determine how many posts belong to each city
    const locCounts = getTotals(locations);

    let bestNearbyCity = [];
    let cityCount = 0;
    try {
        // Iterate through each city in the database that is in the provided state
        for (const [city, location] of Object.entries(locCounts[req.query.country][req.query.state])) {
            // Get the lattitude and longitude of the inputted city and the iterated city in radians
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

            // Final distance between the 2 cities in miles
            const dist = c * r;

            // If the iterated city is the inputted city, set cityCount to the number of posts
            // associated with the city in the database
            if (dist === 0) {
                cityCount = location[1];
            } else if (dist <= 25 && (bestNearbyCity.length === 0 || location[1] > bestNearbyCity[1][1])) {
                // Set the best nearby city if it is within 25 miles of the inputted location
                // and has more posts than the current best nearby city
                bestNearbyCity = [city, location];
            }
            // Clear best nearby city if the inputted city has more posts than the nearby city
            if (bestNearbyCity.length > 0 && cityCount >= bestNearbyCity[1][1]) {
                bestNearbyCity = [];
            }
        }
    } catch (err) { /* Catch for if there are no posts within the country or state */ }

    // Send the best nearby city
    res.send(bestNearbyCity);
});

// Function than takes a list of locations and generates an object that organizes the locations
// based on country, state, and city
function getTotals(locs) {
    const counts = {};
    // Iterate through each location
    for (const l of locs) {
        const loc = l.location
        // If no posts in the country have been found yet, create the coutnry and add the current location
        if (counts[loc.country] === undefined) {
            counts[loc.country] = {};
            counts[loc.country][loc.state] = {};
            counts[loc.country][loc.state][loc.city] = [loc.position, 1];
        } else if (counts[loc.country][loc.state] === undefined) { // Country is defined but not the state
            counts[loc.country][loc.state] = {};
            counts[loc.country][loc.state][loc.city] = [loc.position, 1];
        } else if (counts[loc.country][loc.state][loc.city] === undefined) { // Country and state are defined by not the city
            counts[loc.country][loc.state][loc.city] = [loc.position, 1];
        } else {
            counts[loc.country][loc.state][loc.city][1]++; // Everything is defined. Add 1 to the current city
        }
    }
    // Return the object representing the counts of each location in the database
    return counts;
}

module.exports = router;