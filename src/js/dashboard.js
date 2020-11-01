const printLatest = () => {
  console.log(localStorage);
  console.log(getChartData());
};

const start = () => {
  const data = getChartData();
  const subgroups = ["A", "B", "C", "D"];

  displayCharts(data, subgroups);
};

const getChartData = () => {
  let data = [];
  Object.entries(localStorage).forEach((entry) => {
    data.push({
      date: entry[0],
      A: getTotalHoursForProject(entry[0], "Project A"),
      B: getTotalHoursForProject(entry[0], "Project B"),
      C: getTotalHoursForProject(entry[0], "Project C"),
      D: getTotalHoursForProject(entry[0], "Project D"),
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

const getTotalHoursForProject = (date, project) => {
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

const displayCharts = (data, subgroups) => {
  // Set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 20, left: 50 },
    width = 760 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Append the svg object to the body of the page
  var svg = d3
    .select("#bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // List of groups on the X axis
  var groups = d3
    .map(data, function (d) {
      return d.date;
    })
    .keys();

  // Add X axis
  var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  var y = d3.scaleLinear().domain([0, 60]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // One color per subgroup
  var color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(["#e41a1c", "#377eb8", "#4daf4a", "yellow"]);

  // Stack data per subgroup
  var stackedData = d3.stack().keys(subgroups)(data);

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
