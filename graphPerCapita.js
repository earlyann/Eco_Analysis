let yearSelected = 2019
let continentSelected = 'AF'

// var yearURL = `http://127.0.0.1:5000/api/v1/countries?year${yearSelected}`
var dataURL = `http://127.0.0.1:5000/api/v1/continent_per_capita/${continentSelected}?year=${yearSelected}`

// define global variables
let rawData = null

//define constant arrays -- for drop down and to loop through
const dropDownYear = [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]
const dropDownContinent = ["AF", "AS", "EU", "NA", "OC", "SA"]

////////////////////////////////////////////////////t//////////////////////
function keymetrics() {
    // loop through data to generate list of countries for given year
    const cntyCd = []
    rawData.forEach(rD => {
        if(!cntyCd.some(c => c === rD['Country Code'])) {
            cntyCd.push(rD['Country Code'])}},
        // console.log("Country Code", cntyCd)
    );
    
    // loop through data to generate list of categories for given year
    const categories = []    
    rawData.forEach(rD => {
        if(!categories.some(c => c === rD['Category'])) {
            categories.push(rD['Category'])}},
        // console.log("Categories", categories)
    );

    const bubblechart = []
    const formatData = []
    // Outer Loop iterates over countries / Inner Loop iterates over Category. for each country returns object with category and value
    cntyCd.forEach ((c) => {
        const cntyCategories = []
        rawData.forEach((rD) => {
            if (rD['Country Code'] === c) {
                if (categories.some((cC) => {
                    return cC === rD['Category']
                })) {
                    // console.log('Country, Category, Value', `${rD['Country Code']}: ${rD.Category}: ${rD.Value}`);
                    cntyCategories.push({
                        category: rD.Category,
                        value: rD.Value
                    });
                    }
                };
            },
        )
        
    formatData.push({
        country:c,
        oil: cntyCategories.find(cb => cb.category === 'Oil').value,
        coal: cntyCategories.find(cb =>cb.category === 'Coal').value, 
        gas: cntyCategories.find(cb => cb.category === 'Gas').value,
        cement: cntyCategories.find(cb => cb.category === 'Cement').value, 
        flaring: cntyCategories.find(cb => cb.category === 'Flaring').value, 
        other: cntyCategories.find(cb => cb.category === 'Other').value,
        total: cntyCategories.find(cb => cb.category === 'Total').value,
        gdp: cntyCategories.find(cb => cb.category === 'GDP per capita (current US$)').value,
        population: cntyCategories.find(cb => cb.category === 'Population, total').value,
    });

    bubblechart.push({
        country:c,
        total: cntyCategories.find(cb => cb.category === 'Total').value,
        gdp: cntyCategories.find(cb => cb.category === 'GDP per capita (current US$)').value,
        population: cntyCategories.find(cb => cb.category === 'Population, total').value/1000000,
    });     

    // Sort bargraph data by total emissions for stacked bar chart 
    formatData.sort((d1, d2) => {
        return d2.total - d1.total})
    });

///////////////////--STACKED BAR CHART IN APEX--///////////////////////////////
    var options = {
        series: [ 
            {name: 'Gas', data: (formatData.map(fD => fD.gas)), color: '#4A8DDC'},      
            {name: 'Oil', data: (formatData.map(fD => fD.oil)), color: '#4C5D8A'},
            {name: 'Coal', data: (formatData.map(fD => fD.coal)), color:'#F3C911'},
            {name: 'Cement', data: (formatData.map(fD => fD.cement)), color: '#DC5B57'},
            {name: 'Flaring', data: (formatData.map(fD => fD.flaring)), color:'#33AE81'},
            {name: 'Other', data: (formatData.map(fD => fD.other)), color: '#95C8F0'}],

        plotOptions: {
          bar: {horizontal: true, dataLabels: {position: 'right'}},},

        dataLabels: {
          enabled: false,
          enabledOnSeries: [4],
          textAnchor: "left",
          formatter: function (_val, opt) {
            let series = opt.w.config.series
            let idx = opt.dataPointIndex
            const total = series.reduce((total, self) => total + self.data[idx], 0)
            return total + "x"},

          style: {colors: ["#000"]}},

        chart: {
          type: 'bar',
          height: 1100,
          stacked: true},

        title: {text: 'Per Capital CO2 Emissions by Category'},

        xaxis: {categories: formatData.map(fD => fD.country)},
   
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "x"}}},
        
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 40
        }
      };
      
    var chart = new ApexCharts(document.querySelector("#bar"), options);
    chart.render();
////////////////////////////////////////////////////////////////////////////////////
 // declare layout for bubblechart

 var bubble = [{
    x:(bubblechart.map(bC => bC.total)),
    y: ((bubblechart.map(bC => bC.gdp))),
    mode: 'markers',
    marker: {
        size:(bubblechart.map(bC => bC.population))}}] 

 var bubbleLayout = {
    title: {
        text: `Total CO2 Emissions` ,
        font: {
            family: 'Times New Roman',
            size: 18,
            color: 'dark gray',
            },
    },
    autosize: true,
    responsive: true,
    xaxis: {
        automargin: true,
        title: {
            text: 'Total CO2 Emissions',
            font: {
                family: 'Times New Roman',
                size: 14,
                color: 'dark gray',
                },
        },
    },
    yaxis: { 
        automargin: true,
        title: {
            text: 'GDP per Capita',
            font: {
                family: 'Times New Roman',
                size: 14,
                color: 'dark gray',
                },
        },
    },};
    Plotly.newPlot('bubble', bubble, bubbleLayout)
};
////////////////////////////////////
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
        keymetrics()
    });
    
        // define event listener for drop down selection change on Year
        selectYr.on('change', function() {
            yearSelected = selectYr.property("value")
            dataURL = `http://127.0.0.1:5000/api/v1/continent_per_capita/${continentSelected}?year=${yearSelected}`

        // Fetch the JSON data and assign properties to global variables
                d3.json(dataURL).then(function(data) {
                    rawData = data
                    keymetrics()
                });
            });

        // define event listener for drop down selection change on Continent Code
        selectCC.on('change', function() {
            continentSelected = selectCC.property("value")            
            dataURL = `http://127.0.0.1:5000/api/v1/continent_per_capita/${continentSelected}?year=${yearSelected}`

        // Fetch the JSON data and assign properties to global variables
                d3.json(dataURL).then(function(data) {
                    rawData = data
                    keymetrics()
                });
            });
        };

init();
