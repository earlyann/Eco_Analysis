// Setting up year and continent selection
let yrTotal = 2019
let ccTotal = 'AF'

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
    text: 'Total CO2 Emissions by Country',
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

/////////////////////////-- TREEMAP - Population ///////////////////////////////
// define chart options for tree map
var optionsPopulation = {
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
    text: 'Total Population by Country',
  },
  // plotOptions: {
  //   treemap: {
  //     enableShades: true,
  //     shadeIntensity: 5,
  //     distributed: false,
  //   }
  // }

  
};

let chartPopulation = new ApexCharts(document.querySelector('#treemapb'), optionsPopulation);
chartPopulation.render();

// updateChart for Population
function plotPopulation() {
  let filteredData = rawData.filter(d => d['Category'] == 'Population, total');
    
    let chartData = filteredData.map(c => ({
      x: c['Country'], y: Math.floor(c.Value)/1000000}))
    
    chartPopulation.updateSeries([{
      data: chartData
    }]);
    console.log(chartData)
};

////////////////// -- FUNCTION - INITIALIZE DATA, EVENT HANDLER  ///////////////////
// function to read data, populate initial graphs
function init() {
  var totalURL = `http://127.0.0.1:5000/api/v1/continent_totals/${ccTotal}?year=${yrTotal}`
  
  // Fetch the JSON data and assign properties to global variables
  d3.json(totalURL).then(function(data) {
    rawData = data
    plotTotal(rawData);
    plotPopulation(rawData);
  });

    // define event listener for drop down selection change on Year
  selectYr.on('change', function() {

    // TreeMap Events
    yrTotal = selectYr.property("value")
    const tChange = `http://127.0.0.1:5000/api/v1/continent_totals/${ccTotal}?year=${yrTotal}`

    d3.json(tChange).then(function(data) {
      rawData = data
      plotTotal()
      plotPopulation()
    });

    // per Capita Events
    yrPC = selectYr.property("value")
    const changePC = `http://127.0.0.1:5000/api/v1/continent_per_capita/${ccPC}?year=${yrPC}`

    d3.json(changePC).then(function(data) {
      rawPC = data
      plotAllVisuals()
    });

    // map Events
    mapYr = selectYr.property("value")
    const changeMap = `http://127.0.0.1:5000/api/v1/countries_totals?year=${mapYr}`

    d3.json(changeMap).then(function(data) {
      mapData = data
      setup()
    });
  });

  // define event listener for drop down selection change on Continent Code
  selectCC.on('change', function() {

    // TreeMap Events
    ccTotal = selectCC.property("value")
    const tChange = `http://127.0.0.1:5000/api/v1/continent_totals/${ccTotal}?year=${yrTotal}`

    d3.json(tChange).then(function(data) {
      rawData = data
      plotTotal()
      plotPopulation()
    });

    //per Capita events
    ccPC = selectCC.property("value")            
    const changePC = `http://127.0.0.1:5000/api/v1/continent_per_capita/${ccPC}?year=${yrPC}`

    d3.json(changePC).then(function(data) {
        rawPC = data
        plotAllVisuals()
    });
  });
};

init();