import{_ as s,c as e,o as a,a as n}from"./app.41bcad43.js";const v='{"title":"Survey schemes","description":"","frontmatter":{},"headers":[{"level":2,"title":"Browse survey schemes","slug":"browse-survey-schemes"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Create survey scheme","slug":"create-survey-scheme"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Get survey scheme","slug":"get-survey-scheme"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"},{"level":2,"title":"Update survey scheme","slug":"update-survey-scheme"},{"level":3,"title":"Request","slug":"request-3"},{"level":3,"title":"Response","slug":"response-3"},{"level":2,"title":"Delete survey scheme","slug":"delete-survey-scheme"},{"level":3,"title":"Request","slug":"request-4"},{"level":3,"title":"Response","slug":"response-4"},{"level":2,"title":"Copy survey scheme","slug":"copy-survey-scheme"},{"level":3,"title":"Request","slug":"request-5"},{"level":3,"title":"Response","slug":"response-5"},{"level":2,"title":"Survey scheme references","slug":"survey-scheme-references"},{"level":3,"title":"Request","slug":"request-6"},{"level":3,"title":"Response","slug":"response-6"},{"level":2,"title":"Data export references","slug":"data-export-references"},{"level":3,"title":"Request","slug":"request-7"},{"level":3,"title":"Response","slug":"response-7"},{"level":2,"title":"Question templates","slug":"question-templates"},{"level":3,"title":"Request","slug":"request-8"},{"level":3,"title":"Response","slug":"response-8"}],"relativePath":"api/admin/survey-schemes.md"}',t={},p=n(`<h1 id="survey-schemes" tabindex="-1">Survey schemes <a class="header-anchor" href="#survey-schemes" aria-hidden="true">#</a></h1><h2 id="browse-survey-schemes" tabindex="-1">Browse survey schemes <a class="header-anchor" href="#browse-survey-schemes" aria-hidden="true">#</a></h2><p>Browse paginated survey scheme list</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/survey-schemes
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
</code></pre></div><h2 id="create-survey-scheme" tabindex="-1">Create survey scheme <a class="header-anchor" href="#create-survey-scheme" aria-hidden="true">#</a></h2><p>Create new survey scheme entry</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/survey-schemes

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> &#39;default&#39;<span class="token punctuation">,</span>
    <span class="token property">&quot;meals&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;questions&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;dataExport&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">201</span> Created

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="get-survey-scheme" tabindex="-1">Get survey scheme <a class="header-anchor" href="#get-survey-scheme" aria-hidden="true">#</a></h2><p>Get survey scheme entry</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/survey-schemes/:surveySchemeId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="update-survey-scheme" tabindex="-1">Update survey scheme <a class="header-anchor" href="#update-survey-scheme" aria-hidden="true">#</a></h2><p>Update survey scheme entry</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>PATCH /api/admin/survey-schemes/:surveySchemeId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> &#39;default&#39;<span class="token punctuation">,</span>
    <span class="token property">&quot;meals&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;questions&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;dataExport&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="delete-survey-scheme" tabindex="-1">Delete survey scheme <a class="header-anchor" href="#delete-survey-scheme" aria-hidden="true">#</a></h2><p>Delete survey scheme entry</p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>DELETE /api/admin/survey-schemes/:surveySchemeId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">204</span> No Content
</code></pre></div><h2 id="copy-survey-scheme" tabindex="-1">Copy survey scheme <a class="header-anchor" href="#copy-survey-scheme" aria-hidden="true">#</a></h2><p>Create a new copy of specified source survey scheme</p><h3 id="request-5" tabindex="-1">Request <a class="header-anchor" href="#request-5" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/survey-schemes/:surveySchemeId/copy

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-5" tabindex="-1">Response <a class="header-anchor" href="#response-5" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="survey-scheme-references" tabindex="-1">Survey scheme references <a class="header-anchor" href="#survey-scheme-references" aria-hidden="true">#</a></h2><p>Get survey scheme references</p><h3 id="request-6" tabindex="-1">Request <a class="header-anchor" href="#request-6" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/survey-schemes/refs

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-6" tabindex="-1">Response <a class="header-anchor" href="#response-6" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

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
    <span class="token property">&quot;templates&quot;</span><span class="token operator">:</span> PromptQuestion<span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="data-export-references" tabindex="-1">Data export references <a class="header-anchor" href="#data-export-references" aria-hidden="true">#</a></h2><p>Available fields for data export</p><h3 id="request-7" tabindex="-1">Request <a class="header-anchor" href="#request-7" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/survey-schemes/:surveySchemeId/data-export

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-7" tabindex="-1">Response <a class="header-anchor" href="#response-7" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;food&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;label&quot;</span><span class="token operator">:</span> string
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        ...
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;foodCustom&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;foodFields&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;foodNutrients&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;meal&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;mealCustom&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;portionSizes&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;survey&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;surveyCustom&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;user&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;userCustom&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="question-templates" tabindex="-1">Question templates <a class="header-anchor" href="#question-templates" aria-hidden="true">#</a></h2><p>Browse available question templates for scheme</p><h3 id="request-8" tabindex="-1">Request <a class="header-anchor" href="#request-8" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/survey-schemes/:surveySchemeId/templates
    ?search={searchText}
    &amp;limit={limit}

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-8" tabindex="-1">Response <a class="header-anchor" href="#response-8" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">[</span>
    <span class="token punctuation">{</span>...<span class="token punctuation">}</span>
<span class="token punctuation">]</span>
</code></pre></div>`,55),o=[p];function c(r,u,l,i,d,h){return a(),e("div",null,o)}var y=s(t,[["render",c]]);export{v as __pageData,y as default};
