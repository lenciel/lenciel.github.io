---
layout: page
title: Archives
footer: false
permalink: /archives/
---

<div id="blog-archives">

<h2>置顶</h2>
<article>
  <h1><a href="/about/">关于我</a></h1>
  <time datetime="" pubdate="">
    <span class="month">JUL</span>
    <span class="day">22</span>
    <span class="year">2022</span>
  </time>
  <footer>
    <span class="categories">posted in
      <a class="category" href="/categories/rants/">rants</a>, <a class="category" href="/categories/writing/">writing</a>
    </span>
  </footer>
</article>
{% for post in site.posts %}
{% capture this_year %}{{ post.date | date: "%Y" }}{% endcapture %}
{% unless year == this_year %}
  {% assign year = this_year %}
  <h2>{{ year }}</h2>
{% endunless %}
  <article>
    {% include archive_post.html %}
  </article>
{% endfor %}
</div>
