import{_ as a,o as s,c as e,Q as n}from"./chunks/framework.b637c96f.js";const y=JSON.parse('{"title":"Introduction","description":"","frontmatter":{},"headers":[],"relativePath":"api/index.md","filePath":"api/index.md"}'),o={name:"api/index.md"},t=n(`<h1 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-label="Permalink to &quot;Introduction&quot;">​</a></h1><p>REST-based API endpoints use:</p><ul><li><code>application/json</code> content-type</li><li><code>multipart/form-data</code> content type with file payloads</li></ul><h1 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to &quot;Usage&quot;">​</a></h1><p>Authorization-protected endpoints require to supply access token (JSON Web Token, a.k.a <code>JWT</code>) (obtained during login) in <code>Authorization</code> http header.</p><h2 id="header-format" tabindex="-1">Header format <a class="header-anchor" href="#header-format" aria-label="Permalink to &quot;Header format&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">Authorization: Bearer {accessToken}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">Authorization: Bearer {accessToken}</span></span></code></pre></div><h2 id="example-request" tabindex="-1">Example request <a class="header-anchor" href="#example-request" aria-label="Permalink to &quot;Example request&quot;">​</a></h2><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/endpoint</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/endpoint</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span></code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FDAEB7;font-style:italic;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#B31D28;font-style:italic;">...</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,12),l=[t];function p(i,c,r,d,h,u){return s(),e("div",null,l)}const g=a(o,[["render",p]]);export{y as __pageData,g as default};
