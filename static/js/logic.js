const QUAKE_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
const RADIUS_COEFF = 5;
const RADIUS_MIN = 3;
const COLOR_DEPTHS = [10, 30, 50, 70, 90]
const COLOR_COLORS = ['#b3ecec', '#89ecda', '#43e8d8', '#40e0d0', '#3bd6c6', '#ae0001']

// const DEPTH_TRANSITION = 

let myMap = L.map("map", {
    center: [39.30, -94.70],
    zoom: 2 //4.5
  });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


function getRadius(feature) {
    let mag = feature.properties.mag;
    let calculatedRadius = mag * RADIUS_COEFF;
    let radius = Math.max(calculatedRadius, RADIUS_MIN);
    return calculatedRadius;
}

function getColor(feature) {
    let depth = feature.geometry.coordinates[2];
    if (depth <= COLOR_DEPTHS[0]) {
        return COLOR_COLORS[0];
    } else if (depth <= COLOR_DEPTHS[1]) {
        return COLOR_COLORS[1];
    } else if (depth <= COLOR_DEPTHS[2]) {
        return COLOR_COLORS[2];
    } else if (depth <= COLOR_DEPTHS[3]) {
        return COLOR_COLORS[3];
    } else if (depth <= COLOR_DEPTHS[4]) {
        return COLOR_COLORS[4]; 
    } else {
        return COLOR_COLORS[5];
    }            
}

function markerQuake(feature, coords) {
    markerOptions = {
        radius: getRadius(feature),
        fillColor: getColor(feature),
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    return L.circleMarker(coords, markerOptions);
}

function makePopUp(feature, layer) {
    let content = `${feature.properties.place} <hr>${feature.properties.mag}`;
    layer.bindPopup(content);

}

// markers- size by magnitude and colored by depth. Higher mag the larger the marker
function plotQuakes(quakeData) {
    console.log(quakeData);
    geoJsonOptions = {
        pointToLayer: markerQuake,
        onEachFeature: makePopUp

    };
    L.geoJSON(quakeData, geoJsonOptions).addTo(myMap);
}


d3.json(QUAKE_URL).then(plotQuakes);
