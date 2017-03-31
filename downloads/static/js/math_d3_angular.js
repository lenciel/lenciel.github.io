var app = angular.module('app', [])
app.controller('MainCtrl', function($scope, $window){
  $scope.selectedShape = null
  $scope.highlight = function(points, shape){
    $scope.selectedShape = { points: points, shape: shape }
  }
  function updat_dims(){  }
  angular.element($window).on('resize', function(){
    $scope.$apply(function(){ rescale_panels() })
  })
  $scope.styles = { panel1: {}, panel2: {}, content: {} }
  var w, h
  function rescale_panels(){
    w = $scope.w = $window.innerWidth, h = $scope.h = $window.innerHeight
    var p1 = $scope.styles.panel1, p2 = $scope.styles.panel2, content = $scope.styles.content
    if(w > 650)
      content.height = 600,
      p1.width = 40 + '%',
      p1.height = 600,
      p2.width = 60 + '%',
      p2.height = 800,
      p1.left = 0,
      p2.right = 0,
      delete p2.bottom
    else
      content.height = 1300,
      p1.width = 100 + '%',
      p1.height = 350,
      p2.width = 100 + '%',
      p2.height = 1200

    var fontSize
    if(w < 300){
      fontSize = 10
    }else {
      fontSize = 16
    }
    $scope.styles.content.fontSize = fontSize + 'px'
  }
  $scope.init = function(){
    rescale_panels()
  }
})

var v_add = function(a, b){ return { x: a.x + b.x, y: a.y + b.y } }
var v_perp = function(a){ return { x: -a.y , y: a.x } }
var v_scale = function(a, l){ return { x: a.x * l, y : a.y * l } }
var v_minus = function(b, a){ return { x: b.x - a.x, y: b.y - a.y } }
var v_normal = function(a, b){ var v = v_minus(b, a); return v_perp(v) }
var v_length = function(a){ return Math.sqrt(a.x * a.x + a.y * a.y) }
var v_unit = function(a){ var l = v_length(a); return { x: a.x / l, y: a.y / l } }
var v_avg = function(points){
  var x = 0, y = 0; points.forEach(function(p){ x += p.x, y += p.y })
  return { x: x / points.length, y: y / points.length }
}
var ray_intersect = function(as, ad, bs, bd){
  var dx = bs.x - as.x
  var dy = bs.y - as.y
  var det = bd.x * ad.y - bd.y * ad.x
  if(det === 0) return null
  var u = (dy * bd.x - dx * bd.y) / det
  var v = (dy * ad.x - dx * ad.y) / det
  return { x: as.x + ad.x * u, y: as.y + ad.y * u }
}
var v_set = function(a, b){ a.x = b.x, a.y = b.y; return a }
var v_to_a = function(v){ return [ v.x, v.y ] }

app.directive('co', function(){
  var prev
  function link(scope, el, attr){
    el = d3.select(el[0])
    var points = attr.points, shape = attr.shape
    el.on('mouseover', function(){
      scope.$apply(function(){
        if(prev) prev.classed('active', false)
        scope.highlight(points, shape)
        el.classed('active', true)
        prev = el
      })
    })
  }
  return {
    link: link, restrict: 'E'
  }
})

