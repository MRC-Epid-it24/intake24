import{_ as s,v as a,b as n,R as e}from"./chunks/framework.70afa331.js";const y=JSON.parse('{"title":"Authentication","description":"","frontmatter":{},"headers":[],"relativePath":"api/admin/authentication.md","filePath":"api/admin/authentication.md"}'),l={name:"api/admin/authentication.md"},o=e(`<h1 id="authentication" tabindex="-1">Authentication <a class="header-anchor" href="#authentication" aria-label="Permalink to &quot;Authentication&quot;">​</a></h1><p>Admin frontend authentication endpoints.</p><h2 id="login" tabindex="-1">Login <a class="header-anchor" href="#login" aria-label="Permalink to &quot;Login&quot;">​</a></h2><p>Login with email / password</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">POST /api/admin/auth/login</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">email</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">password</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-label="Permalink to &quot;Response&quot;">​</a></h3><p>Response can differ based on whether multi-factor authentication is enabled or not.</p><h4 id="successful-login-without-mfa-challenge" tabindex="-1">Successful login without MFA challenge <a class="header-anchor" href="#successful-login-without-mfa-challenge" aria-label="Permalink to &quot;Successful login without MFA challenge&quot;">​</a></h4><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#F78C6C;">200</span><span style="color:#A6ACCD;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">accessToken</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><h4 id="successful-login-with-mfa-challenge" tabindex="-1">Successful login with MFA challenge <a class="header-anchor" href="#successful-login-with-mfa-challenge" aria-label="Permalink to &quot;Successful login with MFA challenge&quot;">​</a></h4><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#F78C6C;">200</span><span style="color:#A6ACCD;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">mfaRequestUrl</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><h2 id="verify-mfa-challenge" tabindex="-1">Verify MFA challenge <a class="header-anchor" href="#verify-mfa-challenge" aria-label="Permalink to &quot;Verify MFA challenge&quot;">​</a></h2><p>Verify multi-factor authentication challenge</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">POST /api/admin/auth/verify</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">code</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">state</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#F78C6C;">200</span><span style="color:#A6ACCD;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">accessToken</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><h2 id="refresh-access-token" tabindex="-1">Refresh access token <a class="header-anchor" href="#refresh-access-token" aria-label="Permalink to &quot;Refresh access token&quot;">​</a></h2><p>Refresh access token using refresh token</p><p>API server expects <code>refresh token</code> sent as cookie. Cookie name can differ based on API server configuration. Default (<code>it24a_refresh_token</code>)</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">POST /api/admin/auth/refresh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Cookie: </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">name</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">=</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">refreshToken</span><span style="color:#89DDFF;">}</span></span></code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#F78C6C;">200</span><span style="color:#A6ACCD;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">accessToken</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><h2 id="logout" tabindex="-1">Logout <a class="header-anchor" href="#logout" aria-label="Permalink to &quot;Logout&quot;">​</a></h2><p>Clears <code>http-only</code> cookie which stores <code>refresh token</code> and revokes <code>refresh token</code>.</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">POST /api/admin/auth/logout</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Content-Type: application/json</span></span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#F78C6C;">200</span><span style="color:#A6ACCD;"> OK</span></span></code></pre></div>`,31),t=[o];function p(c,i,r,h,u,d){return a(),n("div",null,t)}const C=s(l,[["render",p]]);export{y as __pageData,C as default};
