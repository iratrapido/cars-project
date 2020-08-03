//set chart dimensions object
const dimensions = {
width: window.innerWidth * 0.7,
height: 410,
margin: {
  top: 40,
  right: 160,
  bottom: 35,
  left: 60,
  },
}
dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

var wrapper, bounds;
var avr_miles_driven = 13500;
var car1_index = 0;
var car2_index = 2;

//create functions for each sceene
function scene1(){
  const text_box = d3.select("#change_text")
  text_box.html("");

  instructions_group = text_box.append("div")
    .attr("id", "instructions")

   instructions_group.append("div")
        .attr("id", "instructions1")
      .append("img")
        .attr("id", "img_hand")
        .attr("src", "./images/hand.png")
        .attr("width", 40)
        .attr("height", 40)

  d3.select("div#instructions1")
        .append("p")
        .attr("class", "instructions_text")
        .text("Click on the buttons at the top to navigate between slides")

    instructions_group.append("div")
         .attr("id", "instructions2")
      .append("img")
         .attr("src", "./images/arrow.png")
         .attr("width", 60)
         .attr("height", 60)

     d3.select("div#instructions2")
        .append("p")
          .attr("class", "instructions_text")
          .text("Hover over a bar in any of the bar charts on the right to see more details")

    instructions_group.append("div")
          .attr("id", "instructions3")
       .append("p")
       .text("Let's get started!")

  const img_area = d3.select("#change_chart")

  img_area.html("");
  const raw1 = img_area.append("div")
      .attr("id", "img_row1")

  raw1.append("div")
      .append("img")
      .attr("src", "./images/car_fleet_small.png")
      //.attr("width", "400")
      .attr("height", "232")

   raw1.append("div")
      .append("img")
      .attr("src", "./images/ford_small.png")
      //.attr("width", "400")
      .attr("height", "232")

  raw1.append("div")
      .append("img")
      .attr("src", "./images/tesla.png")
         //.attr("width", "400")
      .attr("height", "232")

  const raw2 = img_area.append("div")
      .attr("id", "img_row2")

  raw2.append("img")
      .attr("src", "./images/fill_gas.png")
      .attr("height", "232")


  raw2.append("img")
         .attr("src", "./images/highway.png")
        // .attr("width", "400")
         .attr("height", "232")

  raw2.append("img")
          .attr("src", "./images/electric_car_future.png")
          //.attr("width", "340")
          .attr("height", "232")

}

function scene2(){
   d3.select("#change_text").html("");
   d3.select("#change_text").html(`<p>Over the last decade, electric vehicles,
     both plug-in hybrids and fully electric, have significantly grown in popularity.
     They provide smooth and noiseless driving, low maintenance, quick acceleration,
     and, above all, produce no tailpipe emissions.</p><p>But are electric cars really green?
     Let's find out!</p>`);
   d3.select("#change_chart").html("");
   drawChart2();
}

function scene3(){
   d3.select("#change_text").html(`<span id = "smaller_text">Let’s take a closer look at the environmental impact of several popular 2019 car models.
We will consider four main sources of CO2 emissions:
<ul>
<li>battery manufacturing (for hybrid and electric cars);</li>
<li>tailpipe emissions (for hybrid and gasoline cars);</li>
<li>upstream fuel production (including oil production, transport, refining, and electricity generation).</li>
<li>car manufacturing (excluding battery);</li>
</ul>
To build our model, we make several assumptions:
<ul>
<li>we use average US electricity mix, which is about 63% fossil fuels;</li>
<li>emissions are normalized over 100,000 miles, assuming that an average car will drive 100,000 miles over its lifetime;</li>
<li>we only look at CO2 emissions and ignore other environmental damage caused by car manufacturing, use, and disposal.
</span>`);
   d3.select("#change_chart").html("");
   drawChart3();
}

function scene4(){
   d3.select("#change_text").html("a");
   d3.select("#change_text").html(`<span>Assuming that an average person drives 13,500 per year,
     let’s compare cumulative CO2 emissions over the span of 20 years for two mid-size vehicles:
     a fully-electric Nissan Leaf and a conventional (non-hybrid) Toyota Corolla.</span>`)
   d3.select("#change_chart").html("");
   drawChart4();
}

