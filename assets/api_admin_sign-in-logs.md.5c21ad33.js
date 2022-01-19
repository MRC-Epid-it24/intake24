import{_ as e,c as n,o as s,a}from"./app.a95cc4c4.js";const k='{"title":"Sign-in logs","description":"","frontmatter":{},"headers":[{"level":2,"title":"Browse sign-in logs","slug":"browse-sign-in-logs"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Get sign-in log","slug":"get-sign-in-log"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Delete sign-in log","slug":"delete-sign-in-log"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"}],"relativePath":"api/admin/sign-in-logs.md","lastUpdated":1642609165386}',t={},o=a(`<h1 id="sign-in-logs" tabindex="-1">Sign-in logs <a class="header-anchor" href="#sign-in-logs" aria-hidden="true">#</a></h1><h2 id="browse-sign-in-logs" tabindex="-1">Browse sign-in logs <a class="header-anchor" href="#browse-sign-in-logs" aria-hidden="true">#</a></h2><p>Browse paginated sign-in logs list</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/sign-in-logs
    ?search={searchText}
    &amp;page={page}
    &amp;limit={limit}

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;data&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;meta&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="get-sign-in-log" tabindex="-1">Get sign-in log <a class="header-anchor" href="#get-sign-in-log" aria-hidden="true">#</a></h2><p>Get sign-in log entry</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/sign-in-logs/:signInLogId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="delete-sign-in-log" tabindex="-1">Delete sign-in log <a class="header-anchor" href="#delete-sign-in-log" aria-hidden="true">#</a></h2><p>Delete sign-in log entry</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>DELETE /api/admin/sign-in-logs/:signInLogId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">204</span> No Content
</code></pre></div>`,19),p=[o];function i(l,r,c,d,u,h){return s(),n("div",null,p)}var v=e(t,[["render",i]]);export{k as __pageData,v as default};
