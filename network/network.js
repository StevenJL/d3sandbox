queue()
  .defer(d3.csv, "nodelist.csv")
  .defer(d3.csv, "edgelist.csv")
  .await(function(error, nodes, edges) {
     createForceLayout(nodes, edges);
  });

function createForceLayout(nodes, edges) {
  var nodeHash = {};

  for (x in nodes) {
    nodeHash[nodes[x].id] = nodes[x];
  };

  for (x in edges) {
    edges[x].weight = parseInt(edges[x].weight);
    edges[x].source = nodeHash[edges[x].source];
    edges[x].target = nodeHash[edges[x].target];
  }

  var weightScale = d3.scale.linear()
    .domain(d3.extent(edges, function(d) {return d.weight;}))
    .range([.1,1]);

  function forceTick() {
    d3.selectAll("line.link")
       .attr("x1", function (d) {return d.source.x;})
       .attr("x2", function (d) {return d.target.x;})
       .attr("y1", function (d) {return d.source.y;})
       .attr("y2", function (d) {return d.target.y;});

    d3.selectAll("g.node")
      .attr("transform", function (d) {
        return "translate("+d.x+","+d.y+")";
      });
  }

 var nodeEnter = d3.select("svg").selectAll("g.node")
   .data(nodes, function (d) {return d.id})
   .enter()
   .append("g")
   .attr("class", "node"); 

  var force = d3.layout.force().charge(-1000)
   .size([500,500])
   .linkDistance(50)
   .nodes(nodes)
   .links(edges)
   .on("tick", forceTick);

  d3.select("svg").selectAll("line.link")
   .data(edges, function (d) {return d.source.id + "-" + d.target.id;})
   .enter()
   .append("line")
   .attr("class", "link")
   .style("stroke", "black")
   .style("opacity", .5)
   .style("stroke-width", function(d) {return d.weight});

  nodeEnter.append("circle")
   .attr("r", 20)
   .style("fill", "lightgray")
   .style("stroke", "black")
   .style("stroke-width", "1px");

  nodeEnter.append("text")
   .style("text-anchor", "middle")
   .attr("y", 15)
   .text(function(d) {return d.id;});

  var marker = d3.select("svg").append('defs')
    .append('marker')
    .attr("id", "Triangle")
    .attr("refX", 12)
    .attr("refY", 6)
    .attr("markerUnits", 'userSpaceOnUse')
    .attr("markerWidth", 12)
    .attr("markerHeight", 18)
    .attr("orient", 'auto')
    .append('path')
    .attr("d", 'M 0 0 12 6 0 12 3 6');

  d3.selectAll("line").attr("marker-end", "url(#Triangle)")
  force.start();
  d3.selectAll("g.node").call(force.drag());
}

