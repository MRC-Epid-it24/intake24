import{_ as n,c as s,o as a,a as e}from"./app.2d6c6049.js";const q='{"title":"Surveys","description":"","frontmatter":{},"headers":[{"level":2,"title":"Browse surveys","slug":"browse-surveys"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Create survey","slug":"create-survey"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Get survey","slug":"get-survey"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"},{"level":2,"title":"Update survey","slug":"update-survey"},{"level":3,"title":"Request","slug":"request-3"},{"level":3,"title":"Response","slug":"response-3"},{"level":2,"title":"Partial update survey","slug":"partial-update-survey"},{"level":3,"title":"Request","slug":"request-4"},{"level":3,"title":"Response","slug":"response-4"},{"level":2,"title":"Delete survey","slug":"delete-survey"},{"level":3,"title":"Request","slug":"request-5"},{"level":3,"title":"Response","slug":"response-5"},{"level":2,"title":"Survey references","slug":"survey-references"},{"level":3,"title":"Request","slug":"request-6"},{"level":3,"title":"Response","slug":"response-6"}],"relativePath":"api/admin/surveys/surveys.md"}',t={},p=e(`<h1 id="surveys" tabindex="-1">Surveys <a class="header-anchor" href="#surveys" aria-hidden="true">#</a></h1><h2 id="browse-surveys" tabindex="-1">Browse surveys <a class="header-anchor" href="#browse-surveys" aria-hidden="true">#</a></h2><p>Browse paginated survey list</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/surveys
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
</code></pre></div><h2 id="create-survey" tabindex="-1">Create survey <a class="header-anchor" href="#create-survey" aria-hidden="true">#</a></h2><p>Create new survey entry</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/surveys

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;state&quot;</span><span class="token operator">:</span> SurveyState<span class="token punctuation">,</span>
    <span class="token property">&quot;localeId&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;schemeId&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;startDate&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;endDate&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;supportEmail&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;suspensionReason&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;allowGenUsers&quot;</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span>
    <span class="token property">&quot;genUserKey&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;authUrlDomainOverride&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;authUrlTokenCharset&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;authUrlTokenLength&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;storeUserSessionOnServer&quot;</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span>
    <span class="token property">&quot;feedbackEnabled&quot;</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span>
    <span class="token property">&quot;feedbackStyle&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;submissionNotificationUrl&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;numberOfSubmissionsForFeedback&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token property">&quot;maximumDailySubmissions&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token property">&quot;maximumTotalSubmissions&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;minimumSubmissionInterval&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token property">&quot;searchSortingAlgorithm&quot;</span><span class="token operator">:</span> SearchSortingAlgorithm<span class="token punctuation">,</span>
    <span class="token property">&quot;searchMatchScoreWeight&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token property">&quot;overrides&quot;</span><span class="token operator">:</span> SchemeOverrides<span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">201</span> Created

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="get-survey" tabindex="-1">Get survey <a class="header-anchor" href="#get-survey" aria-hidden="true">#</a></h2><p>Get survey entry</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/surveys/:surveyId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="update-survey" tabindex="-1">Update survey <a class="header-anchor" href="#update-survey" aria-hidden="true">#</a></h2><p>Update survey entry</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>PUT /api/admin/surveys/:surveyId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;state&quot;</span><span class="token operator">:</span> SurveyState<span class="token punctuation">,</span>
    <span class="token property">&quot;localeId&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;schemeId&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;startDate&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;endDate&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;supportEmail&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;suspensionReason&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;allowGenUsers&quot;</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span>
    <span class="token property">&quot;genUserKey&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;authUrlDomainOverride&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;authUrlTokenCharset&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;authUrlTokenLength&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;storeUserSessionOnServer&quot;</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span>
    <span class="token property">&quot;feedbackEnabled&quot;</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span>
    <span class="token property">&quot;feedbackStyle&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;submissionNotificationUrl&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;numberOfSubmissionsForFeedback&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token property">&quot;maximumDailySubmissions&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token property">&quot;maximumTotalSubmissions&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">&quot;minimumSubmissionInterval&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token property">&quot;searchSortingAlgorithm&quot;</span><span class="token operator">:</span> SearchSortingAlgorithm<span class="token punctuation">,</span>
    <span class="token property">&quot;searchMatchScoreWeight&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token property">&quot;overrides&quot;</span><span class="token operator">:</span> SchemeOverrides<span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="partial-update-survey" tabindex="-1">Partial update survey <a class="header-anchor" href="#partial-update-survey" aria-hidden="true">#</a></h2><p>Update survey entry - patch / partial update</p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>PATCH /api/admin/surveys/:surveyId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token string">&quot;name&quot;</span>?<span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&quot;state&quot;</span>?<span class="token operator">:</span> SurveyState<span class="token punctuation">,</span>
    <span class="token string">&quot;localeId&quot;</span>?<span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&quot;schemeId&quot;</span>?<span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&quot;startDate&quot;</span>?<span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&quot;endDate&quot;</span>?<span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&quot;supportEmail&quot;</span>?<span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&quot;suspensionReason&quot;</span>?<span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&quot;allowGenUsers&quot;</span>?<span class="token operator">:</span> boolean<span class="token punctuation">,</span>
    <span class="token string">&quot;genUserKey&quot;</span>?<span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&quot;authUrlDomainOverride&quot;</span>?<span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&quot;authUrlTokenCharset&quot;</span>?<span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&quot;authUrlTokenLength&quot;</span>?<span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&quot;storeUserSessionOnServer&quot;</span>?<span class="token operator">:</span> boolean<span class="token punctuation">,</span>
    <span class="token string">&quot;feedbackEnabled&quot;</span>?<span class="token operator">:</span> boolean<span class="token punctuation">,</span>
    <span class="token string">&quot;feedbackStyle&quot;</span>?<span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token string">&quot;submissionNotificationUrl&quot;</span>?<span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&quot;numberOfSubmissionsForFeedback&quot;</span>?<span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token string">&quot;maximumDailySubmissions&quot;</span>?<span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token string">&quot;maximumTotalSubmissions&quot;</span>?<span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&quot;minimumSubmissionInterval&quot;</span>?<span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token string">&quot;searchSortingAlgorithm&quot;</span>?<span class="token operator">:</span> SearchSortingAlgorithm<span class="token punctuation">,</span>
    <span class="token string">&quot;searchMatchScoreWeight&quot;</span>?<span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token string">&quot;overrides&quot;</span>?<span class="token operator">:</span> SchemeOverrides<span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="delete-survey" tabindex="-1">Delete survey <a class="header-anchor" href="#delete-survey" aria-hidden="true">#</a></h2><p>Delete survey entry</p><h3 id="request-5" tabindex="-1">Request <a class="header-anchor" href="#request-5" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>DELETE /api/admin/surveys/:surveyId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-5" tabindex="-1">Response <a class="header-anchor" href="#response-5" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">204</span> No Content
</code></pre></div><h2 id="survey-references" tabindex="-1">Survey references <a class="header-anchor" href="#survey-references" aria-hidden="true">#</a></h2><p>Get survey references</p><h3 id="request-6" tabindex="-1">Request <a class="header-anchor" href="#request-6" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/surveys/refs

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
    <span class="token property">&quot;locales&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;englishName&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;localName&quot;</span><span class="token operator">:</span> string
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        ...
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;feedbackSchemes&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;surveySchemes&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div>`,43),o=[p];function r(l,u,c,i,k,d){return a(),s("div",null,o)}var y=n(t,[["render",r]]);export{q as __pageData,y as default};
