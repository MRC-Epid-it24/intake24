import{_ as n,c as a,o as e,a as s}from"./app.a95cc4c4.js";const b='{"title":"Nutrient tables","description":"","frontmatter":{},"headers":[{"level":2,"title":"Browse nutrient tables","slug":"browse-nutrient-tables"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Create nutrient table","slug":"create-nutrient-table"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Get nutrient table","slug":"get-nutrient-table"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"},{"level":2,"title":"Update nutrient table","slug":"update-nutrient-table"},{"level":3,"title":"Request","slug":"request-3"},{"level":3,"title":"Response","slug":"response-3"},{"level":2,"title":"Delete nutrient table","slug":"delete-nutrient-table"},{"level":3,"title":"Request","slug":"request-4"},{"level":3,"title":"Response","slug":"response-4"},{"level":2,"title":"Nutrient table references","slug":"nutrient-table-references"},{"level":3,"title":"Request","slug":"request-5"},{"level":3,"title":"Response","slug":"response-5"},{"level":2,"title":"Upload nutrient data","slug":"upload-nutrient-data"},{"level":3,"title":"Request","slug":"request-6"},{"level":3,"title":"Response","slug":"response-6"}],"relativePath":"api/admin/nutrient-tables.md","lastUpdated":1642613177043}',t={},p=s(`<h1 id="nutrient-tables" tabindex="-1">Nutrient tables <a class="header-anchor" href="#nutrient-tables" aria-hidden="true">#</a></h1><h2 id="browse-nutrient-tables" tabindex="-1">Browse nutrient tables <a class="header-anchor" href="#browse-nutrient-tables" aria-hidden="true">#</a></h2><p>Browse paginated nutrient tables list</p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/nutrient-tables
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
</code></pre></div><h2 id="create-nutrient-table" tabindex="-1">Create nutrient table <a class="header-anchor" href="#create-nutrient-table" aria-hidden="true">#</a></h2><p>Create new nutrient table entry</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/nutrient-tables

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;csvMapping&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;idColumnOffset&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
        <span class="token property">&quot;descriptionColumnOffset&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
        <span class="token property">&quot;localDescriptionColumnOffset&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
        <span class="token property">&quot;rowOffset&quot;</span><span class="token operator">:</span> number
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    csvMappingFields<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span><span class="token property">&quot;fieldName&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span> <span class="token property">&quot;columnOffset&quot;</span><span class="token operator">:</span> number<span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    csvMappingNutrients<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span><span class="token property">&quot;nutrientTypeId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span> <span class="token property">&quot;columnOffset&quot;</span><span class="token operator">:</span> number<span class="token punctuation">}</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">201</span> Created

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="get-nutrient-table" tabindex="-1">Get nutrient table <a class="header-anchor" href="#get-nutrient-table" aria-hidden="true">#</a></h2><p>Get nutrient table entry</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/nutrient-tables/:nutrientTableId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="update-nutrient-table" tabindex="-1">Update nutrient table <a class="header-anchor" href="#update-nutrient-table" aria-hidden="true">#</a></h2><p>Update nutrient table entry</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>PUT /api/admin/nutrient-tables/:nutrientTableId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token application-json">
<span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;csvMapping&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;idColumnOffset&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
        <span class="token property">&quot;descriptionColumnOffset&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
        <span class="token property">&quot;localDescriptionColumnOffset&quot;</span><span class="token operator">:</span> number | <span class="token null keyword">null</span><span class="token punctuation">,</span>
        <span class="token property">&quot;rowOffset&quot;</span><span class="token operator">:</span> number
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    csvMappingFields<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span><span class="token property">&quot;fieldName&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span> <span class="token property">&quot;columnOffset&quot;</span><span class="token operator">:</span> number<span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    csvMappingNutrients<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span><span class="token property">&quot;nutrientTypeId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span> <span class="token property">&quot;columnOffset&quot;</span><span class="token operator">:</span> number<span class="token punctuation">}</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</span></code></pre></div><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div><h2 id="delete-nutrient-table" tabindex="-1">Delete nutrient table <a class="header-anchor" href="#delete-nutrient-table" aria-hidden="true">#</a></h2><p>Delete nutrient table entry</p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>DELETE /api/admin/nutrient-tables/:nutrientTableId

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">204</span> No Content
</code></pre></div><h2 id="nutrient-table-references" tabindex="-1">Nutrient table references <a class="header-anchor" href="#nutrient-table-references" aria-hidden="true">#</a></h2><p>Get nutrient table references</p><h3 id="request-5" tabindex="-1">Request <a class="header-anchor" href="#request-5" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/admin/nutrient-tables/refs

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-5" tabindex="-1">Response <a class="header-anchor" href="#response-5" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;nutrients&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;unitId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
            <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        ...
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="upload-nutrient-data" tabindex="-1">Upload nutrient data <a class="header-anchor" href="#upload-nutrient-data" aria-hidden="true">#</a></h2><p>Endpoint accepts two types of CSV files.</p><ul><li>NDB mapping</li><li>NDB nutrient data</li></ul><p>Upload is submitted as job and response returns <code>JobResponse</code> entry</p><h3 id="request-6" tabindex="-1">Request <a class="header-anchor" href="#request-6" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>POST /api/admin/nutrient-tables/:nutrientTableId/upload

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">multipart/form-data</span></span>

{
    &quot;type&quot;: &#39;NutrientTableImportData&#39; | &#39;NutrientTableImportMapping&#39;,
    &quot;file&quot;: File
}
</code></pre></div><h3 id="response-6" tabindex="-1">Response <a class="header-anchor" href="#response-6" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    ...
<span class="token punctuation">}</span>
</code></pre></div>`,45),o=[p];function r(l,u,c,i,d,k){return e(),a("div",null,o)}var q=n(t,[["render",r]]);export{b as __pageData,q as default};
