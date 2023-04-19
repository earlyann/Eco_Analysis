//re-assign global variables
let mapYr = 2019
let mapData = null

let myMap = L.map("map", {
  center: [15.5994, -28.6731],
  zoom: 3,
});
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function baseMap () {
  // Use this link to get the GeoJSON data.
  let link = "countries.geojson";
  
  // Getting our GeoJSON data
  d3.json(link).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
      style: function(feature) {
        return {
          color: "green",
          fillOpacity: 0.5,
          weight: 1.5
        };
      },
      // on each feature
      onEachFeature: function(feature, layer) {
        // mouse events to change the map styling.
        layer.on({
          // When a user’s mouse cursor touches a map feature
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9
            });
          },
          // change opacity back when mouse out of country
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          }
        }).addTo(myMap);
      }
    })
  })
};

// function to read data, populate initial graphs
function setup() {

  const mapURL = `http://127.0.0.1:5000/api/v1/countries_totals?year=${mapYr}`

  // Fetch the JSON data and assign properties to global variables
  d3.json(mapURL).then(function(data) {
    mapData = data
    console.log("RawData", rawData)

  });
  
  baseMap();

};

setup();