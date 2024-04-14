d3.csv("https://modhpranav.github.io/opendata/umass_data_with_categories.csv").then(function (data) {

  const departments = Array.from(new Set(data.map(d => d.DEPARTMENT)));
  dropdown = d3.select('.chart1 .dropdown select');
  departments.forEach(department => {
    dropdown.append('option').text(department).attr('value', department);
  });

  // Dropdown change event listener
  dropdown.on('change', function () {
    const selectedDepartment = d3.select(this).property('value');
    showData(data, selectedDepartment);
  });

});

function getStats(data) {
  // Calculate stats
  const maxSalary = d3.max(data, d => +d.ANNUAL_RATE);
  const minSalary = d3.min(data, d => +d.ANNUAL_RATE);
  const avgSalary = d3.mean(data, d => +d.ANNUAL_RATE);
  const highestPaid = data.find(d => +d.ANNUAL_RATE === maxSalary).FULL_NAME;
  const lowestPaid = data.find(d => +d.ANNUAL_RATE === minSalary).FULL_NAME;

  // Create stats string
  const statsString = `Max salary: ${maxSalary} | Min salary: ${minSalary} | Highest Paid: ${highestPaid} | Lowest paid: ${lowestPaid} | Average Pay: ${avgSalary.toFixed(2)}`;

  // Update the stats div
  d3.select('#stats').text(statsString);
}

