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
function cleanData() {
    // loop through data to generate list of countries for given year
    const cnty = []
    rawData.forEach(rD => {
        if(!cnty.some(c => c === rD.Country)) {
            cnty.push(rD.Country)
        }
    });
    
    // loop through data to generate list of categories for given year
    const categories = []    
    rawData.forEach(rD => {
        if(!categories.some(c => c === rD.Category)) {
            categories.push(rD.Category)
        }
    });

    const formatData = []
    // Outer Loop iterates over countries / Inner Loop iterates over Category. for each country returns object with category and value
    cnty.forEach ((c) => {
        const cntyCategories = []
        rawData.forEach((rD) => {
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
            gdp: cntyCategories.find(cC => cC.category === 'GDP per capita (current US$)').value,
            population: cntyCategories.find(cC => cC.category === 'Population, total').value/1000000,
        });
    });
    
    // Sort bargraph data by total emissions for stacked bar chart 
    formatData.sort((d1, d2) => {
        return d2.total - d1.total});

    return formatData
};

///////////////////--STACKED BAR CHART IN APEX--///////////////////////////////
function plotStackedBar (formatData) {
    console.log("Test FD", formatData)
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
          style: {colors: ["#000"]}},

        //   enabledOnSeries: [4],
        //   textAnchor: "left",
        //   formatter: function (_val, opt) {
        //     let series = opt.w.config.series
        //     let idx = opt.dataPointIndex
        //     const total = series.reduce((total, self) => total + self.data[idx], 0)
        //     return total + "x"}

        chart: {
          type: 'bar',
          height: 1100,
          stacked: true},

        title: {text: 'Per Capita CO2 Emissions by Category'},

        xaxis: {categories: formatData.map(fD => fD.country)},
   
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "x"}}},
        
        legend: {
          position: 'bottom',
          align: 'right',
          offsetX: 40
        }
      };
      
    var chart = new ApexCharts(document.querySelector("#stackedBar"), options);
    chart.render();
};

///////////////////--SIMPLE BAR CHART IN APEX--///////////////////////////////
function plotSimpleBar (formatData) {
    console.log("Test FD", formatData)
    var options = {
        series: [ 
            {name: 'Total', data: (formatData.map(fD => fD.total)), color: '#4A8DDC'}],

        plotOptions: {
          bar: {horizontal: true, dataLabels: {position: 'right'}},},

        dataLabels: {
          enabled: true,
          textAnchor: "left",
          style: {colors: ["#000"]}},

        chart: {
          type: 'bar',
          height: 1100,
          stacked: true},

        title: {text: 'Total Per Capita CO2 Emissions'},

        xaxis: {categories: formatData.map(fD => fD.country)},
   
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "x"}}},
        
        legend: {
          position: 'right',
          horizontalAlign: 'left',
          offsetX: 40
        }
      };
      
    var chart = new ApexCharts(document.querySelector("#simpleBar"), options);
    chart.render();
};
//////////////////////--APEX BUBBLE CHART --//////////////////////////////
function plotBubbleChart (formatData) {
    let dataBubble = formatData.map(dB => {
        return {
            name: dB.country,
            data: [[
                dB.total,
                dB.gdp,
                dB.population
            ]]
        }
    })
    
    let axisLimit = formatData.map(dB => {
        return {
            yaxis: dB.gdp
        }
    },)

    // Sort y-axis values to determin max
    axisLimit.sort((d1, d2) => {
        return d2.yaxis - d1.yaxis});

    var bubbleChart = new ApexCharts(
        document.querySelector('#bubble'), {
            chart: {type: 'bubble', },
            dataLabels: {enabled: false },
            series: dataBubble,
            fill: { opacity: 0.8 },
            title: { text: 'Simple Bubble Chart' },
            xaxis: {tickAmount: 10, type: 'category' },
            yaxis: {max: (axisLimit[0].yaxis)  }
        }
    );
    bubbleChart.render();
};
///////////////-- PLOTLY BUBBLECHART -- ///////////////////////////////////
function plotSimpleBubble (formatData) {
    
    var bubble = [{
        x: formatData.map(fD => fD.total),
        y: (formatData.map(fD => fD.gdp)),
        text: formatData.map(fD => fD.country),
        mode: 'markers',
        marker: {
            size:formatData.map(fD => fD.population),
            color:  formatData.map(fD => fD.total),
            colorscale: 'Portland',
            opacity: 0.8},},];

    var bubbleLayout = {
        title: {
            text: `Overview of a country's per Capita CO2 emissions & GDP` ,
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
                text: 'Total CO2 Emissions per Capita',
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

Plotly.newPlot('bubbles', bubble, bubbleLayout)};

//////////////-- SUMMARY TABLE ----//////////////////////////////////
function createTable(formatData) {
    
    const table = document.querySelector("#myTable")
    table.innerHTML = '';
    let headerRow = document.createElement('tr');
    let header1 = document.createElement('th');
    header1.innerText = 'Country';

    headerRow.appendChild(header1);

    table.appendChild(headerRow);


    formatData.forEach(fD => {
        const row = document.createElement('tr');
        let td1 = document.createElement('td');
        td1.innerText = fD.country;
        let td2 = document.createElement('td');
        td2.innerText = fD.total;
        let td3 = document.createElement('td');
        td3.innerText = fD.gdp;
        let td4 = document.createElement('td');
        td4.innerText = fD.population;
        
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        row.appendChild(td4);

        table.appendChild(row);
    })

    console.log("testtable", formatData)
};
///////////////////////////////////////////////////////////////////////////////
function plotAllVisuals () {
    let formatData = cleanData();
    plotSimpleBar(formatData);
    plotStackedBar(formatData);
    plotBubbleChart(formatData);
    createTable(formatData);
    plotSimpleBubble(formatData);
}

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
        plotAllVisuals()
    });
    
        // define event listener for drop down selection change on Year
        selectYr.on('change', function() {
            yearSelected = selectYr.property("value")
            dataURL = `http://127.0.0.1:5000/api/v1/continent_per_capita/${continentSelected}?year=${yearSelected}`

        // Fetch the JSON data and assign properties to global variables
                d3.json(dataURL).then(function(data) {
                    rawData = data
                    plotAllVisuals()
                });
            });

        // define event listener for drop down selection change on Continent Code
        selectCC.on('change', function() {
            continentSelected = selectCC.property("value")            
            dataURL = `http://127.0.0.1:5000/api/v1/continent_per_capita/${continentSelected}?year=${yearSelected}`

        // Fetch the JSON data and assign properties to global variables
                d3.json(dataURL).then(function(data) {
                    rawData = data
                    plotAllVisuals()
                });
            });
        };

init();
