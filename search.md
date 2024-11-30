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
    
			// 获取当前页面的URL查询字符串部分
			const queryString = window.location.search;
			
			// 创建一个URLSearchParams对象，用于解析查询字符串
			const params = new URLSearchParams(queryString);
			
			// 将URLSearchParams对象转换为一个普通的JavaScript对象
			const queryParams = {};
			for (const [key, value] of params.entries()) {
			  queryParams[key] = value;
			}
			
			// 输出解析后的查询参数键值对对象
			console.log(queryParams);
				
			let search = new PagefindUI({ element: "#search", showSubResults: true });
			search.triggerSearch(queryParams["q"]);
			
    });
</script>