function showData(data, selectedDepartment) {
  data = data.filter(d => d.DEPARTMENT === selectedDepartment);
  const sortedData = data.sort((a, b) => b.ANNUAL_RATE - a.ANNUAL_RATE);
  const top5Employees = sortedData.slice(0, 10);
  const lowest5Employees = sortedData.slice(-10);
  document.getElementById("modal-button").hidden = false;

  //Pie Chart for ratings
  // Group the data by category
  data.forEach(d => d.RATING = Math.round(d.RATING));

  const groupedData = Array.from(d3.group(data, d => d.RATING));

  // Calculate the count of rows for each category
  const counts = groupedData.map(([RATING, values]) => ({ RATING, value: values.length }));
  const ratings = {
    "title": {
      "text": "Ratings Distribution in " + selectedDepartment,
      "color": "white"
    },
    "width": 300,
    "height": 200,
    "background": "transparent",
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "A donut chart showing the count of rows for each rating type.",
    "data": { "values": counts },
    "mark": { "type": "arc", "tooltip": true, "innerRadius": 80 },
    "encoding": {
      "theta": { "field": "value", "type": "quantitative", "stack": "normalize" },
      "color": { "field": "RATING", "type": "nominal" },
      "tooltip": [
        { "field": "RATING", "type": "ordinal", "title": "Rating Type" },
        { "field": "value", "type": "quantitative", "title": "Count" }
      ]
    },
    "config": {
      "arc": { "fillOpacity": 0.8 },
      "axis": {
        "labelFontSize": 12, // Adjust label font size as needed
        "labelPadding": 10 // Adjust label padding as needed
      },
      "legend": {
        "titleColor": "white", // Set legend title color to white
        "labelColor": "white"
      }
    }
  };

  getStats(data);
  const ratingData = data.sort((a, b) => b.RATING - a.RATING);
  createTop5timeline(ratingData);
  // Create Vega-Lite specification for horizontal bar chart
  const topSpec = {
    "title": {
      "text": "Top 5 Highly Paid Employees in " + selectedDepartment,
      "color": "white"
    },
    "width": 250,
    "height": 150,
    "background": "transparent",
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "A simple bar chart with data from CSV file.",
    "data": { "values": top5Employees }, // Empty data initially
    "mark": {
      "type": "bar",
      "style": "bar",
      "opacity": 0.8
    },
    "encoding": {
      "x": { "field": "ANNUAL_RATE", "type": "quantitative", "sort": "-x", "axis": { "labelAngle": -45, "labelColor": "white", "titleColor": "white", "grid": false } },
      "y": { "field": "FULL_NAME", "type": "nominal", "sort": "-x", "axis": { "labelColor": "white", "titleColor": "white", "grid": false } },
      "tooltip": [
        { "field": "DEPARTMENT", "type": "ordinal", "title": "Department: " },
        { "field": "ANNUAL_RATE", "type": "quantitative", "title": "Salary: " },
        { "field": "FULL_NAME", "type": "ordinal", "title": "Employee Name: " }
      ],
      "order": { "field": "ANNUAL_RATE", "type": "quantitative" }
    },
    "config": {
      "axis": {
        "labelFontSize": 12, // Adjust label font size as needed
        "labelPadding": 10 // Adjust label padding as needed
      },
      "legend": {
        "titleColor": "white", // Set legend title color to white
        "labelColor": "white"
      }
    }
  };

  const lowSpec = {
    "title": {
      "text": "Top 5 Least Paid Employees in " + selectedDepartment,
      "color": "white"
    },
    "width": 250,
    "height": 200,
    "background": "transparent",
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "A simple bar chart with data from CSV file.",
    "data": { "values": lowest5Employees }, // Empty data initially
    "mark": {
      "type": "bar",
      "style": "bar",
      "opacity": 0.8
    },
    "encoding": {
      "x": { "field": "ANNUAL_RATE", "type": "quantitative", "sort": "-x", "axis": { "labelAngle": -45, "labelColor": "white", "titleColor": "white", "grid": false } },
      "y": { "field": "FULL_NAME", "type": "nominal", "sort": "-x", "axis": { "labelColor": "white", "titleColor": "white", "grid": false } },
      "tooltip": [
        { "field": "DEPARTMENT", "type": "ordinal", "title": "Department: " },
        { "field": "ANNUAL_RATE", "type": "quantitative", "title": "Salary: " },
        { "field": "FULL_NAME", "type": "ordinal", "title": "Employee Name: " }
      ],
      "order": { "field": "ANNUAL_RATE", "type": "quantitative" }
    },
    "config": {
      "axis": {
        "labelFontSize": 12, // Adjust label font size as needed
        "labelPadding": 10 // Adjust label padding as needed
      },
      "mark": {
        "opacity": 0.8
      }
    }
  };

  const scatPlot = {
    "title": {
      "text": "How Ratings are related to Salaries in " + selectedDepartment,
      "color": "white"
    },
    "width": 500,
    "height": 200,
    "background": "transparent",
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "A scatterplot showing horsepower and annual salaries for various ratings.",
    "data": { "values": data },
    "layer": [
      {
        "mark": "point",
        "encoding": {
          "x": { "field": "RATING", "type": "quantitative", "axis": { "labelColor": "white", "titleColor": "white", "grid": false } },
          "y": { "field": "ANNUAL_RATE", "type": "quantitative", "axis": { "labelColor": "white", "titleColor": "white", "grid": false } }
        }
      },
      {
        "mark": { "type": "errorband", "extent": "stdev", "opacity": 0.2 },
        "encoding": {
          "y": {
            "field": "ANNUAL_RATE",
            "type": "quantitative",
            "title": "annual salaries",
            "axis": { "labelColor": "white", "titleColor": "white", "grid": false }
          }
        }
      },
      {
        "mark": "rule",
        "encoding": {
          "y": {
            "field": "ANNUAL_RATE",
            "type": "quantitative",
            "aggregate": "mean",
            "axis": { "labelColor": "white", "titleColor": "white", "grid": false }
          }
        }
      }
    ]
  }
  top5_ratings = data.sort((a, b) => b.RATING - a.RATING).slice(0, 5);
  low5_ratings = data.sort((a, b) => a.RATING - b.RATING).slice(0, 5);
  const rateData = top5_ratings.concat(low5_ratings);
  const plotRatings = {
    "title": {
      "text": "Top 5 and Lowest 5 Rated Professors",
      "color": "white"
    },
    "width": 150,
    "height": 300,
    "background": "transparent",
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "Top 5 and Lowest 5 Rated Professors",
    "data": {
      "values": rateData
    },
    "encoding": {
      "y": { "field": "FULL_NAME", "type": "nominal", "sort": "-x", "title": null, "axis": { "labelColor": "white", "titleColor": "white", "grid": false }},
      "x": { "field": "RATING", "type": "quantitative", "title": null, "axis": { "labelColor": "white", "titleColor": "white", "grid": false } },
      "tooltip": [
        {"field": "FULL_NAME", "type": "nominal", "title": "Professor Name"},
        {"field": "RATING", "type": "quantitative", "title": "Rating"}
      ]
    },
    "layer": [
      {
        "mark": {"type": "bar"},
        "encoding": {
          "color": {
            "field": "RATING",
            "type": "quantitative",
            "title": "Rating on Rate My Professor",
            "scale": {
              "range": ["white", "steelblue"]
            },
            "legend": {
              "titleColor": "white",
              "labelColor": "white"
            }
          }
        }
      },
      {
        "mark": {
          "type": "text",
          "align": "right",
          "xOffset": -4,
          "aria": false
        },
        "encoding": {
          "text": { "field": "RATING", "type": "quantitative" },
          "color": {
            "condition": {
              "test": { "field": "RATING", "gt": 2 },
              "value": "white"
            },
            "value": "black"
          }
        }
      }
    ]
  }
  
  


  // Render the Vega-Lite chart
  vegaEmbed('.chart1 #top5Chart2', topSpec);
  vegaEmbed('.chart1 #lowest5Chart2', lowSpec);
  vegaEmbed('.chart1 #ratingDonut', ratings);
  vegaEmbed('#scatterPlot', scatPlot);
  vegaEmbed('#ratingChart', plotRatings);
}