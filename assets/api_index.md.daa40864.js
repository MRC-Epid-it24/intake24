import{_ as e,c as a,o as s,a as n}from"./app.e1053834.js";const A=JSON.parse('{"title":"Introduction","description":"","frontmatter":{},"headers":[{"level":2,"title":"Header format","slug":"header-format"},{"level":2,"title":"Example request","slug":"example-request"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"}],"relativePath":"api/index.md"}'),t={name:"api/index.md"},o=n(`<h1 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-hidden="true">#</a></h1><p>REST-based API endpoints use:</p><ul><li>mostly in <code>application/json</code> content-type</li><li>file-based endpoints use <code>multipart/form-data</code> content type</li></ul><h1 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-hidden="true">#</a></h1><p>Protected endpoints require to supply access token (obtained during login) in <code>Authorization</code> http header.</p><h2 id="header-format" tabindex="-1">Header format <a class="header-anchor" href="#header-format" aria-hidden="true">#</a></h2><div class="language-"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">Authorization: Bearer {accessToken}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="example-request" tabindex="-1">Example request <a class="header-anchor" href="#example-request" aria-hidden="true">#</a></h2><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">GET /api/endpoint</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Authorization: Bearer </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">accessToken</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">Content-Type: application/json</span></span>
<span class="line"></span></code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#F78C6C;">200</span><span style="color:#A6ACCD;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    ...</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div>`,12),p=[o];function l(r,i,c,d,h,u){return s(),a("div",null,p)}var m=e(t,[["render",l]]);export{A as __pageData,m as default};
