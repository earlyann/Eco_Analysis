
## Eco-Analysis - Examining Global Emissions, GDP and Population

### Project Overview:
The objective of this project is to conduct a comprehensive analysis of global CO2 emissions at the country level, considering factors such as emission sources (coal, oil, gas, cement, flaring, and others) and per capita emissions. By doing so, we aim to enhance our understanding of each country's contribution to the cumulative human impact on climate change. Furthermore, we will explore the correlations between country-level emissions and GDP trends within specific years. Our motivation stems from the understanding that there is a direct relationship between the total amount of CO2 released by human activities and the degree of warming experienced at the Earth's surface.

#### Key Questions to Consider:
- How does a country's GDP per capita influence its contribution to global emissions, and what do disparities look like between  nations?
- What is the relationship between population size and per capita emissions, and how do these factors impact emissions?
- How do per capita emissions vary by source, and what insights can be gained about a country's energy dependency or energy policies from this?
- How do a country's emissions levels and GDP impact one another, and what are the long-term economic risks associated with climate change and environmental degradation?
- What are the economic implications of reducing emissions levels, and how can transitioning to a green economy promote sustainable development and foster innovation while benefiting both the environment and economic growth?

#### Technologies Employed:
- Python/Pandas
- MongoDB
- Flask API
- HTML/CSS
- JavaScript
- D3
- Apex Charts: https://apexcharts.com/

#### Datasets:
- CO2 emissions (total and per capita) for over 200 countries: https://www.kaggle.com/datasets/thedevastator/global-fossil-co2-emissions-by-country-2002-2022
- GDP and population data: https://databank.worldbank.org/reports.aspx?source=world-development-indicators#
- Continent code data: https://datahub.io/core/continent-codes
- Country latitude/longitude data: https://public.opendatasoft.com/explore/embed/dataset/world-administrative-boundaries/table/

### Project Implementation:
The provided notebook consolidates all data sources and constructs a MongoDB database with a single collection. Subsequently, the app.py file queries the database to generate various RESTful endpoints, which facilitate interactive visualizations of our findings. To execute the database, first create it in MongoDB using the notebook, then host the app.py file locally to run the API.

#### Visualizations:

- A world map displaying global CO2 levels for a specific year, enabling users to observe trends by country or continent across all fossil fuel sources.
- Paired bar charts: one presenting total CO2 emissions data for every country within a continent, and another adjacent stacked bar chart delineating the emissions sources.
- A summary table containing complete data for a continent during the selected year.
- Dual tree graphs, with one illustrating total emissions for all countries within the selected continent, and the other presenting population data.

Our interactive visualizations provide users with an accessible and comprehensive understanding of global CO2 emissions, GDP, and population dynamics. By presenting data in various formats, users can easily identify trends and correlations, uncovering insights into emissions sources, GDP-emissions relationships, and the role of population. These visualizations offer a clear perspective on global emissions, empowering stakeholders to make informed decisions and devise effective strategies to combat climate change.

#### Contributors:
- Haddi Fadia
- Erica Graboyes
- Daniela Castellon
- Lacey Morgan
