---
layout: page
title: 搜索结果
footer: false
permalink: /search/
---

<link href="../pagefind/pagefind-ui.css" rel="stylesheet">
<script src="../pagefind/pagefind-ui.js"></script>


<div id="search"></div>
<script>
    window.addEventListener('DOMContentLoaded', (event) => {
    
			const queryString = window.location.search;
			const params = new URLSearchParams(queryString);
			const queryParams = {};
			for (const [key, value] of params.entries()) {
			  queryParams[key] = value;
			}
			
			let search = new PagefindUI({ element: "#search", showSubResults: true });
			search.triggerSearch(queryParams["q"]);
			
    });
</script>
