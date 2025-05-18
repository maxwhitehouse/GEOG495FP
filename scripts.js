// Initialize the map
var map = L.map('map').setView([35.9606, -83.9207], 10); // Default view centered on Knoxville, TN

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define a style for the GeoJSON layers (Census Tracts)
function style(feature) {
    return {
        fillColor: 'rgba(0, 0, 255, 0.2)', // Light blue fill
        weight: 2,
        color: 'blue',
        opacity: 1,
        fillOpacity: 0.4
    };
}

// Define the function to show details when hovering or clicking
function onEachFeature(feature, layer) {
    let tooltipContent = '';

    // Display the name of the Census Tract
    if (feature.properties && feature.properties.NAME_y) {
        tooltipContent += `Census Tract: ${feature.properties.NAME_y}<br>`;
    }

    // Add Housing Data (e.g., DP05_0091PE) to the tooltip or popup
    if (feature.properties && feature.properties.DP05_0091E) {
        tooltipContent += `<strong>Estimate: ${feature.properties.DP05_0091E}</strong>`;
    }

    // Bind the tooltip to the layer
    if (tooltipContent) {
        layer.bindTooltip(tooltipContent, { sticky: true });  // Show the tooltip on hover
        layer.bindPopup(tooltipContent); // Or bind a popup that shows on click
    }
}

// Load the merged GeoJSON data (already contains the housing data)
fetch('data/merged_data.geojson')
    .then(response => response.json())
    .then(mergedData => {
        // Add the merged GeoJSON data to the map with style and interactivity
        L.geoJSON(mergedData, {
            style: style,
            onEachFeature: onEachFeature  // Add the feature details (tooltips/popups)
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error loading GeoJSON data:', error);
    });

// Zoom to Memphis when the "Zoom to Memphis" button is clicked
document.getElementById('zoomMemphis').addEventListener('click', function() {
    map.setView([35.1495, -90.0490], 12);  // Memphis coordinates and zoom level
});

// Zoom to Knoxville when the "Zoom to Knoxville" button is clicked
document.getElementById('zoomKnoxville').addEventListener('click', function() {
    map.setView([35.9606, -83.9207], 10);  // Knoxville coordinates and zoom level
});
