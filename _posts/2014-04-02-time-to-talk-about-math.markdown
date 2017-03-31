---
layout: post
title: "勾股定理"
date: 2014-04-02 14:30
comments: true
categories:
- angular
- d3
- octopress
---

这篇日志主要是想试试:

* 怎么把`d3.js`和`AngularJS`集成到[octopress](http://lenciel.com/2013/03/blog-with-octopress-and-github-pages/)，因为[setosa](http://vudlab.com/bart/)很酷
* 怎么在某篇日志里面支持specific的js和css

玩了一下并不是很麻烦，于是这个静态站点可以干的事情就"动态"多了。比如把课本里面的[勾股定理](http://aleph0.clarku.edu/~djoyce/java/elements/bookI/propI47.html)通过画图证明一下(点击黑色背景字母有彩蛋)：

<link rel="stylesheet" type="text/css" href="/downloads/static/css/math_d3_angular.css">
<script src="/downloads/static/js/d3.min.js" charset="utf-8"></script>
<script src="/downloads/static/js/angular.min.js" charset="utf-8"></script>
<script src="/downloads/static/js/math_d3_angular.js" charset="utf-8"></script>

<div class="main-content" ng-app="app" ng-controller="MainCtrl" ng-style="styles.content" ng-class="{ sm : w < 650 }" ng-init="init()">
    <div id="panel1" class="panel" ng-style="styles.panel1">
      <stage selected-shape="selectedShape" ng-mouseover="selectedShape = null" />
    </div>
    <div id="panel2" class="panel" ng-style="styles.panel2">
      <div class="details">
        <p>
          如图所示的三角形<co points="abc" shape="triangle">ABC</co>角<co points="bac" shape="angle">BAC</co>为直角。
        </p>
        <p>
          勾股定理是说<co points="bdec" shape="square">BC</co>的平方等于<co points="abfg" shape="square">BA</co>的平方加上<co points="ackh" shape="square">AC</co>的平方。证明如下:
        </p>
        <p>
          把<co points="bc" shape="line">BC</co>的平方对应的正方形简称为<co points="bdec" shape="square">CD</co>，同理<co points="ba" shape="line">BA</co>和
          <co points="ac" shape="line">AC</co>的平方分别对应
<co points="abfg" shape="square">GB</co>和<co points="ackh" shape="square">HC</co>
画与<co points="bd" shape="line">BD</co>和<co points="ce" shape="line">CE</co>平行的直线<co points="al" shape="line">AL</co>，然后连接<co points="ad" shape="line">AD</co>和<co points="fc" shape="line">FC</co>。
        </p>
        <p>因为角<co points="bac" shape="angle">BAC</co>
          和角<co points="bag" shape="angle">BAG</co>
          都是直角，所以<co points="ca" shape="line">CA</co>
          和<co points="ag" shape="line">AG</co>在同一条直线上。
        </p>
        <p>
          同理，<co points="ba" shape="line">BA</co>
          和<co points="ah" shape="line">AH</co>也在一条直线上。
        </p>
        <p>
          又由角<co points="dbc" shape="angle">DBC</co>
          和角<co points="fba" shape="angle">FBA</co>
          都是直角，因此它们加上<co points="abc" shape="angle">ABC</co>
          得到的角<co points="dba" shape="angle">DBA</co>
          和<co points="fbc" shape="angle">FBC</co>相等。
        </p>
        <p>
          再由<co points="db" shape="line">DB</co>
          等于<co points="bc" shape="line">BC</co>,
          且<co points="fb" shape="line">FB</co>
          等于<co points="ba" shape="line">BA</co>,
          可得三角形<co points="abd" shape="triangle">ABD</co>面积等于三角形
          <co points="fbc" shape="triangle">FBC</co>。
        </p>

        <p>又由
          <co points="bd" shape="line">BD</co>和
          <co points="al" shape="line">AL</co>平行，所以同底的矩形<co points="bvld" shape="square">BL</co>的面积是三角形
          <co points="abd" shape="triangle">ABD</co>的面积的2倍。同理正方形<co points="gfba" shape="square">GB</co>的面积是三角形<co points="fbc" shape="triangle">FBC</co>面积的两倍。
        </p>

        <p>于是可得矩形<co points="bvld" shape="square">BL</co>面积等于<co points="gfba" shape="square">GB</co>。
        </p>

        <p>同理将
          <co points="ae" shape="line">AE</co>
和<co points="bk" shape="line">BK</co>
连接起来,可证矩形<co points="cvle" shape="square">CL</co>面积等于正方形<co points="hack" shape="square">HC</co>。于是可得正方形<co points="bdec" shape="square">CD</co>
面积等于正方形<co points="gfba" shape="square">GB</co>与<co points="hack" shape="square">HC</co>的和。
        </p>

        <p>这也就证明了
          <co points="bc" shape="line">BC</co>
          的平方等于<co points="ba" shape="line">BA</co>
          的平方加上
          <co points="ac" shape="line">AC</co>的平方。
        </p>
      </div> <!-- end details -->
    </div> <!-- end panel -->
</div>
