import{_ as e,c as s,o as a,a as n}from"./app.6be661ae.js";const k='{"title":"Web Push notifications","description":"","frontmatter":{},"headers":[{"level":2,"title":"Subscribe","slug":"subscribe"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Unsubscribe","slug":"unsubscribe"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Push","slug":"push"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"}],"relativePath":"api/subscriptions.md","lastUpdated":1643303500869}',t={},o=n(`<h1 id="web-push-notifications" tabindex="-1">Web Push notifications <a class="header-anchor" href="#web-push-notifications" aria-hidden="true">#</a></h1><p>Web Push notifications subscriptions management</p><h2 id="subscribe" tabindex="-1">Subscribe <a class="header-anchor" href="#subscribe" aria-hidden="true">#</a></h2><p>Subscribe logged-in user to receive web-push notifications. It expects the subscription object produced by <code>PushManager.subscribe()</code> <a href="https://developer.mozilla.org/en-US/docs/Web/API/PushManager/subscribe" target="_blank" rel="noopener noreferrer">Web API</a></p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/subscriptions

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;subscription&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;endpoint&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;keys&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token property">&quot;p256dh&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;auth&quot;</span><span class="token operator">:</span> string
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK
</code></pre></div><h2 id="unsubscribe" tabindex="-1">Unsubscribe <a class="header-anchor" href="#unsubscribe" aria-hidden="true">#</a></h2><p>Unsubscribe logged-in user from receiving web-push notifications</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>DELETE /api/subscriptions

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">204</span> No Content
</code></pre></div><h2 id="push" tabindex="-1">Push <a class="header-anchor" href="#push" aria-hidden="true">#</a></h2><p>Send <code>test</code> Push notification to logged-in user</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/subscriptions/push

<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK
</code></pre></div>`,20),p=[o];function r(i,c,u,l,d,h){return a(),s("div",null,p)}var g=e(t,[["render",r]]);export{k as __pageData,g as default};
