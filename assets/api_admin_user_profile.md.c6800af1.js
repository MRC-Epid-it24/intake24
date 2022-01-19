import{_ as a,c as s,o as n,a as e}from"./app.a95cc4c4.js";const _='{"title":"User profile","description":"","frontmatter":{},"headers":[{"level":2,"title":"Get profile data","slug":"get-profile-data"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"}],"relativePath":"api/admin/user/profile.md","lastUpdated":1642609165386}',t={},p=e(`<h1 id="user-profile" tabindex="-1">User profile <a class="header-anchor" href="#user-profile" aria-hidden="true">#</a></h1><h2 id="get-profile-data" tabindex="-1">Get profile data <a class="header-anchor" href="#get-profile-data" aria-hidden="true">#</a></h2><p>Get logged-in user profile data</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/user

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;profile&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;phone&quot;</span><span class="token operator">:</span> string
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;permissions&quot;</span><span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;roles&quot;</span><span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div>`,7),o=[p];function r(c,l,i,u,d,h){return n(),s("div",null,o)}var f=a(t,[["render",r]]);export{_ as __pageData,f as default};
