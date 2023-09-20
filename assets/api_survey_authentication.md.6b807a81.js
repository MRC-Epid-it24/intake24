import{_ as s,o as a,c as n,Q as l}from"./chunks/framework.52fb8202.js";const d=JSON.parse('{"title":"Authentication","description":"","frontmatter":{},"headers":[],"relativePath":"api/survey/authentication.md","filePath":"api/survey/authentication.md"}'),e={name:"api/survey/authentication.md"},o=l(`<h1 id="authentication" tabindex="-1">Authentication <a class="header-anchor" href="#authentication" aria-label="Permalink to &quot;Authentication&quot;">​</a></h1><p>Survey frontend authentication endpoints.</p><h2 id="login-with-email" tabindex="-1">Login with email <a class="header-anchor" href="#login-with-email" aria-label="Permalink to &quot;Login with email&quot;">​</a></h2><p>Login with email / password</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">POST /api/auth/login</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;email&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;password&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">POST /api/auth/login</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;email&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;password&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-label="Permalink to &quot;Response&quot;">​</a></h3><p>Response can differ based on whether multi-factor authentication is enabled or not.</p><h4 id="successful-login-without-mfa-challenge" tabindex="-1">Successful login without MFA challenge <a class="header-anchor" href="#successful-login-without-mfa-challenge" aria-label="Permalink to &quot;Successful login without MFA challenge&quot;">​</a></h4><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;accessToken&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;accessToken&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h4 id="successful-login-with-mfa-challenge" tabindex="-1">Successful login with MFA challenge <a class="header-anchor" href="#successful-login-with-mfa-challenge" aria-label="Permalink to &quot;Successful login with MFA challenge&quot;">​</a></h4><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;mfaRequestUrl&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;mfaRequestUrl&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="login-with-survey-alias" tabindex="-1">Login with survey alias <a class="header-anchor" href="#login-with-survey-alias" aria-label="Permalink to &quot;Login with survey alias&quot;">​</a></h2><p>Login with username / password</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">POST /api/auth/login/alias</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;username&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;password&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;survey&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">POST /api/auth/login/alias</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;username&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;password&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;survey&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;accessToken&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;accessToken&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="login-with-token" tabindex="-1">Login with token <a class="header-anchor" href="#login-with-token" aria-label="Permalink to &quot;Login with token&quot;">​</a></h2><p>Login with token</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">POST /api/auth/login/token</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;token&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">POST /api/auth/login/token</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;token&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;accessToken&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;accessToken&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="refresh-access-token" tabindex="-1">Refresh access token <a class="header-anchor" href="#refresh-access-token" aria-label="Permalink to &quot;Refresh access token&quot;">​</a></h2><p>Refresh access token using refresh token</p><p>API server expects <code>refresh token</code> sent as cookie. Cookie name can differ based on API server configuration. Default (<code>it24s_refresh_token</code>)</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">POST /api/auth/refresh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Cookie: {</span><span style="color:#FDAEB7;font-style:italic;">name</span><span style="color:#E1E4E8;">}={</span><span style="color:#FDAEB7;font-style:italic;">refreshToken</span><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">POST /api/auth/refresh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Cookie: {</span><span style="color:#B31D28;font-style:italic;">name</span><span style="color:#24292E;">}={</span><span style="color:#B31D28;font-style:italic;">refreshToken</span><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;accessToken&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;accessToken&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="logout" tabindex="-1">Logout <a class="header-anchor" href="#logout" aria-label="Permalink to &quot;Logout&quot;">​</a></h2><p>Clears <code>http-only</code> cookie which stores <code>refresh token</code> and revokes <code>refresh token</code>.</p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">POST /api/auth/logout</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">POST /api/auth/logout</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span></code></pre></div><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span></code></pre></div>`,37),p=[o];function t(c,i,r,E,y,h){return a(),n("div",null,p)}const g=s(e,[["render",t]]);export{d as __pageData,g as default};
