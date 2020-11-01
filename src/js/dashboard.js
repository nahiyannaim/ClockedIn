const chartProjectColours = ["#e41a1c", "#377eb8", "#4daf4a", "yellow"];

const subgroups = ["A", "B", "C", "D"];

const printLatest = () => {
  console.log(localStorage);
  console.log(getChartData());
};

const start = () => {
  displayBarChart(getChartData());
  displayDonutChart({
    A: getTotalProjectHours("Project A"),
    B: getTotalProjectHours("Project B"),
    C: getTotalProjectHours("Project C"),
    D: getTotalProjectHours("Project D"),
  });
};

const getChartData = () => {
  let data = [];
  Object.entries(localStorage).forEach((entry) => {
    data.push({
      date: entry[0],
      A: getProjectHoursForDate(entry[0], "Project A"),
      B: getProjectHoursForDate(entry[0], "Project B"),
      C: getProjectHoursForDate(entry[0], "Project C"),
      D: getProjectHoursForDate(entry[0], "Project D"),
    });
  });

  return data;
};

const getTotalTime = (start, end) => {
  const hourDiff = Number(end.split(":")[0]) - Number(start.split(":")[0]);
  const minDiff =
    (Number(end.split(":")[1]) - Number(start.split(":")[1])) / 60;

  return hourDiff + minDiff;
};

const getProjectHoursForDate = (date, project) => {
  let hours = 0;

  JSON.parse(localStorage.getItem(date)).taskList.forEach((task) => {
    if (task.project === project) {
      hours += getTotalTime(task.start, task.end);
    }
  });

  if (hours < 0) {
    hours = 0;
  }

  return hours.toString();
};

const getTotalProjectHours = (project) => {
  let hours = 0;

  Object.entries(localStorage).forEach((entry) => {
    JSON.parse(entry[1]).taskList.forEach((task) => {
      if (task.project === project) {
        hours += getTotalTime(task.start, task.end);
      }
    });
  });

  if (hours < 0) {
    hours = 0;
  }

  return hours.toString();
};

const displayBarChart = (data) => {
  // Set the dimensions and margins of the graph
  let margin = { top: 10, right: 30, bottom: 20, left: 50 },
    width = 760 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Append the svg object to the body of the page
  let svg = d3
    .select("#bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // List of groups on the X axis
  let groups = d3
    .map(data, function (d) {
      return d.date;
    })
    .keys();

  // Add X axis
  let x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  let y = d3.scaleLinear().domain([0, 60]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // One color per subgroup
  let color = d3.scaleOrdinal().domain(subgroups).range(chartProjectColours);

  // Stack data per subgroup
  let stackedData = d3.stack().keys(subgroups)(data);

  // Display the bars
  svg
    .append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", function (d) {
      return color(d.key);
    })
    .style("opacity", 0.75)
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function (d) {
      return d;
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.data.date);
    })
    .attr("y", function (d) {
      return y(d[1]);
    })
    .attr("height", function (d) {
      return y(d[0]) - y(d[1]);
    })
    .attr("width", x.bandwidth());
};

const displayDonutChart = (data) => {
  // Dimensions and margins of the graph
  let width = 750;
  height = 450;
  margin = 40;

  // The radius of the pieplot is half the width or half the height of smallest one
  let radius = Math.min(width, height) / 2 - margin;

  // Append the svg object to the div
  let svg = d3
    .select("#donut-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // Set color scale
  let color = d3.scaleOrdinal().domain(subgroups).range(chartProjectColours);

  // Compute the position of each group on the pie:
  let pie = d3
    .pie()
    .sort(null) // Do not sort group by size
    .value(function (d) {
      return d.value;
    });
  let data_ready = pie(d3.entries(data));

  // Generate arc
  let arc = d3
    .arc()
    .innerRadius(radius * 0.5) // Size of the donut hole
    .outerRadius(radius * 0.8);

  // Another arc for labels positioning
  let outerArc = d3
    .arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  // Build the pie chart, each part of the pie is a path that is built using the arc function.
  svg
    .selectAll("allSlices")
    .data(data_ready)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", function (d) {
      return color(d.data.key);
    })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.75);

  // Polylines between chart and labels
  svg
    .selectAll("allPolylines")
    .data(data_ready)
    .enter()
    .append("polyline")
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr("points", function (d) {
      let posA = arc.centroid(d);
      let posB = outerArc.centroid(d);
      let posC = outerArc.centroid(d);
      let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
      return [posA, posB, posC];
    });

  // Polylines between chart and labels
  svg
    .selectAll("allLabels")
    .data(data_ready)
    .enter()
    .append("text")
    .text(function (d) {
      return `${Math.round(d.value)} Hours`;
    })
    .attr("transform", function (d) {
      let pos = outerArc.centroid(d);
      let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      return "translate(" + pos + ")";
    })
    .style("text-anchor", function (d) {
      let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      return midangle < Math.PI ? "start" : "end";
    });
};
