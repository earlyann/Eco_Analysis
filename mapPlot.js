//re-assign global variables
yearselected = 2019
dropDownYear = [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]

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
        })
      }
    }).addTo(myMap);
  });
};


// function to read data, populate initial graphs
function setup() {

  var dataURL = `http://127.0.0.1:5000/api/v1/countries?year=${yearselected}`

  // use d3 to select drop down, assign to variable
  var selectYr = d3.select("#selYr")
  
  // Fetch the JSON data and assign properties to global variables
  d3.json(dataURL).then(function(data) {
      rawData = data
      console.log("RawData", rawData)

      // append year to drop down selector
      dropDownYear.reverse()
      dropDownYear.forEach((sample) => {
          selectYr
              .append("option")
              .text(sample)
              .property("value", sample);
      });
  });
  
      // define event listener for drop down selection change on Year
      selectYr.on('change', function() {
          yearselected = selectYr.property("value")
          dataURL = `http://127.0.0.1:5000/api/v1/countries?year=${yearselected}`
          console.log("New URL", dataURL)

      // Fetch the JSON data and assign properties to global variables
              d3.json(dataURL).then(function(data) {
                  rawData = data
              });
          });
      };

baseMap();
setup();