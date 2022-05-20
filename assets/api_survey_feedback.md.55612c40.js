import{_ as n,c as a,o as s,a as e}from"./app.2d6c6049.js";const q='{"title":"Feedback","description":"","frontmatter":{},"headers":[{"level":2,"title":"Feedback data","slug":"feedback-data"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"}],"relativePath":"api/survey/feedback.md"}',t={},p=e(`<h1 id="feedback" tabindex="-1">Feedback <a class="header-anchor" href="#feedback" aria-hidden="true">#</a></h1><p>Feedback-specific API endpoints accessible to authentication user.</p><h2 id="feedback-data" tabindex="-1">Feedback data <a class="header-anchor" href="#feedback-data" aria-hidden="true">#</a></h2><p>Get feedback related reference data</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/feedback

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;nutrientTypes&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;unit&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;kcalPerUnit&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    ...
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">&quot;physicalActivityLevels&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;coefficient&quot;</span><span class="token operator">:</span> number
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    ...
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">&quot;weightTargets&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;coefficient&quot;</span><span class="token operator">:</span> number
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    ...
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div>`,8),o=[p];function c(r,u,l,i,k,d){return s(),a("div",null,o)}var _=n(t,[["render",c]]);export{q as __pageData,_ as default};
