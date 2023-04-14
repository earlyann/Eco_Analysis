from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask import request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config['JSONIFY_MIMETYPE'] = 'application/json;charset=utf-8'
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
CORS(app, support_credentials=True)   # to prevent CORS errors
app.config["MONGO_URI"] = "mongodb://localhost:27017/global_emissions_db"
mongo = PyMongo(app)
collection = mongo.db.CO2_gdp_population

#Homepage
@app.route('/', methods=['GET'])
def home():
    return """<h1>Eco-Analysis - Examining the intersection of CO2 Emissions, GDP, and Population Data</h1>
<h2>API for CO2 Emissions, GDP, and Population Data (1999-2019)</h2>
<br>
<h3> Endpoints that serve all the countries </h3>
<p> /api/v1/countries : pulls all the data for all the countries in the dataset with the option to search by year. Example: <a href="http://127.0.0.1:5000/api/v1/countries?year=2011">http://127.0.0.1:5000/api/v1/countries?year=2011</a></p>
<p> /api/v1/countries_per_capita : pulls all the per capita data (CO2, GDP and Population) for all countries for all years in the dataset with the option to search by year. Example: <a href="http://127.0.0.1:5000/api/v1/countries_per_capita?year=2011">http://127.0.0.1:5000/api/v1/countries_per_capita?year=2011</a></p>
<p> /api/v1/countries_totals : pulls all the totals data (CO2, GDP, and Population) for all countries for all years in the dataset with the option to search by year. Example: <a href="http://127.0.0.1:5000/api/v1/countries_totals?year=2011">http://127.0.0.1:5000/api/v1/countries_totals?year=2011</a></p>
<br>
<h3> Endpoints that serve a single country </h3>
<p> /api/v1/country/{country_code} : pulls all the data for all a country based on country code with the option to search by year. Example: <a href="http://127.0.0.1:5000/api/v1/country/USA?year=2011">http://127.0.0.1:5000/api/v1/country/USA?year=2011</a></p>
<p> /api/v1/country_per_capita/{country_code} : pulls all the per capita data (CO2, GDP and Population) for a country based on the country code with the option to search by year. Example: <a href="http://127.0.0.1:5000/api/v1/country_per_capita/USA?year=2011">http://127.0.0.1:5000/api/v1/country_per_capita/USA?year=2011</a></p>
<p> /api/v1/country_totals/{country_code} : pulls all the totals data (CO2, GDP, and Population) for a country based on the country code with the option to search by year. Example: <a href="http://127.0.0.1:5000/api/v1/country_totals/USA?year=2011">http://127.0.0.1:5000/api/v1/country_totals/USA?year=2011</a></p>
<br>
<h3> Endpoints that serve a single continent </h3>
<p> /api/v1/continent_per_capita/{continent_code} : pulls all the per capita data (CO2, GDP, and Population) for a continent based on the continent code with the option to search by year. Example: <a href="http://127.0.0.1:5000/api/v1/continent_per_capita/NA?year=2011">/http://127.0.0.1:5000/api/v1/continent_per_capita/NA?year=2011</a></p>
<p> /api/v1/continent_totals/{continent_code} : pulls all the totals data (CO2, GDP and Population) for a continent based on the continent code with the option to search by year. Example: <a href="http://127.0.0.1:5000/api/v1/continent_totals/NA?year=2011">http://127.0.0.1:5000/api/v1/continent_totals/NA?year=2011</a></p>
"""

# Countries Endpoints

# get all the data for all the countries for all the years, optional query parameter for year 
@app.route('/api/v1/countries', methods=['GET'])
def get_all_countries():
    year = request.args.get('year')
    query = {}
    if year:
        query["Year"] = int(year)
    result = list(collection.find(query))
    for item in result:
        item.pop('_id', None)
    return jsonify(result)

# Get all the per capita data for all the countries for all the years Type: Total CO2 and Type: GDP + Category: GDP per capita (current US$, 
# Poplation, total). Population is served with both the per capita and totals endpoints. There is an optional query parameter for year 
@app.route('/api/v1/countries_per_capita', methods=['GET'])
def get_all_per_capita_countries():
    year = request.args.get('year')
    query = {
        "$or": [
            {"Type": "PerCapita CO2"},
            {"Type": "GDP", "Category": "GDP per capita (current US$)"},
            {"Type": "GDP", "Category": "Population, total"}
        ]
    }
    if year:
        query["Year"] = int(year)
    result = list(collection.find(query))
    for item in result:
        item.pop('_id', None)
    return jsonify(result)

