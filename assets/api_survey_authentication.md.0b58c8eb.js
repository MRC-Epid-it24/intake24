import{_ as e,c as n,o as a,a as s}from"./app.2d6c6049.js";const g='{"title":"Authentication","description":"","frontmatter":{},"headers":[{"level":2,"title":"Login with email","slug":"login-with-email"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Login with survey alias","slug":"login-with-survey-alias"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Login with token","slug":"login-with-token"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"},{"level":2,"title":"Refresh access token","slug":"refresh-access-token"},{"level":3,"title":"Request","slug":"request-3"},{"level":3,"title":"Response","slug":"response-3"},{"level":2,"title":"Logout","slug":"logout"},{"level":3,"title":"Request","slug":"request-4"},{"level":3,"title":"Response","slug":"response-4"}],"relativePath":"api/survey/authentication.md"}',t={},o=s(`<h1 id="authentication" tabindex="-1">Authentication <a class="header-anchor" href="#authentication" aria-hidden="true">#</a></h1><p>Survey frontend authentication endpoints.</p><h2 id="login-with-email" tabindex="-1">Login with email <a class="header-anchor" href="#login-with-email" aria-hidden="true">#</a></h2><p>Login with email / password</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/auth/login

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;password&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><p>Response can differ based on whether multi-factor authentication is enabled or not.</p><h4 id="successful-login-without-mfa-challenge" tabindex="-1">Successful login without MFA challenge <a class="header-anchor" href="#successful-login-without-mfa-challenge" aria-hidden="true">#</a></h4><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;accessToken&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</code></pre></div><h4 id="successful-login-with-mfa-challenge" tabindex="-1">Successful login with MFA challenge <a class="header-anchor" href="#successful-login-with-mfa-challenge" aria-hidden="true">#</a></h4><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;mfaRequestUrl&quot;</span><span class="token operator">:</span> string;
<span class="token punctuation">}</span>
</code></pre></div><h2 id="login-with-survey-alias" tabindex="-1">Login with survey alias <a class="header-anchor" href="#login-with-survey-alias" aria-hidden="true">#</a></h2><p>Login with username / password</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/auth/login/alias

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;username&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;password&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;survey&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;accessToken&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</code></pre></div><h2 id="login-with-token" tabindex="-1">Login with token <a class="header-anchor" href="#login-with-token" aria-hidden="true">#</a></h2><p>Login with token</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/auth/login/token

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;token&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;accessToken&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</code></pre></div><h2 id="refresh-access-token" tabindex="-1">Refresh access token <a class="header-anchor" href="#refresh-access-token" aria-hidden="true">#</a></h2><p>Refresh access token using refresh token</p><p>API server expects <code>refresh token</code> sent as cookie. Cookie name can differ based on API server configuration. Default (<code>it24s_refresh_token</code>)</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/auth/refresh

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
Cookie<span class="token operator">:</span> <span class="token punctuation">{</span>name<span class="token punctuation">}</span>=<span class="token punctuation">{</span>refreshToken<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;accessToken&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</code></pre></div><h2 id="logout" tabindex="-1">Logout <a class="header-anchor" href="#logout" aria-hidden="true">#</a></h2><p>Clears <code>http-only</code> cookie which stores <code>refresh token</code> and revokes <code>refresh token</code>.</p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/auth/logout

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK
</code></pre></div>`,37),p=[o];function r(i,c,l,u,h,d){return a(),n("div",null,p)}var f=e(t,[["render",r]]);export{g as __pageData,f as default};
