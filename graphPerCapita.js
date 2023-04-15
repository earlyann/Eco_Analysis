
let yearSelected = 2019
let continentSelected = 'AF'

// var yearURL = `http://127.0.0.1:5000/api/v1/countries?year${yearSelected}`
var dataURL = `http://127.0.0.1:5000/api/v1/continent_per_capita/${continentSelected}?year=${yearSelected}`

//define constant arrays -- for drop down and to loop through
let dropDownYear = [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]
let dropDownContinent = ["AF", "AS", "EU", "NA", "OC", "SA"]
const buckets = ['Coal', 'Oil', 'Gas', 'Cement', 'Flaring', 'Other', 'Total']

let rawData = null
let type = null

////////////////////////////////////////////////////t//////////////////////
function plotBarChart() {
    
    let parts = []
    let tableSum = []

    // filter URL data for perCapita data
    rawData.forEach((rD) => {
        if (buckets.some((b) => {
            return b === rD.Category}))
            parts.push(rD)

        else tableSum.push(rD)},
        console.log("TableData", tableSum),
        console.log("GraphData", parts))

    const cnty = [];
    // loop through data to generate list of countries for given year
    parts.forEach(p => {
        if(!cnty.some(c => c === p.Country)) {
            cnty.push(p.Country)}},
    );
    console.log("Country List", cnty)
    
    let barChart = []
    // Outer Loop iterates over countries / Inner Loop iterates over Category. 
    // for each country returns object with category and value
    cnty.forEach ((c) => {
        const cntybuckets = []
        parts .forEach((p) => {
            if (p.Country === c) {
                if (buckets.some((b) => {
                    return b === p.Category
                })) {
                    cntybuckets.push({
                        category: p.Category,
                        value: p.Value
                    });
                    }
                };
            },
        )

        barChart.push({
            country:c,
            oil: cntybuckets.find(cb => cb.category === 'Oil').value,
            coal: cntybuckets.find(cb =>cb.category === 'Coal').value, 
            gas: cntybuckets.find(cb => cb.category === 'Gas').value ,
            cement: cntybuckets.find(cb => cb.category === 'Cement').value, 
            flaring: cntybuckets.find(cb => cb.category === 'Flaring').value, 
            other: cntybuckets.find(cb => cb.category === 'Other').value,
            total: cntybuckets.find(cb => cb.category === 'Total').value
        })
    });
    // console.log("testgroup",barChart)

/////// Create array for each aspect of stacked bar chart//////////////////////
    var gas = {
        x: barChart.map(bC => bC.gas),
        y: barChart.map(bC => bC.country),
        name: 'Gas',
        orientation: 'h',
        marker: {
            color: '#4A8DDC',
            width: 1},
        type: 'bar'};
    
    var oil = {
        x: barChart.map(bC => bC.oil),
        y: barChart.map(bC => bC.country),
        name: 'Oil',
        orientation: 'h',
        marker: {
            color: '#4C5D8A',
            width: 1},
        type: 'bar'};

    var coal = {
        x: barChart.map(bC => bC.coal),
        y: barChart.map(bC => bC.country),
        name: 'Coal',
        orientation: 'h',
        marker: {
            color: '#F3C911',
            width: 1},
        type: 'bar'};

    var cement = {
        x: barChart.map(bC => bC.cement),
        y: barChart.map(bC=> bC.country),
        name: 'Cement',
        orientation: 'h',
        marker: {
            color: '#DC5B57',
            width: 1},
        type: 'bar'};
    
    var flaring = {
        x: barChart.map(bC => bC.flaring),
        y: barChart.map(bC => bC.country),
        name: 'Flaring',
        orientation: 'h',
        marker: {
            color: '#33AE81',
            width: 1},
        type: 'bar'};

    var other = {
        x: barChart.map(bC => bC.other),
        y: barChart.map(bC => bC.country),
        name: 'Other',
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
///////////////////////////////////////////////////////////////////////
var options = {
    series: [
    
    {name: 'Gas',
    data: (barChart.map(bC => bC.gas))},
    
    {name: 'Oil',
    data: (barChart.map(bC => bC.oil))},

    {name: 'Coal',
    data: (barChart.map(bC => bC.coal))},

    {name: 'Cement',
    data: (barChart.map(bC => bC.cement))},

    {name: 'Flaring',
    data: (barChart.map(bC => bC.flaring))},

    {name: 'Other',
    data: (barChart.map(bC => bC.other))},],

    chart: {
    type: 'bar',
    height: 1500,
    stacked: true,
  },
  plotOptions: {
    bar: {
      horizontal: true},
  },

  dataLabels: {
    enabled: false},

  stroke: {
    width: 1,
    colors: ['#fff']},
  title: {text: 'Fiction Books Sales'},
  xaxis: 
   {categories: barChart.map(bC => bC.country)},
  yaxis: {
    title: {
      text: "Country Emissions"},},

  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetX: 40}
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();

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
        console.log("RawData", rawData)

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
                    plotBarChart()
                });
            });

        // define event listener for drop down selection change on Continent Code
        selectCC.on('change', function() {
            continentSelected = selectCC.property("value")            
            dataURL = `http://127.0.0.1:5000/api/v1/continent_per_capita/${continentSelected}?year=${yearSelected}`

        // Fetch the JSON data and assign properties to global variables
                d3.json(dataURL).then(function(data) {
                    rawData = data
                    plotBarChart()
                });
            });
        };

init();
