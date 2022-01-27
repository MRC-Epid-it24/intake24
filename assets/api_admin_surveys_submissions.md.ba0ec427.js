import{_ as s,c as n,o as a,a as t}from"./app.6be661ae.js";const h='{"title":"Survey submissions","description":"","frontmatter":{},"headers":[{"level":2,"title":"Browse survey submissions","slug":"browse-survey-submissions"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Get survey submission","slug":"get-survey-submission"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Delete survey submission","slug":"delete-survey-submission"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"}],"relativePath":"api/admin/surveys/submissions.md","lastUpdated":1643303500869}',e={},p=t(`<h1 id="survey-submissions" tabindex="-1">Survey submissions <a class="header-anchor" href="#survey-submissions" aria-hidden="true">#</a></h1><h2 id="browse-survey-submissions" tabindex="-1">Browse survey submissions <a class="header-anchor" href="#browse-survey-submissions" aria-hidden="true">#</a></h2><p>Get list of survey submissions.</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/surveys/:surveyId/submissions
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
</code></pre></div><h2 id="get-survey-submission" tabindex="-1">Get survey submission <a class="header-anchor" href="#get-survey-submission" aria-hidden="true">#</a></h2><p>Get survey submission entry</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/surveys/:surveyId/submissions/:submissionId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;surveyId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;userId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;startTime&quot;</span><span class="token operator">:</span> Date<span class="token punctuation">,</span>
  <span class="token property">&quot;endTime&quot;</span><span class="token operator">:</span> Date<span class="token punctuation">,</span>
  <span class="token property">&quot;submissionTime&quot;</span><span class="token operator">:</span> Date<span class="token punctuation">,</span>
  <span class="token property">&quot;log&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;uxSessionId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;user&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
      <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
      <span class="token property">&quot;phone&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
      <span class="token property">&quot;aliases&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
          <span class="token property">&quot;userId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
          <span class="token property">&quot;surveyId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
          <span class="token property">&quot;userName&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
          <span class="token property">&quot;urlAuthToken&quot;</span><span class="token operator">:</span> string
        <span class="token punctuation">}</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token property">&quot;customFields&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
          <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
          <span class="token property">&quot;userId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
          <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
          <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> string
        <span class="token punctuation">}</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">&quot;customFields&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;submissionId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> string
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">&quot;meals&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;submissionId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;hours&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
      <span class="token property">&quot;minutes&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
      <span class="token property">&quot;customFields&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
          <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
          <span class="token property">&quot;meaId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
          <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
          <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> string
        <span class="token punctuation">}</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token property">&quot;foods&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token property">&quot;missingFoods&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="delete-survey-submission" tabindex="-1">Delete survey submission <a class="header-anchor" href="#delete-survey-submission" aria-hidden="true">#</a></h2><p>Delete survey submission records</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>DELETE /api/admin/surveys/:surveyId/submissions/:submissionId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">204</span> No Content
</code></pre></div>`,19),o=[p];function u(r,c,l,i,k,d){return a(),n("div",null,o)}var y=s(e,[["render",u]]);export{h as __pageData,y as default};
