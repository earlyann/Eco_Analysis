// define global variables
let rawMap = null
let mapYr = 2019

const geoData = coords 

let map = L.map("map", {
  center: [40.5, -90.5],
  zoom: 4});

// create tile layer - base background
standard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

// add tile layer to map
standard.addTo(map)

////////////////////////////////////////////////////t//////////////////////
function prepMap() {
    // loop through data to generate list of countries for given year
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

    const formatData = []
    // Outer Loop iterates over countries / Inner Loop iterates over Category. for each country returns object with category and value
    cnty.forEach ((c) => {
        const cntyCategories = []
        rawMap.forEach((rM) => {
            if (rM.Country === c) {
                if (categories.some((cC) => {
                    return cC === rM.Category
                })) {
                    // console.log('Country, Category, Value', `${rD['Country Code']}: ${rD.Category}: ${rD.Value}`);
                    cntyCategories.push({
                        category: rM.Category,
                        value: rM.Value
                    });
                    }
            };
        })
        
        formatData.push({
            country:c,
            countryCode: rawMap.find(rc => rc.Country === c)['Country Code'],
            total: cntyCategories.find(cC => cC.category === 'Total').value,
            gdp: cntyCategories.find(cC => cC.category === 'GDP (current US$)').value,
            population: cntyCategories.find(cC => cC.category === 'Population, total').value/1000000,
        });
    });
    
    // Sort bargraph data by total emissions for stacked bar chart 
    formatData.sort((d1, d2) => {
        return d2.total - d1.total});
    // return formatData

    const mapData = formatData.map(d => {
        const matchingGeo = geoData.find(gd => gd['Country Code'] === d.countryCode);
        // console.log(matchingGeo);
        return {...d, ...{lat: matchingGeo?.Lat, lng: matchingGeo?.Lng }};
    });

    console.log('latlongobj', mapData)
    
    return mapData;
};
//////////////// FUNCTION -- CALL PLOTS FOR VISUALIZATION --- ////////////////
function updateMap () {
    let mapData = prepMap();
    // formatData = latlong(formatData);
}

////////////////////  FUNCTION - INITIALIZE DATA, EVENT HANDLER  //////////////////
// function to read data, populate initial graphs
function plotMap() {
const startMap = `http://127.0.0.1:5000/api/v1/countries_totals?year=${mapYr}`     

// Fetch the JSON data and assign properties to global variables
d3.json(startMap).then(function(data) {
        rawMap = data
        prepMap()
    });
};
plotMap();

