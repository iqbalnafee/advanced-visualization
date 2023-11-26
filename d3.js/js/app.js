const colors = ["yellow","red","purple","blue","green","orange"];
const radius = 5;

d3.json('../d3.js/json/source_code_data.json').then(
//d3.json('../d3.js/json/json_data.json').then(
  ///d => drawHorizontalTree(d)
  d => drawVerticalTree(d)
);

function groupAttributesByFilename(inputData) {

  const outputData = {
    name: "data",
    children: []
  };
  
  const fileMap = {};
  
  inputData.data.forEach(item => {

    devData = [];
    const { filename, developer, lastedit, lines } = item;
    console.log(developer);
    developer.forEach((dev) => {
      devData.push({name:dev});
    });

    let lines_of_code = "Lines: "+lines.length;
    let last_edit = "Last Edit: "+lastedit;
    fileMap[filename] = {
      name: filename , 
      children: [
        { children: devData },
        { name: lines_of_code},
        { name: last_edit }
      ]
    };
    
  });
  
  Object.values(fileMap).forEach(file => {
    outputData.children.push(file);
  });
  
  return outputData;
}


function drawHorizontalTree(treeData) {
  treeData = groupAttributesByFilename(treeData);

  // Displaying the result
  console.log(treeData);

  // set the dimensions and margins of the diagram
  const margin = {top: 20, right: 90, bottom: 30, left: 90};
  width  = 900 - margin.left - margin.right,
  height = 900 - margin.top - margin.bottom;

  // declares a tree layout and assigns the size
  const treemap = d3.tree().size([height, width]);

  //  assigns the data to a hierarchy using parent-child relationships
  let nodes = d3.hierarchy(treeData, d => d.children);

  // maps the node data to the tree layout
  nodes = treemap(nodes);

  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  const svg = d3.select("body").append("svg")
    .attr("width", 1200)
    .attr("height", 1200);
  g = svg.append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  // adds the links between the nodes
  const link = g.selectAll(".link")
  .data( nodes.descendants().slice(1))
  .enter().append("path")
  .attr("class", "link")
  .style("stroke", (d,i) => colors[i%colors.length])
  .attr("d", d => {
  return "M" + d.y + "," + d.x
    + "C" + (d.y + d.parent.y) / 2 + "," + d.x
    + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
    + " " + d.parent.y + "," + d.parent.x;
  });

  // adds each node as a group
  const node = g.selectAll(".node")
  .data(nodes.descendants())
  .enter().append("g")
  .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
  .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

  // adds the circle to the node
  node.append("circle")
  .attr("r", radius)
  .style("stroke", (d,i) => colors[i%colors.length])
  .style("fill", (d,i) => colors[i%colors.length]);

  // adds the text to the node
  node.append("text")
  .attr("dy", ".35em")
  .attr("x", d => d.children ? (radius + 15) * -1 : radius + 15)
  .attr("y", d => d.children && d.depth !== 0 ? -(radius + 15) : d)
  .style("text-anchor", d => d.children ? "end" : "start")
  .text(d => d.data.name);
}

function drawVerticalTree(data){

  data = groupAttributesByFilename(data);
  console.log(data);
  const { innerWidth, innerHeight } = window;
  const w = innerWidth * 0.9;
  const h = innerHeight * 0.9;
  const svg = d3.select("body").append("svg")
  .attr("height", h)
  .attr("width", w);


  const margin = 40;
  const width = w - 2 * margin;
  const height = h - 2 * margin;


  const tree = d3.tree().size([width , height]);

  const root = tree(d3.hierarchy(data));

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  const link = d3
    .linkVertical()
    .x(d => d.x)
    .y(d => d.y);

  g.selectAll("path")
    .data(root.links())
    .enter()
    .append("path")
    .attr("d", d => {
      return link({ source: d.source, target: d.source });
    })
    .style("fill", "none")
    .style("stroke", (d,i) => colors[i%colors.length])
    .transition()
    .attr("d", d => {
      return link(d);
    })
    .delay(d => {
      return 500 + 2000 * d.source.depth;
    })
    .duration(2000);

  g.selectAll("circle")
    .data(root.descendants())
    .enter()
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => {
      return 10 + 3 * d.height;
    })
    .attr("fill", "transparent")
    .transition()
    .attr("fill", (d,i) => colors[i%colors.length])
    .delay(d => {
      return 500 + 2000 * d.depth;
    })
    .duration(2000);


    g.selectAll("text")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("x", d => d.x - 20)
      .attr("y", d => d.y + 20)
      .text(d => d.data.name)
      .attr("font-family", "Monospace")
      .attr("font-weight", "bold")
      .attr("font-size", "20px")
      .attr("fill", "transparent")
      .transition()
      .attr("fill", "#000")
      .delay(d => {
        return 500 + 2000 * d.depth;
      })
      .duration(2000);

}


    