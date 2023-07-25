import{_ as e,o as t,c as o,U as i}from"./chunks/framework.1eef7d9b.js";const f=JSON.parse('{"title":"Prompt editor","description":"","frontmatter":{},"headers":[],"relativePath":"admin/surveys/prompt-editor.md","filePath":"admin/surveys/prompt-editor.md"}'),d={name:"admin/surveys/prompt-editor.md"},a=i('<h1 id="prompt-editor" tabindex="-1">Prompt editor <a class="header-anchor" href="#prompt-editor" aria-label="Permalink to &quot;Prompt editor&quot;">​</a></h1><p>Full screen modal opens when <code>add</code> or <code>edit</code> button is clicked.</p><p>Top level toolbar has:</p><ul><li><code>Cancel</code> button on the left - prompt changes are discarded</li><li><code>Confirm</code> button on the right - prompt changes are confirmed, but not yet saved to server&#39;s database</li><li>Tab list with: <ul><li><code>General</code> - Prompt type &amp; id &amp; name of the prompt <code>internal-only</code> purposes</li><li><code>Content</code> - Localized prompt content fields</li><li><code>Conditions</code> - Conditions list to be met to display the prompt</li><li><code>Validation</code> - Validation options, i.e. prompt is optional or required</li><li><code>Options</code> - Additional per-prompt type options</li></ul></li></ul><h2 id="general" tabindex="-1">General <a class="header-anchor" href="#general" aria-label="Permalink to &quot;General&quot;">​</a></h2><p>General tab defines administrative fields</p><ul><li><p><code>Type</code> - Prompts are categorized to three types:</p><ul><li><a href="/admin/surveys/prompt-types.html#custom-prompts">custom prompts</a></li><li><a href="/admin/surveys/prompt-types.html#standard-prompts">standard prompts</a></li><li><a href="/admin/surveys/prompt-types.html#portion-size-prompts">portion size prompts</a></li></ul></li><li><p><code>ID</code> - <code>scheme-unique</code> ID assigned to prompt</p></li></ul><div class="tip custom-block"><p class="custom-block-title">Prompt ID usage</p><ul><li>Prompt ID of custom prompt is used as identifier in data exports file. It is also used to identify prompt in the scheme.</li><li>Prompt ID is used to load prompt from <code>template</code> and to sync prompt properties from <code>template</code>.</li></ul></div><ul><li><code>Name</code> - User friendly name for easier orientation (for internal use only).</li></ul><h2 id="content" tabindex="-1">Content <a class="header-anchor" href="#content" aria-label="Permalink to &quot;Content&quot;">​</a></h2><p>Content tab defines respondent facing content text fields and their localized versions.</p><ul><li><code>Name</code> - Short prompt name displayed in top breadcrumbs component</li><li><code>Text</code> - Text displayed in the header component (usually defaults to meal name for meal-level prompts and to food name for food-level prompts)</li><li><code>Description</code> - Main body of prompt details, which allows to embed <code>rich-text</code> content</li></ul><p>All fields can be localized to <a href="/admin/localization/languages.html">languages</a> set up in the database.</p><p>Following variables can be used in the fields:</p><ul><li><code>{meal}</code> - Meal name &amp; time</li><li><code>{mealName}</code> - Meal name</li><li><code>{mealTime}</code> - Meal time</li><li><code>{food}</code> - Food name</li><li><code>{item}</code> - Food name or Meal name depending on prompt level type</li></ul><h2 id="actions" tabindex="-1">Actions <a class="header-anchor" href="#actions" aria-label="Permalink to &quot;Actions&quot;">​</a></h2><p>Actions tab defines list of actions to be performed when prompt is displayed.</p><ul><li><code>Enable custom prompt actions</code> - flag whether to enable custom prompt actions defined in this list</li><li><code>Display both layout actions in mobile UI</code> - flag whether to display <code>desktop</code> actions also in <code>mobile</code> UI below the prompt content</li></ul><h3 id="actions-options" tabindex="-1">Actions options <a class="header-anchor" href="#actions-options" aria-label="Permalink to &quot;Actions options&quot;">​</a></h3><ul><li><code>type</code> - type of action that should happen when button is clicked</li><li><code>layout</code> - layout of where the button should be included (<code>desktop</code> or <code>mobile</code>)</li><li><code>variant</code> - style variant (<code>elevated</code>, <code>outlined</code>, <code>text</code>)</li><li><code>color</code> - color variant (<code>primary</code>, <code>secondary</code>, <code>success</code>, <code>warning</code>, <code>error</code>, color hex code)</li><li><code>icon</code> - icon, <a href="https://github.com/MRC-Epid-it24/intake24/blob/master/apps/survey/src/plugins/vuetify.ts" target="_blank" rel="noreferrer">existing alias</a> or <a href="https://fontawesome.com/search?o=r&amp;m=free" target="_blank" rel="noreferrer">FontAwesome</a> icon name</li><li><code>text</code> - localized text to be displayed on the button</li><li><code>label</code> - option localized label to be displayed on the button tooltip. If not specified, <code>text</code> is used instead.</li></ul><h2 id="conditions" tabindex="-1">Conditions <a class="header-anchor" href="#conditions" aria-label="Permalink to &quot;Conditions&quot;">​</a></h2><p>Conditions tab defines list of conditions that needs to be met to display the prompt.</p><ul><li>If conditions is empty, prompt is always displayed.</li><li>If conditions is not empty, prompt is only displayed once all conditions are met.</li></ul><h3 id="operations" tabindex="-1">Operations <a class="header-anchor" href="#operations" aria-label="Permalink to &quot;Operations&quot;">​</a></h3><p>Each condition can be defined by following operations:</p><table><thead><tr><th>Operation</th><th>Value type</th><th>Description</th></tr></thead><tbody><tr><td><code>eq</code></td><td>string | string[]</td><td>Prompt answer equals to defined value</td></tr><tr><td><code>nt</code></td><td>string | string[]</td><td>Prompt answer does not equal to defined value</td></tr><tr><td><code>in</code></td><td>string | string[]</td><td>One of the prompt answers is included defined value-list</td></tr><tr><td><code>notIn</code></td><td>string | string[]</td><td>None of the prompt answers is included in defined value-list</td></tr><tr><td><code>gte</code></td><td>number</td><td>Prompt answer is greater than or equals to defined value</td></tr><tr><td><code>gt</code></td><td>number</td><td>Prompt answer is greater than defined value</td></tr><tr><td><code>lte</code></td><td>number</td><td>Prompt answer is lower than or equals to defined value</td></tr><tr><td><code>lt</code></td><td>number</td><td>Prompt answer is lower than defined value</td></tr></tbody></table><h2 id="validation" tabindex="-1">Validation <a class="header-anchor" href="#validation" aria-label="Permalink to &quot;Validation&quot;">​</a></h2><p>Validation tab defines validation options, i.e. whether prompt is optional or required.</p><h2 id="options" tabindex="-1">Options <a class="header-anchor" href="#options" aria-label="Permalink to &quot;Options&quot;">​</a></h2><p>Options tab defines additional per-prompt type options. See <a href="/admin/surveys/prompt-types.html">Prompt types</a> for more details.</p>',30),n=[a];function l(r,s,c,p,m,h){return t(),o("div",null,n)}const b=e(d,[["render",l]]);export{f as __pageData,b as default};