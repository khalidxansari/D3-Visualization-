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

    d3.csv("london_boroughs_aggregated.csv").then(function(data) {
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
