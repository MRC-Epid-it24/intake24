import{_ as s,c as a,o as e,a as n}from"./app.e1053834.js";const F=JSON.parse('{"title":"Securables","description":"","frontmatter":{},"headers":[{"level":2,"title":"Browse users","slug":"browse-users"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Create user with securables","slug":"create-user-with-securables"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Update securable actions","slug":"update-securable-actions"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"},{"level":2,"title":"Delete securable actions","slug":"delete-securable-actions"},{"level":3,"title":"Request","slug":"request-3"},{"level":3,"title":"Response","slug":"response-3"},{"level":2,"title":"Search for available users","slug":"search-for-available-users"},{"level":3,"title":"Request","slug":"request-4"},{"level":3,"title":"Response","slug":"response-4"},{"level":2,"title":"Update ownership","slug":"update-ownership"},{"level":3,"title":"Request","slug":"request-5"},{"level":3,"title":"Response","slug":"response-5"}],"relativePath":"api/admin/securables.md"}'),l={name:"api/admin/securables.md"},p=n(`<h1 id="securables" tabindex="-1">Securables <a class="header-anchor" href="#securables" aria-hidden="true">#</a></h1><p>Section describes subset of routes, which are registered for any resources with implemented <code>securable</code> per-record access.</p><p>Securable types:</p><ul><li><code>feedback-schemes</code></li><li><code>survey-schemes</code></li><li><code>surveys</code></li></ul><h2 id="browse-users" tabindex="-1">Browse users <a class="header-anchor" href="#browse-users" aria-hidden="true">#</a></h2><p>Browse paginated list of users with any permission for particular record</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">GET /api/admin/</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">securableType</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">securableId</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/securables</span></span>
<span class="line"><span style="color:#A6ACCD;">    ?search=</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">searchText</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">    &amp;page=</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">page</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">    &amp;limit=</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">limit</span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Authorization: Bearer </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">accessToken</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">Content-Type: application/json</span></span>
<span class="line"></span></code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#F78C6C;">200</span><span style="color:#A6ACCD;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">data</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[{</span><span style="color:#A6ACCD;">...</span><span style="color:#89DDFF;">}],</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">meta</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">...</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h2 id="create-user-with-securables" tabindex="-1">Create user with securables <a class="header-anchor" href="#create-user-with-securables" aria-hidden="true">#</a></h2><p>Create new user with <code>securable</code> actions.</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">POST /api/admin/</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">securableType</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">securableId</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/securables</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Authorization: Bearer </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">accessToken</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">email</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">name</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">phone</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">actions</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string</span><span style="color:#89DDFF;">[]</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#F78C6C;">201</span><span style="color:#A6ACCD;"> Created</span></span>
<span class="line"></span></code></pre></div><h2 id="update-securable-actions" tabindex="-1">Update securable actions <a class="header-anchor" href="#update-securable-actions" aria-hidden="true">#</a></h2><p>Update existing user with <code>securable</code> actions.</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">PATCH /api/admin/</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">securableType</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">securableId</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/securables/</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">userId</span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Authorization: Bearer </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">accessToken</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">actions</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string</span><span style="color:#89DDFF;">[]</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#F78C6C;">200</span><span style="color:#A6ACCD;"> OK</span></span>
<span class="line"></span></code></pre></div><h2 id="delete-securable-actions" tabindex="-1">Delete securable actions <a class="header-anchor" href="#delete-securable-actions" aria-hidden="true">#</a></h2><p>Delete user&#39;s <code>securable</code> actions.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>It does not remove user account.</p></div><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-hidden="true">#</a></h3><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">DELETE /api/admin/</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">securableType</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">securableId</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/securables/</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">userId</span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Authorization: Bearer </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">accessToken</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">Content-Type: application/json</span></span>
<span class="line"></span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-hidden="true">#</a></h3><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#F78C6C;">204</span><span style="color:#A6ACCD;"> No Content</span></span>
<span class="line"></span></code></pre></div><h2 id="search-for-available-users" tabindex="-1">Search for available users <a class="header-anchor" href="#search-for-available-users" aria-hidden="true">#</a></h2><p>Search for available users within the system to assign securables.</p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-hidden="true">#</a></h3><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">GET /api/admin/</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">securableType</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">securableId</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/securables/users</span></span>
<span class="line"><span style="color:#A6ACCD;">    ?search=</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">searchText</span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Authorization: Bearer </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">accessToken</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">Content-Type: application/json</span></span>
<span class="line"></span></code></pre></div><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-hidden="true">#</a></h3><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#F78C6C;">200</span><span style="color:#A6ACCD;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">[</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">id</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">name</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">email</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">    ...</span></span>
<span class="line"><span style="color:#89DDFF;">]</span></span>
<span class="line"></span></code></pre></div><h2 id="update-ownership" tabindex="-1">Update ownership <a class="header-anchor" href="#update-ownership" aria-hidden="true">#</a></h2><p>Update <code>securable</code> record&#39;s ownership.</p><h3 id="request-5" tabindex="-1">Request <a class="header-anchor" href="#request-5" aria-hidden="true">#</a></h3><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">POST /api/admin/</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">securableType</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">securableId</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/securables/owner</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Authorization: Bearer </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">accessToken</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">userId</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> string | </span><span style="color:#89DDFF;">null</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h3 id="response-5" tabindex="-1">Response <a class="header-anchor" href="#response-5" aria-hidden="true">#</a></h3><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#F78C6C;">200</span><span style="color:#A6ACCD;"> OK</span></span>
<span class="line"></span></code></pre></div>`,41),o=[p];function r(c,t,i,D,y,C){return e(),a("div",null,o)}var A=s(l,[["render",r]]);export{F as __pageData,A as default};
