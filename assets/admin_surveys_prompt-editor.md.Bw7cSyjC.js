import{_ as e,c as t,o,a4 as d}from"./chunks/framework.D2Q_DY5z.js";const f=JSON.parse('{"title":"Prompt editor","description":"","frontmatter":{},"headers":[],"relativePath":"admin/surveys/prompt-editor.md","filePath":"admin/surveys/prompt-editor.md"}'),i={name:"admin/surveys/prompt-editor.md"},a=d('<h1 id="prompt-editor" tabindex="-1">Prompt editor <a class="header-anchor" href="#prompt-editor" aria-label="Permalink to &quot;Prompt editor&quot;">​</a></h1><p>Full screen modal opens when <code>add</code> or <code>edit</code> button is clicked.</p><p>Top level toolbar has:</p><ul><li><code>Cancel</code> button on the left - prompt changes are discarded</li><li><code>Confirm</code> button on the right - prompt changes are confirmed, but not yet saved to server&#39;s database</li><li>Tab list with: <ul><li><code>General</code> - Prompt type &amp; id &amp; name of the prompt <code>internal-only</code> purposes</li><li><code>Content</code> - Localized prompt content fields</li><li><code>Conditions</code> - Conditions list to be met to display the prompt</li><li><code>Validation</code> - Validation options, i.e. prompt is optional or required</li><li><code>Options</code> - Additional per-prompt type options</li></ul></li></ul><h2 id="general" tabindex="-1">General <a class="header-anchor" href="#general" aria-label="Permalink to &quot;General&quot;">​</a></h2><p>General tab defines administrative fields</p><ul><li><p><code>Type</code> - Prompts are categorized to three types:</p><ul><li><a href="/admin/surveys/prompt-types.html#custom-prompts">custom prompts</a></li><li><a href="/admin/surveys/prompt-types.html#standard-prompts">standard prompts</a></li><li><a href="/admin/surveys/prompt-types.html#portion-size-prompts">portion size prompts</a></li></ul></li><li><p><code>ID</code> - <code>scheme-unique</code> ID assigned to prompt</p></li></ul><div class="tip custom-block"><p class="custom-block-title">Prompt ID usage</p><ul><li>Prompt ID of custom prompt is used as identifier in data exports file. It is also used to identify prompt in the scheme.</li><li>Prompt ID is used to load prompt from <code>template</code> and to sync prompt properties from <code>template</code>.</li></ul></div><ul><li><p><code>Name</code> - User friendly name for easier orientation (for internal use only).</p></li><li><p><code>Group</code> - Group identifier for grouping prompts in the scheme section together.</p><ul><li>available for <a href="/admin/surveys/prompt-types.html#custom-prompts">custom prompts only</a></li><li>prompts with the same group are displayed together on same screen collapsed in expansion panels</li><li>prompts conditions are merged together and evaluated as one condition list for the whole group</li></ul></li></ul><h2 id="content" tabindex="-1">Content <a class="header-anchor" href="#content" aria-label="Permalink to &quot;Content&quot;">​</a></h2><p>Content tab defines respondent facing content text fields and their localized versions.</p><ul><li><code>Name</code> - Short prompt name displayed in top breadcrumbs component</li><li><code>Text</code> - Text displayed in the header component just below the breadcrumb (usually defaults to blank)</li><li><code>Description</code> - Main body of prompt details, which allows to embed <code>rich-text</code> content</li></ul><p>All fields can be localized to <a href="/admin/localization/languages.html">languages</a> set up in the database.</p><p>Following variables can be used in the fields:</p><ul><li><code>{meal}</code> - Meal name &amp; time</li><li><code>{mealName}</code> - Meal name</li><li><code>{mealTime}</code> - Meal time</li><li><code>{food}</code> - Food name</li><li><code>{item}</code> - Food name or Meal name depending on prompt level type</li></ul><h2 id="actions" tabindex="-1">Actions <a class="header-anchor" href="#actions" aria-label="Permalink to &quot;Actions&quot;">​</a></h2><p>Actions tab defines list of actions to be performed when prompt is displayed.</p><ul><li><code>Enable custom prompt actions</code> - flag whether to enable custom prompt actions defined in this list</li><li><code>Display both layout actions in mobile UI</code> - flag whether to display <code>desktop</code> actions also in <code>mobile</code> UI below the prompt content</li></ul><h3 id="actions-options" tabindex="-1">Actions options <a class="header-anchor" href="#actions-options" aria-label="Permalink to &quot;Actions options&quot;">​</a></h3><ul><li><code>type</code> - type of action that should happen when button is clicked</li><li><code>layout</code> - layout of where the button should be displayed (<code>desktop</code> or <code>mobile</code>)</li><li><code>variant</code> - style variant (<code>elevated</code>, <code>outlined</code>, <code>text</code>)</li><li><code>color</code> - color variant (<code>primary</code>, <code>secondary</code>, <code>success</code>, <code>warning</code>, <code>error</code>, color hex code)</li><li><code>icon</code> - icon, <a href="https://github.com/MRC-Epid-it24/intake24/blob/master/apps/survey/src/plugins/vuetify.ts" target="_blank" rel="noreferrer">existing alias</a> or <a href="https://fontawesome.com/search?o=r&amp;m=free" target="_blank" rel="noreferrer">FontAwesome</a> icon name</li><li><code>text</code> - localized text to be displayed on the button</li><li><code>label</code> - option localized label to be displayed on the button tooltip. If not specified, <code>text</code> is used instead.</li></ul><h2 id="conditions" tabindex="-1">Conditions <a class="header-anchor" href="#conditions" aria-label="Permalink to &quot;Conditions&quot;">​</a></h2><p>Conditions tab defines list of conditions that needs to be met to display the prompt.</p><ul><li>If conditions is empty, prompt is always displayed.</li><li>If conditions is not empty, prompt is only displayed once all conditions are met.</li></ul><h3 id="type" tabindex="-1">Type <a class="header-anchor" href="#type" aria-label="Permalink to &quot;Type&quot;">​</a></h3><table><thead><tr><th>Type</th><th>Description</th></tr></thead><tbody><tr><td><code>Drinks</code></td><td>Number of drinks (in <code>meal</code> or <code>survey</code>)</td></tr><tr><td><code>Energy</code></td><td>Total energy (<code>food</code> / <code>meal</code> / <code>survey</code>)</td></tr><tr><td><code>Flag</code></td><td>Whether <code>food</code> / <code>meal</code> / <code>survey</code> has a specific flag</td></tr><tr><td><code>Food category</code></td><td>Whether <code>food</code> has the category assigned</td></tr><tr><td><code>Meals</code></td><td>Number of meals in recall</td></tr><tr><td><code>Prompt answer</code></td><td><code>Food</code> / <code>meal</code> / <code>survey</code> prompt answer</td></tr><tr><td><code>Recall</code></td><td>Current recall number</td></tr></tbody></table><h3 id="operation" tabindex="-1">Operation <a class="header-anchor" href="#operation" aria-label="Permalink to &quot;Operation&quot;">​</a></h3><p>Each condition can be set with one of the following operations:</p><table><thead><tr><th>Operation</th><th>Value type</th><th>Description</th></tr></thead><tbody><tr><td><code>eq</code></td><td>string | string[]</td><td>Condition value equals to defined value</td></tr><tr><td><code>nt</code></td><td>string | string[]</td><td>Condition value does not equal to defined value</td></tr><tr><td><code>in</code></td><td>string | string[]</td><td>One of the condition values is included defined value-list</td></tr><tr><td><code>notIn</code></td><td>string | string[]</td><td>None of the condition values is included in defined value-list</td></tr><tr><td><code>gte</code></td><td>number</td><td>Condition value is greater than or equals to defined value</td></tr><tr><td><code>gt</code></td><td>number</td><td>Condition value is greater than defined value</td></tr><tr><td><code>lte</code></td><td>number</td><td>Condition value is lower than or equals to defined value</td></tr><tr><td><code>lt</code></td><td>number</td><td>Condition value is lower than defined value</td></tr></tbody></table><h3 id="section" tabindex="-1">Section <a class="header-anchor" href="#section" aria-label="Permalink to &quot;Section&quot;">​</a></h3><p>Several condition type can define entity-level where to look for the answer:</p><ul><li><code>survey</code> - looks for the answer in the survey state</li><li><code>meal</code> - looks for the answer in the meal state</li><li><code>food</code> - looks for the answer in the food state</li></ul><h2 id="validation" tabindex="-1">Validation <a class="header-anchor" href="#validation" aria-label="Permalink to &quot;Validation&quot;">​</a></h2><p>Validation tab defines validation options, i.e. whether prompt is optional or required.</p><h2 id="options" tabindex="-1">Options <a class="header-anchor" href="#options" aria-label="Permalink to &quot;Options&quot;">​</a></h2><p>Options tab defines additional per-prompt type options. See <a href="/admin/surveys/prompt-types.html">Prompt types</a> for more details.</p><h2 id="json" tabindex="-1">JSON <a class="header-anchor" href="#json" aria-label="Permalink to &quot;JSON&quot;">​</a></h2><p>Raw JSON prompt editor. Can be used for manual editing, copy-pasting between prompts / schemes etc.</p>',37),n=[a];function l(r,s,c,p,m,h){return o(),t("div",null,n)}const b=e(i,[["render",l]]);export{f as __pageData,b as default};
