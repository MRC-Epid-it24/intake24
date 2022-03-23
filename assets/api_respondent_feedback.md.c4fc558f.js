import{_ as e,c as a,o as n,a as s}from"./app.83317307.js";const f='{"title":"Feedback","description":"","frontmatter":{},"headers":[{"level":2,"title":"Henry coefficients","slug":"henry-coefficients"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Physical activity levels","slug":"physical-activity-levels"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Weight targets","slug":"weight-targets"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"}],"relativePath":"api/respondent/feedback.md"}',t={},p=s(`<h1 id="feedback" tabindex="-1">Feedback <a class="header-anchor" href="#feedback" aria-hidden="true">#</a></h1><p>Feedback-specific API endpoints accessible to authentication user.</p><h2 id="henry-coefficients" tabindex="-1">Henry coefficients <a class="header-anchor" href="#henry-coefficients" aria-hidden="true">#</a></h2><p>Henry coefficients for feedback calculations.</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/feedback/henry-coefficients

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token property">&quot;sex&quot;</span><span class="token operator">:</span> Sex<span class="token punctuation">,</span>
    <span class="token property">&quot;ageRange&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>number<span class="token punctuation">,</span> number<span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;weightCoefficient&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token property">&quot;heightCoefficient&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token property">&quot;constant&quot;</span><span class="token operator">:</span> number
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span>
</code></pre></div><h2 id="physical-activity-levels" tabindex="-1">Physical activity levels <a class="header-anchor" href="#physical-activity-levels" aria-hidden="true">#</a></h2><p>Physical activity levels for feedback calculations.</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/feedback/physical-activity-levels

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;coefficient&quot;</span><span class="token operator">:</span> number
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  ...
<span class="token punctuation">]</span>
</code></pre></div><h2 id="weight-targets" tabindex="-1">Weight targets <a class="header-anchor" href="#weight-targets" aria-hidden="true">#</a></h2><p>Weight targets for feedback calculations.</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/feedback/weight-targets

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;coefficient&quot;</span><span class="token operator">:</span> number
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  ...
<span class="token punctuation">]</span>
</code></pre></div>`,20),o=[p];function c(r,i,l,u,d,h){return n(),a("div",null,o)}var g=e(t,[["render",c]]);export{f as __pageData,g as default};
