import{_ as e,c as a,o as n,a as s}from"./app.9e785ce0.js";const g='{"title":"Authentication","description":"","frontmatter":{},"headers":[{"level":2,"title":"Login","slug":"login"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Verify MFA challenge","slug":"verify-mfa-challenge"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Refresh access token","slug":"refresh-access-token"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"},{"level":2,"title":"Logout","slug":"logout"},{"level":3,"title":"Request","slug":"request-3"},{"level":3,"title":"Response","slug":"response-3"}],"relativePath":"api/admin/authentication.md"}',t={},o=s(`<h1 id="authentication" tabindex="-1">Authentication <a class="header-anchor" href="#authentication" aria-hidden="true">#</a></h1><p>Admin frontend authentication endpoints.</p><h2 id="login" tabindex="-1">Login <a class="header-anchor" href="#login" aria-hidden="true">#</a></h2><p>Login with email / password</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/auth/login

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token string-property property">&quot;email&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token string-property property">&quot;password&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><p>Response can differ based on whether multi-factor authentication is enabled or not.</p><h4 id="successful-login-without-mfa-challenge" tabindex="-1">Successful login without MFA challenge <a class="header-anchor" href="#successful-login-without-mfa-challenge" aria-hidden="true">#</a></h4><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;accessToken&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</code></pre></div><h4 id="successful-login-with-mfa-challenge" tabindex="-1">Successful login with MFA challenge <a class="header-anchor" href="#successful-login-with-mfa-challenge" aria-hidden="true">#</a></h4><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;mfaRequestUrl&quot;</span><span class="token operator">:</span> string;
<span class="token punctuation">}</span>
</code></pre></div><h2 id="verify-mfa-challenge" tabindex="-1">Verify MFA challenge <a class="header-anchor" href="#verify-mfa-challenge" aria-hidden="true">#</a></h2><p>Verify multi-factor authentication challenge</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/auth/verify

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;code&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;state&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;accessToken&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</code></pre></div><h2 id="refresh-access-token" tabindex="-1">Refresh access token <a class="header-anchor" href="#refresh-access-token" aria-hidden="true">#</a></h2><p>Refresh access token using refresh token</p><p>API server expects <code>refresh token</code> sent as cookie. Cookie name can differ based on API server configuration. Default (<code>it24a_refresh_token</code>)</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/auth/refresh

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
Cookie<span class="token operator">:</span> <span class="token punctuation">{</span>name<span class="token punctuation">}</span>=<span class="token punctuation">{</span>refreshToken<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;accessToken&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</code></pre></div><h2 id="logout" tabindex="-1">Logout <a class="header-anchor" href="#logout" aria-hidden="true">#</a></h2><p>Clears <code>http-only</code> cookie which stores <code>refresh token</code> and revokes <code>refresh token</code>.</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/auth/logout

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK
</code></pre></div>`,31),p=[o];function r(c,i,l,u,d,h){return n(),a("div",null,p)}var f=e(t,[["render",r]]);export{g as __pageData,f as default};
