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

/////////////////////////-- TREEMAP - GDP ///////////////////////////////
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
    text: 'Total GDP by Country',
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

////////////////// -- FUNCTION - INITIALIZE DATA, EVENT HANDLER  ///////////////////
// function to read data, populate initial graphs
function init() {
  var totalURL = `http://127.0.0.1:5000/api/v1/continent_totals/${ccTotal}?year=${yrTotal}`
  
  // Fetch the JSON data and assign properties to global variables
  d3.json(totalURL).then(function(data) {
    rawData = data
    plotTotal(rawData);
    plotGDP(rawData);
  });

    // define event listener for drop down selection change on Year
  selectYr.on('change', function() {

    // TreeMap Events
    yrTotal = selectYr.property("value")
    const tChange = `http://127.0.0.1:5000/api/v1/continent_totals/${ccTotal}?year=${yrTotal}`

    d3.json(tChange).then(function(data) {
      rawData = data
      plotTotal()
      plotGDP()
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
    const changeMap = `http://127.0.0.1:5000/api/v1/countries?year=${mapYr}`

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
      plotGDP()
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