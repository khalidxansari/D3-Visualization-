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

function draw(filteredData) {
    // Clear previous markers
    markers.clearLayers();

    // Iterate over each data entry and place a marker
    filteredData.forEach(function(d) {
        var marker = L.marker([d.Latitude, d.Longitude]);
        marker.bindPopup(`Crime: ${d['Crime type']}<br>Outcome: ${d['Last outcome category'] || 'Count: ' + d['Count']}`);
        markers.addLayer(marker);
    });
}

// Load London borough data
d3.csv("london_boroughs.csv").then(function(data) {
    allData.london = data.map(function(d) {
        return {
            ...d,
            Latitude: +d.Latitude,
            Longitude: +d.Longitude
        };
    });
    updateMap(); // Update map after data is loaded
}).catch(function(error) {
    console.error('Error loading the London CSV file: ', error);
});


function updateMap() {
    var currentMonth = new Date().getMonth() + 1;  // Get the current month
    var monthDataLondon = allData.london.filter(d => new Date(d.Month).getMonth() + 1 === currentMonth);
    var monthDataMonthly = allData.monthlyCrimes.filter(d => new Date(d.Month).getMonth() + 1 === currentMonth);
    
    draw(monthDataLondon.concat(monthDataMonthly));  // Combine and draw both datasets
    document.getElementById('crimeCount').textContent = monthDataLondon.length + monthDataMonthly.length;
}
