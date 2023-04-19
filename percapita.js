// define global variables
let rawPC = null
let yrPC = 2019
let ccPC = 'AF'

//define global variables -- for event handler and dropdown
var selectYr = d3.select("#selYr")
var selectCC = d3.select("#selCC")
var dropDownYear = [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]
var dropDownContinent = ["AF", "AS", "EU", "NA", "OC", "SA"]

////////////////////////////////////////////////////t//////////////////////
function cleanData() {
    // loop through data to generate list of countries for given year
    const cnty = []
    rawPC.forEach(rD => {
        if(!cnty.some(c => c === rD.Country)) {
            cnty.push(rD.Country)
        }
    });
    
    // loop through data to generate list of categories for given year
    const categories = []    
    rawPC.forEach(rD => {
        if(!categories.some(c => c === rD.Category)) {
            categories.push(rD.Category)
        }
    });

    const formatData = []
    // Outer Loop iterates over countries / Inner Loop iterates over Category. for each country returns object with category and value
    cnty.forEach ((c) => {
        const cntyCategories = []
        rawPC.forEach((rD) => {
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

        chart: {
          type: 'bar',
          height: 800,
          stacked: true},

        title: {text: 'CO2 Emissions by Category (Per Capita)'},

        xaxis: {categories: formatData.map(fD => fD.country)},
   
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "x"}}},
        
        legend: {
          position: 'right',
          align: 'right',
          offsetY: 30,
          fontSize: '11'
        }
      };
    
    const stackedbar = document.querySelector("#stackedBar");

    stackedbar.innerHTML = '';

    var chart = new ApexCharts(document.querySelector("#stackedBar"), options);
    chart.render();
};

///////////////////--SIMPLE BAR CHART IN APEX--///////////////////////////////
function plotSimpleBar (formatData) {

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
          height: 800,
          stacked: true},

        title: {text: 'CO2 Emissions (Per Capita)'},

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
     
    const simpleBar = document.querySelector("#simpleBar");

    simpleBar.innerHTML = '';
      
    var chart = new ApexCharts(document.querySelector("#simpleBar"), options);
    
    chart.render();
};

//////////////-- SUMMARY TABLE ----//////////////////////////////////
function createTable(formatData) {
    
    const table = document.querySelector("#myTable")
    table.innerHTML = '';
    let headerRow = document.createElement('tr');
    let header1 = document.createElement('th');
    let header2 = document.createElement('th');
    let header3 = document.createElement('th');
    let header4 = document.createElement('th');

    header1.innerText = 'Country';
    header2.innerText = 'Total CO2 Per Capita';
    header3.innerText = 'GDP Per Capita';
    header4.innerText = 'Population (Millions)';

    headerRow.appendChild(header1);
    headerRow.appendChild(header2);
    headerRow.appendChild(header3);
    headerRow.appendChild(header4);

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
//////////////// FUNCTION -- CALL PLOTS FOR VISUALIZATION --- ////////////////
function plotAllVisuals () {
    let formatData = cleanData();
    plotSimpleBar(formatData);
    plotStackedBar(formatData);
    createTable(formatData);
}

////////////////////  FUNCTION - INITIALIZE DATA, EVENT HANDLER  //////////////////
// function to read data, populate initial graphs
function first() {
    
    const startPC = `http://127.0.0.1:5000/api/v1/continent_per_capita/${ccPC}?year=${yrPC}`

    // Fetch the JSON data and assign properties to global variables
    d3.json(startPC).then(function(data) {
        rawPC = data
        console.log("RawData", rawPC)

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
};
first();
