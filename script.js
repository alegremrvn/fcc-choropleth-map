let body = d3
  .select('body')

body
  .append('h1')
  .attr('id', 'title')
  .text('United States Educational Attainment')

body
  .append('h2')
  .attr('id', 'description')
  .text('Percentage of adults age 25 and older with a bachelor\'s degree or higher (2010-2014)')

let svg = d3
  .select('body')
  .append('svg')
  .attr('width', 1200)
  .attr('height', 900)

let path = d3
  .geoPath()

let dataset = new Map()
let colorScale = d3
  .scaleThreshold()
  .domain([3, 12, 21, 30, 39, 48, 57, 66])
  .range(d3.schemeGreens[9])

let legend = body
  .append('svg')
  .attr('id','legend')
  
legend
  .selectAll('rect')
  .data([3, 12, 21, 30, 39, 48, 57, 66])
  .enter()
  .append('rect')
  .style('fill', (d) => colorScale(d))

const handleMouseleave = function(event) {
  d3.selectAll("#tooltip")
    .remove()
}        

const handleMouseover = function(event) {
  d3.select(this)
    .on("mouseleave",handleMouseleave)

  const thisX = d3.select(this)
    .attr("x")

  const thisEduc = d3.select(this)
    .attr("data-education")
  
  svg.append("text")
  .attr("x",thisX)
  .attr("y",10)
  .attr("id","tooltip")
  .attr("data-education",thisEduc)
  .text(thisEduc)
}


Promise.all([
  d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'),
  d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
]).then(function (data) {
  let map = topojson.feature(data[0], data[0].objects.counties)

  for (let i = 0; i < data[1].length; i++) {
    dataset.set(+data[1][i].fips, data[1][i].bachelorsOrHigher)
  }

  svg
    .append("g")
    .selectAll("path")
    .data(map.features)
    .join("path")
    .attr("d", d3.geoPath()
    )
    .attr("fill", function (d) {
      d.total = dataset.get(d.id) || 0;
      return colorScale(d.total);
    })
    .attr('class', 'county')
    .attr('data-fips', (d) => d.id)
    .attr('data-education', (d) => dataset.get(d.id))
    .on('mouseover', handleMouseover)

})
