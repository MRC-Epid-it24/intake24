import{_ as s,c as e,o as n,a}from"./app.a95cc4c4.js";const v='{"title":"Surveys - respondent","description":"","frontmatter":{},"headers":[{"level":2,"title":"Survey parameters","slug":"survey-parameters"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"User info","slug":"user-info"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Get user session","slug":"get-user-session"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"},{"level":2,"title":"Set user session","slug":"set-user-session"},{"level":3,"title":"Request","slug":"request-3"},{"level":3,"title":"Response","slug":"response-3"},{"level":2,"title":"Survey follow-up","slug":"survey-follow-up"},{"level":3,"title":"Request","slug":"request-4"},{"level":3,"title":"Response","slug":"response-4"},{"level":2,"title":"Submit recall","slug":"submit-recall"},{"level":3,"title":"Request","slug":"request-5"},{"level":3,"title":"Response","slug":"response-5"},{"level":2,"title":"Request assistance","slug":"request-assistance"},{"level":3,"title":"Request","slug":"request-6"},{"level":3,"title":"Response","slug":"response-6"}],"relativePath":"api/respondent/surveys-respondent.md","lastUpdated":1642609165386}',t={},o=a(`<h1 id="surveys-respondent" tabindex="-1">Surveys - respondent <a class="header-anchor" href="#surveys-respondent" aria-hidden="true">#</a></h1><p>Survey-specific API endpoints accessible to respondents.</p><h2 id="survey-parameters" tabindex="-1">Survey parameters <a class="header-anchor" href="#survey-parameters" aria-hidden="true">#</a></h2><p>Returns survey parameters such as the scheme ID, current status, custom HTML content etc.</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/surveys/{surveyId}/parameters

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;schemeId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;state&quot;</span><span class="token operator">:</span> <span class="token string">&quot;pending&quot;</span> | <span class="token string">&quot;running&quot;</span> | <span class="token string">&quot;finished&quot;</span> | <span class="token string">&quot;suspended&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;suspensionReason&quot;</span><span class="token operator">:</span> string?<span class="token punctuation">,</span>
  <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string?<span class="token punctuation">,</span>
  <span class="token property">&quot;finalPageHtml&quot;</span><span class="token operator">:</span> string?<span class="token punctuation">,</span>
  <span class="token property">&quot;uxEventSettings&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;enableSearchEvents&quot;</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span> 
    <span class="token property">&quot;enableAssociatedFoodsEvents&quot;</span><span class="token operator">:</span> boolean
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;storeUserSessionOnServer&quot;</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span>
  <span class="token property">&quot;maximumDailySubmissions&quot;</span><span class="token operator">:</span> number
<span class="token punctuation">}</span>
</code></pre></div><h2 id="user-info" tabindex="-1">User info <a class="header-anchor" href="#user-info" aria-hidden="true">#</a></h2><p>Returns a subset of personal data for the current user that is relevant to the recall application.</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/surveys/{surveyId}/user-info?tzOffset={tzOffset}

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p><strong>tzOffset</strong> is client&#39;s timezone offset, (e.g. as returned by <code>new Date().getTimezoneOffset()</code> in web browsers).</p></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
   <span class="token property">&quot;id&quot;</span> <span class="token operator">:</span> string<span class="token punctuation">,</span>
   <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
   <span class="token property">&quot;recallNumber&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
   <span class="token property">&quot;redirectToFeedback&quot;</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span>
   <span class="token property">&quot;maximumTotalSubmissionsReached&quot;</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span>
   <span class="token property">&quot;maximumDailySubmissionsReached&quot;</span><span class="token operator">:</span> boolean
<span class="token punctuation">}</span>
</code></pre></div><p>where:</p><p><strong>surveyId</strong> is the internal (numerical) Intake24 user ID,</p><p><strong>name</strong> is optional first name of the respondent (used to confirm that the right person is completing the recall),</p><p><strong>recallNumber</strong> is the current recall number, i.e. the number of previous submissions + 1,</p><p><strong>redirectToFeedback</strong> means that the user should be redirected to dietary feedback and not allowed to complete, any more recalls</p><p><strong>maximumTotalSubmissionsReached</strong> means that the user is not allowed to complete any more recalls (used to display the correct error page in case the dietary feedback redirect is disabled),</p><p><strong>maximumDailySubmissionsReached</strong> means that the user is not allowed to complete any more recalls <em>today</em> but they could do so tomorrow. &quot;Today&quot; is defined as the current day in the user&#39;s local time zone.</p><h2 id="get-user-session" tabindex="-1">Get user session <a class="header-anchor" href="#get-user-session" aria-hidden="true">#</a></h2><p>Get survey user session (current recall state), if any. Functionality is controlled by survey settings.</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/surveys/{surveyId}/session

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;userId&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
  <span class="token property">&quot;surveyId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;sessionData&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="set-user-session" tabindex="-1">Set user session <a class="header-anchor" href="#set-user-session" aria-hidden="true">#</a></h2><p>Save survey user session (current recall state) on server. Functionality is controlled by survey settings.</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/surveys/{surveyId}/session

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
  <span class="token property">&quot;sessionData&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;userId&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
  <span class="token property">&quot;surveyId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;sessionData&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="survey-follow-up" tabindex="-1">Survey follow-up <a class="header-anchor" href="#survey-follow-up" aria-hidden="true">#</a></h2><p>Returns actions available at the end of the recall which can be a link to the next (external) stage of the survey and/or a link to the dietary feedback.</p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/surveys/{surveyId}/follow-up

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;followUpUrl&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">&quot;showFeedback&quot;</span><span class="token operator">:</span> boolean
<span class="token punctuation">}</span>
</code></pre></div><h2 id="submit-recall" tabindex="-1">Submit recall <a class="header-anchor" href="#submit-recall" aria-hidden="true">#</a></h2><p>Submit a completed recall.</p><p><a href="https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/system/user/SurveyController.scala#L181-L290" target="_blank" rel="noopener noreferrer">v3 implementation</a></p><h3 id="request-5" tabindex="-1">Request <a class="header-anchor" href="#request-5" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/surveys/{surveyId}/submissions

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
  <span class="token property">&quot;recall&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></code></pre></div><p>where:</p><p><strong>surveyId</strong> is the survey ID,</p><p><strong>recall</strong> is a completed dietary recall in JSON format.</p><h3 id="response-5" tabindex="-1">Response <a class="header-anchor" href="#response-5" aria-hidden="true">#</a></h3><p>Same as survey follow-up:</p><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;followUpUrl&quot;</span><span class="token operator">:</span> string | <span class="token null keyword">null</span><span class="token punctuation">,</span> 
  <span class="token property">&quot;showFeedback&quot;</span><span class="token operator">:</span> boolean
<span class="token punctuation">}</span>
</code></pre></div><h2 id="request-assistance" tabindex="-1">Request assistance <a class="header-anchor" href="#request-assistance" aria-hidden="true">#</a></h2><p>Notify people having support role for the survey to give the respondent a call to help them complete their recall.</p><p><a href="https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/system/user/HelpController.scala#L68-L138" target="_blank" rel="noopener noreferrer">v3 implementation</a></p><h3 id="request-6" tabindex="-1">Request <a class="header-anchor" href="#request-6" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/surveys/{surveyId}/request-callback

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;phone&quot;</span><span class="token operator">:</span> string
<span class="token punctuation">}</span> 
</span></code></pre></div><p>where:</p><p><strong>surveyId</strong> is the survey ID,</p><p><strong>name</strong> and <strong>phone</strong> are the respondent&#39;s contact details (as entered into the assistance request form by the respondent).</p><h3 id="response-6" tabindex="-1">Response <a class="header-anchor" href="#response-6" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK
</code></pre></div>`,61),p=[o];function r(l,c,u,i,d,h){return n(),e("div",null,p)}var y=s(t,[["render",r]]);export{v as __pageData,y as default};
