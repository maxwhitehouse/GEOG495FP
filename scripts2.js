// Initialize the map
var map = L.map('map').setView([35.7478, -86.6923], 8); // Default view centered on Tennessee

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define a color scale function (you can use other color scales from d3 or define your own)
function getColor(d) {
    return d > 2000 ? '#800026' :
           d > 1700  ? '#BD0026' :
           d > 1500  ? '#E31A1C' :
           d > 1000  ? '#FC4E2A' :
           d > 500   ? '#FD8D3C' :
           d > 200   ? '#FEB24C' :
           d > 100   ? '#FED976' :
                      '#FFEDA0';
}

// Define a function to style each feature based on its data value (DP05_0091E)
function style(feature) {
    const dpValue = feature.properties.DP05_0091E;

    return {
        fillColor: getColor(dpValue), // Use DP05_0091E value for color
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// Define the function to show details when clicking (for both NAME_y and DP05_0091E)
function onEachFeatureClick(feature, layer) {
    let popupContent = '';

    // Display NAME_y when clicked
    if (feature.properties && feature.properties.NAME_y) {
        popupContent += `Census Tract: ${feature.properties.NAME_y}<br>`;
    }

    // Display DP05_0091E when clicked
    if (feature.properties && feature.properties.DP05_0091E) {
        popupContent += `<strong>Estimate: ${feature.properties.DP05_0091E}</strong>`;
    }

    // Bind the popup to the layer on click
    if (popupContent) {
        layer.bindPopup(popupContent);  // Show the popup on click
    }
}

// Highlight feature on hover
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#ffff00',
        dashArray: '',
        fillOpacity: 0.7
    });
}

// Reset highlight on mouseout
function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
}

// Load the merged GeoJSON data (already contains the housing data)
fetch('data/merged_data.geojson')
    .then(response => response.json())
    .then(mergedData => {
        // Add the merged GeoJSON data to the map with style and interactivity
        geojsonLayer = L.geoJSON(mergedData, {
            style: style,
            onEachFeature: function (feature, layer) {
                // Set click interaction for popups
                layer.on('click', function () {
                    onEachFeatureClick(feature, layer);
                });
                // Set hover interaction for highlighting
                layer.on('mouseover', highlightFeature);
                layer.on('mouseout', resetHighlight);
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error loading GeoJSON data:', error);
    });

// Add a color legend to the map
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 100, 200, 500, 1000, 1500, 1700, 2000],
        labels = [];

    // Loop through the grades and generate a label with a colored square for each
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

// Add the legend to the map
legend.addTo(map);

// Zoom to Memphis when the "Zoom to Memphis" button is clicked
document.getElementById('zoomMemphis').addEventListener('click', function() {
    map.setView([35.1495, -90.0490], 12);  // Memphis coordinates and zoom level
});

// Zoom to Knoxville when the "Zoom to Knoxville" button is clicked
document.getElementById('zoomKnoxville').addEventListener('click', function() {
    map.setView([35.9606, -83.9207], 10);  // Knoxville coordinates and zoom level
});
