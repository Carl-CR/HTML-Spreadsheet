// YOUR CODE GOES HERE

//Edited the getgrade function to check for values from 100
function getGrade(mark) {
    if (mark < 50.0) {
        return 'F';
    } else if (mark < 60.0) {
        return 'D';
    } else if (mark < 70.0) {
        return 'C';
    } else if (mark < 80.0) {
        return 'B';
    } else {
        return 'A';
    }
}

function getFrequencies(marks) {
    const frequencies = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0};
    const total = marks.length;

    // Count the frequency of each grade
    for (let i = 0; i < total; i++) {
      const grade = getGrade(marks[i]);
      frequencies[grade]++;
    }
  
    //Setting it to a value between 0 - 1
    for (const grade in frequencies) {
      frequencies[grade] /= total;
    }
  
    // Return the occurrences of each grade as a dictionary
    return frequencies;
}

function createChart(marks){
    //To replace the previous chart with the latest chart
    d3.select("#chart svg").remove();

    const width = 400; 
    const height = 300; 
    const margin = 50;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;


    const colourScale = d3.scaleLinear()
                            .domain([978, 2188])
                            .range(['red', 'blue']); 
    
    const xScale = d3.scaleBand()
                        .domain(Object.keys(marks))
                        .range([0, chartWidth])
                        .padding(0.3);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(marks))])
        .range([chartHeight, 0]);
    
    let svg = d3.select("#chart")
        .append('svg')
            .attr('width', width)
            .attr('height', height)

    // title
    svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin)
            .attr('text-anchor', 'middle')
            .text('Grade Distribution');

    // Append x axis title
    svg.append("text")
        .attr("class", "x-axis-title")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - margin / 2)
        .text("Grade");

    // Append y axis title
    svg.append("text")
        .attr("class", "y-axis-title")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2)
        .attr("y", margin / 2)
        .attr("transform", "rotate(-90)")
        .text("Frequency(%)");

    let g = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

    g.append('g')
        .call(d3.axisLeft(yScale)); 

    g.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale));
    
    g.selectAll('rect')
        .data(Object.entries(marks))
        .enter()
            .append('rect')
                .attr('x', (data) => xScale(data[0]))
                .attr('y', (data) => yScale(data[1]))
                .attr('width', xScale.bandwidth())
                .attr('height', (data) => chartHeight - yScale(data[1]))
                .attr('fill', (data) => colourScale(data[1]))
}
