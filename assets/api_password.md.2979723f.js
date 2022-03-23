import{_ as e,c as s,o as a,a as n}from"./app.954531fb.js";const g='{"title":"Password recovery","description":"","frontmatter":{},"headers":[{"level":2,"title":"Password request","slug":"password-request"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Password reset","slug":"password-reset"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"}],"relativePath":"api/password.md"}',t={},o=n(`<h1 id="password-recovery" tabindex="-1">Password recovery <a class="header-anchor" href="#password-recovery" aria-hidden="true">#</a></h1><p>Routes to handle user&#39;s password recovery.</p><h2 id="password-request" tabindex="-1">Password request <a class="header-anchor" href="#password-request" aria-hidden="true">#</a></h2><p>Request a password reset. It sends an email to user with password recovery link.</p><ul><li>route can be protected with <a href="https://developers.google.com/recaptcha/intro" target="_blank" rel="noopener noreferrer">Google reCAPTCHA</a>, see <a href="/config/api/services.html#google-recaptcha">API Services Config</a> for more details.</li><li>route is rate-limited, see <a href="/config/api/rate-limiter.html#password">API Rate Limiter Config</a>.</li></ul><p>Field <code>recaptcha</code> can be omitted if <code>Google reCAPTCHA</code> is disabled.</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/password

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token string">&quot;recaptcha&quot;</span>?<span class="token operator">:</span> string
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK
</code></pre></div><h2 id="password-reset" tabindex="-1">Password reset <a class="header-anchor" href="#password-reset" aria-hidden="true">#</a></h2><p>Reset user&#39;s password.</p><p>Field <code>token</code> value is received with password recovery email. It is valid to limited period of time specified in <a href="/config/api/security.html#passwords">API Security Config</a>.</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/password/reset

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;password&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;passwordConfirm&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;token&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK
</code></pre></div>`,17),r=[o];function p(i,c,d,l,u,h){return a(),s("div",null,r)}var v=e(t,[["render",p]]);export{g as __pageData,v as default};
