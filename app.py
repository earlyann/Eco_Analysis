from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask import request


app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/global_emissions_db"
mongo = PyMongo(app)
collection = mongo.db.CO2_gdp_population

#Homepage
@app.route('/', methods=['GET'])
def home():
    return """<h1>Eco-Analysis - Examining the intersection of CO2 Emissions, GDP, and Population Data</h1>
<p>API for CO2 Emissions, GDP, and Population Data</p>
<p> /api/v1/countries : pulls all the data for all the countries in the dataset with the option to search by year. Example: <a href="http://127.0.0.1:5000/api/v1/countries?year=2011">http://127.0.0.1:5000/api/v1/countries?year=2011</a></p>
<p> /api/v1/countries_per_capita : pulls all the per capita data (CO2 and GDP) for all countries for all years in the dataset with the option to search by year. Example: <a href="http://127.0.0.1:5000/api/v1/countries_per_capita?year=2011">http://127.0.0.1:5000/api/v1/countries_per_capita?year=2011</a></p>
<p> /api/v1/countries_totals : pulls all the totals data (CO2, GDP, and Population) for all countries for all years in the dataset with the option to search by year. Example: <a href="http://127.0.0.1:5000/api/v1/countries_totals?year=2011">http://127.0.0.1:5000/api/v1/countries_totals?year=2011</a></p>
<p> /api/v1/country/{country_code} : pulls all the data for all a country based on country code with the option to search by year. Example: <a href="http://127.0.0.1:5000/api/v1/country/USA?year=2011">http://127.0.0.1:5000/api/v1/country/USA?year=2011</a></p>
<p> /api/v1/country_per_capita/{country_code} : pulls all the per capita data (CO2 and GDP) for a country based on the country code with the option to search by year. Example: <a href="http://127.0.0.1:5000/api/v1/country_per_capita/USA?year=2011">http://127.0.0.1:5000/api/v1/country_per_capita/USA?year=2011</a></p>
<p> /api/v1/country_totals/{country_code} : pulls all the totals data (CO2, GDP, and Population) for a country based on the country code with the option to search by year. Example: <a href="http://127.0.0.1:5000/api/v1/country_totals/USA?year=2011">http://127.0.0.1:5000/api/v1/country_totals/USA?year=2011</a></p>
<p> /api/v1/geojson_countries/ : pulls all boundary coordinates for all countries. Example: <a href="http://127.0.0.1:5000/api/v1/geojson_countries">http://127.0.0.1:5000/api/v1/geojson_countries</a></p>
<p> /api/v1/geojson_country/{country_code}: pulls the geojson for one country. Example: <a href="http://127.0.0.1:5000/api/v1/geojson_country/USA">http://127.0.0.1:5000/api/v1/geojson_country/USA</a></p>
"""

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

# Get all the per capita data for all the countries for all the years Type: Total CO2 and Type: GDP + Category: GDP per capita (current US$)
# optional query parameter for year 
@app.route('/api/v1/countries_per_capita', methods=['GET'])
def get_all_per_capita_countries():
    year = request.args.get('year')
    query = {
        "$or": [
            {"Type": "PerCapita CO2"},
            {"Type": "GDP", "Category": "GDP per capita (current US$)"}
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


# Get all the data for a specific country code for all the years
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

# Get all the per capita data for a specific country code for all the years
# Type: Total CO2 and Type: GDP + Category: GDP per capita (current US$)
@app.route('/api/v1/country_per_capita/<country_code>', methods=['GET'])
def get_per_capita_country_data(country_code):
    year = request.args.get('year')
    query = {
        "Country Code": country_code,
        "$or": [
            {"Type": "PerCapita CO2"},
            {"Type": "GDP", "Category": "GDP per capita (current US$)"}
        ]
    }
    if year:
        query["Year"] = int(year)
    result = list(collection.find(query))
    for item in result:
        item.pop('_id', None)
    return jsonify(result)


# Type: Total CO2 and Type: GDP + Categories (GDP (current US$), Population, total) for a specific country code
@app.route('/api/v1/country_totals/<country_code>', methods=['GET'])
def get_totals_country_data(country_code):
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


#Geojson calls  

# Get all the geojson data for all the countries
@app.route('/api/v1/geojson_countries', methods=['GET'])
def get_global_geojson():
    result = list(mongo.db.country_geojson_data.find({}))
    for item in result:
        item.pop('_id', None)
    return jsonify(result)

# Get all the geojson data for a specific country code
@app.route('/api/v1/geojson_country/<country_code>', methods=['GET'])
def get_country_geojson(country_code):
    result = list(mongo.db.country_geojson_data.find({"Country Code": country_code}))
    for item in result:
        item.pop('_id', None)
    return jsonify(result)


# # Get country coordinates from one collection and then that data for a specific year
# @app.route('/api/v1/map_data', methods=['GET'])
# def get_global_info():
#     year = int(request.args.get('year'))

#     # Query country_geojson_data collection
#     geo_data = list(mongo.db.country_geojson_data.find({}))
#     for item in geo_data:
#         item.pop('_id', None)

#     # Query CO2_gdp_population collection
#     co2_gdp_population_data = list(mongo.db.CO2_gdp_population.find({"Year": year}))
#     for item in co2_gdp_population_data:
#         item.pop('_id', None)

#     # Combine data from both collections
#     result = {
#         "Year": year,
#         "Countries": geo_data,
#         "CO2_gdp_population_data": co2_gdp_population_data
#     }
#     return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
