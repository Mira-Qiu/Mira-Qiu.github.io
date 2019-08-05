var margin = { top: 50, right: 50, bottom: 50, left: 50 },
  width = window.innerWidth - margin.left - margin.right,
  height = window.innerWidth - margin.bottom - margin.top
radius = 5;

d3.csv("data.csv", function (d) {
  return {
    year: d.year, position: d.position, salaryfrom: Number(d.AvgSalaryFrom), salaryto: Number(d.AvgSalaryTo)
  };
}).then(function (data) {
  var maxyear = d3.max(data, function (d) { return d.year; })
  var minyear = d3.min(data, function (d) { return d.year; })
  //console.log(maxyear);
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) { return d.position })])
    .range([height, 0]);
  var xScale = d3.scaleLinear()
    .domain([minyear, maxyear])
    .range([0, width]);
  var yAxis = d3.axisLeft(yScale);
  var xAxis = d3.axisBottom(xScale);

  var svg = d3.select("#2014chart").append('svg')
    .attr("class", "bar-chart")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
  var chartGroup = svg.append('g').attr("transform", "translate(50,50)");
  var line = d3.line()
    .y(function (d) { return xScale(d.year); })
    .x(function (d) { return yScale(d.position); })
    .curve(d3.curveMonotoneX);

  chartGroup.append("g").attr("transform", "translate(0," + height + ")").call(xAxis);
  chartGroup.append("g").call(yAxis);

  chartGroup.append('path').datum(data).attr("d", line).attr("fill", "none").attr("stroke", "black").attr("stroke-width", "3");

  // circle out data point
  chartGroup.selectAll(".dot").data(data).enter()
    .append("circle").attr("cx", function (d) { return xScale(d.year) })
    .attr("cy", function (d) { return yScale(d.position) }).attr('r', radius).attr("fill", "none").attr("stroke", "gray").attr("stroke-width", "2")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  chartGroup.on("click", function () {
    var coords = d3.mouse(this);
    var newData = {
      x: Math.round(xScale.invert(coords[0])),  // Takes the pixel number to convert to number
      y: Math.round(yScale.invert(coords[1]))
    };
    data.push(newData);   // Push data to our array

    chartGroup.selectAll("circle")  // For new circle, go through the update process
      .data(data)
      .enter()
      .append("circle")
      .attr("cy", function (d) { return yScale(d.position) }).attr('r', radius)  // Get attributes from circleAttrs var
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);
  })

  function handleMouseOver(d, i) {
    d3.select(this).attr({
      fill: "orange",
      r: radius * 2
    });

    // Specify where to put label of text
    chartGroup.append("text").attr({
      id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
      x: function () { return xScale(d.year) - 30; },
      y: function () { return yScale(d.position) - 15; }
    })
      .text(function () {
        return d.AvgSalaryFrom;
      });
  }

  function handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    d3.select(this).attr({
      fill: "black",
      r: radius
    });

    // Select text by id and then remove
    d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
  }

})
  .catch(function (error) {
    console.log(error);
  })

