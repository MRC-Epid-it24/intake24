import{_ as e,c as s,o as n,a}from"./app.88b8cbf2.js";const g='{"title":"Surveys - public","description":"","frontmatter":{},"headers":[{"level":2,"title":"Public survey list","slug":"public-survey-list"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Public survey parameters","slug":"public-survey-parameters"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Generate user","slug":"generate-user"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"},{"level":2,"title":"Create user","slug":"create-user"},{"level":3,"title":"Request","slug":"request-3"},{"level":3,"title":"Response","slug":"response-3"}],"relativePath":"api/survey/surveys-public.md"}',t={},p=a(`<h1 id="surveys-public" tabindex="-1">Surveys - public <a class="header-anchor" href="#surveys-public" aria-hidden="true">#</a></h1><p>Survey-specific public API endpoints.</p><h2 id="public-survey-list" tabindex="-1">Public survey list <a class="header-anchor" href="#public-survey-list" aria-hidden="true">#</a></h2><p>Publicly accessible survey list. Returns list of public surveys.</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/surveys

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;localeId&quot;</span><span class="token operator">:</span> string
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span>
</code></pre></div><h2 id="public-survey-parameters" tabindex="-1">Public survey parameters <a class="header-anchor" href="#public-survey-parameters" aria-hidden="true">#</a></h2><p>Publicly accessible API end-point.</p><p>Returns survey parameters necessary to render the survey login page such as the language settings and the support e-mail.</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/surveys/{survey-slug}

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;localeId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;respondentLanguageId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;supportEmail&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;originatingURL&quot;</span><span class="token operator">:</span> string?
<span class="token punctuation">}</span>
</code></pre></div><p>where:</p><p><strong>originatingURL</strong> is a feature for integrating with external systems. In v3 respondents are redirected to this URL in case of authentication failure so the external system can perform the authentication for them. A better solution should be used for v4.</p><h2 id="generate-user" tabindex="-1">Generate user <a class="header-anchor" href="#generate-user" aria-hidden="true">#</a></h2><p>Publicly accessible API end-point.</p><p>Automatically create a new user account with a respondent role and random credentials if allowed by the survey settings.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>This functionality has to be allowed in survey settings. It is using reCaptcha challenge and is rate-limited.</p></div><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/surveys/{survey-slug}/generate-user

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;reCaptchaToken&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;username&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;password&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</code></pre></div><h2 id="create-user" tabindex="-1">Create user <a class="header-anchor" href="#create-user" aria-hidden="true">#</a></h2><p>Publicly accessible API end-point.</p><p>Create a new user account with a specific user name and a unique redirect URL if allowed by the survey settings. Currently used for integration with external survey systems.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>This function presents a vulnerability similar to the generate user function. The JWT signing is done on the client side by the current users of this function and can therefore be easily extracted.</p></div><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/surveys/{survey-slug}/create-user?params={token}

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><p><code>token</code> is the request parameters encoded as a signed JWT token. The signing key is set up in the survey parameters.</p><p>JWT payload expects following claims:</p><ul><li><code>user</code> - Unique respondent username within the survey</li><li><code>redirect</code> - Unique respondent username within the survey</li></ul><p>JWT Payload object</p><div class="language-json"><pre><code><span class="token punctuation">{</span>
  <span class="token property">&quot;user&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;redirect&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;userId&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
  <span class="token property">&quot;redirect&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;authToken&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</code></pre></div><ul><li><p><code>userId</code> - Internal Intake24 user ID</p></li><li><p><code>redirect</code> - Redirect URL decoded from the input token</p></li><li><p><code>authToken</code> - Authentication token for the new user</p></li></ul>`,39),r=[p];function o(i,u,c,l,d,h){return n(),s("div",null,r)}var v=e(t,[["render",o]]);export{g as __pageData,v as default};
