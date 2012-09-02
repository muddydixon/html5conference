(function(){
  var width = 1100
  , height = 550
  , color = d3.scale.category20c();

  (function(){
    var cluster = d3.layout.cluster().size([height - 100, width - 200]);
    var nodes = cluster.nodes(flare);
    var diagonal = d3.svg.diagonal().projection(function(d){return [d.y, d.x]; });

    var vis = d3.select('#cluster').append('svg').attr('width', width).attr('height', height).append('g').attr('transform', 'translate(40, 40)');
    var link = vis.selectAll('path.link').data(cluster.links(nodes))
      .enter().append('path').attr('class', 'link').attr('d', diagonal);
    link.on('mouseover', function(d){ d3.select(this).attr('class', 'link hover');})
      .on('mouseout', function(d){ d3.select(this).attr('class', 'link'); });
    
    var node = vis.selectAll('g.node').data(nodes).enter().append('g').attr('class', 'node').attr('transform', function(d){ return 'translate('+d.y+','+d.x+')';});
    node.append('circle').attr('r', 4.5);
    node.append('text').attr('dx', function(d){return d.children ? -8 : 8; }).attr('dy', function(d){ return d.children ? 15 : 0; }).attr('text.anchor', function(d){ return d.children ? 'end' : 'start'; }).text(function(d){return d.name; });
    node.on('mouseover', function(d){ d3.select(this).attr('class', 'node hover'); })
      .on('mouseout', function(d){ d3.select(this).attr('class', 'node'); });

  }());
                                    
  (function(){
    var treemap = d3.layout.treemap()
      .sticky(true)
      .size([width, height])
      .value(function(d){return d.size;});
    
    var nodes = treemap.nodes(flare);

    var cell = function(){
      this
        .style('left', function(d){ return d.x + 'px';})
        .style('top', function(d){ return d.y + 'px';})
        .style('width', function(d){ return Math.max(0, d.dx -1) + 'px';})
        .style('height', function(d){ return Math.max(0, d.dy -1) + 'px';});
    };

    var vis = d3
      .select('#treemap')
      .append('div')
      .style('position', 'relative')
      .style('width', width + 'px')
      .style('height', height + 'px');
    
    var node = vis.selectAll('div.cell')
      .data(nodes)
    .enter()
      .append('div')
      .attr('class', 'cell')
      .style('background', function(d){return d.children ? color(d.name): null})
      .call(cell)
      .text(function(d){return d.children ? null: d.name;});
    node.on('mouseover', function(d){ d3.select(this).attr('class', 'cell hover'); })
      .on('mouseout', function(d){ d3.select(this).attr('class', 'cell'); });
  }());
                                    
                                    
  
}());