# Get all the totals data for all the countries for all the years 
# Type: Total CO2 and Type: GDP + Categories (GDP (current US$), Population,total), optional query parameter for year 
@app.route('/api/v1/countries_totals', methods=['GET'])
def get_all_totals_countries():
    year = request.args.get('year')
    query = {
        "$or": [
            {"Type": "Total CO2"},
            {"Type": "GDP", "Category": "GDP (current US$)"},
            {"Type": "GDP", "Category": "Population, total"}
        ]
    }
    if year:
        query["Year"] = int(year)
    result = list(collection.find(query))
    for item in result:
        item.pop('_id', None)
    return jsonify(result)


# Country endpoints

# Get all the data for a specific country code with optional year query parameter
@app.route('/api/v1/country/<country_code>', methods=['GET'])
def get_country_data(country_code):
    year = request.args.get('year')
    query = {"Country Code": country_code}
    if year:
        query["Year"] = int(year)
    result = list(collection.find(query))
    for item in result:
        item.pop('_id', None)
    return jsonify(result)

# Get all the per capita data for a specific country code, optional year query parameter.
# Type: Total CO2 and Type: GDP + Category: GDP per capita (current US$, Population, total)
@app.route('/api/v1/country_per_capita/<country_code>', methods=['GET'])
def get_per_capita_country_data(country_code):
    year = request.args.get('year')
    query = {
        "Country Code": country_code,
        "$or": [
            {"Type": "PerCapita CO2"},
            {"Type": "GDP", "Category": "GDP per capita (current US$)"},
            {"Type": "GDP", "Category": "Population, total"}
        ]
    }
    if year:
        query["Year"] = int(year)
    result = list(collection.find(query))
    for item in result:
        item.pop('_id', None)
    return jsonify(result)

# Get all the Totals data for a single country, with optional year query parameter.
# Type: Total CO2 and Type: GDP + Category: (GDP (current US$), population, total)
@app.route('/api/v1/country_totals/<country_code>', methods=['GET'])
def get_per_country_totals_data(country_code):
    year = request.args.get('year')
    query = {
        "Country Code": country_code,
        "$or": [
            {"Type": "Total CO2"},
            {"Type": "GDP", "Category": "GDP (current US$)"},
            {"Type": "GDP", "Category": "Population, total"}
        ]
    }
    if year:
        query["Year"] = int(year)
    result = list(collection.find(query))
    for item in result:
        item.pop('_id', None)
    return jsonify(result)


# Continent Endpoints

# Get all the per capita data for a specific continent code for all the years
# Type: Total CO2 and Type: GDP + Category: (GDP per capita (current US$), Population, total)
@app.route('/api/v1/continent_per_capita/<continent_code>', methods=['GET'])
def get_per_capita_continent_data(continent_code):
    year = request.args.get('year')
    query = {
        "Continent Code": continent_code,
        "$or": [
            {"Type": "PerCapita CO2"},
            {"Type": "GDP", "Category": "GDP per capita (current US$)"},
            {"Type": "GDP", "Category": "Population, total"}
        ]
    }
    if year:
        query["Year"] = int(year)
    result = list(collection.find(query))
    for item in result:
        item.pop('_id', None)
    return jsonify(result)

# Get Total CO2 and Type: GDP + Categories (GDP (current US$), Population, total) for a specific continent code
# with optional year query parameter
@app.route('/api/v1/continent_totals/<continent_code>', methods=['GET'])
def get_totals_continent_data(continent_code):
    year = request.args.get('year')
    query = {
        "Continent Code": continent_code,
        "$or": [
            {"Type": "Total CO2"},
            {"Type": "GDP", "Category": "GDP (current US$)"},
            {"Type": "GDP", "Category": "Population, total"}
        ]
    }
    if year:
        query["Year"] = int(year)
    result = list(collection.find(query))
    for item in result:
        item.pop('_id', None)
    return jsonify(result)



if __name__ == "__main__":
    app.run(debug=True)


