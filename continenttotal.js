//define global arrays -- for drop down and to loop through
let rawDataTotal = null;
let yrSelecTotal = 2019
let ccSelecTotal = 'AF'

////////////////////////////////////////////////////t//////////////////////
function clean() {
    // loop through data to generate list of countries for given year
    const cnty = []
    rawDataTotal.forEach(rD => {
        if(!cnty.some(c => c === rD.Country)) {
            cnty.push(rD.Country)
        }
    });
    
    // loop through data to generate list of categories for given year
    const categories = []    
    rawDataTotal.forEach(rD => {
        if(!categories.some(c => c === rD.Category)) {
            categories.push(rD.Category)
        }
    });

    const formatData = []
    // Outer Loop iterates over countries / Inner Loop iterates over Category. for each country returns object with category and value
    cnty.forEach ((c) => {
        const cntyCategories = []
        rawDataTotal.forEach((rD) => {
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

    const tree = document.querySelector("#tree");

    tree.innerHTML = '';
    
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
    const startTotal = `http://127.0.0.1:5000/api/v1/continent_totals/${ccSelecTotal}?year=${yrSelecTotal}`
    
    // Fetch JSON data to load initial charts
    d3.json(startTotal).then(function(data) {
        rawDataTotal = data
        console.log("rawDataTotal", rawDataTotal)
        plot()
    });
    
    // define event listener for drop down selection change on Year
    selectYr.on('change', function() {
        yrSelecTotal = selectYr.property("value")
        const changeTotal = `http://127.0.0.1:5000/api/v1/continent_totals/${ccSelecTotal}?year=${yrSelecTotal}`

        // Fetch the JSON data and refresh charts using Total API
        d3.json(changeTotal).then(function(data) {
            rawDataTotal = data
            plot()
        });

        yearSelected = selectYr.property("value")
        const changePC = `http://127.0.0.1:5000/api/v1/continent_per_capita/${continentSelected}?year=${yearSelected}`

       // Fetch the JSON data and refresh charts using Per Cap API
        d3.json(changePC).then(function(data) {
            rawData = data
            plotAllVisuals()
        });
    });

    // define event listener for drop down selection change on Continent Code
    selectCC.on('change', function() {
        ccSelecTotal = selectCC.property("value")            
        const changeTotal = `http://127.0.0.1:5000/api/v1/continent_totals/${ccSelecTotal}?year=${yrSelecTotal}`

        // Fetch the JSON data and refresh charts using Total API
        d3.json(changeTotal).then(function(data) {
            rawDataTotal = data
            plot()
        });

        continentSelected = selectCC.property("value")            
        const changePC = `http://127.0.0.1:5000/api/v1/continent_per_capita/${continentSelected}?year=${yearSelected}`

       // Fetch the JSON data and refresh charts using Per Cap API
        d3.json(changePC).then(function(data) {
            rawData = data
            plotAllVisuals()
        });
    });
};

setup();