---
layout: post
title: "Merry Christmas Css Animation"
date: 2014-12-16 22:18:49 +0800
comments: true
categories:

- css
- animation

---

昔日一统天下的Flash继续[势微](http://www.36kr.com/p/217821.html)，但其实Web上的各种动画效果却越来越多了。今天因为一个产品需求，花了点儿时间看了一下，感觉目前CSS动画和JS动画两大门派势力都不小，之间需要有一个把大家嫁接在一起的东西：不知道[Web Animation](http://w3c.github.io/web-animations/)会不会[有机会](http://updates.html5rocks.com/2014/05/Web-Animations---element-animate-is-now-in-Chrome-36)。

纯CSS的动画实作:

<link rel="stylesheet" type="text/css" href="/downloads/static/css/christmas_animation.css" />

<script>
  function resetSvgText() {
    $('#id-text-1' ).text($('#id-text-input-1' ).val());
    $('#id-text-2' ).text($('#id-text-input-2' ).val());
  }
$('#id-btn-submit').click(function() {
  resetSvgText();
})
</script>

<div class="form-container">
  <form class="form-inline" autocomplete="off" onsubmit="return false;">
    <input id="id-text-input-1" type="text" class="input-text" placeholder="Merry">
    <input id="id-text-input-2" type="text" class="input-text" placeholder="Christmas"><br/>
    <input type="submit" onclick="javascript:resetSvgText()" id="id-btn-submit" value="给我点儿颜色看看">
  </form>
</div>

<div class="box-container">
    <svg viewBox="0 0 1400 1000">
      <symbol id="s-text">
        <text id="id-text-1" text-anchor="middle"
              x="50%"
              y="35%"
              class="text--line"
              >
          Merry
        </text>
        <text id="id-text-2" text-anchor="middle"
              x="50%"
              y="90%"
              class="text--line2"
              >
          Christmas
        </text>
      </symbol>

      <g class="g-ants">
        <use xlink:href="#s-text"
          class="text-copy"></use>
        <use xlink:href="#s-text"
          class="text-copy"></use>
        <use xlink:href="#s-text"
          class="text-copy"></use>
        <use xlink:href="#s-text"
          class="text-copy"></use>
        <use xlink:href="#s-text"
          class="text-copy"></use>
      </g>
    </svg>
</div><!-- /container -->


