import{_ as a,c as n,o as s,a as e}from"./app.df7875f4.js";const k='{"title":"Internationalization","description":"","frontmatter":{},"headers":[{"level":2,"title":"Browse languages","slug":"browse-languages"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Get language entry","slug":"get-language-entry"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"}],"relativePath":"api/i18n.md"}',t={},o=e(`<h1 id="internationalization" tabindex="-1">Internationalization <a class="header-anchor" href="#internationalization" aria-hidden="true">#</a></h1><p>Internationalization routes to fetch available languages and translations.</p><h2 id="browse-languages" tabindex="-1">Browse languages <a class="header-anchor" href="#browse-languages" aria-hidden="true">#</a></h2><p>Fetch list of available languages for front-ends.</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/i18n

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
        <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;englishName&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;localName&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;countryFlagCode&quot;</span><span class="token operator">:</span> string
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    ...
<span class="token punctuation">]</span>
</code></pre></div><h2 id="get-language-entry" tabindex="-1">Get language entry <a class="header-anchor" href="#get-language-entry" aria-hidden="true">#</a></h2><p>Get language entry and available translations.</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/i18n/:languageId

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;englishName&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;localName&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;countryFlagCode&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;textDirection&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;messages&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div>`,14),p=[o];function r(l,i,c,u,d,g){return s(),n("div",null,p)}var q=a(t,[["render",r]]);export{k as __pageData,q as default};