function scene5(){
   d3.select("#change_text").html("");
   d3.select("#change_text").html(`<span>Time to explore! Choose any two car models
   from our small dataset, set the average number of miles driven per year,
   and find out which car is greener.</span>`);
   d3.select("#change_chart").html("");
   drawChart5();
}

function scene6(){
  d3.select("#change_text").html("");
  d3.select("#change_chart").html("");
  d3.select("#change_chart")
     .append("div")
     .attr("class", "references")
     .html(`<p class = "chart_title">References and data sources:</p><br />
      <ul id = "ref_list">
        <li>International Energy Agency (IEA). <a href="https://www.iea.org/reports/global-ev-outlook-2019">"Global EV Outlook 2020: Entering the Decade of Electric Drive?"</a></li>
        <li>EPA and U.S.Department of Energy. <a href="https://www.fueleconomy.gov">Fueleconomy.gov</a> website.</li>
        <li>The Guardian. <a href="https://www.theguardian.com/environment/green-living-blog/2010/sep/23/carbon-footprint-new-car">"What's the carbon footprint of ... a new car?"</a> September 23, 2010.</li>
        <li>Zeke Hausfather. <a href ="https://www.carbonbrief.org/factcheck-how-electric-vehicles-help-to-tackle-climate-change">"Factcheck: How electric vehicles help to tackle climate change."</a> May 13, 2019.</li>
      </ul>
      `
     )
}

