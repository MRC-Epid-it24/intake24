import{_ as e,c as a,o as t,a as n}from"./app.9160966e.js";const f='{"title":"Languages","description":"","frontmatter":{},"headers":[{"level":2,"title":"Detail tab","slug":"detail-tab"},{"level":2,"title":"Create / Edit tab","slug":"create-edit-tab"},{"level":2,"title":"Translations","slug":"translations"},{"level":2,"title":"Deletion","slug":"deletion"}],"relativePath":"admin/languages.md","lastUpdated":1642434740639}',s={},o=n(`<h1 id="languages" tabindex="-1">Languages <a class="header-anchor" href="#languages" aria-hidden="true">#</a></h1><p>Intake24 bundles by default on English default texts. Additional languages can be defined in following sections.</p><p>Languages are then associated with locales and they in list of available languages in frontend UI (<code>admin tool</code> or <code>survey recall</code>).</p><h2 id="detail-tab" tabindex="-1">Detail tab <a class="header-anchor" href="#detail-tab" aria-hidden="true">#</a></h2><p>Detail tab displays basic settings of the selected language.</p><h2 id="create-edit-tab" tabindex="-1">Create / Edit tab <a class="header-anchor" href="#create-edit-tab" aria-hidden="true">#</a></h2><p>Edit tab allows to edit settings of the selected language.</p><ul><li><p><code>Language ID</code> - short, unique and valid locale ID.</p></li><li><p><code>Country flag code</code> - country code to select correct flag.</p></li><li><p><code>English name</code> - english name of the language (e.g. Czech).</p></li><li><p><code>Local name</code> - local name of the language (e.g. \u010Ce\u0161tina).</p></li><li><p><code>Text direction</code> - read/write direction of text. Valid options are <code>ltr</code> or <code>rlt</code>.</p></li></ul><h2 id="translations" tabindex="-1">Translations <a class="header-anchor" href="#translations" aria-hidden="true">#</a></h2><p>When new language is created, default translations for frontend applications are copied to language record and can be modified / localized to the desired language.</p><p>Translations tab shows the list of <code>application - section</code> records, which contains <code>key -&gt; value</code> translations. These can be modified / localized.</p><p>When user visits frontend application or manually changes language in user profile, it fetches available languages from server, so they get updated translations</p><div class="tip custom-block"><p class="custom-block-title">Built-in translations updates</p><p>If default built-in translations structure was modified, job <code>SyncLanguageTranslations</code> should be triggered / run. It updates all language translations to up-to-date structure.</p><p>It can potentially result in data loss in predicted way. Translation files are simple <code>js</code> object literals / json.</p><p>See below example of when original in-built structure was simple string and new translation got expanded and became object of strings. New object is taken and original string removed -&gt; this translation then gets discarded and new object with all it&#39;s keys (and default English values) needs to be translated.</p><div class="language-js"><pre><code><span class="token comment">// original translation</span>
<span class="token punctuation">{</span>
    <span class="token literal-property property">section</span><span class="token operator">:</span> <span class="token string">&#39;Section&#39;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token comment">// new translation</span>
<span class="token punctuation">{</span>
    <span class="token literal-property property">section</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&#39;Section&#39;</span><span class="token punctuation">,</span>
        <span class="token literal-property property">content</span><span class="token operator">:</span> <span class="token string">&#39;Content&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div></div><h2 id="deletion" tabindex="-1">Deletion <a class="header-anchor" href="#deletion" aria-hidden="true">#</a></h2><p>Language deletion won&#39;t be permitted if there are locales using it. User firstly needs to be re-assign the locales to use different language.</p>`,15),l=[o];function i(r,c,d,p,u,g){return t(),a("div",null,l)}var b=e(s,[["render",i]]);export{f as __pageData,b as default};
