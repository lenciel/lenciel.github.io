---
layout: page
title: Archives
footer: false
permalink: /archives/
---

<div id="blog-archives">
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

<!--
<div id="blog-archives">
{% for post in site.posts %}
  {% assign currentdate = post.date | date: "%Y" %}
  {% if currentdate != date %}
    {% unless forloop.first %}</ul>{% endunless %}
    <h1 id="y{{post.date | date: "%Y"}}">{{ currentdate }}</h1>
    <ul>
    {% assign date = currentdate %}
  {% endif %}
    <li><a href="{{ post.url }}">{{ post.title }}</a></li>
  {% if forloop.last %}</ul>{% endif %}
{% endfor %}
</div>

<div id="blog-archives" class="category">
<h1>标签</h1>
{% assign sorted_categories = site.categories | sort %}
{% for category in sorted_categories %}
    <li><a href="{{category.url}}"><strong>{{category|first}}<sup>{{ category[1].size }}</sup></strong></a></li>
{% endfor %}

</div> 
-->
