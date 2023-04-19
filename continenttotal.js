//define global arrays -- for drop down and to loop through
let continentalRawData = null;
let yearSelectedTotal = 2019
let continentSelectedTotal = 'AF'

////////////////////////////////////////////////////t//////////////////////
function clean() {
    // loop through data to generate list of countries for given year
    const cnty = []
    continentalRawData.forEach(rD => {
        if(!cnty.some(c => c === rD.Country)) {
            cnty.push(rD.Country)
        }
    });
    
    // loop through data to generate list of categories for given year
    const categories = []    
    continentalRawData.forEach(rD => {
        if(!categories.some(c => c === rD.Category)) {
            categories.push(rD.Category)
        }
    });

    const formatData = []
    // Outer Loop iterates over countries / Inner Loop iterates over Category. for each country returns object with category and value
    cnty.forEach ((c) => {
        const cntyCategories = []
        continentalRawData.forEach((rD) => {
            if (rD.Country === c) {
                if (categories.some((cC) => {
                    return cC === rD.Category
                })) {
                    // console.log('Country, Category, Value', `${rD['Country Code']}: ${rD.Category}: ${rD.Value}`);
                    cntyCategories.push({
                        category: rD.Category,
                        value: rD.Value
                    });
                    }
            };
        })
        
        formatData.push({
            country:c,
            oil: cntyCategories.find(cC => cC.category === 'Oil').value,
            coal: cntyCategories.find(cC =>cC.category === 'Coal').value, 
            gas: cntyCategories.find(cC => cC.category === 'Gas').value,
            cement: cntyCategories.find(cC => cC.category === 'Cement').value, 
            flaring: cntyCategories.find(cC => cC.category === 'Flaring').value, 
            other: cntyCategories.find(cC => cC.category === 'Other').value,
            total: cntyCategories.find(cC => cC.category === 'Total').value,
            // gdp: cntyCategories.find(cC => cC.category === 'GDP per capita (current US$)').value,
            population: cntyCategories.find(cC => cC.category === 'Population, total').value/1000000,
        });
    });
    
    // Sort bargraph data by total emissions for stacked bar chart 
    formatData.sort((d1, d2) => {
        return d2.total - d1.total});

    return formatData
};
///////////////////--SIMPLE BAR CHART IN APEX--///////////////////////////////
function plotTreeMap (formatData) {
    let treeChart = formatData.map(tC => {
        return {
            x: tC.country,
            y: tC.total
        }
    })
    console.log(treeChart);

    var options = {
        series: [{data: treeChart}],

        legend: {show: false},

        chart: {
            height: 350,
            type: 'treemap'},

        title: {
            text: 'Basic Treemap'
        }
    };

    const treeEl = document.querySelector("#tree");
    treeEl.innerHTML = '';
    var chart = new ApexCharts(document.querySelector("#tree"), options);
    chart.render();

}
//////////////// FUNCTION -- CALL PLOTS FOR VISUALIZATION --- ////////////////
function plot() {
    let formatData = clean();
    plotTreeMap(formatData);
}

////////////////////  FUNCTION - INITIALIZE DATA, EVENT HANDLER  //////////////////
// function to read data, populate initial graphs
function setup() {
    const initialDataURLTotal = `http://127.0.0.1:5000/api/v1/continent_totals/${continentSelectedTotal}?year=${yearSelectedTotal}`
    
    // Fetch the JSON data and assign properties to global variables
    d3.json(initialDataURLTotal).then(function(data) {
        continentalRawData = data
        console.log("ContinentalRawData", continentalRawData)

        plot()
    });
    
    // define event listener for drop down selection change on Year
    selectYr.on('change', function() {
        yearSelectedTotal = selectYr.property("value")
        const dataURLTotal = `http://127.0.0.1:5000/api/v1/continent_totals/${continentSelectedTotal}?year=${yearSelectedTotal}`

        // Fetch the JSON data and assign properties to global variables
        d3.json(dataURLTotal).then(function(data) {
            continentalRawData = data
            plot()
        });

        yearSelected = selectYr.property("value")
        const dataURL = `http://127.0.0.1:5000/api/v1/continent_per_capita/${continentSelected}?year=${yearSelected}`

        // Fetch the JSON data and assign properties to global variables
        d3.json(dataURL).then(function(data) {
            rawData = data

            plotAllVisuals()
        });
    });

    // define event listener for drop down selection change on Continent Code
    selectCC.on('change', function() {
        continentSelectedTotal = selectCC.property("value")            
        const dataURLTotal = `http://127.0.0.1:5000/api/v1/continent_totals/${continentSelectedTotal}?year=${yearSelectedTotal}`

        // Fetch the JSON data and assign properties to global variables
        d3.json(dataURLTotal).then(function(data) {
            continentalRawData = data

            plot()
        });

        continentSelected = selectCC.property("value")            
        const dataURL = `http://127.0.0.1:5000/api/v1/continent_per_capita/${continentSelected}?year=${yearSelected}`

        // Fetch the JSON data and assign properties to global variables
        d3.json(dataURL).then(function(data) {
            rawData = data

            plotAllVisuals()
        });
    });
};

setup();