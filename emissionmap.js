
let mapYr = 2019

const geoData = coords 

// Create the tile layer that will be the background of our map.
let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
  
// Create a baseMaps object to hold the streetmap layer.
let baseMaps = {"base map": base};

// define new layergroup
var totalEmissions = new L.LayerGroup();

// Create an overlayMaps object to hold the bikeStations layer.
let overlayMaps = {"CO2 Emissions": totalEmissions};

// Create the map object with options.
let map = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 3,
    layers: [base, totalEmissions]
});

// Create a layer control add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(map);

// create a legend
let legend = L.control({position: "bottomright"});

// define legend function
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        const total = [0, 10, 30, 50, 100, 300, 700];
        const colors = ["#27ae60", "#9ccc65", "#ffea00", "#ffc107", "#ff9800", "#ff5722", "#d32f2f"];
        let legendTitle = "<h4>Total CO2 emissions </h4>"

        div.innerHTML = legendTitle;

        // use for loop to iterate through colors and depths; pair color with orresponding depth, using index position.
        for (var i = 0; i < total.length; i++) {
            console.log(colors[i]);
            div.innerHTML +=
            "<i style=\"background: " + colors[i] + "\"></i>" +
            total[i] + (total[i + 1] ? " to " + total[i + 1] + "<br>" : "+");}
        return div;};

//////////////////////////////////---  CIRCLE COLORS & SIZE  ----- ///////////////////////////////////////////
// functions to style earthquake markers / https://www.color-hex.com/color-palettes/?page=4 (color scheme)

// define function to determine circle color based on earthquake depth
function setColor(total) {
    if(total < 10 ) {
      return "#27ae60";}
    else if (total < 30 ) {
      return "#9ccc65";}

    else if(total < 50) {
      return "#ffea00" ;}

    else if(total < 100) {
      return "#ffc107";}

    else if(total < 300) {
      return "#ff9800";}

    else if(total < 700) {
      return "#ff5722";}

    return "#d32f2f"}; 
  
  // define function to determine circle size
  function setSize(gdp) {
  if(gdp === 0) {
    return 1;}
    return 3};
  
//////////////////////////////////////////////////////////////////////////////////////////
function createMarkers(response) {
    // Pull the "stations" property from response.data.
    let rawMap = response

    const cnty = []
    rawMap.forEach(rM => {
        if(!cnty.some(c => c === rM.Country)) {
            cnty.push(rM.Country)
        }
    });
    
    // loop through data to generate list of categories for given year
    const categories = []    
    rawMap.forEach(rM => {
        if(!categories.some(c => c === rM.Category)) {
            categories.push(rM.Category)
        }
    });

    let formatmap = []
    // Outer Loop iterates over countries / Inner Loop iterates over Category. for each country returns object with category and value
    cnty.forEach ((c) => {
        const cntyCategories = []
        rawMap.forEach((rM) => {
            if (rM.Country === c) {
                if (categories.some((cC) => {
                    return cC === rM.Category
                })) {
                    // console.log('Country, Category, Value', `${rM['Country Code']}: ${rM.Category}: ${rM.Value}`);
                    cntyCategories.push({
                        category: rM.Category,
                        value: rM.Value
                    });
                    }
            };
        })
        
        formatmap.push({
            country:c,
            countryCode: rawMap.find(rc => rc.Country === c)['Country Code'],
            total: cntyCategories.find(cC => cC.category === 'Total').value,
            gdp: cntyCategories.find(cC => cC.category === 'GDP (current US$)').value,
            population: cntyCategories.find(cC => cC.category === 'Population, total').value/1000000,
        });
    });

    let mapData = formatmap.map(d => {
        const matchingGeo = geoData.find(gd => gd['Country Code'] === d.countryCode);
        // console.log(matchingGeo);
        return {...d, ...{lat: matchingGeo?.lat, lon: matchingGeo?.lon }};
    });

    console.log("Test LatLong", mapData)

    // Loop through the array.
    for (var m = 0; m < mapData.length; m ++) {

        let lat = mapData[m].lat;
        let lon = mapData[m].lon;
        let countryname = mapData[m].country;
        let total = mapData[m].total;
        let population = mapData[m].population;
        let gdp = mapData[m].gdp

        L.circleMarker([lat, lon],{
                fillOpacity:1,
                clickable: true,
                stroke: true,   
                weight: 0.25,
                fillColor: setColor(total),
                radius: 10})

        .bindPopup("<h5><b>Country: </b>" + countryname + "<h5><b>Total CO2 Emissions: </b>" + total + "<h5><b>Population in Millions: </b>" + population).addTo(totalEmissions)
    };

    totalEmissions.addTo(map);
    
    legend.addTo(map)

};
  
// Perform an API call to API to get the emissions information. Call createMarkers when it completes.
const startMap = `http://127.0.0.1:5000/api/v1/countries_totals?year=${mapYr}`
  
d3.json(startMap).then(createMarkers);
