import{_ as s,o as a,c as n,Q as l}from"./chunks/framework.b637c96f.js";const u=JSON.parse('{"title":"Permissions","description":"","frontmatter":{},"headers":[],"relativePath":"api/admin/permissions.md","filePath":"api/admin/permissions.md"}'),p={name:"api/admin/permissions.md"},e=l(`<h1 id="permissions" tabindex="-1">Permissions <a class="header-anchor" href="#permissions" aria-label="Permalink to &quot;Permissions&quot;">​</a></h1><h2 id="browse-permissions" tabindex="-1">Browse permissions <a class="header-anchor" href="#browse-permissions" aria-label="Permalink to &quot;Browse permissions&quot;">​</a></h2><p>Browse paginated permission list</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/admin/permissions</span></span>
<span class="line"><span style="color:#E1E4E8;">    ?search={</span><span style="color:#FDAEB7;font-style:italic;">searchText</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">    &amp;page={</span><span style="color:#FDAEB7;font-style:italic;">page</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">    &amp;limit={</span><span style="color:#FDAEB7;font-style:italic;">limit</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/admin/permissions</span></span>
<span class="line"><span style="color:#24292E;">    ?search={</span><span style="color:#B31D28;font-style:italic;">searchText</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">    &amp;page={</span><span style="color:#B31D28;font-style:italic;">page</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">    &amp;limit={</span><span style="color:#B31D28;font-style:italic;">limit</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span></code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;data&quot;</span><span style="color:#E1E4E8;">: [{</span><span style="color:#FDAEB7;font-style:italic;">...</span><span style="color:#E1E4E8;">}],</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;meta&quot;</span><span style="color:#E1E4E8;">: {</span><span style="color:#FDAEB7;font-style:italic;">...</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;data&quot;</span><span style="color:#24292E;">: [{</span><span style="color:#B31D28;font-style:italic;">...</span><span style="color:#24292E;">}],</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;meta&quot;</span><span style="color:#24292E;">: {</span><span style="color:#B31D28;font-style:italic;">...</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="create-permission" tabindex="-1">Create permission <a class="header-anchor" href="#create-permission" aria-label="Permalink to &quot;Create permission&quot;">​</a></h2><p>Create new permission entry</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">POST /api/admin/permissions</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;name&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;displayName&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;description&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">POST /api/admin/permissions</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;name&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;displayName&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;description&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">201</span><span style="color:#E1E4E8;"> Created</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FDAEB7;font-style:italic;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">201</span><span style="color:#24292E;"> Created</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#B31D28;font-style:italic;">...</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="get-permission" tabindex="-1">Get permission <a class="header-anchor" href="#get-permission" aria-label="Permalink to &quot;Get permission&quot;">​</a></h2><p>Get permission entry</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/admin/permissions/:permissionId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/admin/permissions/:permissionId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span></code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FDAEB7;font-style:italic;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#B31D28;font-style:italic;">...</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="update-permission" tabindex="-1">Update permission <a class="header-anchor" href="#update-permission" aria-label="Permalink to &quot;Update permission&quot;">​</a></h2><p>Update permission entry</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">PUT /api/admin/permissions/:permissionId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;name&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;displayName&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;description&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">PUT /api/admin/permissions/:permissionId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;name&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;displayName&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;description&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FDAEB7;font-style:italic;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#B31D28;font-style:italic;">...</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="delete-permission" tabindex="-1">Delete permission <a class="header-anchor" href="#delete-permission" aria-label="Permalink to &quot;Delete permission&quot;">​</a></h2><p>Delete permission entry</p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">DELETE /api/admin/permissions/:permissionId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">DELETE /api/admin/permissions/:permissionId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span></code></pre></div><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">204</span><span style="color:#E1E4E8;"> No Content</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">204</span><span style="color:#24292E;"> No Content</span></span></code></pre></div><h2 id="permission-roles" tabindex="-1">Permission roles <a class="header-anchor" href="#permission-roles" aria-label="Permalink to &quot;Permission roles&quot;">​</a></h2><p>Get roles associated with permission</p><h3 id="request-5" tabindex="-1">Request <a class="header-anchor" href="#request-5" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/admin/permissions/:permissionId/roles</span></span>
<span class="line"><span style="color:#E1E4E8;">    ?search={</span><span style="color:#FDAEB7;font-style:italic;">searchText</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">    &amp;page={</span><span style="color:#FDAEB7;font-style:italic;">page</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">    &amp;limit={</span><span style="color:#FDAEB7;font-style:italic;">limit</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/admin/permissions/:permissionId/roles</span></span>
<span class="line"><span style="color:#24292E;">    ?search={</span><span style="color:#B31D28;font-style:italic;">searchText</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">    &amp;page={</span><span style="color:#B31D28;font-style:italic;">page</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">    &amp;limit={</span><span style="color:#B31D28;font-style:italic;">limit</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span></code></pre></div><h3 id="response-5" tabindex="-1">Response <a class="header-anchor" href="#response-5" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;data&quot;</span><span style="color:#E1E4E8;">: [{</span><span style="color:#FDAEB7;font-style:italic;">...</span><span style="color:#E1E4E8;">}],</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;meta&quot;</span><span style="color:#E1E4E8;">: {</span><span style="color:#FDAEB7;font-style:italic;">...</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;data&quot;</span><span style="color:#24292E;">: [{</span><span style="color:#B31D28;font-style:italic;">...</span><span style="color:#24292E;">}],</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;meta&quot;</span><span style="color:#24292E;">: {</span><span style="color:#B31D28;font-style:italic;">...</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="permission-users" tabindex="-1">Permission users <a class="header-anchor" href="#permission-users" aria-label="Permalink to &quot;Permission users&quot;">​</a></h2><p>Get users associated with permission</p><h3 id="request-6" tabindex="-1">Request <a class="header-anchor" href="#request-6" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/admin/permissions/:permissionId/users</span></span>
<span class="line"><span style="color:#E1E4E8;">    ?search={</span><span style="color:#FDAEB7;font-style:italic;">searchText</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">    &amp;page={</span><span style="color:#FDAEB7;font-style:italic;">page</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">    &amp;limit={</span><span style="color:#FDAEB7;font-style:italic;">limit</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/admin/permissions/:permissionId/users</span></span>
<span class="line"><span style="color:#24292E;">    ?search={</span><span style="color:#B31D28;font-style:italic;">searchText</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">    &amp;page={</span><span style="color:#B31D28;font-style:italic;">page</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">    &amp;limit={</span><span style="color:#B31D28;font-style:italic;">limit</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span></code></pre></div><h3 id="response-6" tabindex="-1">Response <a class="header-anchor" href="#response-6" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;data&quot;</span><span style="color:#E1E4E8;">: [{</span><span style="color:#FDAEB7;font-style:italic;">...</span><span style="color:#E1E4E8;">}],</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;meta&quot;</span><span style="color:#E1E4E8;">: {</span><span style="color:#FDAEB7;font-style:italic;">...</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;data&quot;</span><span style="color:#24292E;">: [{</span><span style="color:#B31D28;font-style:italic;">...</span><span style="color:#24292E;">}],</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;meta&quot;</span><span style="color:#24292E;">: {</span><span style="color:#B31D28;font-style:italic;">...</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,43),o=[e];function t(i,c,r,E,y,d){return a(),n("div",null,o)}const m=s(p,[["render",t]]);export{u as __pageData,m as default};
