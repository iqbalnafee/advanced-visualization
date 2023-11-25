

const canva = d3.select('.canva');
nestedTree([]);


// d3.json('../d3.js/json/source_code_data.json').then(
//     d => nestedTree(d.data)
// );

function nestedTree(datum){

  let sampleData = [
    {site:"Good Marketing Club",
      category:"Visualization",
      essay:"HOW INCLUSIVE ARE MAKEUP BRANDS?",
      link:"https://www.goodmarketing.club/visualization/how-inclusive-are-makeup-brands"
      },
      {site:"Good Marketing Club",
      category:"Visualization",
      essay:"fgf1",
      link:"ghg2"
      },
      {site:"aa",
      category:"bb",
      essay:"cc",
      link:"ff"
      },
      {site:"aa",
      category:"bb",
      essay:"gggg",
      link:"ffkkk"
      }
  ];

  let nestedData = d3.nest()
  .key(d => d.site)
  .key(d => d.category)
  .entries(sampleData);


  //const nestedData = d3.groups(datum, d => d.filename); 
  let treeData = d3.hierarchy(nestedData[0], d => d.values);
  console.log(treeData);
  let treeLayout = d3.tree().size([600,500]);
  treeLayout(treeData);
  let parentsNumber = 10;
  let treeNodes = d3.select("svg g.nodes");

  //parent nodes as circle
  treeNodes.selectAll("circle")
           .data(treeData.descendants())
           .enter()
           .append("circle")
           .attr("class","circle")
           .attr("transform", d => `translate(${d.y},${d.x})`)
           .attr("r",8)
           .attr("fill","red");

  //children nodes as rectangle
  // treeNodes.selectAll("rect")
  //           .data(treeData.descendants().slice(0, parentsNumber))
  //           .enter()
  //           .append("rect")
  //           .attr("class","rect")
  //           .attr("transform", d => `translate(${d.y},${d.x})`)
  //           .attr("width",d => ((d.data.essay + " ").length+4)*9)
  //           .attr("height",25)
  //           .attr("y",-25/2);

  //links between nodes
  treeNodes.select(".links")
            .selectAll("line")
            .data(treeData.links())
            .enter()
            .append("path")
            .classed("link",true)
            .attr("d", function(d) { 
              return "M" + d.target.y + "," + d.target.x
                    + "C" + (d.source.y + 100) + "," + d.target.x
                    + " " + (d.source.y + 100) + "," + d.source.x
                    + " " + d.source.y + "," + d.source.x
            });
            
  
}

function drawTree(data){
    const width = 928;

    // Compute the tree height; this approach will allow the height of the
    // SVG to scale according to the breadth (width) of the tree layout.
    const root = d3.hierarchy(data);
    const dx = 10;
    const dy = width / (root.height + 1);
  
    // Create a tree layout.
    const tree = d3.tree().nodeSize([dx, dy]);
  
    // Sort the tree and apply the layout.
    root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
    tree(root);
  
    // Compute the extent of the tree. Note that x and y are swapped here
    // because in the tree layout, x is the breadth, but when displayed, the
    // tree extends right rather than down.
    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });
  
    // Compute the adjusted height of the tree.
    const height = x1 - x0 + dx * 2;
  
    
  
    const svg = canva.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-dy / 3, x0 - dx, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
  
    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
      .selectAll()
        .data(root.links())
        .join("path")
          .attr("d", d3.linkHorizontal()
              .x(d => d.y)
              .y(d => d.x));
    
    const node = svg.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
      .selectAll()
      .data(root.descendants())
      .join("g")
        .attr("transform", d => `translate(${d.y},${d.x})`);
  
    node.append("circle")
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 2.5);
  
    node.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.children ? -6 : 6)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name)
      .clone(true).lower()
        .attr("stroke", "white");
}