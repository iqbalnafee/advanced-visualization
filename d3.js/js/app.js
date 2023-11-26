

d3.json('../d3.js/json/source_code_data.json').then(
  d => drawTree(d)
);

function groupAttributesByFilename(inputData) {

  const outputData = {
    name: "data",
    children: []
  };
  
  const fileMap = {};
  
  inputData.data.forEach(item => {
    const { filename, developer, lastedit, lines } = item;
    let developers = "Developers: "+developer.join(', ');
    let lines_of_code = "Lines: "+lines.length;
    let last_edit = "Last Edit: "+lastedit;
    fileMap[filename] = {
      name: filename , 
      children: [
        { name: developers },
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


function drawTree(treeData) {
  treeData = groupAttributesByFilename(treeData);

  // Displaying the result
  console.log(treeData);
  
  let colors = ["yellow","red","purple","blue","green","orange"];
  //let colors = ["red","blue","green"];
  let radius = 5;
  // set the dimensions and margins of the diagram
  const margin = {top: 20, right: 90, bottom: 30, left: 90},
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
    .attr("height", 1200),
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


    