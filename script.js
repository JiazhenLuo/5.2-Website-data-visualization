const svg = d3.select('svg');
const svgContainer = d3.select('#container');

const margin = 80;
const width = 1500 - 2 * margin;
const height = 600 - 2 * margin;

const chart = svg.append('g')
      .attr('transform', `translate(${margin}, ${margin})`);

d3.csv('https://data.cityofnewyork.us/resource/ia2d-e54m.csv')
    .then(function(Mydata){
        console.log(Mydata)
       
        const xScale = d3.scaleBand()
      .range([0, width])
      .domain(Mydata.map((s) => s.year))
      .padding(0.3)
    
    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([900, 1600]);

    const makeYLines = () => d3.axisLeft()
      .scale(yScale)

    chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('class', 'axisNum')

    chart.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('class', 'axisNum')

    chart.append('g')
      .attr('class', 'grid')
      .call(makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat('')
      )

      const barGroups = chart.selectAll()
    .data(Mydata)
    .enter()
    .append('g')
    .attr('class','bar')
    
    barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.year))
    .attr('y', (g) => yScale(g.nyc_consumption_million_gallons_per_day))
    .attr('height', (g) => height - yScale(g.nyc_consumption_million_gallons_per_day))
    .attr('width', xScale.bandwidth())
    .attr('fill', '#5b085e')
    // mouse over interaction
    .on('mouseenter', function (actual, i) {
      d3.selectAll('.nyc_consumption_million_gallons_per_day')
        .attr('opacity', 0)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.6)
        .attr('x', (a) => xScale(a.year) - 5)
        .attr('width', xScale.bandwidth() + 10)

      const y = yScale(actual.nyc_consumption_million_gallons_per_day)

    //   let line = chart.append('line')
    //     .attr('id', 'limit')
    //     .attr('x1', 0)
    //     .attr('y1', y)
    //     .attr('x2', width)
    //     .attr('y2', y)

      barGroups.append('text')
        .attr('class','axisdata' )
        .attr('x', (a) => xScale(a.year) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.nyc_consumption_million_gallons_per_day))
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        // .text((a, idx) => {
        //   const divergence = (a.nyc_consumption_million_gallons_per_day - actual.nyc_consumption_million_gallons_per_day).toFixed(1)
          
        //   let text = ''
        //   if (divergence > 0) text += '+'
        //   text += `${divergence}%`

        //   return idx !== i ? text : '';
        // })

    })
    // mouse leave interaction
    .on('mouseleave', function () {
      d3.selectAll('.nyc_consumption_million_gallons_per_day')
        .attr('opacity', 1)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 1)
        .attr('x', (a) => xScale(a.year))
        .attr('width', xScale.bandwidth())

      chart.selectAll('#limit').remove()
    //   chart.selectAll('.divergence').remove()
    })



// append % text on the bars
barGroups 
    .append('text')
    .attr('class', 'nyc_consumption_million_gallons_per_day')
    .attr('x', (a) => xScale(a.year) + xScale.bandwidth() / 2)
    .attr('y', (a) => yScale(a.nyc_consumption_million_gallons_per_day)-6)
    .attr('text-anchor', 'middle')
    .text((a) => `${a.nyc_consumption_million_gallons_per_day} `)

    svg.append('text')
      .attr('class', 'label')
      .attr('x', -(height / 2) - margin)
      .attr('y', margin / 2.4-10)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text('nyc_consumption_million_gallons_per_day')

    svg.append('text')
      .attr('class', 'label')
      .attr('x', width / 2 + margin)
      .attr('y', height + margin * 1.7)
      .attr('text-anchor', 'middle')
      .text('year')

    svg.append('text')
      .attr('class', 'title')
      .attr('x', width / 2 + margin)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text('Water Consumption in the City of New York')

    svg.append('text')
      .attr('class', 'source')
      .attr('x', width - margin / 2 - 300)
      .attr('y', height + margin * 1.7)
      .attr('text-anchor', 'start')
      .text('Department of Environmental Protection (DEP)')
    })



    