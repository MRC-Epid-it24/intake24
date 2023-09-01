import{_ as s,o as a,c as n,Q as l}from"./chunks/framework.b637c96f.js";const q=JSON.parse('{"title":"Image maps","description":"","frontmatter":{},"headers":[],"relativePath":"api/admin/images/image-maps.md","filePath":"api/admin/images/image-maps.md"}'),p={name:"api/admin/images/image-maps.md"},o=l(`<h1 id="image-maps" tabindex="-1">Image maps <a class="header-anchor" href="#image-maps" aria-label="Permalink to &quot;Image maps&quot;">​</a></h1><h2 id="browse-image-maps" tabindex="-1">Browse image maps <a class="header-anchor" href="#browse-image-maps" aria-label="Permalink to &quot;Browse image maps&quot;">​</a></h2><p>Browse paginated image map list</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/admin/images/image-maps</span></span>
<span class="line"><span style="color:#E1E4E8;">    ?search={</span><span style="color:#FDAEB7;font-style:italic;">searchText</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">    &amp;page={</span><span style="color:#FDAEB7;font-style:italic;">page</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">    &amp;limit={</span><span style="color:#FDAEB7;font-style:italic;">limit</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/admin/images/image-maps</span></span>
<span class="line"><span style="color:#24292E;">    ?search={</span><span style="color:#B31D28;font-style:italic;">searchText</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">    &amp;page={</span><span style="color:#B31D28;font-style:italic;">page</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">    &amp;limit={</span><span style="color:#B31D28;font-style:italic;">limit</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span></code></pre></div><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;data&quot;</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">        {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;id&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;description&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;imageUrl&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#FDAEB7;font-style:italic;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">    ],</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;meta&quot;</span><span style="color:#E1E4E8;">: {</span><span style="color:#FDAEB7;font-style:italic;">...</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;data&quot;</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;id&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;description&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;imageUrl&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#B31D28;font-style:italic;">...</span></span>
<span class="line"><span style="color:#24292E;">    ],</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;meta&quot;</span><span style="color:#24292E;">: {</span><span style="color:#B31D28;font-style:italic;">...</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="create-image-map" tabindex="-1">Create image map <a class="header-anchor" href="#create-image-map" aria-label="Permalink to &quot;Create image map&quot;">​</a></h2><p>Create new image map entry</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">POST /api/admin/images/image-maps</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: multipart/form-data</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;id&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;description&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;baseImage&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">File</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">POST /api/admin/images/image-maps</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: multipart/form-data</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;id&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;description&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;baseImage&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">File</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">201</span><span style="color:#E1E4E8;"> Created</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;id&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;description&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;baseImageUrl&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;objects&quot;</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">        {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;id&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;description&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;label&quot;</span><span style="color:#E1E4E8;">: { </span><span style="color:#79B8FF;">&quot;en&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">, </span><span style="color:#FDAEB7;font-style:italic;">...</span><span style="color:#E1E4E8;"> },</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;outlineCoordinates&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">number</span><span style="color:#E1E4E8;">[]</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#FDAEB7;font-style:italic;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">    ],</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">201</span><span style="color:#24292E;"> Created</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;id&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;description&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;baseImageUrl&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;objects&quot;</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;id&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;description&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;label&quot;</span><span style="color:#24292E;">: { </span><span style="color:#005CC5;">&quot;en&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">, </span><span style="color:#B31D28;font-style:italic;">...</span><span style="color:#24292E;"> },</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;outlineCoordinates&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">number</span><span style="color:#24292E;">[]</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#B31D28;font-style:italic;">...</span></span>
<span class="line"><span style="color:#24292E;">    ],</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="get-image-map" tabindex="-1">Get image map <a class="header-anchor" href="#get-image-map" aria-label="Permalink to &quot;Get image map&quot;">​</a></h2><p>Get image map entry</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/admin/images/image-maps/:imageMapId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/admin/images/image-maps/:imageMapId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span></code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;id&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;description&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;baseImageUrl&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;objects&quot;</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">        {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;id&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;description&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;label&quot;</span><span style="color:#E1E4E8;">: { </span><span style="color:#79B8FF;">&quot;en&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">, </span><span style="color:#FDAEB7;font-style:italic;">...</span><span style="color:#E1E4E8;"> },</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;outlineCoordinates&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">number</span><span style="color:#E1E4E8;">[]</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#FDAEB7;font-style:italic;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">    ],</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;id&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;description&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;baseImageUrl&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;objects&quot;</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;id&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;description&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;label&quot;</span><span style="color:#24292E;">: { </span><span style="color:#005CC5;">&quot;en&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">, </span><span style="color:#B31D28;font-style:italic;">...</span><span style="color:#24292E;"> },</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;outlineCoordinates&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">number</span><span style="color:#24292E;">[]</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#B31D28;font-style:italic;">...</span></span>
<span class="line"><span style="color:#24292E;">    ],</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="update-image-map" tabindex="-1">Update image map <a class="header-anchor" href="#update-image-map" aria-label="Permalink to &quot;Update image map&quot;">​</a></h2><p>Update image map entry</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">PUT /api/admin/images/image-maps/:imageMapId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;description&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;objects&quot;</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">        {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;id&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">number</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;description&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;label&quot;</span><span style="color:#E1E4E8;">: { </span><span style="color:#79B8FF;">&quot;en&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">, </span><span style="color:#FDAEB7;font-style:italic;">...</span><span style="color:#E1E4E8;"> },</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;outlineCoordinates&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">number</span><span style="color:#E1E4E8;">[]</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#FDAEB7;font-style:italic;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">    ]</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">PUT /api/admin/images/image-maps/:imageMapId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;description&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;objects&quot;</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;id&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">number</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;description&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;label&quot;</span><span style="color:#24292E;">: { </span><span style="color:#005CC5;">&quot;en&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">, </span><span style="color:#B31D28;font-style:italic;">...</span><span style="color:#24292E;"> },</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;outlineCoordinates&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">number</span><span style="color:#24292E;">[]</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#B31D28;font-style:italic;">...</span></span>
<span class="line"><span style="color:#24292E;">    ]</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;id&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;description&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;baseImageUrl&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;objects&quot;</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">        {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;id&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;description&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;label&quot;</span><span style="color:#E1E4E8;">: { </span><span style="color:#79B8FF;">&quot;en&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">, </span><span style="color:#FDAEB7;font-style:italic;">...</span><span style="color:#E1E4E8;"> },</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;outlineCoordinates&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">number</span><span style="color:#E1E4E8;">[]</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#FDAEB7;font-style:italic;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">    ],</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">200</span><span style="color:#24292E;"> OK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;id&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;description&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;baseImageUrl&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;objects&quot;</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;id&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;description&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;label&quot;</span><span style="color:#24292E;">: { </span><span style="color:#005CC5;">&quot;en&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">, </span><span style="color:#B31D28;font-style:italic;">...</span><span style="color:#24292E;"> },</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;outlineCoordinates&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">number</span><span style="color:#24292E;">[]</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#B31D28;font-style:italic;">...</span></span>
<span class="line"><span style="color:#24292E;">    ],</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="delete-image-map" tabindex="-1">Delete image map <a class="header-anchor" href="#delete-image-map" aria-label="Permalink to &quot;Delete image map&quot;">​</a></h2><p>Delete image map entry</p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">DELETE /api/admin/images/image-maps/:imageMapId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">Content-Type: application/json</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">DELETE /api/admin/images/image-maps/:imageMapId</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">Content-Type: application/json</span></span></code></pre></div><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">204</span><span style="color:#E1E4E8;"> No Content</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">204</span><span style="color:#24292E;"> No Content</span></span></code></pre></div>`,31),e=[o];function t(c,r,i,E,y,u){return a(),n("div",null,e)}const g=s(p,[["render",t]]);export{q as __pageData,g as default};
