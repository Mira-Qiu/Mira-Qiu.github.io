//lastchart
var margin = { top: 50, right: 50, bottom: 50, left: 50 },
  width = window.innerWidth - margin.left - margin.right,
  height = window.innerWidth - margin.bottom - margin.top,
  radius = 5;

d3.csv("data.csv", function (d) {
  return {year: d.year, position: d.position, salaryfrom: d.AvgSalaryFrom, salaryto: d.AvgSalaryTo};
}).then(function (data) {
    var minSa = d3.min(data,function(d){return d.salaryfrom})
    var maxSa = d3.min(data,function(d){return d.salaryto})
   
    var svg = d3.select("#lastchart").append('svg')
                .attr("class","line-chart")
                .attr("height", height + margin.top + margin.bottom)
                .attr("width",width + margin.left + margin.right)
                .append('g')
                .attr("transform","translate(50,50)");

    //CALL X & Y AXIS
    var xScale = d3.scaleLinear()
                    .domain([2011,2019]).range([0,width]);
    var yScale = d3.scaleLinear()
                    .domain([minSa,maxSa])
                    .range([height,0])
    svg.append('g')
        .attr("class","x axis")
        .attr("transform","translate(0,"+ height + ")")
        .call(d3.axisBottom(xScale));
    svg.append('g')
        .attr("class",'y axis')
        .call(d3.axisLeft(yScale));
    
    //CALL LINE high
    var line = d3.line()
                .x(function(d){return xScale(d.year)})
                .y(function(d){return yScale(d.salaryto)})
                .curve(d3.curveMonotoneX);
    svg.append("path")
        .datum(data)
        .attr("class","linehigh")
        .attr("d",line);
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class","dot")
        .attr("cx",function(d){return xScale(d.year)})
        .attr("cy",function(d){return yScale(d.salaryto)})
        .attr('r',5)
        .on("mouseover",function(d){
            var text = ["Year: "+d.year," Average Salary From: $"+d.salaryto];
            d3.select(this).attr('class','point').attr('r',radius * 2);
            svg.append('text')
                .text(text)
                .attr("id",text)
                .attr("x", xScale(d.year) - 30)
                .attr("y", yScale(d.salaryto) - 50)
                .attr('text-anchor', "middle")
        })
        svg.append("path")
        .datum(data)
        .attr("class","linelow")
        .attr("d",line);
    //CALL LINE LOW
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class","dot")
        .attr("cx",function(d){return xScale(d.year)})
        .attr("cy",function(d){return yScale(d.salaryfrom)})
        .attr('r',5)
        .on("mouseover",function(d){
            var text = ["Year: "+d.year," Average Salary From: $"+d.salaryfrom];
            d3.select(this).attr('class','point').attr('r',radius * 2);
            svg.append('text')
                .text(text)
                .attr("id",text)
                .attr("x", xScale(d.year) - 30)
                .attr("y", yScale(d.salaryfrom) - 50)
                .attr('text-anchor', "middle")
        })
})
  .catch(function (error) {
    console.log(error);
  })