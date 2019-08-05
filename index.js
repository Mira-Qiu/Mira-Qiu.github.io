//tab change page function
function openPage(evt, pageNum){
  var i, chart, tablinks;
  chart = document.getElementsByClassName("chart");
  for (i = 0; i < chart.length; i++){
    chart[i].style.display ="none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0;i < tablinks.length; i++){
    tablinks[i].className = tablinks[i].className.replace(" active","");
  }
  document.getElementById(pageNum).style.display = "block";
  evt.currentTarget.className += " active";
}

// YearChart
//defind the chart size;
var margin = { top: 50, right: 50, bottom: 50, left: 50 },
  width = window.innerWidth - margin.left - margin.right,
  height = window.innerWidth - margin.bottom - margin.top,
  radius = 5;

//upload data and draw line chart
d3.csv("data.csv",function(d){
  return {year:d.year, pos: d.position, sfrom: d.AvgSalaryFrom, sto: d.AvgSalaryTo};
}).then(function(data){
  //console.log(data);
  //STEP 1. ADD SVG to the page
  var svg = d3.select("#yearChart")
              .append('svg')
              .attr("class","line-chart")
              .attr("height",height + margin.top + margin.bottom)
              .attr("width", width + margin.left + margin.right)
              .append("g")
              .attr("transform","translate(50,50)");
  
  //STEP 2. CALL x & y AXIS
  var xScale = d3.scaleLinear()
                  .domain([d3.min(data,function(d){return d.year}),d3.max(data,function(d){return d.year})])
                  .range([0,width]);
  var yScale = d3.scaleLinear()
                  .domain([0,6000])
                  .range([height,0]);

  svg.append("g")
    .attr("class","x axis")
    .attr("transform","translate(0,"+height+")")
    .call(d3.axisBottom(xScale));

  svg.append("g")
      .attr("class","y axis")
      .call(d3.axisLeft(yScale));
  
  //STEP 3: CALL LINE
  var line = d3.line()
                .x(function(d){return xScale(d.year);})
                .y(function(d){return yScale(d.pos);})
                .curve(d3.curveMonotoneX);
  
  svg.append("path")
      .datum(data)
      .attr("class","line")
      .attr("d",line);
  //STEP 4: CIRCLE OUT POINT
  svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx",function(d){return xScale(d.year)})
      .attr("cy",function(d){return yScale(d.pos)})
      .attr("r",5)
      .on("mouseover",function(d){
        var text = ["Year: "+ d.year, "\n\ Positions :"+d.pos];
          d3.select(this).attr('class','point').attr('r',radius *2);
          svg.append('text')
            .text(text)
            .attr("id",text)
            .attr("x",xScale(d.year) - 30)
             .attr('y',yScale(d.pos) - 50)
              .attr('text-anchor',"middle")
      })
      .on("mousemove",function(d){
        d3.select(this).attr({
          class: "dot",
          r: radius
        })
      });

  //STEP 5: MOUSE
  
}).catch(function(error){console.log(error)});