import React, {useEffect, useState} from "react";
import * as d3 from "d3";
import Chart from "chart.js/auto"
import axios from "axios";

function Charts(){

    const [dataSource, setDataSource] = useState({
        labels: [],
        datasets:[
            {
                data: [],
                backgroundColor: [
                    '#ffcd56',
                    '#ff6384',
                    '#36a2eb',
                    '#fd6b19',
                    '#CC0000',
                    '#45818e',
                    '#c90076',
                    '#783f04',
                    '#f6b26b'
                ],
            }
        ],
        myBudget: []
    });

    useEffect(() => {
        getBudget();
    }, []);
    
    const createChart = () => {
        var ctx = document.getElementById('myChart').getContext('2d');
        // if(window.myPieChart != null){
        //     window.myPieChart.destroy();
        // }
        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: dataSource
        })
    }

    const getBudget = () => {
        axios.get('http://localhost:3050/budget')
        .then(function (res) {
            // console.log(res.data);
            const newDataSource = { ...dataSource };
            for(var i = 0; i < res.data.myBudget.length; i++){
                dataSource.datasets[0].data[i] = res.data.myBudget[i].budget;
                dataSource.labels[i] = res.data.myBudget[i].title;
                dataSource.myBudget.push({
                    "title": res.data.myBudget[i].title,
                    "budget": res.data.myBudget[i].budget
                })
            }
            setDataSource(newDataSource);
            createChart();
            populateD3jsChart();
        })
        .catch(function (error) {
            console.log(error);
        });
    }


    const populateD3jsChart = () => {
        // set the dimensions and margins of the graph
        var width = 450, height = 450, margin = 40

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        var radius = Math.min(width, height) / 2 - margin

        // append the svg object to the div called 'my_dataviz'
        var svg = d3.select("#d3jsChart")
        .append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Create dummy data
        var data = dataSource.myBudget;

        // set the color scale
        var color = d3.scaleOrdinal()
        .range(d3.schemeDark2);

        // Compute the position of each group on the pie:
        var pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(function(d) {return d[1].budget; })
        var data_ready = pie(Object.entries(data))

        // The arc generator
        var arc = d3.arc()
        .innerRadius(radius * 0.45)         // This is the size of the donut hole
        .outerRadius(radius * 0.8)

        // Another arc that won't be drawn. Just for labels positioning
        var outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
        .selectAll('allSlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d){return(color(d.data[1].title)) })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

        // Add the polylines between chart and labels:
        svg
        .selectAll('allPolylines')
        .data(data_ready)
        .enter()
        .append('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
            var posA = arc.centroid(d) // line insertion in the slice
            var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
            var posC = outerArc.centroid(d); // Label position = almost the same as posB
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
            return [posA, posB, posC]
            })

        // Add the polylines between chart and labels:
        svg
        .selectAll('allLabels')
        .data(data_ready)
        .enter()
        .append('text')
            .text( function(d) { return d.data[1].title } )
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
    }

    return(
        <div className="charts">
            <article className="text-box d3js" id="d3jsChart">
                <h1>D3js Chart</h1>
            </article>

            <article className="text-box pieChart">
                <h1>Pie Chart</h1>
                <p>
                    <canvas id="myChart" min-width="400" min-height="400"></canvas>
                </p>
            </article>
        </div>
    );
}

export default Charts;