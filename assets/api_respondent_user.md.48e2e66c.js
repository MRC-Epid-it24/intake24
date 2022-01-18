import{_ as s,c as n,o as a,a as t}from"./app.a95cc4c4.js";const q='{"title":"User","description":"","frontmatter":{},"headers":[{"level":2,"title":"Get physical data","slug":"get-physical-data"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Update physical data","slug":"update-physical-data"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Submissions","slug":"submissions"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"},{"level":2,"title":"Update password","slug":"update-password"},{"level":3,"title":"Request","slug":"request-3"},{"level":3,"title":"Response","slug":"response-3"}],"relativePath":"api/respondent/user.md","lastUpdated":1642526787278}',p={},e=t(`<h1 id="user" tabindex="-1">User <a class="header-anchor" href="#user" aria-hidden="true">#</a></h1><p>User API endpoints accessible to authentication user.</p><h2 id="get-physical-data" tabindex="-1">Get physical data <a class="header-anchor" href="#get-physical-data" aria-hidden="true">#</a></h2><p>Get user&#39;s physical data.</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/user/physical-data

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;userId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;sex&quot;</span><span class="token operator">:</span> Sex | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;weightKg&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;heightCm&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;physicalActivityLevelId&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;birthdate&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;weightTarget&quot;</span><span class="token operator">:</span> WeightTarget | <span class="token null keyword">null</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="update-physical-data" tabindex="-1">Update physical data <a class="header-anchor" href="#update-physical-data" aria-hidden="true">#</a></h2><p>Update user&#39;s physical data.</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/user/physical-data

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
  <span class="token property">&quot;sex&quot;</span><span class="token operator">:</span> Sex | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;weightKg&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;heightCm&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;physicalActivityLevelId&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;birthdate&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;weightTarget&quot;</span><span class="token operator">:</span> WeightTarget | <span class="token null keyword">null</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;userId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;sex&quot;</span><span class="token operator">:</span> Sex | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;weightKg&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;heightCm&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;physicalActivityLevelId&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;birthdate&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;weightTarget&quot;</span><span class="token operator">:</span> WeightTarget | <span class="token null keyword">null</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="submissions" tabindex="-1">Submissions <a class="header-anchor" href="#submissions" aria-hidden="true">#</a></h2><p>User submissions for specific survey</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/user/submissions?surveyId={surveyId}

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

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
      <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;phone&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
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
<span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span>
</code></pre></div><h2 id="update-password" tabindex="-1">Update password <a class="header-anchor" href="#update-password" aria-hidden="true">#</a></h2><p>Update password of authenticated user</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/user/password

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
  <span class="token property">&quot;passwordCurrent&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;password&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;passwordConfirm&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK
</code></pre></div>`,26),o=[e];function r(u,c,l,i,k,d){return a(),n("div",null,o)}var y=s(p,[["render",r]]);export{q as __pageData,y as default};
