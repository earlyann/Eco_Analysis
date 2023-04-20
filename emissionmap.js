
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

// Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(map);

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
    for (let index = 0; index < mapData.length; index++) {
        let mapD = mapData[index];

        L.circleMarker([mapD.lat, mapD.lon],{
                fillOpacity:1,
                clickable: true,
                stroke: true,
                color: "black",
                weight: 0.25,
})
        .bindPopup("<h5>" + mapD.country + "<h5><h5>Total CO2 Emissions: " + mapD.total + "</h5>").addTo(totalEmissions)
    };

    totalEmissions.addTo(map);
};
  
// Perform an API call to API to get the emissions information. Call createMarkers when it completes.
const startMap = `http://127.0.0.1:5000/api/v1/countries_totals?year=${mapYr}`
  
d3.json(startMap).then(createMarkers);
  