app.directive('stage', function(){
  function link(scope, el, attr){
    el = el[0]
    var w, h, svg = d3.select(el).append('svg')
      , tw = 100, th = 100
      , root_center = svg.append('g')
      , root = root_center.append('g') // scaled root
      , pa = { x: 0, y: 0, name: 'a' }
      , pb = { x: 0, y: -th, name: 'b' }
      , pc = { x: tw, y: 0, name: 'c' }
      , pg = { x: 0, y: 0, name: 'g' }
      , pf = { x: 0, y: 0, name: 'f' }
      , ph = { x: 0, y: 0, name: 'h' }
      , pk = { x: 0, y: 0, name: 'k' }
      , pe = { x: 0, y: 0, name: 'e' }
      , pd = { x: 0, y: 0, name: 'd' }
      , pl = { x: 0, y: 0, name: 'l' }
      , pv = { x: 0, y: 0, name: 'v' }
      , points = [pa, pb, pc, pg, pf, ph, pk, pe, pd, pl]
      , lines = [ [pa, pd], [pa, pe], [pc, pg], [pf, pc], [pk, pb], [pa, pl] ]
      , p = { a: pa, b: pb, c: pc, g: pg, f: pf, h: ph, k: pk, e: pe, d: pd, l: pl, v: pv }
      , bc = [pb, pc]
      , ca = [pa, pb]
      , ab = [pc, pa]
      , drag =  d3.behavior.drag()
      , triangle = root.append('path').datum([pa, pb, pc]).attr('class', 'triangle')
      , highlights = root.append('g').attr('class', 'highlights')

    window.a = pa, window.b = pb, window.c = pc

    el.ontouchmove = function(event){ event.preventDefault() }

    root.attr('transform', 'scale(0.5) rotate(-45)')
      .style('opacity', 0)
      .transition().duration(2000)
      .style('opacity', 1)
      .attr('transform', 'scale(1) rotate(0)')

    function update_points(){
      // the control points, a, b, or c, where changed. update the rest in
      // response
      var points = get_square_points(bc)
      v_set(pe, points[2])
      v_set(pd, points[3])

      points = get_square_points(ca)
      v_set(pf, points[2])
      v_set(pg, points[3])

      points = get_square_points(ab)
      v_set(ph, points[2])
      v_set(pk, points[3])

      // find pl
      var n_u = v_unit(v_minus(pd, pb))
      var n = ray_intersect(pa, n_u, pd, v_minus(pd, pe))
      if(n) v_set(pl, n)
      n = ray_intersect(pa, n_u, pb, v_minus(pb, pc))
      if(n) v_set(pv, n)
    }

    function redraw_triangle(){
      triangle.attr('d', function(d){ return 'M' + d.map(v_to_a).join('L') + 'Z' })
    }

    var square_a = root.append('path').attr('class', 'square').datum(bc)
      .call(redraw_square)

    var square_b = root.append('path').attr('class', 'square').datum(ca)
      .call(redraw_square)

    var square_c = root.append('path').attr('class', 'square').datum(ab)
      .call(redraw_square)

    function get_square_points(edge){
      var n = v_unit(v_normal.apply(null, edge))
      var l = v_length(v_minus(edge[1], edge[0]))
      var p1 = edge[0], p2 = edge[1]
        , p3 = v_add(p2, v_scale(n, -l))
        , p4 = v_add(p1, v_scale(n, -l))
      return [p1, p2, p3, p4]
    }

    function redraw_square(square){
      var points = get_square_points(square.datum())
      square.attr('d', function(d){
        return 'M' + points.map(v_to_a).join('L') + 'Z'
      })
    }

    var lines_g = root.append('g').attr('class', 'lines')
      .selectAll('path').data(lines).enter().append('path')

    var sides = root.selectAll('path.side')
      .data([bc, ca, ab]).enter().append('path')
      .attr('class', 'side')

    var edge_labels = root.selectAll('g.edge-label')
      .data([ bc, ca, ab ]).enter().append('g')
      .attr('class', 'edge-label')
    // edge_labels.append('text')
      // .text(function(d, i){ return ['A', 'B', 'C'][i] }).attr('y', 5)

    var points_g = root.selectAll('g.point')
      .data(points).enter().append('g')
      .attr('class', 'point')
    points_g.append('circle').attr('r', 7)
    points_g.append('text')
      .text(function(d, i){ return d.name.toUpperCase() }).attr('y', 4)
    points_g.call(drag)

    function redraw_edge_labels(){
      edge_labels.attr('transform', function(d){
        var p1 = d[0], p2 = d[1]
        var n = v_unit(v_normal(p1, p2))
        var p = v_avg([p1, p2])
        n = v_scale(n, -20)
        p = v_add(p, n)
        return 'translate(' + v_to_a(p) + ')'
      })
    }
    drag.on('drag', function(d){
      var m = d3.mouse(root.node())
      if(d === pb){ d.y = m[1]; if(d.y > -10) d.y = -10 }
      else if(d === pc){ d.x = m[0]; if(d.x < 10) d.x = 10 }
      redraw()
      remove_drag_hints()
    })
    function redraw_points(){
      points_g.attr('transform', function(d){
        return 'translate(' + [d.x, d.y] + ')'
      })
    }
    function redraw_sides(){
      sides.attr('d', function(d){
        return 'M' + d.map(v_to_a).join('L') + 'Z'
      })
    }
    function redraw_lines(){
      lines_g.attr('d', function(d){
        return 'M' + d.map(v_to_a).join('L') + 'Z'
      })
    }

    function redraw(){
      update_points()
      redraw_points()
      redraw_sides()
      redraw_edge_labels()
      redraw_triangle()
      redraw_square(square_a)
      redraw_square(square_b)
      redraw_square(square_c)
      redraw_highlight(false)
      redraw_lines()
    }
    function resize(){
      svg.attr({width: w, height: h})
      root_center.attr('transform', 'translate(' + [w/2 - tw/2, h/2 + th/2] + ')')
      redraw()
    }
    scope.$watch(function(){
      return w = el.clientWidth, h = el.clientHeight, w * h
    }, resize)

    scope.$watch('selectedShape', function(shape){
      redraw_highlight()
      if(shape) remove_drag_hints()
    })

    function redraw_highlight(anim){
      if(anim === undefined) anim = true
      var sh = scope.selectedShape, closed = false
      if(!sh){
        highlight.style('opacity', 0)
        points_g.classed('active', false)
          .attr('transform', function(d){
            return 'translate(' + [d.x, d.y] + ')'
          })
        return
      }
      var points = sh.points.split('')
      if(sh.shape === 'square' || sh.shape === 'triangle') closed = true
      if(closed) points.push(points[0])
      points = points.map(function(n){ return p[n] })

      highlight.attr('d', 'M' + points.map(v_to_a).join('L'))
        .classed('closed', closed)
        .style('opacity', 0)
        .style('stroke-width', 0)
        .transition()
        .style('opacity', 1)
        .style('stroke-width', 10)

      var g = points_g
        .each(function(d){ d.active = (points.indexOf(d) !== -1) })
        .classed('active', function(d){ return d.active })
      if(anim) g = g.transition()
      g.attr('transform', function(d){
        return 'translate(' + [d.x, d.y] + ') scale(' + (d.active ? 1.5 : 1) + ')'
      })
    }

    var highlight = highlights.append('path').attr('class', 'highlight')

    var points_ab = points_g
      .filter(function(d){ return d === pb || d === pc })


    points_ab.append('circle').attr('r', 20).attr('class', 'handle')

    var dragHints = points_ab.append('g').attr('class', 'drag-hint')
    dragHints
      .append('path').attr('d', d3.svg.arc()({
        startAngle: -Math.PI, endAngle: Math.PI, innerRadius: 10, outerRadius: 15
      }))
    dragHints.attr('transform', 'scale(1)')

    function loop_pulse(sel){
      return sel
        .attr('transform', 'scale(0.5)')
        .style('opacity', 1)
        .transition()
        .duration(2000)
        .ease('linear')
        .attr('transform', 'scale(2)')
        .style('opacity', 0)
        .each('end', function(){ loop_pulse(d3.select(this)) })
    }
    dragHints.call(loop_pulse)
    dragHints.on('mouseover', remove_drag_hints)

    function remove_drag_hints(){
      dragHints.transition().duration(0).each('end', null)
      dragHints.transition().style('opacity', 0)
        .remove()
    }

  }
  return {
    link: link, restrict: 'E'
    , scope: { selectedShape: '='}
  }
})
