import{_ as s,o as n,c as a,Q as e}from"./chunks/framework.abd19ccc.js";const h=JSON.parse('{"title":"Nutrient types","description":"","frontmatter":{},"headers":[],"relativePath":"api/admin/nutrient-types.md","filePath":"api/admin/nutrient-types.md"}'),l={name:"api/admin/nutrient-types.md"},p=e(`<h1 id="nutrient-types" tabindex="-1">Nutrient types <a class="header-anchor" href="#nutrient-types" aria-label="Permalink to &quot;Nutrient types&quot;">​</a></h1><h2 id="browse-nutrient-types" tabindex="-1">Browse nutrient types <a class="header-anchor" href="#browse-nutrient-types" aria-label="Permalink to &quot;Browse nutrient types&quot;">​</a></h2><p>Browse paginated nutrient type list</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/admin/nutrient-types</span></span>
<span class="line"><span style="color:#E1E4E8;">    ?search={</span><span style="color:#FDAEB7;font-style:italic;">searchText</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">    &amp;page={</span><span style="color:#FDAEB7;font-style:italic;">page</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">    &amp;limit={</span><span style="color:#FDAEB7;font-style:italic;">limit</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/admin/nutrient-types</span></span>
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
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="create-nutrient-type" tabindex="-1">Create nutrient type <a class="header-anchor" href="#create-nutrient-type" aria-label="Permalink to &quot;Create nutrient type&quot;">​</a></h2><p>Create new nutrient type entry</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">POST /api/admin/nutrient-types</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;id&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;description&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;unitId&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;kcalPerUnit&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">number</span><span style="color:#E1E4E8;"> </span><span style="color:#FDAEB7;font-style:italic;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">POST /api/admin/nutrient-types</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;id&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;description&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;unitId&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;kcalPerUnit&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">number</span><span style="color:#24292E;"> </span><span style="color:#B31D28;font-style:italic;">|</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">201</span><span style="color:#E1E4E8;"> Created</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FDAEB7;font-style:italic;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">201</span><span style="color:#24292E;"> Created</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#B31D28;font-style:italic;">...</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="get-nutrient-type" tabindex="-1">Get nutrient type <a class="header-anchor" href="#get-nutrient-type" aria-label="Permalink to &quot;Get nutrient type&quot;">​</a></h2><p>Get nutrient type entry</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/admin/nutrient-types/:nutrientTypeId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/admin/nutrient-types/:nutrientTypeId</span></span>
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
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="update-nutrient-type" tabindex="-1">Update nutrient type <a class="header-anchor" href="#update-nutrient-type" aria-label="Permalink to &quot;Update nutrient type&quot;">​</a></h2><p>Update nutrient type entry</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">PUT /api/admin/nutrient-types/:nutrientTypeId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;description&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;unitId&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;kcalPerUnit&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">number</span><span style="color:#E1E4E8;"> </span><span style="color:#FDAEB7;font-style:italic;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">PUT /api/admin/nutrient-types/:nutrientTypeId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;description&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;unitId&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;kcalPerUnit&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">number</span><span style="color:#24292E;"> </span><span style="color:#B31D28;font-style:italic;">|</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FDAEB7;font-style:italic;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#B31D28;font-style:italic;">...</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="delete-nutrient-type" tabindex="-1">Delete nutrient type <a class="header-anchor" href="#delete-nutrient-type" aria-label="Permalink to &quot;Delete nutrient type&quot;">​</a></h2><p>Delete nutrient type entry</p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">DELETE /api/admin/nutrient-types/:nutrientTypeId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">DELETE /api/admin/nutrient-types/:nutrientTypeId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span></code></pre></div><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">204</span><span style="color:#E1E4E8;"> No Content</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">204</span><span style="color:#24292E;"> No Content</span></span></code></pre></div><h2 id="nutrient-type-references" tabindex="-1">nutrient type references <a class="header-anchor" href="#nutrient-type-references" aria-label="Permalink to &quot;nutrient type references&quot;">​</a></h2><p>Get nutrient type references</p><h3 id="request-5" tabindex="-1">Request <a class="header-anchor" href="#request-5" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/admin/nutrient-types/refs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/admin/nutrient-types/refs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span></code></pre></div><h3 id="response-5" tabindex="-1">Response <a class="header-anchor" href="#response-5" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;units&quot;</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">        {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;id&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;description&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#FDAEB7;font-style:italic;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">    ],</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;units&quot;</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;id&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;description&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#B31D28;font-style:italic;">...</span></span>
<span class="line"><span style="color:#24292E;">    ],</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,37),t=[p];function o(c,i,r,y,E,d){return n(),a("div",null,t)}const q=s(l,[["render",o]]);export{h as __pageData,q as default};
