import{_ as a,c as s,o as i,a4 as e}from"./chunks/framework.L7gT5uOw.js";const u=JSON.parse('{"title":"Languages","description":"","frontmatter":{},"headers":[],"relativePath":"admin/localization/languages.md","filePath":"admin/localization/languages.md"}'),n={name:"admin/localization/languages.md"},t=e(`<h1 id="languages" tabindex="-1">Languages <a class="header-anchor" href="#languages" aria-label="Permalink to &quot;Languages&quot;">​</a></h1><p>Intake24 bundles English texts by default. Additional languages can be added to source code and bundled during build or added to database. See <a href="/admin/localization/languages#translations">Translations</a> for more details.</p><p>Languages are then associated with locales and they are displayed as a list of available languages in frontend UI (<code>admin tool</code> or <code>survey recall</code>).</p><h2 id="detail" tabindex="-1">Detail <a class="header-anchor" href="#detail" aria-label="Permalink to &quot;Detail&quot;">​</a></h2><p>Detail tab displays selected language info.</p><h2 id="create-edit" tabindex="-1">Create / Edit <a class="header-anchor" href="#create-edit" aria-label="Permalink to &quot;Create / Edit&quot;">​</a></h2><p>Edit tab allows to modify selected language.</p><ul><li><p><code>Language ID</code> - valid locale ID and unique string within <code>language</code> records</p></li><li><p><code>Country flag code</code> - Country code to select correct flag</p></li><li><p><code>English name</code> - English name of the language (e.g. Czech)</p></li><li><p><code>Local name</code> - Local name of the language (e.g. Čeština)</p></li><li><p><code>Text direction</code> - Read / write direction of text. Valid options are <code>ltr</code> or <code>rlt</code></p></li><li><p><code>Visibility</code> - Record visibility, valid options are <code>public</code> or <code>restricted</code> (<a href="/admin/acl/securables.html#record-visibility">record visibility</a>).</p></li></ul><h2 id="translations" tabindex="-1">Translations <a class="header-anchor" href="#translations" aria-label="Permalink to &quot;Translations&quot;">​</a></h2><p>When new language record is created, language will be included in in both <code>admin</code> and <code>survey</code> profile language selection. However, translation needs to be provided firstly.</p><p>Language translations can be managed on two levels:</p><ol><li>Source code</li><li>Database records</li></ol><h3 id="source-code-translations" tabindex="-1">Source code translations <a class="header-anchor" href="#source-code-translations" aria-label="Permalink to &quot;Source code translations&quot;">​</a></h3><p>Application translations are default built-in files in source code and <code>en</code> (English) files should treated as templates.</p><p>Translations are located in <code>packages/i18n/src</code>.</p><p>They are structured based on components (<code>admin</code>, <code>api</code>, <code>survey</code>) with addition of <code>shared</code> including shared translations between each components.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>packages/i18n/src</span></span>
<span class="line"><span>.</span></span>
<span class="line"><span>├─ admin -&gt; Admin client translations</span></span>
<span class="line"><span>│  └─ en -&gt; English files</span></span>
<span class="line"><span>│  └─ ... -&gt; other language files</span></span>
<span class="line"><span>├─ api -&gt; API Server translations</span></span>
<span class="line"><span>│  └─ en -&gt; English files</span></span>
<span class="line"><span>│  └─ ... -&gt; other language files</span></span>
<span class="line"><span>├─ shared -&gt; Shared translations used for all application</span></span>
<span class="line"><span>│  └─ en -&gt; English files</span></span>
<span class="line"><span>│  └─ ... -&gt; other language files</span></span>
<span class="line"><span>└─ survey -&gt; Survey client translations</span></span>
<span class="line"><span>   └─ en -&gt; English files</span></span>
<span class="line"><span>   └─ ... -&gt; other language files</span></span></code></pre></div><h4 id="adding-new-language-translations-in-source-code" tabindex="-1">Adding new language translations in source code <a class="header-anchor" href="#adding-new-language-translations-in-source-code" aria-label="Permalink to &quot;Adding new language translations in source code&quot;">​</a></h4><p>Copy <code>en</code> folder in each section and rename to valid <code>locale</code> code.</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> packages/i18n/src/{section}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cp</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -r</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> en</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> cs</span></span></code></pre></div><p>Modify <code>index.ts</code> to include the locale</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> en </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;./en&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> cs </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;./cs&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> messages</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Record</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">LocaleMessages</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { en };</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> messages</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Record</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">LocaleMessages</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { en, cs };</span></span></code></pre></div><h3 id="database-translations" tabindex="-1">Database translations <a class="header-anchor" href="#database-translations" aria-label="Permalink to &quot;Database translations&quot;">​</a></h3><p>When new language is created, <code>translations</code> tab allows to manage database translation for particular file. Click on <code>plus</code> button in <code>translations</code> section of newly created language record will initialize database set of translations. (It takes a copy of default built-in <code>English</code> set and saves it to database).</p><p>Then, <code>translations</code> tab will show a list of <code>application - section</code> records, which contains <code>key -&gt; value</code> translations. These can now be modified / localized to desired language.</p><h3 id="priority-resolution" tabindex="-1">Priority resolution <a class="header-anchor" href="#priority-resolution" aria-label="Permalink to &quot;Priority resolution&quot;">​</a></h3><p>Language translations are resolved in following priority:</p><ol><li>Database translations (<code>cs</code>)</li><li>Source code translations (<code>cs</code>)</li><li>Fallback database translations (<code>en</code>)</li><li>Fallback source code translations (<code>en</code>)</li></ol><p>When user visits frontend application or manually changes language in user profile, it fetches available languages from server, so they get updated translations</p><h3 id="translations-synchronization" tabindex="-1">Translations synchronization <a class="header-anchor" href="#translations-synchronization" aria-label="Permalink to &quot;Translations synchronization&quot;">​</a></h3><p>When source code translation files gets updates, structure can be changed when adding / editing / deleting keys. Therefore, database translations has to synchronized.</p><p>In <code>translations</code> section, there is a <code>synchronization</code> button on top of the list of translations, which triggers the synchronization for particular file.</p><p>Also there a system-level job <code>SyncLanguageTranslations</code> that can be triggered to update all language translations to up-to-date structure.</p><div class="warning custom-block"><p class="custom-block-title">Built-in translations updates</p><p>Updating structure of database translations can potentially result in data loss in following predictable way.</p><p>Source code translation files are simple <code>js</code> object literals. See below example of when original built-in key <code>section</code> was simple string and new translation got expanded and became object of strings. Then, this new object is taken and original string removed -&gt; this <code>section</code> string translation then gets discarded and new object with all its keys (and default English values) needs to be translated.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// original translation</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    section</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Section&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// new translation</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    section</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        title</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Section&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        content</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Content&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></div><h2 id="deletion" tabindex="-1">Deletion <a class="header-anchor" href="#deletion" aria-label="Permalink to &quot;Deletion&quot;">​</a></h2><p>Language deletion won&#39;t be permitted if there are locales using it. User firstly needs to update the locales to use different language.</p>`,36),l=[t];function o(d,r,p,c,h,g){return i(),s("div",null,l)}const E=a(n,[["render",o]]);export{u as __pageData,E as default};