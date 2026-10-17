# 把 ```mermaid 代码块转成 <pre class="mermaid">，由前端 mermaid.js 渲染。
# kramdown+rouge 对未知语言有两种输出形态，这里都处理：
#   <div class="language-mermaid highlighter-rouge"><div class="highlight"><pre class="highlight"><code>…</code></pre></div></div>
#   <pre><code class="language-mermaid">…</code></pre>
MERMAID_BLOCKS = [
  %r{<div class="language-mermaid[^"]*"><div class="highlight"><pre[^>]*><code>(.*?)</code></pre></div></div>}m,
  %r{<pre><code class="language-mermaid">(.*?)</code></pre>}m,
].freeze

Jekyll::Hooks.register [:documents, :pages], :post_convert do |doc|
  next unless doc.content && doc.content.include?("language-mermaid")

  MERMAID_BLOCKS.each do |pattern|
    doc.content = doc.content.gsub(pattern, '<pre class="mermaid">\1</pre>')
  end
end
