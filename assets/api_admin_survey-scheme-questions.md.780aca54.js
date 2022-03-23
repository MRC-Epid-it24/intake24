import{_ as e,c as s,o as n,a}from"./app.954531fb.js";const q='{"title":"Survey scheme questions","description":"","frontmatter":{},"headers":[{"level":2,"title":"Browse survey scheme questions","slug":"browse-survey-scheme-questions"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Create survey scheme question","slug":"create-survey-scheme-question"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Get survey scheme question","slug":"get-survey-scheme-question"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"},{"level":2,"title":"Update survey scheme question","slug":"update-survey-scheme-question"},{"level":3,"title":"Request","slug":"request-3"},{"level":3,"title":"Response","slug":"response-3"},{"level":2,"title":"Delete survey scheme question","slug":"delete-survey-scheme-question"},{"level":3,"title":"Request","slug":"request-4"},{"level":3,"title":"Response","slug":"response-4"},{"level":2,"title":"Survey scheme question references","slug":"survey-scheme-question-references"},{"level":3,"title":"Request","slug":"request-5"},{"level":3,"title":"Response","slug":"response-5"},{"level":2,"title":"Scheme question sync","slug":"scheme-question-sync"},{"level":3,"title":"Request","slug":"request-6"},{"level":3,"title":"Response","slug":"response-6"}],"relativePath":"api/admin/survey-scheme-questions.md"}',t={},p=a(`<h1 id="survey-scheme-questions" tabindex="-1">Survey scheme questions <a class="header-anchor" href="#survey-scheme-questions" aria-hidden="true">#</a></h1><p>Manage survey scheme question templates</p><h2 id="browse-survey-scheme-questions" tabindex="-1">Browse survey scheme questions <a class="header-anchor" href="#browse-survey-scheme-questions" aria-hidden="true">#</a></h2><p>Browse paginated survey scheme questions list</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/survey-scheme-questions
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
</code></pre></div><h2 id="create-survey-scheme-question" tabindex="-1">Create survey scheme question <a class="header-anchor" href="#create-survey-scheme-question" aria-hidden="true">#</a></h2><p>Create new survey scheme question entry</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/survey-scheme-questions

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;question&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">201</span> Created

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="get-survey-scheme-question" tabindex="-1">Get survey scheme question <a class="header-anchor" href="#get-survey-scheme-question" aria-hidden="true">#</a></h2><p>Get survey scheme question entry</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/survey-scheme-questions/:surveySchemeQuestionId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="update-survey-scheme-question" tabindex="-1">Update survey scheme question <a class="header-anchor" href="#update-survey-scheme-question" aria-hidden="true">#</a></h2><p>Update survey scheme question entry</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>PUT /api/admin/survey-scheme-questions/:surveySchemeQuestionId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;question&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="delete-survey-scheme-question" tabindex="-1">Delete survey scheme question <a class="header-anchor" href="#delete-survey-scheme-question" aria-hidden="true">#</a></h2><p>Delete survey scheme question entry</p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>DELETE /api/admin/survey-scheme-questions/:surveySchemeQuestionId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">204</span> No Content
</code></pre></div><h2 id="survey-scheme-question-references" tabindex="-1">Survey scheme question references <a class="header-anchor" href="#survey-scheme-question-references" aria-hidden="true">#</a></h2><p>Get survey scheme question references</p><h3 id="request-5" tabindex="-1">Request <a class="header-anchor" href="#request-5" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/survey-scheme-questions/refs

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-5" tabindex="-1">Response <a class="header-anchor" href="#response-5" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;languages&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;englishName&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;localName&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;countryFlagCode&quot;</span><span class="token operator">:</span> string
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        ...
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;questionIds&quot;</span><span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;schemes&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="scheme-question-sync" tabindex="-1">Scheme question sync <a class="header-anchor" href="#scheme-question-sync" aria-hidden="true">#</a></h2><p>Synchronize scheme question template with specific question in scheme section</p><h3 id="request-6" tabindex="-1">Request <a class="header-anchor" href="#request-6" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/survey-scheme-questions/:surveySchemeQuestionId/sync

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;surveySchemeId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;section&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;question&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-6" tabindex="-1">Response <a class="header-anchor" href="#response-6" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;data&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre></div>`,44),o=[p];function r(c,u,i,l,d,h){return n(),s("div",null,o)}var v=e(t,[["render",r]]);export{q as __pageData,v as default};
