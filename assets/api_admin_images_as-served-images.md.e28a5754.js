import{_ as e,c as a,o as s,a as n}from"./app.a95cc4c4.js";const g='{"title":"As served images","description":"","frontmatter":{},"headers":[{"level":2,"title":"Browse as served images","slug":"browse-as-served-images"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Create as served image","slug":"create-as-served-image"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Get as served image","slug":"get-as-served-image"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"},{"level":2,"title":"Delete as served image","slug":"delete-as-served-image"},{"level":3,"title":"Request","slug":"request-3"},{"level":3,"title":"Response","slug":"response-3"}],"relativePath":"api/admin/images/as-served-images.md","lastUpdated":1642526787274}',t={},p=n(`<h1 id="as-served-images" tabindex="-1">As served images <a class="header-anchor" href="#as-served-images" aria-hidden="true">#</a></h1><h2 id="browse-as-served-images" tabindex="-1">Browse as served images <a class="header-anchor" href="#browse-as-served-images" aria-hidden="true">#</a></h2><p>Browse paginated as served image list</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/images/as-served/:asServedSetId/images
    ?search={searchText}
    &amp;page={page}
    &amp;limit={limit}

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;data&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;weight&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
            <span class="token property">&quot;mainImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;thumbnailUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        ...
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;meta&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="create-as-served-image" tabindex="-1">Create as served image <a class="header-anchor" href="#create-as-served-image" aria-hidden="true">#</a></h2><p>Create new as served image entry</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/images/as-served/:asServedSetId/images

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">multipart/form-data</span></span>

{
    &quot;image&quot;: File,
    &quot;weight&quot;: number
}
</code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">201</span> Created

<span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;weight&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token property">&quot;mainImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;thumbnailUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="get-as-served-image" tabindex="-1">Get as served image <a class="header-anchor" href="#get-as-served-image" aria-hidden="true">#</a></h2><p>Get as served image entry</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/images/as-served/:asServedSetId/images/:asServedImageId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;weight&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token property">&quot;mainImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;thumbnailUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="delete-as-served-image" tabindex="-1">Delete as served image <a class="header-anchor" href="#delete-as-served-image" aria-hidden="true">#</a></h2><p>Delete as served image entry</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>DELETE /api/admin/images/as-served/:asServedSetId/images/:asServedImageId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">204</span> No Content
</code></pre></div>`,25),o=[p];function r(i,c,l,d,u,h){return s(),a("div",null,o)}var m=e(t,[["render",r]]);export{g as __pageData,m as default};
