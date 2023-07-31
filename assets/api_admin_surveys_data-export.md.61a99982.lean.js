import{_ as a,v as s,b as e,R as n}from"./chunks/framework.70afa331.js";const C=JSON.parse('{"title":"Survey data export","description":"","frontmatter":{},"headers":[],"relativePath":"api/admin/surveys/data-export.md","filePath":"api/admin/surveys/data-export.md"}'),t={name:"api/admin/surveys/data-export.md"},o=n(`<h1 id="survey-data-export" tabindex="-1">Survey data export <a class="header-anchor" href="#survey-data-export" aria-label="Permalink to &quot;Survey data export&quot;">​</a></h1><h2 id="queue-data-export" tabindex="-1">Queue data export <a class="header-anchor" href="#queue-data-export" aria-label="Permalink to &quot;Queue data export&quot;">​</a></h2><p>Submits a job to generate CSV file with submission data.</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">POST /api/admin/surveys/:surveyId/data-export</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Authorization: Bearer </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">accessToken</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">Content-Type: application/json</span></span></code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-label="Permalink to &quot;Response&quot;">​</a></h3><p>Returns job resource entry.</p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#F78C6C;">200</span><span style="color:#A6ACCD;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    ...</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><h2 id="download-data-export" tabindex="-1">Download data export <a class="header-anchor" href="#download-data-export" aria-label="Permalink to &quot;Download data export&quot;">​</a></h2><p>Download CSV file with submission data.</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">POST /api/admin/surveys/:surveyId/data-export/sync</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Authorization: Bearer </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">accessToken</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">Content-Type: application/json</span></span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-label="Permalink to &quot;Response&quot;">​</a></h3><p>Returns <code>Buffer</code>.</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">200 OK</span></span></code></pre></div>`,15),p=[o];function l(r,i,c,d,u,h){return s(),e("div",null,p)}const m=a(t,[["render",l]]);export{C as __pageData,m as default};
