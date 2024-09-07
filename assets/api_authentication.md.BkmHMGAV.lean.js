import{_ as a,c as s,a2 as t,o as i}from"./chunks/framework.DneEosfm.js";const u=JSON.parse('{"title":"Authentication","description":"","frontmatter":{},"headers":[],"relativePath":"api/authentication.md","filePath":"api/authentication.md"}'),n={name:"api/authentication.md"};function o(c,e,d,l,h,r){return i(),s("div",null,e[0]||(e[0]=[t(`<h1 id="authentication" tabindex="-1">Authentication <a class="header-anchor" href="#authentication" aria-label="Permalink to &quot;Authentication&quot;">​</a></h1><p><code>Authentication</code> and <code>Authorization</code> protected endpoints require valid access token (JSON Web Token format, a.k.a <code>JWT</code>) attached as <code>Authorization</code> http request header.</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-http vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">http</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">GET</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /api/endpoint</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Authorization</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Bearer {accessToken}</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Content-Type</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> application/json</span></span></code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">200</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#B31D28;--shiki-dark:#FDAEB7;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">    ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h4 id="invalid-authentication-attempt-will-return-http-401-unauthorized-status-code" tabindex="-1">Invalid authentication attempt will return HTTP <code>401 Unauthorized</code> status code. <a class="header-anchor" href="#invalid-authentication-attempt-will-return-http-401-unauthorized-status-code" aria-label="Permalink to &quot;Invalid authentication attempt will return HTTP \`401 Unauthorized\` status code.&quot;">​</a></h4><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">401</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Unauthorized</span></span></code></pre></div><h4 id="invalid-authorization-attempt-will-return-http-403-forbidden-status-code" tabindex="-1">Invalid authorization attempt will return HTTP <code>403 Forbidden</code> status code. <a class="header-anchor" href="#invalid-authorization-attempt-will-return-http-403-forbidden-status-code" aria-label="Permalink to &quot;Invalid authorization attempt will return HTTP \`403 Forbidden\` status code.&quot;">​</a></h4><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">403</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Forbidden</span></span></code></pre></div><p>Access tokens can be obtained in two ways depending on intended usage.</p><h2 id="spa-applications" tabindex="-1">SPA applications <a class="header-anchor" href="#spa-applications" aria-label="Permalink to &quot;SPA applications&quot;">​</a></h2><p>Authentication flow for SPA applications (<code>admin</code> and <code>survey</code>) is based on combination of short-lived <code>access token</code> and long-lived <code>refresh token</code>.</p><p>Login endpoints issue JWT <code>access tokens</code> in response body. <code>Access token</code> is short-lived JWT and has to be included in <code>Authorization</code> header for specific endpoint.</p><p>Response includes cookie with <code>refresh token</code>, which can be used to obtain fresh <code>access token</code>. By default, cookie is <code>http-only</code> (prevents to be read by javascript code) and <code>secure</code> (sent over https-only), please refer to <a href="/config/api/security#json-web-tokens">security configuration</a> for more details.</p><p>Combination of short-lived <code>access token</code> and long-lived <code>refresh token</code> is focused on security and usability within SPA applications. Moreover, account can be protected with multi-factor authentication, which is not suitable for <code>machine-to-machine</code> communication.</p><h2 id="personal-access-tokens" tabindex="-1">Personal access tokens <a class="header-anchor" href="#personal-access-tokens" aria-label="Permalink to &quot;Personal access tokens&quot;">​</a></h2><p>The use of personal access tokens a.k.a. <code>API Keys</code> is recommended for <code>machine-to-machine</code> communication.</p><p>Personal access tokens are long-lived JWT tokens, which can be used to authenticate requests. Personal access tokens are bound to specific user. Personal access tokens can be managed in <a href="/admin/user/personal-access-tokens">admin tool</a>.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Personal access tokens are long lived and should be treated as sensitive data. They should be stored securely and never exposed to public (e.g. embedded into frontend code).</p></div>`,20)]))}const k=a(n,[["render",o]]);export{u as __pageData,k as default};
