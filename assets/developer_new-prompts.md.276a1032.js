import{_ as s,o as e,c as a,Q as n}from"./chunks/framework.b637c96f.js";const h=JSON.parse('{"title":"Adding a New Prompt","description":"","frontmatter":{},"headers":[],"relativePath":"developer/new-prompts.md","filePath":"developer/new-prompts.md"}'),p={name:"developer/new-prompts.md"},o=n(`<h1 id="adding-a-new-prompt" tabindex="-1">Adding a New Prompt <a class="header-anchor" href="#adding-a-new-prompt" aria-label="Permalink to &quot;Adding a New Prompt&quot;">​</a></h1><p>In order to add a new prompt to the system you need to add it to the following modules and packages:</p><ul><li>Admin (<code>apps\\admin</code>) - for a new prompt to appear in the list of available prompts</li><li>Packages (<code>packages\\common</code> and <code>packages\\i18n</code>) - for a new prompt to have corresponding translation and Types for <code>Admin</code> and <code>Survey</code> modules to use</li><li>Survey (<code>apps\\survey</code>) - for a new prompts to appear in the Recall flow and to have a necessary logic.</li></ul><p>The process of adding prompt consits of the following stages:</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>We are not covering the topic of prompt logic implementation and integration into the recall flow on this page. Please refere to the other guidlines or contact developers through the github. We are leaving the topic of test coverage out of the scope of this page as well. Please refer to the <a href="/developer/testing.html">Testing</a> guidlines for more information.</p></div><h2 id="admin-packages" tabindex="-1">Admin &amp; Packages <a class="header-anchor" href="#admin-packages" aria-label="Permalink to &quot;Admin &amp; Packages&quot;">​</a></h2><ol><li><strong>Admin:</strong> Add a new Prompt file in the <code>apps\\admin\\src\\Components\\{Prompt Type}\\NEW-PROMPT-NAME.ts</code>. Where is <code>{Prompt Type}</code> is one of the Available Prompt Types in the Intake24 (e.g.: <code>custom</code>, <code>portion-size</code>, <code>standard</code>)</li><li><strong>Admin:</strong> Link it to the corresponding <code>index.ts</code> file in the <code>{Prompt Type}</code> folder</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">├─ apps</span></span>
<span class="line"><span style="color:#e1e4e8;">   └─ admin</span></span>
<span class="line"><span style="color:#e1e4e8;">      └─ components</span></span>
<span class="line"><span style="color:#e1e4e8;">         ├─ prompts</span></span>
<span class="line"><span style="color:#e1e4e8;">            └─{prompt-type}</span></span>
<span class="line"><span style="color:#e1e4e8;">               └─ {NEW-PROMPT-NAME.ts}</span></span>
<span class="line"><span style="color:#e1e4e8;">               └─ index.ts</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">├─ apps</span></span>
<span class="line"><span style="color:#24292e;">   └─ admin</span></span>
<span class="line"><span style="color:#24292e;">      └─ components</span></span>
<span class="line"><span style="color:#24292e;">         ├─ prompts</span></span>
<span class="line"><span style="color:#24292e;">            └─{prompt-type}</span></span>
<span class="line"><span style="color:#24292e;">               └─ {NEW-PROMPT-NAME.ts}</span></span>
<span class="line"><span style="color:#24292e;">               └─ index.ts</span></span></code></pre></div><ol start="3"><li><strong>Packages:</strong> Add a new Prompt to the <code>packages\\common\\src\\prompts\\{Prompt Type}.ts</code> and <code>packages\\common\\src\\prompts\\prompts.ts</code>. Where is <code>{Prompt Type}</code> is one of the Available Prompt Types in the Intake24 (e.g.: <code>custom</code>, <code>portion-size</code>, <code>standard</code>). In the <code>{Prompt Type}.ts</code> you need to define a new Prompt Object for export and add it in the Corresponding prompt Component Type.</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">├─ packages</span></span>
<span class="line"><span style="color:#e1e4e8;">   └─ common</span></span>
<span class="line"><span style="color:#e1e4e8;">      └─ src</span></span>
<span class="line"><span style="color:#e1e4e8;">         ├─ prompts</span></span>
<span class="line"><span style="color:#e1e4e8;">            └─{prompt-type}.ts</span></span>
<span class="line"><span style="color:#e1e4e8;">            └─ prompts.ts</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">├─ packages</span></span>
<span class="line"><span style="color:#24292e;">   └─ common</span></span>
<span class="line"><span style="color:#24292e;">      └─ src</span></span>
<span class="line"><span style="color:#24292e;">         ├─ prompts</span></span>
<span class="line"><span style="color:#24292e;">            └─{prompt-type}.ts</span></span>
<span class="line"><span style="color:#24292e;">            └─ prompts.ts</span></span></code></pre></div><ol start="4"><li><strong>Packages:</strong> Add a new Prompt to the list of prompts in the <code>packages\\common\\src\\prompts\\index.ts</code></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">├─ packages</span></span>
<span class="line"><span style="color:#e1e4e8;">   └─ common</span></span>
<span class="line"><span style="color:#e1e4e8;">      └─ src</span></span>
<span class="line"><span style="color:#e1e4e8;">         ├─ prompts</span></span>
<span class="line"><span style="color:#e1e4e8;">            └─ index.ts</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">├─ packages</span></span>
<span class="line"><span style="color:#24292e;">   └─ common</span></span>
<span class="line"><span style="color:#24292e;">      └─ src</span></span>
<span class="line"><span style="color:#24292e;">         ├─ prompts</span></span>
<span class="line"><span style="color:#24292e;">            └─ index.ts</span></span></code></pre></div><ol start="5"><li><strong>Packages:</strong> Add a new property to the corresponding translation <code>LocaleMessageObject</code> in the <code>i18n</code> package. For all of the available languages. E.g.: <code>packages\\i18n\\src\\admin\\{Language}\\survey-schemes.ts</code>. At the time of writing the <code>Language</code> can be one of the following: <code>en</code>, <code>ms</code>, <code>ta</code>, <code>zh</code></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">├─ packages</span></span>
<span class="line"><span style="color:#e1e4e8;">   └─ i18n</span></span>
<span class="line"><span style="color:#e1e4e8;">      └─ src</span></span>
<span class="line"><span style="color:#e1e4e8;">         ├─ admin</span></span>
<span class="line"><span style="color:#e1e4e8;">            └─{Language}.ts</span></span>
<span class="line"><span style="color:#e1e4e8;">               └─ survey-schemes.ts</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">├─ packages</span></span>
<span class="line"><span style="color:#24292e;">   └─ i18n</span></span>
<span class="line"><span style="color:#24292e;">      └─ src</span></span>
<span class="line"><span style="color:#24292e;">         ├─ admin</span></span>
<span class="line"><span style="color:#24292e;">            └─{Language}.ts</span></span>
<span class="line"><span style="color:#24292e;">               └─ survey-schemes.ts</span></span></code></pre></div><ol start="6"><li><strong>Admin Dashboard</strong> Sync the Language Translation in the Admin Dashboard for the corresponding Locale. <code>Languages -&gt; {Language} -&gt; Translation</code> if needed. Repeat this step at any stage where you change files in <code>i18n</code> if you have DB Translation for a given <code>{Language}</code></li></ol><h2 id="survey-packages" tabindex="-1">Survey &amp; Packages <a class="header-anchor" href="#survey-packages" aria-label="Permalink to &quot;Survey &amp; Packages&quot;">​</a></h2><ol><li><strong>Packages:</strong> Add a new Prompt State to the <code>packages\\common\\src\\prompts\\prompt-states.ts</code>.</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">├─ packages</span></span>
<span class="line"><span style="color:#e1e4e8;">   └─ common</span></span>
<span class="line"><span style="color:#e1e4e8;">      └─ src</span></span>
<span class="line"><span style="color:#e1e4e8;">         ├─ prompts</span></span>
<span class="line"><span style="color:#e1e4e8;">            └─ prompt-states.ts</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">├─ packages</span></span>
<span class="line"><span style="color:#24292e;">   └─ common</span></span>
<span class="line"><span style="color:#24292e;">      └─ src</span></span>
<span class="line"><span style="color:#24292e;">         ├─ prompts</span></span>
<span class="line"><span style="color:#24292e;">            └─ prompt-states.ts</span></span></code></pre></div><ol start="2"><li><strong>Survey:</strong> Add a new Handler to <code>apps\\survey\\src\\components\\handlers\\{Prompt Type}\\{NEW-PROMPT-NAME}Handler.vue</code>. Import and Export it in the corresponding <code>Index.ts</code>.</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">├─ apps</span></span>
<span class="line"><span style="color:#e1e4e8;">   └─ survey</span></span>
<span class="line"><span style="color:#e1e4e8;">      └─ src</span></span>
<span class="line"><span style="color:#e1e4e8;">         ├─ components</span></span>
<span class="line"><span style="color:#e1e4e8;">            └─handlers</span></span>
<span class="line"><span style="color:#e1e4e8;">               └─{prompt-type}</span></span>
<span class="line"><span style="color:#e1e4e8;">                  └─ {NEW-PROMPT-NAME}Handler.vue</span></span>
<span class="line"><span style="color:#e1e4e8;">                  └─ index.ts</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">├─ apps</span></span>
<span class="line"><span style="color:#24292e;">   └─ survey</span></span>
<span class="line"><span style="color:#24292e;">      └─ src</span></span>
<span class="line"><span style="color:#24292e;">         ├─ components</span></span>
<span class="line"><span style="color:#24292e;">            └─handlers</span></span>
<span class="line"><span style="color:#24292e;">               └─{prompt-type}</span></span>
<span class="line"><span style="color:#24292e;">                  └─ {NEW-PROMPT-NAME}Handler.vue</span></span>
<span class="line"><span style="color:#24292e;">                  └─ index.ts</span></span></code></pre></div><ol start="3"><li><strong>Survey:</strong> Add a new prompt to the Prompt views: <code>apps\\survey\\src\\components\\prompts\\{Prompt Type}\\{NEW-PROMPT-NAME}.vue</code>. Import and Export it in the corresponding <code>Index.ts</code>.</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">├─ apps</span></span>
<span class="line"><span style="color:#e1e4e8;">   └─ survey</span></span>
<span class="line"><span style="color:#e1e4e8;">      └─ src</span></span>
<span class="line"><span style="color:#e1e4e8;">         ├─ components</span></span>
<span class="line"><span style="color:#e1e4e8;">            └─prompts</span></span>
<span class="line"><span style="color:#e1e4e8;">               └─{prompt-type}</span></span>
<span class="line"><span style="color:#e1e4e8;">                  └─ {NEW-PROMPT-NAME}.vue</span></span>
<span class="line"><span style="color:#e1e4e8;">                  └─ index.ts</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">├─ apps</span></span>
<span class="line"><span style="color:#24292e;">   └─ survey</span></span>
<span class="line"><span style="color:#24292e;">      └─ src</span></span>
<span class="line"><span style="color:#24292e;">         ├─ components</span></span>
<span class="line"><span style="color:#24292e;">            └─prompts</span></span>
<span class="line"><span style="color:#24292e;">               └─{prompt-type}</span></span>
<span class="line"><span style="color:#24292e;">                  └─ {NEW-PROMPT-NAME}.vue</span></span>
<span class="line"><span style="color:#24292e;">                  └─ index.ts</span></span></code></pre></div><ol start="4"><li><strong>Packages</strong> Add a new property to the corresponding translation <code>LocaleMessageObject</code> in the <code>i18n</code> package. For all of the available languages. E.g.: <code>packages\\i18n\\src\\shared\\{Language}\\prompts.ts</code>. At the time of writing the <code>Language</code> can be one of the following: <code>en</code>, <code>ms</code>, <code>ta</code>, <code>zh</code></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">├─ packages</span></span>
<span class="line"><span style="color:#e1e4e8;">   └─ i18n</span></span>
<span class="line"><span style="color:#e1e4e8;">      └─ src</span></span>
<span class="line"><span style="color:#e1e4e8;">         ├─ shared</span></span>
<span class="line"><span style="color:#e1e4e8;">            └─{Language}.ts</span></span>
<span class="line"><span style="color:#e1e4e8;">               └─ prompts.ts</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">├─ packages</span></span>
<span class="line"><span style="color:#24292e;">   └─ i18n</span></span>
<span class="line"><span style="color:#24292e;">      └─ src</span></span>
<span class="line"><span style="color:#24292e;">         ├─ shared</span></span>
<span class="line"><span style="color:#24292e;">            └─{Language}.ts</span></span>
<span class="line"><span style="color:#24292e;">               └─ prompts.ts</span></span></code></pre></div><ol start="5"><li><strong>Packages (ONLY IF NEEDED):</strong> Add a new property to the corresponding translation <code>LocaleMessageObject</code> in the <code>i18n</code> package. For all of the available languages. E.g.: <code>packages\\i18n\\src\\survey\\{Language}\\</code>. At the time of writing the <code>Language</code> can be one of the following: <code>en</code>, <code>ms</code>, <code>ta</code>, <code>zh</code></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">├─ packages</span></span>
<span class="line"><span style="color:#e1e4e8;">   └─ i18n</span></span>
<span class="line"><span style="color:#e1e4e8;">      └─ src</span></span>
<span class="line"><span style="color:#e1e4e8;">         ├─ survey</span></span>
<span class="line"><span style="color:#e1e4e8;">            └─{Language}.ts</span></span>
<span class="line"><span style="color:#e1e4e8;">               └─ RELEVANT FILES (eg.: common, profile, recall, survey)</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">├─ packages</span></span>
<span class="line"><span style="color:#24292e;">   └─ i18n</span></span>
<span class="line"><span style="color:#24292e;">      └─ src</span></span>
<span class="line"><span style="color:#24292e;">         ├─ survey</span></span>
<span class="line"><span style="color:#24292e;">            └─{Language}.ts</span></span>
<span class="line"><span style="color:#24292e;">               └─ RELEVANT FILES (eg.: common, profile, recall, survey)</span></span></code></pre></div>`,26),l=[o];function c(t,r,i,d,g,y){return e(),a("div",null,l)}const u=s(p,[["render",c]]);export{h as __pageData,u as default};
