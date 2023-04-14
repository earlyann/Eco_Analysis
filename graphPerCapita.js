
let yearSelected = 2019
let continentSelected = 'AF'

// var yearURL = `http://127.0.0.1:5000/api/v1/countries?year${yearSelected}`
var dataURL = `http://127.0.0.1:5000/api/v1/continent_per_capita/${continentSelected}?year=${yearSelected}`

//define constant arrays -- for drop down and to loop through
let dropDownYear = [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]
let dropDownContinent = ["AF", "AS", "EU", "NA", "OC", "SA"]
const buckets = ['Coal', 'Oil', 'Gas', 'Cement', 'Flaring', 'Other']

let rawData = null
let type = null

////////////////////////////////////////////////////t//////////////////////
function plotBarChart() {
    
    let perCap = []

    // filter URL data for perCapita data
    rawData.forEach((rD) => {
        if (rD.Type === 'PerCapita CO2') {
            perCap .push(rD)};
    });

    const country = [];
    // loop through data to generate list of countries for given year
    perCap .forEach(pC => {
        if(!country.some(c => c === pC.Country)) {
            country.push(pC.Country)}},
    );
    console.log("Country List", country)
    
    let dataToChart = []
    // Outer Loop iterates over countries / Inner Loop iterates over Category. 
    // for each country returns object with category and value
    country.forEach ((c) => {
        const countrybuckets = []
        perCap .forEach((pC) => {
            if (pC.Country === c) {
                if (buckets.some((b) => {
                    return b === pC.Category
                })) {
                    countrybuckets.push({
                        category: pC.Category,
                        value: pC.Value
                    });    
                    } 
                };
            },
        )

        dataToChart.push({
            country:c,
            oil: countrybuckets.find(cb => cb.category === 'Oil').value,
            coal: countrybuckets.find(cb =>cb.category === 'Coal').value, 
            gas: countrybuckets.find(cb => cb.category === 'Gas').value ,
            cement: countrybuckets.find(cb => cb.category === 'Cement').value, 
            flaring: countrybuckets.find(cb => cb.category === 'Flaring').value, 
            other: countrybuckets.find(cb => cb.category === 'Other').value
        })
    });
    console.log("testgroup",dataToChart)

/////// Create array for each aspect of stacked bar chart//////////////////////
    var gas = {
        x: dataToChart.map(dtc => dtc.gas),
        y: dataToChart.map(dtc => dtc.country),
        name: 'Gas',
        orientation: 'h',
        marker: {
            color: '#4A8DDC',
            width: 1},
        type: 'bar'};
    
    var oil = {
        x: dataToChart.map(dtc => dtc.oil),
        y: dataToChart.map(dtc => dtc.country),
        name: 'Oil',
        orientation: 'h',
        marker: {
            color: '#4C5D8A',
            width: 1},
        type: 'bar'};

    var coal = {
        x: dataToChart.map(dtc => dtc.coal),
        y: dataToChart.map(dtc => dtc.country),
        name: 'Coal',
        orientation: 'h',
        marker: {
            color: '#F3C911',
            width: 1},
        type: 'bar'};

    var cement = {
        x: dataToChart.map(dtc => dtc.cement),
        y: dataToChart.map(dtc => dtc.country),
        name: 'Gas',
        orientation: 'h',
        marker: {
            color: '#DC5B57',
            width: 1},
        type: 'bar'};
    
    var flaring = {
        x: dataToChart.map(dtc => dtc.flaring),
        y: dataToChart.map(dtc => dtc.country),
        name: 'Oil',
        orientation: 'h',
        marker: {
            color: '#33AE81',
            width: 1},
        type: 'bar'};

    var other = {
        x: dataToChart.map(dtc => dtc.other),
        y: dataToChart.map(dtc => dtc.country),
        name: 'Coal',
        orientation: 'h',
        marker: {
            color: '#95C8F0',
            width: 1},
        type: 'bar'};

    var data = [gas, oil, coal, cement, flaring, other]

    var layout = {
            title: 'Colored Bar Chart',
            barmode: 'stack',
          };

    Plotly.newPlot('bar', data, layout);
};

////////////////////  FUNCTION - INITIALIZE DATA, EVENT HANDLER  //////////////////
// function to read data, populate initial graphs
function init() {

    // use d3 to select drop down, assign to variable
    var selectYr = d3.select("#selYr")
    var selectCC = d3.select("#selCC")
    
    // Fetch the JSON data and assign properties to global variables
    d3.json(dataURL).then(function(data) {
        rawData = data

        // append year to drop down selector
        dropDownYear.reverse()
        dropDownYear.forEach((sample) => {
            selectYr
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // append Continent Code to drop down selector
        dropDownContinent.forEach((sample) => {
            selectCC
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        plotBarChart()
    });
    
        // define event listener for drop down selection change on Year
        selectYr.on('change', function() {
            yearSelected = selectYr.property("value")
            
            dataURL = `http://127.0.0.1:5000/api/v1/continent_per_capita/${continentSelected}?year=${yearSelected}`

        // Fetch the JSON data and assign properties to global variables
                d3.json(dataURL).then(function(data) {
                    rawData = data
                    console.log("YearSelection", rawData)
                    plotBarChart()
                });
                console.log("Test", yearSelected);
            });

        // define event listener for drop down selection change on Continent Code
        selectCC.on('change', function() {
            continentSelected = selectCC.property("value")
            
            dataURL = `http://127.0.0.1:5000/api/v1/continent_per_capita/${continentSelected}?year=${yearSelected}`

        // Fetch the JSON data and assign properties to global variables
                d3.json(dataURL).then(function(data) {
                    rawData = data
                    console.log("YearSelection", rawData)
                    plotBarChart()
                });
            });
        };

init();