async function drawChart2() {
  //Load data
  const dataset = await d3.csv("data.csv");
  const years = d3.map(dataset, function(d){return(d.Year)}).keys()
  const car_types = dataset.columns.slice(1);
  const stackedData = d3.stack().keys(car_types)(dataset)
  //add column of totals (this will help determine scale)
  d3.map(dataset, function(d) {
    var t = 0;
    for (var i = 0; i < car_types.length; i++) {
      // Convert to numeric
      d[car_types[i]] = +d[car_types[i]];
      t += d[car_types[i]];
    }
    d.total = t;
  } );

  //draw canvas
  wrapper = d3.select("#change_chart")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

  bounds = wrapper.append("g")
      .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

  //create scales
  const xScale= d3.scaleBand()
     .domain(years)
     .range([0, dimensions.boundedWidth])
     .padding([0.2])

  const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, function(d) { return d.total; })])
      .range([dimensions.boundedHeight, 0])

  const colorScale = d3.scaleOrdinal()
    .domain(car_types)
    .range(['#89a190','#5fcf64'])

  //add tooltips
  const tooltip = d3.select("#change_chart")
    .append("div")
    .attr("class", "tooltip")

  const mouseover = function(d) {
    const subgroupName = d3.select(this.parentNode).datum().key;
    const subgroupValue = d.data[subgroupName];
    tooltip.html("Vehicle type: " + subgroupName + "<br>" + "Number of cars: " + d3.format(".2f")(subgroupValue) + " millions")
           .style("opacity", 1)
  }
  const mousemove = function(d) {
    tooltip.style("left", (d3.event.pageX + "px"))
           .style("top", (d3.event.pageY + "px"));
 }
  const mouseleave = function(d) {
       tooltip.style("opacity", 0)
  }

  //draw the chart
  const chart = bounds.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
          .attr("fill", function(d) { return colorScale(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
          .attr("x", function(d) { return xScale(d.data.Year); })
          .attr("y", function(d) { return yScale(d[1]); })
          .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
          .attr("width", xScale.bandwidth())
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)

  //add  axes and decorations
  const yAxisGenerator = d3.axisLeft()
      .scale(yScale)

  const yAxis = bounds.append("g")
      .call(yAxisGenerator)

  const xAxisGenerator = d3.axisBottom()
     .scale(xScale)

  const xAxis = bounds.append("g")
      .call(xAxisGenerator)
          .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const yAxisLabel = yAxis.append("text")
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("y", -dimensions.margin.left + 30)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .text("Number of cars (in millions)")
      .style("transform", "rotate(-90deg)")
      .style("text-anchor", "middle")

   //draw legend
    const legend = bounds.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
          .selectAll("g")
          .data(car_types.reverse())
          .enter()
          .append("g")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", dimensions.boundedWidth)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", function(d, i) { return colorScale(d); })

      legend.append("text")
        .attr("class", "legend_text")
        .attr("x", dimensions.boundedWidth + 22)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });


        //add annotations
    bounds.append("svg:defs").append("svg:marker")
          .attr("id", "triangle")
          .attr("refX", 12)
          .attr("refY", 6)
          .attr("markerWidth", 30)
          .attr("markerHeight", 30)
          .attr("orient", "auto")
          .append("path")
          .attr("d", "M 0 0 12 6 0 12 3 6")
          .style("fill", "grey")
          .style("stroke", "grey");

    bounds.append("line")
          .attr("x2", xScale(2010)+xScale.bandwidth()/2)
          .attr("y2", yScale(dataset[0].total))
          .attr("x1", xScale(2010)+xScale.bandwidth()/2+45)
          .attr("y1", yScale(dataset[0].total)-45)
          .style("stroke", "grey")
          .attr("marker-end", "url(#triangle)")

    var x = xScale(2010)+xScale.bandwidth()/2+45;
    bounds.append("text")
        .attr("class", "annotation-label")
        .attr("x", x)
        .attr("y", yScale(dataset[0].total)-65)
        .attr("text-anchor", "middle")
        .html(`<tspan x=${x}>In 2010, there were only</tspan><tspan x=${x} dy=15>170,400 electric cars globally</tspan>`);

    bounds.append("line")
          .attr("x2", xScale(2019)+xScale.bandwidth()/2)
          .attr("y2", yScale(dataset[9].total))
          .attr("x1", xScale(2019)+xScale.bandwidth()/2-45)
          .attr("y1", yScale(dataset[9].total)+45)
          .style("stroke", "grey")
          .attr("marker-end", "url(#triangle)")

      x = xScale(2019)+xScale.bandwidth()/2-130;
      bounds.append("text")
          .attr("class", "annotation-label")
          .attr("x", x)
          .attr("y", yScale(dataset[9].total)+55)
          .attr("text-anchor", "middle")
          .html(`<tspan x=${x}>In 2019, the total number </tspan>
            <tspan x=${x} dy=15>of electric cars (all-electric + </tspan>
            <tspan x=${x} dy=15>hybrid plug-ins) surpassed 7 million</tspan>`);

      //add title
      bounds.append("text")
          .attr("class", "chart_title")
          .attr("x", dimensions.boundedWidth/2)
          .attr("y", - (dimensions.margin.top / 2 - 15))
          .attr("text-anchor", "middle")
          .text("Global electric car stock, 2010-2019");

}
async function drawChart3() {
  //Load data
  const dataset = await d3.csv("co2_emissions.csv");
  const models = d3.map(dataset, function(d){return(d.Model)}).keys()
  const emissions_type = dataset.columns.slice(1,5);
  const stacked_emissions = d3.stack().keys(emissions_type)(dataset);


  d3.map(dataset, function(d) {
    var t = 0;
    for (var i = 0; i < emissions_type.length; i++) {
      // Convert to numeric
      d[emissions_type[i]] = +d[emissions_type[i]];
      t += d[emissions_type[i]];
    }
    d.total = t;
  } );

  //draw canvas
  wrapper = d3.select("#change_chart")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height+60);

  bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`);

  //create scales
  const xScale= d3.scaleBand()
     .domain(models)
     .range([0, dimensions.boundedWidth])
     .padding([0.2])

  const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, function(d) { return d.total; })])
      .range([dimensions.boundedHeight, 0])

  const colorScale = d3.scaleOrdinal()
    .domain(models)
    .range(['#4f91c3','#cbb1b0', '#c7dae1', '#fccb90'])

   //add tooltips
   const tooltip = d3.select("#change_chart")
      .append("div")
        .attr("class", "tooltip")

   const mouseover = function(d) {
     const subgroupName = d3.select(this.parentNode).datum().key;
     const subgroupValue = d.data[subgroupName];
     tooltip.html("Emissions type: " + subgroupName + "<br>" + "Emissions: " + d3.format(".0f")(subgroupValue) + " g/mi")
           .style("opacity", 1)
   }
   const mousemove = function(d) {
     tooltip.style("left", (d3.event.pageX + "px"))
            .style("top", (d3.event.pageY + "px"));

   }
   const mouseleave = function(d) {
        tooltip.style("opacity", 0)
   }

  //draw chart
  bounds.append("g")
        .selectAll("g")
        .data(stacked_emissions)
        .enter().append("g")
          .attr("fill", function(d) { return colorScale(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
          .attr("x", function(d) { return xScale(d.data.Model); })
          .attr("y", function(d) { return yScale(d[1]); })
          .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
          .attr("width", xScale.bandwidth())
          .on("mouseover", mouseover)
          .on("mouseleave", mouseleave)
          .on("mousemove", mousemove)

    //add axes
    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)

    const yAxis = bounds.append("g")
        .call(yAxisGenerator)

    const xAxisGenerator = d3.axisBottom()
       .scale(xScale)

    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
            .style("transform", `translateY(${dimensions.boundedHeight}px)`)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("font-weight", "bold")
            .attr("transform", "rotate(-35)");

    const yAxisLabel = yAxis.append("text")
        .attr("x", -dimensions.boundedHeight / 2)
        .attr("y", -dimensions.margin.left + 25)
        .attr("fill", "black")
        .style("font-size", "1.4em")
        .text("CO2-equivalent emissions (in grams per mile)")
        .style("transform", "rotate(-90deg)")
        .style("text-anchor", "middle")

     //draw legend
    const legend = bounds.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
          .selectAll("g")
          .data(emissions_type.reverse())
          .enter()
          .append("g")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", dimensions.boundedWidth)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", function(d, i) { return colorScale(d); })

      legend.append("text")
        .attr("class", "legend_text")
        .attr("x", dimensions.boundedWidth+22)
        .attr("y", 13.5)
        .style("text-anchor", "start")
        .text(function(d) { return d; });

      //add title
      const chart2_title = bounds.append("text")
            .attr("class", "chart_title")
            .attr("x", dimensions.boundedWidth/2)
            .attr("y", - (dimensions.margin.top / 2))
            .attr("text-anchor", "middle")
            .text("Lifetime greenhouse gas emissions for different car types")


      //add divider lines and section labels
      space_width = (dimensions.boundedWidth-(xScale.bandwidth()*10))/11
      section_width = (dimensions.boundedWidth-xScale.bandwidth()-space_width*1.5)/3
      section_text = ["Midsize cars", "Large cars", "SUVs"]
      for (let i = 0; i < 3; i++){
        bounds.append("line")
          .attr("class", "vertical_line")
          .attr("x1", (i+1)*section_width)
          .attr("x2", (i+1)*section_width)
          .attr("y1", 5)
          .attr("y2", dimensions.boundedHeight);

        bounds.append("text")
           .attr("class", "section_label")
           .attr("x", section_width * (i+0.5))
           .attr("y", - (dimensions.margin.top / 2 )+16)
           .attr("text-anchor", "middle")
           .text(section_text[i]);
      }
      bounds.append("text")
         .attr("class", "section_label")
         .attr("x", section_width * 3 + 28)
         .attr("y", - (dimensions.margin.top / 2 )+16)
         .attr("text-anchor", "middle")
         .text("Pickup trucks");

    //add annotations
     bounds.append("svg:defs").append("svg:marker")
           .attr("id", "triangle")
           .attr("refX", 12)
           .attr("refY", 6)
           .attr("markerWidth", 30)
           .attr("markerHeight", 30)
           .attr("orient", "auto")
           .append("path")
           .attr("d", "M 0 0 12 6 0 12 3 6")
           .style("fill", "grey")
           .style("stroke", "grey");

     var x = xScale("Nissan Leaf")+xScale.bandwidth()/2;
     var y = yScale(dataset.filter(function(d){ return d.Model == "Nissan Leaf" })[0].total) + 30;
     bounds.append("line")
           .attr("x2", x)
           .attr("y2", y)
           .attr("x1", x-100)
           .attr("y1", y-100)
           .style("stroke", "grey")
           .attr("marker-end", "url(#triangle)");

     x = x-150;
     y = y-100-5*15;
     bounds.append("text")
         .attr("class", "annotation-label")
         .attr("x", x)
         .attr("y", y)
         .attr("text-anchor", "left")
         .html(`<tspan x=${x}>Unlike tailpipe emissions that</tspan>
                <tspan x=${x} dy=15>remain constant, lifecycle</tspan>
                <tspan x=${x} dy=15>emissions of electric vehicles</tspan>
                <tspan x=${x} dy=15>will vary significantly</tspan>
                <tspan x=${x} dy=15>depending on the local mix</tspan>
                <tspan x=${x} dy=15>of electrical power sources</tspan>
              `);

        x = xScale("Tesla Model S")+xScale.bandwidth()/2;
        y = yScale(dataset.filter(function(d){ return d.Model == "Tesla Model S" })[0].total);
        bounds.append("line")
              .attr("x2", x)
              .attr("y2", y)
              .attr("x1", x-100)
              .attr("y1", y-100)
              .style("stroke", "grey")
              .attr("marker-end", "url(#triangle)");

          x = x-150;
          y = y-100-4*15;
          bounds.append("text")
              .attr("class", "annotation-label")
              .attr("x", x)
              .attr("y", y)
              .attr("text-anchor", "left")
              .html(`<tspan x=${x}>Car size matters more than</tspan>
                     <tspan x=${x} dy=15>whether the car is electric: driving</tspan>
                     <tspan x=${x} dy=15>a Tesla Model S produces more</tspan>
                     <tspan x=${x} dy=15>CO2 than driving a Toyota</tspan>
                     <tspan x=${x} dy=15>Corolla</tspan>
                   `);

           x = xScale("Tesla Model X")+xScale.bandwidth()/2;
           y = yScale(dataset.filter(function(d){ return d.Model == "Tesla Model X" })[0].total);
           bounds.append("line")
                 .attr("x2", x)
                 .attr("y2", y)
                 .attr("x1", x-50)
                 .attr("y1", y-50)
                 .style("stroke", "grey")
                 .attr("marker-end", "url(#triangle)");


             x = x-150;
             y = y-55-5*15;
             bounds.append("text")
                 .attr("class", "annotation-label")
                 .attr("x", x)
                 .attr("y", y)
                 .attr("text-anchor", "left")
                 .html(`<tspan x=${x}>Because of its large battery, Tesla</tspan>
                        <tspan x=${x} dy=15>Model X produces more CO2 than</tspan>
                        <tspan x=${x} dy=15>a comparable plug-in hybrid.</tspan>
                        <tspan x=${x} dy=15>Also, for larger cars, the</tspan>
                        <tspan x=${x} dy=15>difference in CO2 emissions</tspan>
                        <tspan x=${x} dy=15>between gas and electric cars is</tspan>
                        <tspan x=${x} dy=15>is not that big</tspan>
                      `);

}

async function drawChart4(annotate = true){

  const dataset = await d3.csv("co2_emissions.csv", d3.autoType);
  const models_subset = ["Toyota Corolla", "Nissan Leaf"]
  //const subset = dataset.filter(function(d){ return  (d.Model == "Toyota Corolla" || d.Model == "Nissan Leaf") });
  const subset = dataset.filter(function(d) {return models_subset.includes( d.Model );});
  const num_years = d3.range(0,21);

  const data_predict = [];

  //construct data
  for (let i = 0; i < 21; i++){
      let years = i;
      data_predict.push({"Number of Years": years});
      d3.map(subset, function(d){
        //original manufacturing data was normalized by 100K miles, so we need to multiply it by 100K
         predict = (100000 * ( d["Battery Manufacturing"] + d["Vehicle Manufacturing"] ) + years*avr_miles_driven*(d["Tailpipe Emissions"] + d["Upstream Fuel Production"]))/1000000;
         Object.assign(data_predict[i], {[d.Model]: predict})
    });
  }

  //draw canvas
  wrapper = d3.select("#change_chart")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

  bounds = wrapper.append("g")
      .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

  //create scales
  const xScale = d3.scaleBand()
     .domain(num_years)
     .range([0, dimensions.boundedWidth])
     .padding([0.2])

   const xSubgroup = d3.scaleBand()
     .domain(models_subset)
     .range([0, xScale.bandwidth()])
     .padding([0.05])

  const yScale = d3.scaleLinear()
      .domain([0, d3.max(data_predict, d => d3.max(models_subset, key => d[key]))]).nice()
      .range([dimensions.boundedHeight, 0])

  const colorScale = d3.scaleOrdinal()
    .domain(models_subset)
    .range(['#6495ed', '#ba9797'])

  //add tooltips
  const tooltip = d3.select("#change_chart")
       .append("div")
         .attr("class", "tooltip")

  const mouseover = function(d) {
    const car_name = d3.select(this).datum().key;
    const co2_value = d3.select(this).datum().value;
    tooltip.html("Car: " + car_name + "<br>" + "Emissions: " + d3.format(".2f")(co2_value) + " tonnes")
           .style("opacity", 1)
  }
  const mousemove = function(d) {
        tooltip.style("left", (d3.event.pageX + "px"))
          .style("top", (d3.event.pageY + "px"));
  }
  const mouseleave = function(d) {
         tooltip.style("opacity", 0)
  }

 //draw chart
  bounds.selectAll("g")
  .data(data_predict)
  .enter()
  .append("g")
     .attr("class", "bar")
     //.attr("transform", d => `translate(${xScale(d["Number of Years"])},0)`)
     .attr("transform", function(d) { return "translate(" + xScale(d["Number of Years"]) + ",0)"; })
  .selectAll("rect")
  .data(function(d) { return models_subset.map(function(key) { return {key: key, value: d[key]}; }); })
  .enter().append("rect")
    .attr("x", function(d) { return xSubgroup(d.key); })
    .attr("y", function(d) { return yScale(d.value); })
    .attr("width", xSubgroup.bandwidth())
    .attr("height", function(d) { return yScale(0) - yScale(d.value); })
    .attr("fill", function(d) { return colorScale(d.key); })
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave)
    .on("mousemove", mousemove);

  //add  axes and decorations
  const yAxisGenerator = d3.axisLeft()
      .scale(yScale);

  const yAxis = bounds.append("g")
      .attr("id", "y_axis")
      .call(yAxisGenerator)

  const xAxisGenerator = d3.axisBottom()
     .scale(xScale)

  const xAxis = bounds.append("g")
      .attr("id", "x_axis")
      .call(xAxisGenerator)
          .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const yAxisLabel = yAxis.append("text")
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("y", -dimensions.margin.left + 30)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .text("Cumulative CO2 emissions (in tonnes)")
      .style("transform", "rotate(-90deg)")
      .style("text-anchor", "middle")

  const xAxisLabel = xAxis.append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", 30)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .text("Years of use")
      .style("text-anchor", "middle")

   //draw legend
   const legend = bounds.append("g")
           .attr("class", "legend")
           .attr("font-family", "sans-serif")
           .attr("font-size", 10)
           .attr("text-anchor", "end")
         .selectAll("g")
         .data(models_subset)
         .enter()
         .append("g")
         .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

     legend.append("rect")
         .attr("x", dimensions.boundedWidth)
         .attr("width", 19)
         .attr("height", 19)
         .attr("fill", function(d, i) { return colorScale(d); })

     legend.append("text")
       .attr("class", "legend_text")
       .attr("x", dimensions.boundedWidth+22)
       .attr("y", 9.5)
       .attr("dy", "0.32em")
       .style("text-anchor", "start")
       .text(function(d) { return d; });

  //add title
   bounds.append("text")
       .attr("class", "chart_title")
       .attr("x", dimensions.boundedWidth/2)
       .attr("y", - (dimensions.margin.top / 2 - 15))
       .attr("text-anchor", "middle")
       .text("Cumulative CO2 emissions for different car models");

       //add annotations
    if (annotate){
      bounds.append("svg:defs").append("svg:marker")
            .attr("id", "triangle")
            .attr("refX", 12)
            .attr("refY", 6)
            .attr("markerWidth", 30)
            .attr("markerHeight", 30)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 12 6 0 12 3 6")
            .style("fill", "grey")
            .style("stroke", "grey");

      var x = xScale(0)+xScale.bandwidth()/2;
      var y = yScale(data_predict.filter(function(d){ return d["Number of Years"] == 0})[0]["Nissan Leaf"]);
      bounds.append("line")
            .attr("x2", x)
            .attr("y2", y)
            .attr("x1", x)
            .attr("y1", y-150)
            .style("stroke", "grey")
            .attr("marker-end", "url(#triangle)");

        x = x-10;
        y = y-150-50;
        bounds.append("text")
            .attr("class", "annotation-label")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "left")
            .html(`<tspan x=${x}>The battery of Nissan Leaf</tspan>
                   <tspan x=${x} dy=15>causes higher emissions</tspan>
                   <tspan x=${x} dy=15>during vehicle manufacture</tspan>
                   <tspan x=${x} dy=15>in "year zero"</tspan>
                 `);

       x = xScale(2)+xScale.bandwidth()/2;
       y = yScale(data_predict.filter(function(d){ return d["Number of Years"] == 3})[0]["Nissan Leaf"]);
       bounds.append("line")
             .attr("x2", x)
             .attr("y2", y)
             .attr("x1", x)
             .attr("y1", y-55)
             .style("stroke", "grey")
             .attr("marker-end", "url(#triangle)");

         x = x-10;
         y = y-55-50;
         bounds.append("text")
             .attr("class", "annotation-label")
             .attr("x", x)
             .attr("y", y)
             .attr("text-anchor", "left")
             .html(`<tspan x=${x}>However, this carbon "debt"</tspan>
                    <tspan x=${x} dy=15>would be paid back after</tspan>
                    <tspan x=${x} dy=15>less than two years</tspan>
                    <tspan x=${x} dy=15> of driving</tspan>
                  `);

          x = xScale(20)+xScale.bandwidth()/2;
          y = yScale(data_predict.filter(function(d){ return d["Number of Years"] == 20})[0]["Nissan Leaf"]);
          bounds.append("line")
                .attr("x2", x)
                .attr("y2", y)
                .attr("x1", x+35)
                .attr("y1", y-35)
                .style("stroke", "grey")
                .attr("marker-end", "url(#triangle)");

            x = x+20;
            y = y-35-50;
            bounds.append("text")
                .attr("class", "annotation-label")
                .attr("x", x)
                .attr("y", y)
                .attr("text-anchor", "left")
                .html(`<tspan x=${x}>In 20 years, Nissan</tspan>
                       <tspan x=${x} dy=15>Leaf's cumulative CO2</tspan>
                       <tspan x=${x} dy=15>emissions will be almost</tspan>
                       <tspan x=${x} dy=15>half of Toyota Corolla's</tspan>
                     `);
    }
}

function updateChart(dataset){
  models_subset = [ dataset[car1_index].Model, dataset[car2_index].Model ];
  const subset = dataset.filter( function(d) { return models_subset.includes( d.Model ); } );
  const num_years = d3.range(0,21);

  const data_predict = [];

  //construct data
  for (let i = 0; i < 21; i++){
      let years = i;
      data_predict.push({"Number of Years": years});
      d3.map(subset, function(d){
        //original manufacturing data was normalized by 100K miles, so we need to multiply it by 100K
         predict = (100000 * ( d["Battery Manufacturing"] + d["Vehicle Manufacturing"] ) + years*avr_miles_driven*(d["Tailpipe Emissions"] + d["Upstream Fuel Production"]))/1000000;
         Object.assign(data_predict[i], {[d.Model]: predict})
    });
  }

  //create scales
  const xScale = d3.scaleBand()
     .domain(num_years)
     .range([0, dimensions.boundedWidth])
     .padding([0.2])

   const xSubgroup = d3.scaleBand()
     .domain(models_subset)
     .range([0, xScale.bandwidth()])
     .padding([0.05])

  const yScale = d3.scaleLinear()
      .domain([0, d3.max(data_predict, d => d3.max(models_subset, key => d[key]))]).nice()
      .range([dimensions.boundedHeight, 0])

  const colorScale = d3.scaleOrdinal()
    .domain(models_subset)
    .range(['#6495ed', '#ba9797'])

  //update chart
  bounds.selectAll("g.bar")
    .data(data_predict)
       .attr("transform", function(d) { return "translate(" + xScale(d["Number of Years"]) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return models_subset.map(function(key) { return {key: key, value: d[key]}; }); })
    .transition()
    .duration(1000)
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return yScale(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return yScale(0) - yScale(d.value); })
      .attr("fill", function(d) { return colorScale(d.key); });

   //update legend
   bounds.selectAll("text.legend_text")
         .data(models_subset)
         .text(function(d) { return d; });

    //update axes
    const yAxisGenerator = d3.axisLeft()
        .scale(yScale);

    bounds.select("g#y_axis")
          .call(yAxisGenerator);
}

async function drawChart5(){
  const dataset = await d3.csv("co2_emissions.csv", d3.autoType);
  avr_miles_driven = 13500;
  car1_index = 0;
  car2_index = 2;
  drawChart4(annotate = false);
 //add selection boxes
  const dropdown_group = d3.select("#change_text")
      .append("div")
      .attr("class","dropdown_group")

  const selector1 = dropdown_group
     .append("div")
        .attr("id", "selector1")
        .attr("class", "selector")
     .append("label")
       .attr("for", "model_selector1")
       .text("Choose car model 1")
     .append("select")
       .attr("name", "model_selector1")
       .attr("id", "model_selector1")
       .on( "change", function() {
         car1_index = d3.select(this).property('value');
         updateChart( dataset );
       } );

    const options1 = selector1.selectAll("option")
       .data(dataset)
       .enter()
       .append("option")
         .text(function(d) { return d.Model; })
         .attr("value", function (d, i) { return i; });

   options1.property("selected", function (d, i) { return i == car1_index });

   const selector2 = dropdown_group.append("div")
          .attr("id", "selector2")
          .attr("class", "selector")
      .append("label")
          .attr("for", "model_selector2")
          .text("Choose car model 2")
      .append("select")
          .attr("name", "model_selector2")
          .attr("id", "model_selector2")
          .on( "change", function() {
            car2_index = d3.select(this).property('value');
            updateChart( dataset );
          } );


    const options2 = selector2.selectAll("option")
          .data(dataset)
          .enter()
          .append("option")
            .text(function(d) { return d.Model; })
            .attr("value", function (d, i) { return i; });

    options2.property("selected", function (d, i) { return i == car2_index });

  //draw slider
    d3.select("#change_text")
      .append("div")
      .attr("class", "slider_text")
      .text("How many miles per year do you drive on average?");

    const slider_group = d3.select("#change_text")
        .append("div")
        .attr("class","slider_group");

    const miles_disp = slider_group.append("div")
        .attr("id","miles_value")
        .text(`${avr_miles_driven/1000}k`);

    slider_group.append("div")
      .attr("id","miles_slider");

    const sliderMiles = d3
        .sliderHorizontal()
        .min(1)
        .max(100000)
        .default(avr_miles_driven)
        .width(200)
        .step(1)
        .tickFormat(d3.format('.2s'))
        .displayValue(false)
        .on('onchange', val => {
                  //d3.select('div#miles_value').text(d3.format(".2s")(val));
                  avr_miles_driven = +val;
                  miles_disp.text(d3.format(".2s")(avr_miles_driven));
                  updateChart(dataset);
        });

    const gSimple = d3
        .select('div#miles_slider')
        .append('svg')
        .attr('width', 400)
        .attr('height', 50)
        .append('g')
        .attr('transform', 'translate(25,15)')
        .call(sliderMiles);
}
