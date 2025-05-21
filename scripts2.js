// Initialize the map
var map = L.map('map').setView([35.7478, -86.1923], 8); // Default view centered on Tennessee
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
        weight: 1,
        opacity: 0.5,
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

// Load the merged GeoJSON data
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

    var toggleLayerButton = L.Control.extend({
        options: {
            position: 'topright'
            
        },

        onAdd: function () {
            var container = L.DomUtil.create('div', '');
            container.style.marginTop = '12px';
            container.style.marginRight = '10px';
    
            var button = L.DomUtil.create('button', '', container);
            button.innerHTML = 'Toggle Data';
            button.style.backgroundColor = '#434445';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.padding = '10px';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '5px';
            button.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
            button.style.fontSize = '14px';
            container.style.marginRight = '180px';
            
                // Hover effects
    button.addEventListener('mouseenter', function () {
        button.style.backgroundColor = '#0f0d0d';
    });

    button.addEventListener('mouseleave', function () {
        button.style.backgroundColor = '#434445';
    });
    
            button.onclick = function () {
                if (map.hasLayer(geojsonLayer)) {
                    map.removeLayer(geojsonLayer);
                } else {
                    map.addLayer(geojsonLayer);
                }
            };
    
            return container;
        }
    });
    
    map.addControl(new toggleLayerButton());

// Add a color legend to the map
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 100, 200, 500, 1000, 1500, 1700, 2000],
        labels = [];

    // Loop through the grades and generate a label with a colored square for each
    for (var i = 0; i < grades.length; i++) {
        // Adding color square with specific width and height
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></i> ' +
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
    map.setView([35.9606, -83.9207], 11);  // Knoxville coordinates and zoom level
});

function addBasemapSwitcher(map) {
    var mapboxAccessToken = 'pk.eyJ1IjoibWF4d2hpdGVob3VzZSIsImEiOiJjbG9peW9nY3UxZTN5MnJvMWV2ZGVxZ3VqIn0.a8iEZsSCZA7IP7mtskj4TQ';

    var basemaps = {
        'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }),
        'Stamen Terrain': L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
                '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; ' +
                '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }),       
        'Esri World Imagery': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }),
        'Custom Mapbox Style': L.tileLayer('https://api.mapbox.com/styles/v1/maxwhitehouse/clonh3vft003t01r7667peoxu/tiles/256/{z}/{x}/{y}@2x?access_token=' + mapboxAccessToken, {
            attribution: '@MaxWhitehouse'
        }),
        'Mapbox Satellite': L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
            attribution: 'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        }),
        'Mapbox Streets': L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        }),
        'Mapbox Dark': L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
            attribution: 'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        }),
        'MtbMap': L.tileLayer('http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &amp; USGS'
        }),

    };
    
    L.control.layers(basemaps).addTo(map);
  }
  addBasemapSwitcher(map);

  // Function to show the second (data explanation) popup
function showInfoPopup() {
    var infoPopup = L.popup({
        closeButton: true,
        autoClose: false,
        closeOnClick: false,
        className: 'info-popup'
    })
    .setLatLng([35.7478, -86.1923])
    .setContent("<strong>Information about the Data.</strong><br>This map shows estimated total housing units by census tract in Tennessee, using data from the American Community Survey (DP05_0091E). Click on a tract to see details. Use the toggle button to turn the data layer on or off.")
    .openOn(map);
}

// Function to show the first (welcome) popup with "OK" button
function showWelcomePopup() {
    var welcomeContent = `
        <div class="welcome-popup">
            <h2>GEOG 495 Final Project!</h2>
            <p>By Max Whitehouse</p>
            <button id="okButton" style="
                margin-top: 15px;
                padding: 8px 12px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;">OK</button>
        </div>
    `;

    var welcomePopup = L.popup({
        closeButton: false,
        autoClose: false,
        closeOnClick: false,
        className: 'welcome-popup'
    })
    .setLatLng([35.7478, -86.1923])
    .setContent(welcomeContent)
    .openOn(map);

    // Wait for the DOM to render, then bind the click event
    setTimeout(() => {
        document.getElementById('okButton').addEventListener('click', function () {
            map.closePopup(welcomePopup);
            showInfoPopup(); // Then show the second popup
        });
    }, 0);
}

// Call the function to show welcome popup on map load
showWelcomePopup();
