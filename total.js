// Setting up year and continent selection
let yrTotal = 2019
let ccTotal = 'AF'

//define constant arrays -- for drop down and to loop through
// let dropDownYear = [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]
// let dropDownContinent = ["AF", "AS", "EU", "NA", "OC", "SA"]
let rawData = null

/////////////////////////TREEMAP - C02 ///////////////////////////////
// define chart options for tree map
var optionsCO2 = {
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
    text: 'Countries by Total CO2 Emissions',
  },
  // plotOptions: {
  //   treemap: {
  //     enableShades: true,
  //     shadeIntensity: 5,
  //     distributed: false,
  //   }
  // }
};

let chart = new ApexCharts(document.querySelector('#treemap'), optionsCO2);
chart.render();

// updateChart for total CO2 Emission
function plotTotal() {
  let filteredData = rawData.filter(d => d['Category'] == 'Total')

  let chartData = filteredData.map(c => ({
    x: c['Country'], y: Math.floor(c.Value)}))
  
  chart.updateSeries([{
    data: chartData
  }]);
  console.log(chartData)
};

/////////////////////////TREEMAP - GDP ///////////////////////////////
// define chart options for tree map
var optionsGDP = {
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
  // plotOptions: {
  //   treemap: {
  //     enableShades: true,
  //     shadeIntensity: 5,
  //     distributed: false,
  //   }
  // }

  
};

let chartgdp = new ApexCharts(document.querySelector('#treemapb'), optionsGDP);
chartgdp.render();

// updateChart for GDP
function plotGDP() {
  let filteredData = rawData.filter(d => d['Category'] == 'GDP (current US$)');
    
    let chartData = filteredData.map(c => ({
      x: c['Country'], y: Math.floor(c.Value)/1000000}))
    
    chartgdp.updateSeries([{
      data: chartData
    }]);
    console.log(chartData)
};

/////// SELECT YEAR //////
// let yearSelect = document.querySelector('#selYr')
// let continentSelect = document.querySelector('#selCC')

// yearSelect.addEventListener('change', (event) => {yrTotal = parseInt(event.target.value)
//   updateChart()
// })

// continentSelect.addEventListener('change', (event) => {
//     ccTotal = event.target.value
//   updateChart()
// })

///////FUNCTION - INITIALIZE DATA, EVENT HANDLER  ///////

// function to read data, populate initial graphs
function init() {
  var totalURL = `http://127.0.0.1:5000/api/v1/continent_totals/${ccTotal}?year=${yrTotal}`
  
  // Fetch the JSON data and assign properties to global variables
  d3.json(totalURL).then(function(data) {
    rawData = data

    //   dropDownYear.reverse()
    //   dropDownYear.forEach((sample) => {
    //       selectYr
    //           .append("option")
    //           .text(sample)
    //           .property("value", sample);
    //   });

    //   // append Continent Code to drop down selector
    //   dropDownContinent.forEach((sample) => {
    //       selectCC
    //           .append("option")
    //           .text(sample)
    //           .property("value", sample);
    //   });
  plotTotal(rawData);
  plotGDP(rawData)

  ;
  });

    // define event listener for drop down selection change on Year
  selectYr.on('change', function() {
    yrTotal = selectYr.property("value")
    const tChange = `http://127.0.0.1:5000/api/v1/continent_totals/${ccTotal}?year=${yrTotal}`

    // Fetch the JSON data and refresh charts using Total API
    d3.json(tChange).then(function(data) {
      rawData = data
      console.log("YearSelection", rawData)
      plotTotal()
      plotGDP()
    });

    yrPC = selectYr.property("value")
    const changePC = `http://127.0.0.1:5000/api/v1/continent_per_capita/${ccPC}?year=${yrPC}`

    // Fetch the JSON data and refresh charts using Per Cap API
    d3.json(changePC).then(function(data) {
      rawPC = data
      plotAllVisuals()
    });
  });

    // define event listener for drop down selection change on Continent Code
  selectCC.on('change', function() {
    ccTotal = selectCC.property("value")
    const tChange = `http://127.0.0.1:5000/api/v1/continent_totals/${ccTotal}?year=${yrTotal}`

    // Fetch the JSON data and assign properties to global variables
    d3.json(tChange).then(function(data) {
      rawData = data
      console.log("YearSelection", rawData)
      plotTotal()
      plotGDP()
    });

    ccPC = selectCC.property("value")            
    const changePC = `http://127.0.0.1:5000/api/v1/continent_per_capita/${ccPC}?year=${yrPC}`

       // Fetch the JSON data and refresh charts using Per Cap API
    d3.json(changePC).then(function(data) {
        rawPC = data
        plotAllVisuals()
    });
  });
};

init();