var margin = {top: 60, right: 20, bottom: 160, left: 80},
  width = 1200 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([20, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
  .range(["#98abc5", "#8a89a6"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".5s"));

function saltsugar(){

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      d3.json("JsonFiles/saltsugar.json", function(error, data) {

        if (error) throw error;

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "country"; }));

        data.forEach(function(d) {
          var y0 = 0;
          d.categories1 = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
          d.total = d.categories1[d.categories1.length - 1].y1;
        });

        data.sort(function(a, b) { return b.total - a.total; });

        x.domain(data.map(function(d) { return d.country; }));
        y.domain([0,d3.max(data, function(d) { return d.total; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
              .attr("y", 0)
              .attr("x", 9)
              .attr("dy", ".5em")
              .attr("transform", "rotate(80)")
              .style("text-anchor", "start");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Salt/Sugar Count");

        var country = svg.selectAll(".country")
            .data(data)
          .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x(d.country) + ",0)"; });

        country.selectAll("rect")
            .data(function(d) { return d.categories1; })
          .enter().append("rect")
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.y1); })
            .attr("height", function(d) { return y(d.y0) - y(d.y1); })
            .style("fill", function(d) { return color(d.name); });

        var legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

      });
}


function line(jsonPoints) {

  var width = 1000,
      height = 600,
      padding = 150;

  var svgContainer = d3.select("body").append("svg")
               .attr("width", width)
               .attr("height", height);

  //Create the Scale we will use for the Axis

  var xAxisScale = d3.scale.ordinal()
   .domain(jsonPoints.map(function(d) { return d.region; }))
   .rangePoints([0, 800]);

  //Create the Axis
  var xAxis = d3.svg.axis().orient("bottom").scale(xAxisScale);

  //Create an SVG group Element for the Axis elements and call the xAxis function
  var xAxisGroup = svgContainer.append("g").attr("transform", "translate(150," + (height - padding +10) + ")").call(xAxis);

  //Create the Scale we will use for the Axis
  var yAxisScale = d3.scale.linear()
   .domain([d3.max(jsonPoints, function(d) { return d.carbohydrates; }),0])
   .range([0, 400]);
  //Create the Axis
  var yAxis = d3.svg.axis().orient("left").scale(yAxisScale);

  //Create an SVG group Element for the Axis elements and call the xAxis function
  var yAxisGroup = svgContainer.append("g").attr("transform", "translate("+padding+",60)").call(yAxis);



  svgContainer.append("text")
          .attr("class", "yaxis_label")
          .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
          .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
          .text("Fat/Protein/Carbohydrates");

  svgContainer.append("text")
          .attr("class", "xaxis_label")
          .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
          .attr("transform", "translate("+ (width/2) +","+(height-80)+")")  // text is drawn off the screen top left, move down and out and rotate
          .text("Regions");

  svgContainer.append("text")
 .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
 .attr("transform", "translate("+ (width/2) +","+(height-60)+")")  // text is drawn off the screen top left, move down and out and rotate
 .text("Fat:Blue , Proteins:Red , Carbohydrates:Orange");



  var lineFunction1 = d3.svg.line()
                          .x(function(d,i) { return 150+(i)*(800/2); })
                          .y(function(d) { return (400-((d.fat/800000)*400))+60; })
                          .interpolate("linear");

//The line SVG Path we draw
  var lineGraph1 = svgContainer.append("path")
                            .attr("d", lineFunction1(jsonPoints))
                            .attr("stroke", "blue")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");

  var lineFunction2 = d3.svg.line()
                          .x(function(d,i) { return 150+(i)*(800/2); })
                          .y(function(d) { return (400-((d.proteins/800000)*400))+60; })
                          .interpolate("linear");

  var lineGraph2 = svgContainer.append("path")
                            .attr("d", lineFunction2(jsonPoints))
                            .attr("stroke", "red")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");

  var lineFunction3 = d3.svg.line()
                          .x(function(d,i) { return 150+(i)*(800/2); })
                          .y(function(d) { return (400-((d.carbohydrates/800000)*400))+60; })
                          .interpolate("linear");

  var lineGraph3 = svgContainer.append("path")
                            .attr("d", lineFunction3(jsonPoints))
                            .attr("stroke", "orange")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");

}
