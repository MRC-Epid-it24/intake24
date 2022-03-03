import{_ as n,c as s,o as a,a as e}from"./app.7092d291.js";const q='{"title":"Survey respondents","description":"","frontmatter":{},"headers":[{"level":2,"title":"Browse respondents","slug":"browse-respondents"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Create respondent","slug":"create-respondent"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Get respondent","slug":"get-respondent"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"},{"level":2,"title":"Update respondent","slug":"update-respondent"},{"level":3,"title":"Request","slug":"request-3"},{"level":3,"title":"Response","slug":"response-3"},{"level":2,"title":"Delete respondent","slug":"delete-respondent"},{"level":3,"title":"Request","slug":"request-4"},{"level":3,"title":"Response","slug":"response-4"},{"level":2,"title":"Export authentication URLs","slug":"export-authentication-urls"},{"level":3,"title":"Request","slug":"request-5"},{"level":3,"title":"Response","slug":"response-5"},{"level":2,"title":"Upload respondents","slug":"upload-respondents"},{"level":3,"title":"Request","slug":"request-6"},{"level":3,"title":"Response","slug":"response-6"}],"relativePath":"api/admin/surveys/respondents.md"}',t={},p=e(`<h1 id="survey-respondents" tabindex="-1">Survey respondents <a class="header-anchor" href="#survey-respondents" aria-hidden="true">#</a></h1><h2 id="browse-respondents" tabindex="-1">Browse respondents <a class="header-anchor" href="#browse-respondents" aria-hidden="true">#</a></h2><p>Get list of survey respondents.</p><div class="tip custom-block"><p class="custom-block-title">List content</p><p>List includes users with <code>{surveyId}/respondent</code> role.</p></div><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/surveys/:surveyId/respondents
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
</code></pre></div><h2 id="create-respondent" tabindex="-1">Create respondent <a class="header-anchor" href="#create-respondent" aria-hidden="true">#</a></h2><p>Create new survey respondent</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/surveys/:surveyId/respondents

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;userName&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string? | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> string? | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;phone&quot;</span><span class="token operator">:</span> string? | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;password&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;passwordConfirm&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;customFields&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> string
        <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">201</span> Created

<span class="token punctuation">{</span>
    <span class="token property">&quot;userId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;surveyId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;userName&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;urlAuthToken&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;phone&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;customFields&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> string
        <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="get-respondent" tabindex="-1">Get respondent <a class="header-anchor" href="#get-respondent" aria-hidden="true">#</a></h2><p>Get survey respondent record</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/surveys/:surveyId/respondents/:userId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;userId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;surveyId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;userName&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;urlAuthToken&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;phone&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;customFields&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> string
        <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="update-respondent" tabindex="-1">Update respondent <a class="header-anchor" href="#update-respondent" aria-hidden="true">#</a></h2><p>Update survey respondent</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>PATCH /api/admin/surveys/:surveyId/respondents/:userId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string? | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> string? | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;phone&quot;</span><span class="token operator">:</span> string? | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;password&quot;</span><span class="token operator">:</span> string? | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;passwordConfirm&quot;</span><span class="token operator">:</span> string? | <span class="token null keyword">null</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;userId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;surveyId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;userName&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;urlAuthToken&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;phone&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;customFields&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> string
        <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="delete-respondent" tabindex="-1">Delete respondent <a class="header-anchor" href="#delete-respondent" aria-hidden="true">#</a></h2><p>Delete respondent</p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>DELETE /api/admin/surveys/:surveyId/respondents/:userId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">204</span> No Content
</code></pre></div><h2 id="export-authentication-urls" tabindex="-1">Export authentication URLs <a class="header-anchor" href="#export-authentication-urls" aria-hidden="true">#</a></h2><p>Submits a job to generate CSV file with authentication URLs.</p><h3 id="request-5" tabindex="-1">Request <a class="header-anchor" href="#request-5" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/surveys/:surveyId/respondents/export-auth-urls

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-5" tabindex="-1">Response <a class="header-anchor" href="#response-5" aria-hidden="true">#</a></h3><p>Returns job resource entry.</p><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="upload-respondents" tabindex="-1">Upload respondents <a class="header-anchor" href="#upload-respondents" aria-hidden="true">#</a></h2><p>Submits a job to import respondent from CSV file.</p><h3 id="request-6" tabindex="-1">Request <a class="header-anchor" href="#request-6" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/surveys/:surveyId/respondents/upload

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">multipart/form-data</span></span>

{
    &quot;file&quot;: File
}
</code></pre></div><h3 id="response-6" tabindex="-1">Response <a class="header-anchor" href="#response-6" aria-hidden="true">#</a></h3><p>Returns job resource entry.</p><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div>`,46),o=[p];function r(l,u,c,i,d,k){return a(),s("div",null,o)}var y=n(t,[["render",r]]);export{q as __pageData,y as default};
