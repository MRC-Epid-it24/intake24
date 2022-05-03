import{_ as a,c as n,o as s,a as e}from"./app.41bcad43.js";const m='{"title":"Image maps","description":"","frontmatter":{},"headers":[{"level":2,"title":"Browse image maps","slug":"browse-image-maps"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Create image map","slug":"create-image-map"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Get image map","slug":"get-image-map"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"},{"level":2,"title":"Update image map","slug":"update-image-map"},{"level":3,"title":"Request","slug":"request-3"},{"level":3,"title":"Response","slug":"response-3"},{"level":2,"title":"Delete image map","slug":"delete-image-map"},{"level":3,"title":"Request","slug":"request-4"},{"level":3,"title":"Response","slug":"response-4"}],"relativePath":"api/admin/images/maps.md"}',t={},p=e(`<h1 id="image-maps" tabindex="-1">Image maps <a class="header-anchor" href="#image-maps" aria-hidden="true">#</a></h1><h2 id="browse-image-maps" tabindex="-1">Browse image maps <a class="header-anchor" href="#browse-image-maps" aria-hidden="true">#</a></h2><p>Browse paginated image map list</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/images/maps
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
            <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;imageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        ...
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;meta&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="create-image-map" tabindex="-1">Create image map <a class="header-anchor" href="#create-image-map" aria-hidden="true">#</a></h2><p>Create new image map entry</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/images/maps

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">multipart/form-data</span></span>

{
    &quot;id&quot;: string,
    &quot;description&quot;: string,
    &quot;baseImage&quot;: File
}
</code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">201</span> Created

<span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;baseImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;objects&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;outlineCoordinates&quot;</span><span class="token operator">:</span> number<span class="token punctuation">[</span><span class="token punctuation">]</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        ...
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="get-image-map" tabindex="-1">Get image map <a class="header-anchor" href="#get-image-map" aria-hidden="true">#</a></h2><p>Get image map entry</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/images/maps/:imageMapId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;baseImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;objects&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;outlineCoordinates&quot;</span><span class="token operator">:</span> number<span class="token punctuation">[</span><span class="token punctuation">]</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        ...
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="update-image-map" tabindex="-1">Update image map <a class="header-anchor" href="#update-image-map" aria-hidden="true">#</a></h2><p>Update image map entry</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>PUT /api/admin/images/maps/:imageMapId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;objects&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
            <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;outlineCoordinates&quot;</span><span class="token operator">:</span> number<span class="token punctuation">[</span><span class="token punctuation">]</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        ...
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;baseImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;objects&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;outlineCoordinates&quot;</span><span class="token operator">:</span> number<span class="token punctuation">[</span><span class="token punctuation">]</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        ...
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="delete-image-map" tabindex="-1">Delete image map <a class="header-anchor" href="#delete-image-map" aria-hidden="true">#</a></h2><p>Delete image map entry</p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>DELETE /api/admin/images/maps/:imageMapId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">204</span> No Content
</code></pre></div>`,31),o=[p];function r(c,i,u,l,d,k){return s(),n("div",null,o)}var g=a(t,[["render",r]]);export{m as __pageData,g as default};
