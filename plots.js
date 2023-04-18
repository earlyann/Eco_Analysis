//Creating the map object
let  yearselected = 2019
var dataURL = `http://127.0.0.1:5000/api/v1/countries?year=${yearselected}`
console.log(dataURL)

let myMap = L.map("map", {
  center: [15.5994, -28.6731],
  zoom: 3,
});
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
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

          var selectYr = d3.select("#selYr")
        //Get the data for the country from the API
        d3.json(dataURL).then(function(data) {
          // Display the data in a tooltip
          let tooltipText = "";
          for (let key in data) {
            tooltipText += `${key}: ${data[key]}<br>`;
          }
          layer.bindTooltip(tooltipText);
        });
      },
      // When the cursor no longer hovers over a map feature
      mouseout: function(event) {
        layer = event.target;
        layer.setStyle({
          fillOpacity: 0.5
        });
      },
      // When a feature (country) is clicked, it enlarges to fit the screen.
      click: function(event) {
        myMap.fitBounds(event.target.getBounds());
      },
    })
    // Giving each feature a popup with information that’s relevant to it
    layer.bindPopup("<h1>" + feature.properties.ADMIN);
    }
  }).addTo(myMap);
});












