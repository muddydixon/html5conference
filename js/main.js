(function(){
  var width = window.innerWidth * 0.8
  , height = window.innerHeight * 0.8
  , cx = width / 2
  , cy = height / 2
  , color = d3.scale.category20();
  ;
  

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

  (function(){
    var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height])
    ;

    var svg = d3.select('#force').append('svg').attr('width', width).attr('height', height * 0.8);
    var nodes = miserables.nodes
    , links = miserables.links
    ;
    force
      .nodes(nodes)
      .links(links)
      .start();

    var link = svg.selectAll('line.link').data(links).enter()
      .append('line').attr('class', 'link')
      .style('stroke-width', function(d){ return Math.sqrt(d.value); })
      .style('stroke', function(d){ return '#CCC';})
      .style('stroke-opacity', '0.6')
    ;
    
    var node = svg.selectAll('circle.node').data(nodes).enter()
      .append('circle').attr('class', 'node')
      .attr('r', 5)
      .style('fill', function(d){return color(d.group); })
      .call(force.drag)
    ;

    force.on('tick', function(){
      link.attr('x1', function(d){return d.source.x ;})
        .attr('y1', function(d){return d.source.y ;})
        .attr('x2', function(d){return d.target.x ;})
        .attr('y2', function(d){return d.target.y ;})
      ;
      node.attr('cx', function(d){ return d.x})
        .attr('cy', function(d){ return d.y})
      ;
    });
    
  }());

  (function(){
    var data = [];
    var cnt = 10;
    var svg = d3.select('#smile')
      .append('svg')
      .attr('xmlns','http://www.w3.org/2000/svg')
      .attr('version','1.1')
      .attr('width', width)
      .attr('height', height * 0.8)
    ;

    var duration = 500;
    setInterval(function(){
      data.push({size: 0|Math.random() * 500, x: 0|Math.random() * width, y: 0|Math.random() * height, rad: 0|Math.random() * 360});
      svg.data(data).enter();
      
      var smile = svg.append('g').attr('class', 'smile')
        .attr('transform', 'translate('+(width / 2)+','+(height / 2)+ ') rotate('+0+') scale(0.2)');
      smile.append('circle').attr('class', 'face')
        .attr('r', function(d){ return d.size;})
        .attr('fill', 'white')
        .attr('stroke', 'orange')
        .attr('stroke-width', function(d){ return d.size * 0.03})
      ;
      smile.append('circle').attr('class', 'left-eye')
        .attr('r', function(d){ return d.size / 10})
        .attr('transform', function(d){ return 'translate('+(d.size * 0.4)+', '+(-d.size * 0.4)+')';})
        .attr('fill', 'orange');
      smile.append('circle').attr('class', 'right-eye')
        .attr('r', function(d){ return d.size / 10})
        .attr('transform', function(d){ return 'translate('+(-d.size * 0.4)+', '+(-d.size * 0.4)+')';})
        .attr('fill', 'orange');
      smile.append('path').attr('class', 'mouth')
        .attr('d', function(d){ return 'm-'+(d.size * 0.6)+',0 a'+(d.size * 0.6)+','+(d.size * 0.6)+' 1 1,0 '+(d.size * 1.2)+',0'})
        .attr('fill', 'none')
        .attr('stroke', 'orange')
        .attr('stroke-width', function(d){ return d.size * 0.03});
      smile.transition()
        .duration(duration)
        .ease('linear')
        .attr('transform', function(d){ return 'translate('+((d.x - cx) / 2 + cx)+','+((d.y - cy) / 2 + cy)+') rotate('+d.rad+')'; })
      ;    
      smile.transition()
        .duration(duration)
        .ease('linear')
        .delay(duration)
        .attr('transform', function(d){ return 'translate('+d.x+','+d.y + ') rotate('+d.rad+') scale(0)'; })
        .each('end', function(){data.shift();})
          .remove()
      ;
    }, 100);
  }());
                                    
                                    
  
}());