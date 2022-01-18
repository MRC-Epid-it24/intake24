import{_ as e,c as a,o as s,a as n}from"./app.a95cc4c4.js";const x='{"title":"Survey data export","description":"","frontmatter":{},"headers":[{"level":2,"title":"Queue data export","slug":"queue-data-export"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Download data export","slug":"download-data-export"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"}],"relativePath":"api/admin/surveys/data-export.md","lastUpdated":1642526787274}',t={},r=n(`<h1 id="survey-data-export" tabindex="-1">Survey data export <a class="header-anchor" href="#survey-data-export" aria-hidden="true">#</a></h1><h2 id="queue-data-export" tabindex="-1">Queue data export <a class="header-anchor" href="#queue-data-export" aria-hidden="true">#</a></h2><p>Submits a job to generate CSV file with submission data.</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/surveys/:surveyId/data-export

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><p>Returns job resource entry.</p><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="download-data-export" tabindex="-1">Download data export <a class="header-anchor" href="#download-data-export" aria-hidden="true">#</a></h2><p>Download CSV file with submission data.</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/surveys/:surveyId/data-export/sync

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><p>Returns <code>Buffer</code>.</p><div class="language-"><pre><code>200 OK
</code></pre></div>`,15),o=[r];function d(p,i,c,l,u,h){return s(),a("div",null,o)}var k=e(t,[["render",d]]);export{x as __pageData,k as default};
