// Setting up year and continent selection
let yearSelected = 2019
let continentSelected = 'AF'
var dataURL = `http://127.0.0.1:5000/api/v1/continent_totals/${continentSelected}?year=${yearSelected}`
//define constant arrays -- for drop down and to loop through
let dropDownYear = [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]
let dropDownContinent = ["AF", "AS", "EU", "NA", "OC", "SA"]
let rawData = null

// define chart options for tree map
var chartOptions = {
  series: [
    {
      data: []
    }
  ],
  chart: {
    type: 'treemap',
    height: 500,
  },
  title: {
    text: 'Countries by Total GDP',
  },
};

let chart = new ApexCharts(document.querySelector('#treemap'), chartOptions);
chart.render();

// updateChart for total GDP
function updateChart() {
  // console.log(rawData)
  let filteredData = rawData.filter(d => d['Year'] == yearSelected && d['Continent Code'] == continentSelected)
    .filter(d => d['Category'] == 'GDP (current US$)');
  
  let chartData = filteredData.map(c => ({
    x: c['Country'], y: Math.floor(c.Value)/1000000
  }));
    
  chart.updateSeries([{
    data: chartData
  }]);

  console.log(chartData);
}


/////// SELECT YEAR //////
let yearSelect = document.querySelector('#selYr')
let continentSelect = document.querySelector('#selCC')

yearSelect.addEventListener('change', (event) => {yearSelected = parseInt(event.target.value)
  updateChart()
})

continentSelect.addEventListener('change', (event) => {
  continentSelected = event.target.value
  updateChart()
})

///////FUNCTION - INITIALIZE DATA, EVENT HANDLER  ///////

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

      updateChart();
  });

      // define event listener for drop down selection change on Year

      selectYr.on('change', function() {
          yearSelected = selectYr.property("value")
          
          dataURL = `http://127.0.0.1:5000/api/v1/continent_totals/${continentSelected}?year=${yearSelected}`

      // Fetch the JSON data and assign properties to global variables
              d3.json(dataURL).then(function(data) {
                  rawData = data
                  console.log("YearSelection", rawData)
                  updateChart()
              });
              console.log("Test", yearSelected);
              console.log(rawData);
          });

      // define event listener for drop down selection change on Continent Code
      selectCC.on('change', function() {
          continentSelected = selectCC.property("value")
          
          dataURL = `http://127.0.0.1:5000/api/v1/continent_totals/${continentSelected}?year=${yearSelected}`

      // Fetch the JSON data and assign properties to global variables
              d3.json(dataURL).then(function(data) {
                  rawData = data
                  console.log("YearSelection", rawData)
                  updateChart()
              });
          });
      };

init();