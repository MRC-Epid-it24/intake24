import{_ as s,c as e,o as a,a as n}from"./app.a95cc4c4.js";const k='{"title":"Survey management","description":"","frontmatter":{},"headers":[{"level":3,"title":"Survey resource permissions:","slug":"survey-resource-permissions"},{"level":3,"title":"Two specific permissions:","slug":"two-specific-permissions"},{"level":2,"title":"Browse management users","slug":"browse-management-users"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Available management permissions","slug":"available-management-permissions"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Available management users","slug":"available-management-users"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"},{"level":2,"title":"Create management user","slug":"create-management-user"},{"level":3,"title":"Request","slug":"request-3"},{"level":3,"title":"Response","slug":"response-3"},{"level":2,"title":"Update management user","slug":"update-management-user"},{"level":3,"title":"Request","slug":"request-4"},{"level":3,"title":"Response","slug":"response-4"}],"relativePath":"api/admin/surveys/mgmt.md","lastUpdated":1642613177043}',t={},o=n(`<h1 id="survey-management" tabindex="-1">Survey management <a class="header-anchor" href="#survey-management" aria-hidden="true">#</a></h1><p>Survey management works with following permissions.</p><h3 id="survey-resource-permissions" tabindex="-1">Survey resource permissions: <a class="header-anchor" href="#survey-resource-permissions" aria-hidden="true">#</a></h3><ul><li><code>surveys-browse</code> - allows to browse survey list</li><li><code>surveys-create</code> - allows to create survey record</li><li><code>surveys-read</code> - allows to read survey record</li><li><code>surveys-edit</code> - allows to edit the survey list</li><li><code>surveys-delete</code> - allows to browse the survey list</li><li><code>surveys-overrides</code> - allows to manage survey scheme overrides</li><li><code>surveys-mgmt</code> - allows to manage staff accounts</li><li><code>surveys-respondents</code> - allows to manage respondents accounts</li><li><code>surveys-submissions</code> - allows to read survey submissions</li><li><code>surveys-data-export</code> - allows to export survey submission data</li></ul><h3 id="two-specific-permissions" tabindex="-1">Two specific permissions: <a class="header-anchor" href="#two-specific-permissions" aria-hidden="true">#</a></h3><ul><li><code>{surveyId}/staff</code> - gives access to particular study record</li><li><code>{surveyId}/support</code> - user will receive any help queries from survey respondents</li></ul><h2 id="browse-management-users" tabindex="-1">Browse management users <a class="header-anchor" href="#browse-management-users" aria-hidden="true">#</a></h2><p>Get list of survey management users having at least one of the above permission list.</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/surveys/:surveyId/mgmt
    ?search={searchText}
    &amp;page={page}
    &amp;limit={limit}

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;data&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;permissions&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
                <span class="token punctuation">{</span>
                    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
                    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
                    <span class="token property">&quot;displayName&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">]</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;meta&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="available-management-permissions" tabindex="-1">Available management permissions <a class="header-anchor" href="#available-management-permissions" aria-hidden="true">#</a></h2><p>Get list of permissions, which can be assigned to survey management users.</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/surveys/:surveyId/mgmt/permissions

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
        <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;displayName&quot;</span><span class="token operator">:</span> string
    <span class="token punctuation">}</span>
<span class="token punctuation">]</span>
</code></pre></div><h2 id="available-management-users" tabindex="-1">Available management users <a class="header-anchor" href="#available-management-users" aria-hidden="true">#</a></h2><p>Get list of users with system active account and no permission from above permission list.</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/surveys/:surveyId/mgmt/users?search={searchText}

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
        <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> string
    <span class="token punctuation">}</span>
<span class="token punctuation">]</span>
</code></pre></div><h2 id="create-management-user" tabindex="-1">Create management user <a class="header-anchor" href="#create-management-user" aria-hidden="true">#</a></h2><p>Assign list of survey management roles to specified user</p><ul><li><code>{surveyId}/staff</code></li><li><code>{surveyId}/support</code></li></ul><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/surveys/:surveyId/mgmt

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> string | undefined<span class="token punctuation">,</span>
    <span class="token property">&quot;phone&quot;</span><span class="token operator">:</span> string | undefined<span class="token punctuation">,</span>
    <span class="token property">&quot;permissions&quot;</span><span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">201</span> Created
</code></pre></div><h2 id="update-management-user" tabindex="-1">Update management user <a class="header-anchor" href="#update-management-user" aria-hidden="true">#</a></h2><p>Assign list of survey management permissions to specified user</p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>PATCH /api/admin/surveys/:surveyId/mgmt/:userId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;permissions&quot;</span><span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK
</code></pre></div>`,37),p=[o];function r(i,l,c,u,d,h){return a(),e("div",null,p)}var v=s(t,[["render",r]]);export{k as __pageData,v as default};
