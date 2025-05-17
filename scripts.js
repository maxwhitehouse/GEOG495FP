// scripts.js

// Initialize the map
var map = L.map('map').setView([36.1627, -86.7816], 6); // Set the initial view (latitude, longitude, zoom level)

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define the style for the GeoJSON
function style(feature) {
    return {
        fillColor: 'rgba(0, 0, 0, 0)',  // Transparent fill
        weight: 2,                       // Border thickness
        color: 'black',                  // Border color
        opacity: 1,                      // Border opacity
        fillOpacity: 0                  // Fill opacity (0 for transparent)
    };
}

// Define a function to show the name of the tract in the tooltip
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.NAME) {  // Check if the property NAME exists
        layer.bindTooltip('<strong>' + feature.properties.NAME + '</strong>', { sticky: true }); // Show the name in the tooltip
    }
}

// Load and add GeoJSON data from the 'data' folder with custom style and interactivity
fetch('data/TN_Census.geojson')  // Path to your GeoJSON file in the 'data' folder
    .then(response => response.json())
    .then(data => {
        // Add the GeoJSON layer with the specified style and interactivity
        L.geoJSON(data, {
            style: style,
            onEachFeature: onEachFeature // Apply the function to each feature
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error loading GeoJSON data:', error);
    });
