document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map and load data
    var map = L.map('map').setView([51.505, -0.09], 10);  // Centered on London
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var markers = L.markerClusterGroup();
    map.addLayer(markers);
    var allData = {
        london: [],
        monthlyCrimes: []
    };

    function updateMap() {
        // Clear existing markers
        markers.clearLayers();

        // Assuming you want to display all data collected so far
        var combinedData = allData.london.concat(allData.monthlyCrimes);
        combinedData.forEach(function(d) {
            var marker = L.marker([d.Latitude, d.Longitude]).bindPopup(`Latitude: ${d.Latitude}, Longitude: ${d.Longitude}`);
            markers.addLayer(marker);
        });

        // Add the markers to the map
        map.addLayer(markers);
    }

    d3.csv("london_boroughs_aggregated").then(function(data) {
        allData.london = data.map(d => ({
            ...d,
            Latitude: +d.Latitude,
            Longitude: +d.Longitude
        }));
        updateMap(); // Update map after data is loaded
    }).catch(function(error) {
        console.error('Error loading the London aggregated CSV file: ', error);
        alert("Failed to load London borough data. Please check your network connection and try again.");
    });
});
