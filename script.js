document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([51.505, -0.09], 10);
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
        markers.clearLayers();
        var combinedData = allData.london.concat(allData.monthlyCrimes);
        combinedData.forEach(d => {
            var marker = L.marker([d.Latitude, d.Longitude]).bindPopup(`Lat: ${d.Latitude}, Lon: ${d.Longitude}`);
            markers.addLayer(marker);
        });
        map.addLayer(markers);
    }

    d3.csv("london_boroughs_aggregated.csv").then(data => {
        allData.london = data.map(d => ({...d, Latitude: +d.Latitude, Longitude: +d.Longitude}));
        updateMap();
    }).catch(error => {
        console.error('Error loading the London aggregated CSV file: ', error);
        alert("Failed to load London borough data. Please check your network connection and try again.");
    });
});
