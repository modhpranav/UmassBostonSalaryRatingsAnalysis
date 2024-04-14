d3.csv("https://modhpranav.github.io/opendata/umass_data_with_categories.csv").then(function (data) {
        const sortedData = data.sort((a, b) => b.ANNUAL_RATE - a.ANNUAL_RATE);
        const top5Employees = sortedData.slice(0, 5);
        const lowest5Employees = sortedData.slice(-5);

        const vegaSpec1 = {
            "title": {
                "text": "Top 5 Highly Paid Departments",
                "color": "white"
            },
            "width": 250,
            "height": 150,
            "background": "transparent",
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "description": "A simple bar chart with data from CSV file.",
            "data": { "values": top5Employees }, // Empty data initially
            "mark": "bar",
            "encoding": {
                "x": { "field": "DEPARTMENT", "type": "nominal", "sort": "-y", "axis": { "labelAngle": -45, "labelColor": "white", "titleColor": "white", "grid": false } },
                "y": { "field": "ANNUAL_RATE", "type": "quantitative", "axis": { "labelColor": "white", "titleColor": "white", "grid": false} },
                "color": { "field": "ANNUAL_RATE", "type": "quantitative" },
                "tooltip": [
                    { "field": "DEPARTMENT", "type": "ordinal", "title": "Department: " },
                    { "field": "ANNUAL_RATE", "type": "quantitative", "title": "Salary: " },
                    { "field": "FULL_NAME", "type": "ordinal", "title": "Employee Name: " }
                ]
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

        const vegaSpec2 = {
            "title": {
                "text": "Top 5 Least Paid Departments",
                "color": "white"
              },
            "width": 250,
            "height": 200,
            "background": "transparent",
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "description": "A simple bar chart with data from CSV file.",
            "data": { "values": lowest5Employees }, // Empty data initially
            "mark": { "type": "bar" },
            "encoding": {
                "x": { "field": "DEPARTMENT", "type": "nominal", "sort": "-y", "axis": { "labelAngle": -45, "labelColor": "white", "titleColor": "white", "grid": false } },
                "y": { "field": "ANNUAL_RATE", "type": "quantitative", "axis": { "labelColor": "white", "titleColor": "white", "grid": false } },
                "color": { "field": "ANNUAL_RATE", "type": "quantitative" },
                "tooltip": [
                    { "field": "DEPARTMENT", "type": "ordinal", "title": "Department: " },
                    { "field": "ANNUAL_RATE", "type": "quantitative", "title": "Salary: " },
                    { "field": "FULL_NAME", "type": "ordinal", "title": "Employee Name: " }
                ]
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
        vegaEmbed("#top5Chart", vegaSpec1, { actions: false });
        vegaEmbed("#lowest5Chart", vegaSpec2, { actions: false });


})