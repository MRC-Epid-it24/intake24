import{_ as s,o as a,c as o,Q as n}from"./chunks/framework.b637c96f.js";const h=JSON.parse('{"title":"Food database lookup","description":"","frontmatter":{},"headers":[],"relativePath":"api/survey/food-lookup.md","filePath":"api/survey/food-lookup.md"}'),e={name:"api/survey/food-lookup.md"},l=n(`<h1 id="food-database-lookup" tabindex="-1">Food database lookup <a class="header-anchor" href="#food-database-lookup" aria-label="Permalink to &quot;Food database lookup&quot;">​</a></h1><p>Functions related to searching food records in the food database.</p><h2 id="split-description" tabindex="-1">Split description <a class="header-anchor" href="#split-description" aria-label="Permalink to &quot;Split description&quot;">​</a></h2><p>Detects multiple foods entered as a single entry and returns a suggested split into several foods.</p><p><a href="https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/food/user/FoodLookupController.scala#L52-L60" target="_blank" rel="noreferrer">v3 implementation</a></p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/foods/{</span><span style="color:#FDAEB7;font-style:italic;">locale</span><span style="color:#E1E4E8;">}/split-description?desc={</span><span style="color:#FDAEB7;font-style:italic;">description</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/foods/{</span><span style="color:#B31D28;font-style:italic;">locale</span><span style="color:#24292E;">}/split-description?desc={</span><span style="color:#B31D28;font-style:italic;">description</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span></code></pre></div><p>where</p><p><strong>locale</strong> is the locale ID (different locales could use different description splitting strategies),</p><p><strong>description</strong> is the food description as entered by the user.</p><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;parts&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">[]</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;parts&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">[]</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>where</p><p><strong>parts</strong> is the list of individual foods extracted from the original description.</p><h2 id="food-lookup" tabindex="-1">Food lookup <a class="header-anchor" href="#food-lookup" aria-label="Permalink to &quot;Food lookup&quot;">​</a></h2><p>Returns a list of foods from the food database that match the description as entered by the user.</p><p><a href="https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/food/user/FoodLookupController.scala#L62-L74" target="_blank" rel="noreferrer">v3 implementation</a></p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/foods/{</span><span style="color:#FDAEB7;font-style:italic;">locale</span><span style="color:#E1E4E8;">}/lookup?desc={</span><span style="color:#FDAEB7;font-style:italic;">description</span><span style="color:#E1E4E8;">}&amp;existing={</span><span style="color:#FDAEB7;font-style:italic;">existing</span><span style="color:#E1E4E8;">}&amp;limit={</span><span style="color:#FDAEB7;font-style:italic;">limit</span><span style="color:#E1E4E8;">}&amp;alg={</span><span style="color:#FDAEB7;font-style:italic;">algorithm</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/foods/{</span><span style="color:#B31D28;font-style:italic;">locale</span><span style="color:#24292E;">}/lookup?desc={</span><span style="color:#B31D28;font-style:italic;">description</span><span style="color:#24292E;">}&amp;existing={</span><span style="color:#B31D28;font-style:italic;">existing</span><span style="color:#24292E;">}&amp;limit={</span><span style="color:#B31D28;font-style:italic;">limit</span><span style="color:#24292E;">}&amp;alg={</span><span style="color:#B31D28;font-style:italic;">algorithm</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span></code></pre></div><p>where</p><p><strong>description</strong> is the food description as entered by the user,</p><p><strong>existing</strong> is an optional list of food codes representing other foods in the same meal, used by the search result ranking algorithm (more than one can be specified by repeating the query parameter multiple times),</p><p><strong>limit</strong> is an optional maximum number of results to return, defaults to 50</p><p><strong>algorithm</strong> is an optional id of the search result ranking algorithm to use, defaults to &quot;paRules&quot;. Can be one of:</p><ul><li>&quot;paRules&quot;: pairwise association rules, a machine learning based algorithm</li><li>&quot;popularity&quot;: simple algorithm based on the number of times foods were selected</li></ul><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;foods&quot;</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#79B8FF;">&quot;code&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#79B8FF;">&quot;localDescription&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;categories&quot;</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;code&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;localDescription&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;foods&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#005CC5;">&quot;code&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#005CC5;">&quot;localDescription&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;categories&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;code&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;localDescription&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>where</p><p><strong>foods</strong> is the list of foods that match the description,</p><p><strong>categories</strong> is the list of categories that match the description,</p><p><strong>code</strong> is the Intake24 food or category code,</p><p><strong>localDescription</strong> is the food/category name from the food database in the local language for survey</p><h2 id="food-lookup-for-recipes" tabindex="-1">Food lookup (for recipes) <a class="header-anchor" href="#food-lookup-for-recipes" aria-label="Permalink to &quot;Food lookup (for recipes)&quot;">​</a></h2><p>Same as normal lookup but expands the search results to foods marked for use in recipes (e.g. raw ingredients).</p><p><a href="https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/food/user/FoodLookupController.scala#L95-L100" target="_blank" rel="noreferrer">v3 implementation</a></p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/foods/{</span><span style="color:#FDAEB7;font-style:italic;">locale</span><span style="color:#E1E4E8;">}/lookup-for-recipes?desc={</span><span style="color:#FDAEB7;font-style:italic;">description</span><span style="color:#E1E4E8;">}&amp;existing={</span><span style="color:#FDAEB7;font-style:italic;">existing</span><span style="color:#E1E4E8;">}&amp;limit={</span><span style="color:#FDAEB7;font-style:italic;">limit</span><span style="color:#E1E4E8;">}&amp;alg={</span><span style="color:#FDAEB7;font-style:italic;">algorithm</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/foods/{</span><span style="color:#B31D28;font-style:italic;">locale</span><span style="color:#24292E;">}/lookup-for-recipes?desc={</span><span style="color:#B31D28;font-style:italic;">description</span><span style="color:#24292E;">}&amp;existing={</span><span style="color:#B31D28;font-style:italic;">existing</span><span style="color:#24292E;">}&amp;limit={</span><span style="color:#B31D28;font-style:italic;">limit</span><span style="color:#24292E;">}&amp;alg={</span><span style="color:#B31D28;font-style:italic;">algorithm</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span></code></pre></div><p>See regular food lookup request.</p><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-label="Permalink to &quot;Response&quot;">​</a></h3><p>See regular food lookup response.</p><h2 id="food-lookup-in-category" tabindex="-1">Food lookup (in category) <a class="header-anchor" href="#food-lookup-in-category" aria-label="Permalink to &quot;Food lookup (in category)&quot;">​</a></h2><p>Same as normal lookup but limits the search results to foods that are contained with a specific category.</p><p><a href="https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/food/user/FoodLookupController.scala#L103-L114" target="_blank" rel="noreferrer">v3 implementation</a></p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/foods/{</span><span style="color:#FDAEB7;font-style:italic;">locale</span><span style="color:#E1E4E8;">}/lookup-in-category?desc={</span><span style="color:#FDAEB7;font-style:italic;">description</span><span style="color:#E1E4E8;">}&amp;category={</span><span style="color:#FDAEB7;font-style:italic;">category</span><span style="color:#E1E4E8;">}existing={</span><span style="color:#FDAEB7;font-style:italic;">existing</span><span style="color:#E1E4E8;">}&amp;limit={</span><span style="color:#FDAEB7;font-style:italic;">limit</span><span style="color:#E1E4E8;">}&amp;alg={</span><span style="color:#FDAEB7;font-style:italic;">algorithm</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/foods/{</span><span style="color:#B31D28;font-style:italic;">locale</span><span style="color:#24292E;">}/lookup-in-category?desc={</span><span style="color:#B31D28;font-style:italic;">description</span><span style="color:#24292E;">}&amp;category={</span><span style="color:#B31D28;font-style:italic;">category</span><span style="color:#24292E;">}existing={</span><span style="color:#B31D28;font-style:italic;">existing</span><span style="color:#24292E;">}&amp;limit={</span><span style="color:#B31D28;font-style:italic;">limit</span><span style="color:#24292E;">}&amp;alg={</span><span style="color:#B31D28;font-style:italic;">algorithm</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span></code></pre></div><p>Query parameters are the same as regular food lookup plus</p><p><strong>category</strong>: Intake24 category code to limit search to.</p><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-label="Permalink to &quot;Response&quot;">​</a></h3><p>See regular food lookup response.</p><h2 id="get-root-category-list-for-browsing" tabindex="-1">Get root category list for browsing <a class="header-anchor" href="#get-root-category-list-for-browsing" aria-label="Permalink to &quot;Get root category list for browsing&quot;">​</a></h2><p>Get the list of root categories in the current locale for the &quot;browse all foods&quot; options.</p><p><a href="https://github.com/MRC-Epid-it24/api-server/blob/master/FoodDataSQL/src/main/scala/uk/ac/ncl/openlab/intake24/foodsql/user/FoodBrowsingServiceImpl.scala#L28-L37" target="_blank" rel="noreferrer">v3 implementation</a></p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/categories/{</span><span style="color:#FDAEB7;font-style:italic;">locale</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/categories/{</span><span style="color:#B31D28;font-style:italic;">locale</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span></code></pre></div><p>where <strong>locale</strong> is the current survey&#39;s locale ID.</p><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">[</span></span>
<span class="line"><span style="color:#E1E4E8;">  {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;code&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;localDescription&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FDAEB7;font-style:italic;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">]</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">[</span></span>
<span class="line"><span style="color:#24292E;">  {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;code&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;localDescription&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#B31D28;font-style:italic;">...</span></span>
<span class="line"><span style="color:#24292E;">]</span></span></code></pre></div><p>where</p><p><strong>code</strong> is the Intake24 category code,</p><p><strong>localDescription</strong> is the description of the category in the local language.</p><h2 id="browse-category-contents" tabindex="-1">Browse category contents <a class="header-anchor" href="#browse-category-contents" aria-label="Permalink to &quot;Browse category contents&quot;">​</a></h2><p>Get the category contents, i.e. foods and subcategories listed under the given category.</p><p><a href="https://github.com/MRC-Epid-it24/api-server/blob/master/FoodDataSQL/src/main/scala/uk/ac/ncl/openlab/intake24/foodsql/user/FoodBrowsingServiceImpl.scala#L81-L89" target="_blank" rel="noreferrer">v3 implementation</a></p><h3 id="request-5" tabindex="-1">Request <a class="header-anchor" href="#request-5" aria-label="Permalink to &quot;Request&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">GET /api/categories/{</span><span style="color:#FDAEB7;font-style:italic;">locale</span><span style="color:#E1E4E8;">}/{</span><span style="color:#FDAEB7;font-style:italic;">code</span><span style="color:#E1E4E8;">}?alg={</span><span style="color:#FDAEB7;font-style:italic;">algorithmId</span><span style="color:#E1E4E8;">}&amp;existing={</span><span style="color:#FDAEB7;font-style:italic;">existingFoodCode</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Authorization: Bearer {</span><span style="color:#FDAEB7;font-style:italic;">accessToken</span><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">GET /api/categories/{</span><span style="color:#B31D28;font-style:italic;">locale</span><span style="color:#24292E;">}/{</span><span style="color:#B31D28;font-style:italic;">code</span><span style="color:#24292E;">}?alg={</span><span style="color:#B31D28;font-style:italic;">algorithmId</span><span style="color:#24292E;">}&amp;existing={</span><span style="color:#B31D28;font-style:italic;">existingFoodCode</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Authorization: Bearer {</span><span style="color:#B31D28;font-style:italic;">accessToken</span><span style="color:#24292E;">}</span></span></code></pre></div><p>where</p><p><strong>locale</strong> is the current survey&#39;s locale ID,</p><p><strong>code</strong> is the Intake24 category code,</p><p><strong>algorithmId</strong> (optional) is the algorithm to use for sorting the food/subcategory listings, can be <code>popularity</code> or <code>paRules</code>,</p><p><strong>existing</strong> (optional) is the list of foods in the same meal for <code>paRules</code> based ranking.</p><h3 id="response-5" tabindex="-1">Response <a class="header-anchor" href="#response-5" aria-label="Permalink to &quot;Response&quot;">​</a></h3><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;foods&quot;</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">    {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">&quot;code&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">&quot;localDescription&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FDAEB7;font-style:italic;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">  ],</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;categories&quot;</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">    {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">&quot;code&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">&quot;localDescription&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#FDAEB7;font-style:italic;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FDAEB7;font-style:italic;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">  ]</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;foods&quot;</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">&quot;code&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">&quot;localDescription&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#B31D28;font-style:italic;">...</span></span>
<span class="line"><span style="color:#24292E;">  ],</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;categories&quot;</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">&quot;code&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">&quot;localDescription&quot;</span><span style="color:#24292E;">: </span><span style="color:#B31D28;font-style:italic;">string</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#B31D28;font-style:italic;">...</span></span>
<span class="line"><span style="color:#24292E;">  ]</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>where</p><p><strong>foods</strong> is the list of foods contained in the category:</p><div class="nested-description"><p><strong>code</strong> is the Intake24 food code,</p><p><strong>localDescription</strong> is the name of the food in the local language,</p></div><p><strong>categories</strong> is the list of subcategories contained in the category:</p><div class="nested-description"><p><strong>code</strong> is the Intake24 category code,</p><p><strong>localDescription</strong> is the name of the category in the local language,</p></div>`,77),t=[l];function p(r,c,i,y,E,d){return a(),o("div",null,t)}const g=s(e,[["render",p]]);export{h as __pageData,g as default};
