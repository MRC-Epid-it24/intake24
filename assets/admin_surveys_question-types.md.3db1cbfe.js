import{_ as e,o,c as t,R as a}from"./chunks/framework.8e8e72cd.js";const f=JSON.parse('{"title":"Question types","description":"","frontmatter":{},"headers":[],"relativePath":"admin/surveys/question-types.md","filePath":"admin/surveys/question-types.md"}'),i={name:"admin/surveys/question-types.md"},r=a('<h1 id="question-types" tabindex="-1">Question types <a class="header-anchor" href="#question-types" aria-label="Permalink to &quot;Question types&quot;">​</a></h1><p>Questions / Prompts are divided into three groups:</p><ul><li><a href="#standard-prompts">standard</a> - Standard prompts</li><li><a href="#portion-size-prompts">portion-size</a> - Portion-size estimation prompts</li><li><a href="#custom-prompts">custom</a> - Custom / generic prompts</li></ul><h2 id="standard-prompts" tabindex="-1">Standard prompts <a class="header-anchor" href="#standard-prompts" aria-label="Permalink to &quot;Standard prompts&quot;">​</a></h2><p>Prompts with standardized behavior tied to specific functionality. Usually only one can be used per scheme and functionality is often tied to specific scheme section.</p><h3 id="associated-foods-prompt" tabindex="-1">Associated foods prompt <a class="header-anchor" href="#associated-foods-prompt" aria-label="Permalink to &quot;Associated foods prompt&quot;">​</a></h3><h3 id="edit-meal-prompt" tabindex="-1">Edit meal prompt <a class="header-anchor" href="#edit-meal-prompt" aria-label="Permalink to &quot;Edit meal prompt&quot;">​</a></h3><p>Edit meal prompt allows initial entry of food and drink before portion-size estimation.</p><h4 id="options" tabindex="-1">Options <a class="header-anchor" href="#options" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><code>separateDrinks</code> - true/false whether to show drinks separately</li></ul><h3 id="final-prompt" tabindex="-1">Final prompt <a class="header-anchor" href="#final-prompt" aria-label="Permalink to &quot;Final prompt&quot;">​</a></h3><p>Terminal prompt that is shown at the end of the recall. It offers home button It can offer feedback is applicable (feedback enabled and submission threshold reached).</p><h3 id="food-search-prompt" tabindex="-1">Food search prompt <a class="header-anchor" href="#food-search-prompt" aria-label="Permalink to &quot;Food search prompt&quot;">​</a></h3><h3 id="meal-add-prompt" tabindex="-1">Meal add prompt <a class="header-anchor" href="#meal-add-prompt" aria-label="Permalink to &quot;Meal add prompt&quot;">​</a></h3><p>Prompt to add new meals. Multi-select list of options predefined in the scheme meal list.</p><h4 id="options-1" tabindex="-1">Options <a class="header-anchor" href="#options-1" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><code>custom</code> - allow adding custom meal names</li></ul><h3 id="meal-time-prompt" tabindex="-1">Meal time prompt <a class="header-anchor" href="#meal-time-prompt" aria-label="Permalink to &quot;Meal time prompt&quot;">​</a></h3><p>Prompt to collect meal time information using standard time picker.</p><h4 id="options-2" tabindex="-1">Options <a class="header-anchor" href="#options-2" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><code>format</code> - time format (<code>am/pm</code> or <code>24h</code>)</li></ul><h3 id="ready-meal-prompt" tabindex="-1">Ready meal prompt <a class="header-anchor" href="#ready-meal-prompt" aria-label="Permalink to &quot;Ready meal prompt&quot;">​</a></h3><p>Prompt to collect ready meal information. Multi-select list of options, for each food within the meal that has <code>ready-meal</code> attribute set to <code>true</code>.</p><h3 id="redirect-prompt" tabindex="-1">Redirect prompt <a class="header-anchor" href="#redirect-prompt" aria-label="Permalink to &quot;Redirect prompt&quot;">​</a></h3><p>Prompt to redirect user to external site with optional user identifier embedded into URL.</p><h4 id="options-3" tabindex="-1">Options <a class="header-anchor" href="#options-3" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>url</code> - URL to redirect to</p><ul><li>use <code>{identifier}</code> variable as a placeholder where the user identifier should be to inserted.</li><li>example: <code>https://example.com/?arg={identifier}</code></li></ul></li><li><p><code>identifier</code> - identifier that should be embedded into the URL.</p><ul><li><code>userId</code> - internal intake24 user id</li><li><code>username</code> - survey-unique respondent username</li><li><code>urlAuthToken</code> - URL authentication token</li><li><code>custom</code> - custom identifier that can be set through <code>userCustomField</code>. <ul><li>Enter a <code>name</code> of the custom field to be looked up the <code>value</code>.</li></ul></li></ul></li><li><p><code>timer</code> - optional timer in seconds when automatic redirection should occur</p><ul><li>disabled if set to <code>0</code></li></ul></li></ul><h3 id="review-confirm-prompt" tabindex="-1">Review confirm prompt <a class="header-anchor" href="#review-confirm-prompt" aria-label="Permalink to &quot;Review confirm prompt&quot;">​</a></h3><h3 id="same-as-before-prompt" tabindex="-1">Same as before prompt <a class="header-anchor" href="#same-as-before-prompt" aria-label="Permalink to &quot;Same as before prompt&quot;">​</a></h3><p>Prompt to detect foods that are the same as in the previous recalls / meals and offer to use the same portion-size estimation.</p><h3 id="split-food-prompt" tabindex="-1">Split food prompt <a class="header-anchor" href="#split-food-prompt" aria-label="Permalink to &quot;Split food prompt&quot;">​</a></h3><p>Prompt to identify foods that can potentially be split into separate foods.</p><h3 id="submit-prompt" tabindex="-1">Submit prompt <a class="header-anchor" href="#submit-prompt" aria-label="Permalink to &quot;Submit prompt&quot;">​</a></h3><p>Prompt with recap of the recall and submit button.</p><h2 id="portion-size-prompts" tabindex="-1">Portion-size prompts <a class="header-anchor" href="#portion-size-prompts" aria-label="Permalink to &quot;Portion-size prompts&quot;">​</a></h2><p>Prompts for food portion-size estimation. Only one can be used per scheme and functionality is tied <code>foods</code> scheme section.</p><h3 id="as-served-prompt" tabindex="-1">As-served prompt <a class="header-anchor" href="#as-served-prompt" aria-label="Permalink to &quot;As-served prompt&quot;">​</a></h3><h4 id="options-4" tabindex="-1">Options <a class="header-anchor" href="#options-4" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>leftovers</code> - true/false whether to show leftovers option</p></li><li><p><code>linked quantity categories</code></p><ul><li>Category list of that parent food should have (at least one) to trigger quantity selection based on parent food quantity</li><li>Optional, standard unit can be assigned to set the <code>how-many</code> label</li></ul></li></ul><h3 id="cereal-prompt" tabindex="-1">Cereal prompt <a class="header-anchor" href="#cereal-prompt" aria-label="Permalink to &quot;Cereal prompt&quot;">​</a></h3><h4 id="options-5" tabindex="-1">Options <a class="header-anchor" href="#options-5" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>leftovers</code> - true/false whether to show leftovers option</p></li><li><p><code>image map labels</code> - true/false whether to show image map labels</p></li><li><p><code>image map pinchZoom</code> - true/false whether to show PinchZoom control for mobile UI labels</p></li></ul><h3 id="direct-weight-prompt" tabindex="-1">Direct weight prompt <a class="header-anchor" href="#direct-weight-prompt" aria-label="Permalink to &quot;Direct weight prompt&quot;">​</a></h3><h3 id="drink-scale-prompt" tabindex="-1">Drink scale prompt <a class="header-anchor" href="#drink-scale-prompt" aria-label="Permalink to &quot;Drink scale prompt&quot;">​</a></h3><h4 id="options-6" tabindex="-1">Options <a class="header-anchor" href="#options-6" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>leftovers</code> - true/false whether to show leftovers option</p></li><li><p><code>image map labels</code> - true/false whether to show image map labels</p></li><li><p><code>image map pinchZoom</code> - true/false whether to show PinchZoom control for mobile UI labels</p></li></ul><h3 id="guide-image-prompt" tabindex="-1">Guide image prompt <a class="header-anchor" href="#guide-image-prompt" aria-label="Permalink to &quot;Guide image prompt&quot;">​</a></h3><h4 id="options-7" tabindex="-1">Options <a class="header-anchor" href="#options-7" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>image map labels</code> - true/false whether to show image map labels</p></li><li><p><code>image map pinchZoom</code> - true/false whether to show PinchZoom control for mobile UI labels</p></li></ul><h3 id="milk-in-a-hot-drink-prompt" tabindex="-1">Milk in a hot drink prompt <a class="header-anchor" href="#milk-in-a-hot-drink-prompt" aria-label="Permalink to &quot;Milk in a hot drink prompt&quot;">​</a></h3><h4 id="options-8" tabindex="-1">Options <a class="header-anchor" href="#options-8" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>options</code> - locale-specific list of options for milk portion in hot drink (<code>0-1 range</code>)</p></li><li><p><code>orientation</code> - orientation of radio buttons (column/row)</p></li></ul><h3 id="milk-on-cereal-prompt" tabindex="-1">Milk on cereal prompt <a class="header-anchor" href="#milk-on-cereal-prompt" aria-label="Permalink to &quot;Milk on cereal prompt&quot;">​</a></h3><h4 id="options-9" tabindex="-1">Options <a class="header-anchor" href="#options-9" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>image map labels</code> - true/false whether to show image map labels</p></li><li><p><code>image map pinchZoom</code> - true/false whether to show PinchZoom control for mobile UI labels</p></li></ul><h3 id="pizza-prompt" tabindex="-1">Pizza prompt <a class="header-anchor" href="#pizza-prompt" aria-label="Permalink to &quot;Pizza prompt&quot;">​</a></h3><h4 id="options-10" tabindex="-1">Options <a class="header-anchor" href="#options-10" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>image map labels</code> - true/false whether to show image map labels</p></li><li><p><code>image map pinchZoom</code> - true/false whether to show PinchZoom control for mobile UI labels</p></li></ul><h3 id="portion-size-option-prompt" tabindex="-1">Portion size option prompt <a class="header-anchor" href="#portion-size-option-prompt" aria-label="Permalink to &quot;Portion size option prompt&quot;">​</a></h3><h3 id="standard-portion-prompt" tabindex="-1">Standard portion prompt <a class="header-anchor" href="#standard-portion-prompt" aria-label="Permalink to &quot;Standard portion prompt&quot;">​</a></h3><h2 id="custom-prompts" tabindex="-1">Custom prompts <a class="header-anchor" href="#custom-prompts" aria-label="Permalink to &quot;Custom prompts&quot;">​</a></h2><p>Prompts with customizable generic behavior. Custom prompts can be used multiple times per scheme as long as they are identified with scheme-unique <a href="/admin/surveys/question-editor.html#general"><code>Question ID</code></a>.</p><h3 id="checkbox-list-prompt" tabindex="-1">Checkbox list prompt <a class="header-anchor" href="#checkbox-list-prompt" aria-label="Permalink to &quot;Checkbox list prompt&quot;">​</a></h3><p>Multi-select list of options.</p><h4 id="options-11" tabindex="-1">Options <a class="header-anchor" href="#options-11" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>options</code> - locale-specific list of options with properties:</p><ul><li><code>label</code> (user-facing displayed value)</li><li><code>value</code> (value stored in database) can be specified</li></ul></li><li><p><code>other</code> - <code>true</code> or <code>false</code> whether to show &#39;other&#39; option, free-form text input</p></li></ul><h3 id="date-picker-prompt" tabindex="-1">Date picker prompt <a class="header-anchor" href="#date-picker-prompt" aria-label="Permalink to &quot;Date picker prompt&quot;">​</a></h3><p>Prompt to collect date information.</p><ul><li><code>futureDates</code> - allow future dates to be selected</li></ul><h3 id="info-prompt" tabindex="-1">Info prompt <a class="header-anchor" href="#info-prompt" aria-label="Permalink to &quot;Info prompt&quot;">​</a></h3><p>Informational prompt for acknowledging displayed information.</p><h3 id="no-more-information-prompt" tabindex="-1">No more information prompt <a class="header-anchor" href="#no-more-information-prompt" aria-label="Permalink to &quot;No more information prompt&quot;">​</a></h3><p>Terminal prompt for <code>food</code> or <code>meal</code> when no more information is required. It should be placed in <code>foods</code> and <code>postFoods</code> sections respectively.</p><h3 id="radio-list-prompt" tabindex="-1">Radio list prompt <a class="header-anchor" href="#radio-list-prompt" aria-label="Permalink to &quot;Radio list prompt&quot;">​</a></h3><p>Single-select list of options.</p><ul><li><p><code>options</code> - locale-specific list of options with properties:</p><ul><li><code>label</code> (user-facing displayed value)</li><li><code>value</code> (value stored in database) can be specified</li></ul></li><li><p><code>other</code> - <code>true</code> or <code>false</code> whether to show &#39;other&#39; option, free-form text input</p></li><li><p><code>orientation</code> - orientation of radio buttons (<code>column</code> or <code>row</code>)</p></li></ul><h3 id="textarea-prompt" tabindex="-1">Textarea prompt <a class="header-anchor" href="#textarea-prompt" aria-label="Permalink to &quot;Textarea prompt&quot;">​</a></h3><p>Prompt to offer free-form text input.</p><h3 id="time-picker-prompt" tabindex="-1">Time picker prompt <a class="header-anchor" href="#time-picker-prompt" aria-label="Permalink to &quot;Time picker prompt&quot;">​</a></h3><p>Prompt to collect time information.</p><ul><li><code>format</code> - time format (<code>am/pm</code> or <code>24h</code>)</li></ul><h3 id="yes-no-prompt" tabindex="-1">Yes/no prompt <a class="header-anchor" href="#yes-no-prompt" aria-label="Permalink to &quot;Yes/no prompt&quot;">​</a></h3><p>Prompt to collect <code>yes</code> / <code>no</code> (<code>true</code> / <code>false</code>) information presented as distinct buttons.</p>',83),p=[r];function l(s,n,d,c,m,h){return o(),t("div",null,p)}const b=e(i,[["render",l]]);export{f as __pageData,b as default};
