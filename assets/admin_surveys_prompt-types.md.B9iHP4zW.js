import{_ as o,c as i,o as t,ag as a}from"./chunks/framework.CDhRSyRB.js";const u=JSON.parse('{"title":"Prompt types","description":"","frontmatter":{"outline":{"level":[2,3]}},"headers":[],"relativePath":"admin/surveys/prompt-types.md","filePath":"admin/surveys/prompt-types.md"}'),l={name:"admin/surveys/prompt-types.md"};function r(d,e,s,c,n,p){return t(),i("div",null,e[0]||(e[0]=[a('<h1 id="prompt-types" tabindex="-1">Prompt types <a class="header-anchor" href="#prompt-types" aria-label="Permalink to &quot;Prompt types&quot;">​</a></h1><p>Prompts / Prompts are divided into three groups:</p><ul><li><a href="#standard-prompts">standard</a> - Standard prompts</li><li><a href="#portion-size-prompts">portion-size</a> - Portion-size estimation prompts</li><li><a href="#custom-prompts">custom</a> - Custom / generic prompts</li></ul><h2 id="standard-prompts" tabindex="-1">Standard prompts <a class="header-anchor" href="#standard-prompts" aria-label="Permalink to &quot;Standard prompts&quot;">​</a></h2><p>Prompts with standardized behavior tied to specific functionality. Usually only one can be used per scheme and functionality is often tied to specific scheme section.</p><h3 id="addon-foods-prompt" tabindex="-1">Addon foods prompt <a class="header-anchor" href="#addon-foods-prompt" aria-label="Permalink to &quot;Addon foods prompt&quot;">​</a></h3><p>Prompt to add additional foods as linked foods. Prompt can be added to <code>food</code>, <code>meal</code> or <code>survey</code> level.</p><ul><li><p><code>multiple</code> - allow multiple foods to be selected</p></li><li><p><code>trigger</code> - trigger options for which foods to trigger addon foods prompt</p><ul><li><code>type</code> - type of trigger <ul><li><code>any</code> - trigger for any food</li><li><code>afp</code> - trigger for associated foods (TBI)</li><li><code>category</code> - trigger for food having specified category code</li><li><code>food</code> - trigger for food having specified food code</li><li><code>tag</code> - trigger for food having specified food tag</li></ul></li><li><code>value</code> - value to trigger on (fill in for <code>category</code>, <code>food</code> or <code>tag</code> trigger types)</li></ul></li><li><p><code>lookup</code> - lookup to include food for add-ons</p><ul><li><code>type</code> - type of lookup <ul><li><code>category</code> - look up foods by specified category</li><li><code>food</code> - look up specified by food</li></ul></li><li><code>value</code> - value to lookup (fill in for <code>category</code> or <code>food</code> lookup types)</li></ul></li></ul><h3 id="associated-foods-prompt" tabindex="-1">Associated foods prompt <a class="header-anchor" href="#associated-foods-prompt" aria-label="Permalink to &quot;Associated foods prompt&quot;">​</a></h3><ul><li><code>multiple</code> - allow multiple foods to be selected</li></ul><h4 id="food-browser-settings" tabindex="-1">Food browser settings <a class="header-anchor" href="#food-browser-settings" aria-label="Permalink to &quot;Food browser settings&quot;">​</a></h4><ul><li><strong>Show categories first</strong><ul><li><code>food browse list</code> - Show categories first in the browse list</li><li><code>food search list</code> - Show categories first in the search list</li></ul></li></ul><h3 id="edit-meal-prompt" tabindex="-1">Edit meal prompt <a class="header-anchor" href="#edit-meal-prompt" aria-label="Permalink to &quot;Edit meal prompt&quot;">​</a></h3><p>Edit meal prompt allows initial entry of food and drink before portion-size estimation.</p><h4 id="options" tabindex="-1">Options <a class="header-anchor" href="#options" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><code>separateDrinks</code> - show drinks separately</li></ul><h3 id="external-source-prompt" tabindex="-1">External source prompt <a class="header-anchor" href="#external-source-prompt" aria-label="Permalink to &quot;External source prompt&quot;">​</a></h3><p>Prompt to collect external source of food matching.</p><h4 id="source-options" tabindex="-1">Source options <a class="header-anchor" href="#source-options" aria-label="Permalink to &quot;Source options&quot;">​</a></h4><ul><li><code>type</code> - external source type / provider <ul><li><code>open-food-facts</code> - Open Food Facts <ul><li><code>country</code> - country code</li><li><code>query</code> - key:value pairs of query parameters</li></ul></li></ul></li></ul><h4 id="barcode-options" tabindex="-1">Barcode options <a class="header-anchor" href="#barcode-options" aria-label="Permalink to &quot;Barcode options&quot;">​</a></h4><ul><li><code>none</code> - no barcode scanner</li><li><code>quagga</code> - <a href="https://github.com/ericblade/quagga2" target="_blank" rel="noreferrer">Quagga2</a> barcode scanner (open-source)</li><li><code>strich</code> - <a href="https://strich.io/" target="_blank" rel="noreferrer">Strich</a> barcode scanner (subscription-based)</li></ul><h3 id="final-prompt" tabindex="-1">Final prompt <a class="header-anchor" href="#final-prompt" aria-label="Permalink to &quot;Final prompt&quot;">​</a></h3><p>Terminal prompt that is shown at the end of the recall. It offers home button It can offer feedback is applicable (feedback enabled and submission threshold reached).</p><ul><li><code>rating</code> - 5-star rating with optional comment to be submitted after the recall</li></ul><h3 id="food-search-prompt" tabindex="-1">Food search prompt <a class="header-anchor" href="#food-search-prompt" aria-label="Permalink to &quot;Food search prompt&quot;">​</a></h3><h4 id="food-browser-settings-1" tabindex="-1">Food browser settings <a class="header-anchor" href="#food-browser-settings-1" aria-label="Permalink to &quot;Food browser settings&quot;">​</a></h4><ul><li><strong>Show categories first</strong><ul><li><code>food browse list</code> - Show categories first in the browse list</li><li><code>food search list</code> - Show categories first in the search list</li></ul></li></ul><h3 id="meal-add-prompt" tabindex="-1">Meal add prompt <a class="header-anchor" href="#meal-add-prompt" aria-label="Permalink to &quot;Meal add prompt&quot;">​</a></h3><p>Prompt to add new meals. Multi-select list of options predefined in the scheme meal list.</p><h4 id="options-1" tabindex="-1">Options <a class="header-anchor" href="#options-1" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><code>custom</code> - allow adding custom meal names</li><li><code>unique</code> - allow adding only unique meal names</li></ul><h3 id="meal-duration-prompt" tabindex="-1">Meal duration prompt <a class="header-anchor" href="#meal-duration-prompt" aria-label="Permalink to &quot;Meal duration prompt&quot;">​</a></h3><p>Prompt to collect meal duration in minutes.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Prompt uses slider component as <a href="/admin/surveys/prompt-types#slider-prompt">slider-prompt</a>, but it is more constrained, keep in mind that:</p><ul><li>meal duration is always in minutes</li><li>labels should reflect the minutes unit</li></ul></div><h4 id="slider-settings" tabindex="-1">Slider settings <a class="header-anchor" href="#slider-settings" aria-label="Permalink to &quot;Slider settings&quot;">​</a></h4><ul><li><code>current</code> - current duration in minutes <ul><li><code>label</code> - label to be displayed</li><li><code>value</code> - current value</li><li><code>size</code> - droplet size (in <code>px</code>) of the label</li></ul></li><li><code>min</code> - minimum duration in minutes <ul><li><code>label</code> - label to be displayed at the start of the slider (min value) (use <code>{value}</code> to insert variable value into the label)</li><li><code>value</code> - minimum value</li></ul></li><li><code>max</code> - maximum duration in minutes <ul><li><code>label</code> - label to be displayed at the end of the slider (max value) (use <code>{value}</code> to insert variable value into the label)</li><li><code>value</code> - maximum value</li></ul></li><li><code>step</code> - step size in minutes</li></ul><h3 id="meal-gap-prompt" tabindex="-1">Meal gap prompt <a class="header-anchor" href="#meal-gap-prompt" aria-label="Permalink to &quot;Meal gap prompt&quot;">​</a></h3><p>Prompt to remind user about meal gap between meals.</p><h4 id="options-2" tabindex="-1">Options <a class="header-anchor" href="#options-2" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><code>gap</code> - time gap between meals (minutes)</li><li><code>startTime</code> - day start time</li><li><code>endTime</code> - day end time</li></ul><h3 id="meal-time-prompt" tabindex="-1">Meal time prompt <a class="header-anchor" href="#meal-time-prompt" aria-label="Permalink to &quot;Meal time prompt&quot;">​</a></h3><p>Prompt to collect meal time information using standard time picker.</p><h4 id="options-3" tabindex="-1">Options <a class="header-anchor" href="#options-3" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>allowedMinutes</code> - allowed minutes for selection (<code>1</code>, <code>5</code>, <code>10</code>, <code>15</code>, <code>20</code>, <code>30</code>)</p></li><li><p><code>format</code> - time format (<code>am/pm</code> or <code>24h</code>)</p></li><li><p><code>AM/PM toggle</code> - <code>true</code> or <code>false</code> whether to show AM/PM toggle buttons</p></li></ul><h3 id="ready-meal-prompt" tabindex="-1">Ready meal prompt <a class="header-anchor" href="#ready-meal-prompt" aria-label="Permalink to &quot;Ready meal prompt&quot;">​</a></h3><p>Prompt to collect ready meal information. Multi-select list of options, for each food within the meal that has <code>ready-meal</code> attribute set to <code>true</code>.</p><h3 id="recall-date-prompt" tabindex="-1">Recall date prompt <a class="header-anchor" href="#recall-date-prompt" aria-label="Permalink to &quot;Recall date prompt&quot;">​</a></h3><p>Prompt to collect recall date information.</p><ul><li><code>current</code> - highlighted current date offset in days</li><li><code>min</code> - minimum date offset in days</li><li><code>max</code> - maximum date offset in days</li></ul><h3 id="redirect-prompt" tabindex="-1">Redirect prompt <a class="header-anchor" href="#redirect-prompt" aria-label="Permalink to &quot;Redirect prompt&quot;">​</a></h3><p>Prompt to redirect user to external site with optional user identifier embedded into URL.</p><h4 id="options-4" tabindex="-1">Options <a class="header-anchor" href="#options-4" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>rating</code> - 5-star rating with optional comment to be submitted after the recall</p></li><li><p><code>url</code> - URL to redirect to</p><ul><li>use <code>{identifier}</code> variable as a placeholder where the user identifier should be to inserted.</li><li>example: <code>https://example.com/?arg={identifier}</code></li></ul></li><li><p><code>identifier</code> - identifier that should be embedded into the URL.</p><ul><li><code>userId</code> - internal intake24 user id</li><li><code>username</code> - survey-unique respondent username</li><li><code>urlAuthToken</code> - URL authentication token</li><li><code>custom</code> - custom identifier that can be set through <code>userCustomField</code>. <ul><li>Enter a <code>name</code> of the custom field to be looked up the <code>value</code>.</li></ul></li></ul></li><li><p><code>target</code> - target window for redirection</p><ul><li><code>_blank</code> - open in a new window</li><li><code>_self</code> - open in the same window</li></ul></li><li><p><code>timer</code> - optional timer in seconds when automatic redirection should occur</p><ul><li>if set to <code>0</code>, timed redirection is disabled</li><li>if set to negative value, redirection is immediate</li></ul></li></ul><h3 id="review-confirm-prompt" tabindex="-1">Review confirm prompt <a class="header-anchor" href="#review-confirm-prompt" aria-label="Permalink to &quot;Review confirm prompt&quot;">​</a></h3><h3 id="same-as-before-prompt" tabindex="-1">Same as before prompt <a class="header-anchor" href="#same-as-before-prompt" aria-label="Permalink to &quot;Same as before prompt&quot;">​</a></h3><p>Prompt to detect foods that are the same as in the previous recalls / meals and offer to use the same portion-size estimation.</p><h3 id="split-food-prompt" tabindex="-1">Split food prompt <a class="header-anchor" href="#split-food-prompt" aria-label="Permalink to &quot;Split food prompt&quot;">​</a></h3><p>Prompt to identify foods that can potentially be split into separate foods.</p><h3 id="submit-prompt" tabindex="-1">Submit prompt <a class="header-anchor" href="#submit-prompt" aria-label="Permalink to &quot;Submit prompt&quot;">​</a></h3><p>Prompt with recap of the recall and submit button.</p><h4 id="options-5" tabindex="-1">Options <a class="header-anchor" href="#options-5" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><code>review</code> - defines rules (per layout, <code>desktop | mobile</code>) how review step is enforced before submission <ul><li><code>false</code> - no review step, submit button is always enabled</li><li><code>scroll</code> - button is enabled when scrolled through the meal list to the end</li><li><code>checkbox</code> - button is enabled when all meal checkboxes are ticked</li><li><code>onecheckbox</code> - button is enabled when one survey level checkbox is ticked</li></ul></li></ul><h2 id="portion-size-prompts" tabindex="-1">Portion-size prompts <a class="header-anchor" href="#portion-size-prompts" aria-label="Permalink to &quot;Portion-size prompts&quot;">​</a></h2><p>Prompts for food portion-size estimation. Only one can be used per scheme and functionality is tied <code>foods</code> scheme section.</p><h3 id="as-served-prompt" tabindex="-1">As-served prompt <a class="header-anchor" href="#as-served-prompt" aria-label="Permalink to &quot;As-served prompt&quot;">​</a></h3><h4 id="options-6" tabindex="-1">Options <a class="header-anchor" href="#options-6" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>badges</code> - show quantity badge on expansion panel header</p></li><li><p><code>leftovers</code> - show leftovers option</p></li><li><p><code>multiple</code> - allow multiple items to be selected. When enabled, additional options are available:</p><ul><li><code>false</code> - disable multiple selection</li><li><code>counter</code> - counter-style multiple selection</li><li><code>slider</code> - slider-style multiple selection</li></ul></li><li><p><code>image map settings</code> - image map settings</p><ul><li><code>labels</code> - show image map labels (options are <code>always ON</code> / <code>always OFF</code> / <code>portion size method setting</code>)</li><li><code>pinchZoom</code> - show PinchZoom control for mobile UI labels</li></ul></li></ul><h3 id="cereal-prompt" tabindex="-1">Cereal prompt <a class="header-anchor" href="#cereal-prompt" aria-label="Permalink to &quot;Cereal prompt&quot;">​</a></h3><h4 id="options-7" tabindex="-1">Options <a class="header-anchor" href="#options-7" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>badges</code> - show quantity badge on expansion panel header</p></li><li><p><code>leftovers</code> - show leftovers option</p></li><li><p><code>image map settings</code> - image map settings</p><ul><li><code>labels</code> - show image map labels (options are <code>always ON</code> / <code>always OFF</code> / <code>portion size method setting</code>)</li><li><code>pinchZoom</code> - show PinchZoom control for mobile UI labels</li></ul></li></ul><h3 id="direct-weight-prompt" tabindex="-1">Direct weight prompt <a class="header-anchor" href="#direct-weight-prompt" aria-label="Permalink to &quot;Direct weight prompt&quot;">​</a></h3><h3 id="drink-scale-prompt" tabindex="-1">Drink scale prompt <a class="header-anchor" href="#drink-scale-prompt" aria-label="Permalink to &quot;Drink scale prompt&quot;">​</a></h3><h4 id="options-8" tabindex="-1">Options <a class="header-anchor" href="#options-8" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>badges</code> - show quantity badge on expansion panel header</p></li><li><p><code>leftovers</code> - show leftovers option</p></li><li><p><code>image map settings</code> - image map settings</p><ul><li><code>labels</code> - show image map labels (options are <code>always ON</code> / <code>always OFF</code> / <code>portion size method setting</code>)</li><li><code>pinchZoom</code> - show PinchZoom control for mobile UI labels</li></ul></li><li><p><code>multiple</code> - allow multiple items to be selected. When enabled, additional options are available:</p><ul><li><code>false</code> - disable multiple selection</li><li><code>counter</code> - counter-style multiple selection</li><li><code>slider</code> - slider-style multiple selection</li></ul></li></ul><h4 id="counter-settings" tabindex="-1">Counter settings <a class="header-anchor" href="#counter-settings" aria-label="Permalink to &quot;Counter settings&quot;">​</a></h4><ul><li><code>current</code> - current value</li><li><code>min</code> - minimum value</li><li><code>max</code> - maximum value</li><li><code>confirm</code> - require confirmation</li><li><code>whole</code>- use whole numbers</li><li><code>fraction</code> - use fractions</li></ul><h4 id="slider-settings-1" tabindex="-1">Slider settings <a class="header-anchor" href="#slider-settings-1" aria-label="Permalink to &quot;Slider settings&quot;">​</a></h4><ul><li><code>current</code> - current value settings <ul><li><code>label</code> - label to be displayed</li><li><code>value</code> - current value</li><li><code>size</code> - droplet size (in <code>px</code>) of the label</li></ul></li><li><code>min</code> - minimum value settings <ul><li><code>label</code> - label to be displayed at the start of the slider (min value) (use <code>{value}</code> to insert variable value into the label)</li><li><code>value</code> - minimum value</li></ul></li><li><code>max</code> - maximum value settings <ul><li><code>label</code> - label to be displayed at the end of the slider (max value) (use <code>{value}</code> to insert variable value into the label)</li><li><code>value</code> - maximum value</li></ul></li><li><code>confirm</code> - require confirmation</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Prompt uses slider component as <a href="/admin/surveys/prompt-types#slider-prompt">slider-prompt</a>, but it is more constrained, keep in mind that:</p><ul><li>slider has decrement/increment buttons, so <code>min</code> and <code>max</code> labels won&#39;t be displayed</li><li>consider settings in context of <code>multiple</code> option that prompt is collecting - number if items related to selected food</li></ul></div><h3 id="guide-image-prompt" tabindex="-1">Guide image prompt <a class="header-anchor" href="#guide-image-prompt" aria-label="Permalink to &quot;Guide image prompt&quot;">​</a></h3><h4 id="options-9" tabindex="-1">Options <a class="header-anchor" href="#options-9" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>badges</code> - show quantity badge on expansion panel header</p></li><li><p><code>image map settings</code> - image map settings</p><ul><li><code>labels</code> - show image map labels (options are <code>always ON</code> / <code>always OFF</code> / <code>portion size method setting</code>)</li><li><code>pinchZoom</code> - show PinchZoom control for mobile UI labels</li></ul></li><li><p><code>linked quantity settings</code></p><ul><li>Allows to trigger quantity selection prompt for linked parent food</li><li><code>Automatically apply linked quantity</code> - skips prompt panel with quantity selection</li><li><code>Source categories to trigger</code> - child food&#39;s categories it should trigger on</li><li><code>Parent categories to link</code> - parent food&#39;s categories it should trigger on <ul><li>Optional standard unit can be assigned to set the <code>how-many</code> label</li></ul></li></ul></li></ul><h3 id="milk-in-a-hot-drink-prompt" tabindex="-1">Milk in a hot drink prompt <a class="header-anchor" href="#milk-in-a-hot-drink-prompt" aria-label="Permalink to &quot;Milk in a hot drink prompt&quot;">​</a></h3><h4 id="options-10" tabindex="-1">Options <a class="header-anchor" href="#options-10" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>badges</code> - show quantity badge on expansion panel header and option labels</p></li><li><p><code>orientation</code> - orientation of radio buttons (column/row)</p></li></ul><h3 id="milk-on-cereal-prompt" tabindex="-1">Milk on cereal prompt <a class="header-anchor" href="#milk-on-cereal-prompt" aria-label="Permalink to &quot;Milk on cereal prompt&quot;">​</a></h3><h4 id="options-11" tabindex="-1">Options <a class="header-anchor" href="#options-11" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>badges</code> - show quantity badge on expansion panel header</p></li><li><p><code>image map settings</code> - image map settings</p><ul><li><code>labels</code> - show image map labels (options are <code>always ON</code> / <code>always OFF</code> / <code>portion size method setting</code>)</li><li><code>pinchZoom</code> - show PinchZoom control for mobile UI labels</li></ul></li></ul><h3 id="parent-food-portion-prompt" tabindex="-1">Parent food portion prompt <a class="header-anchor" href="#parent-food-portion-prompt" aria-label="Permalink to &quot;Parent food portion prompt&quot;">​</a></h3><p>Calculates portion size based on parent food portion size.</p><h4 id="options-12" tabindex="-1">Options <a class="header-anchor" href="#options-12" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>badges</code> - show quantity badge on expansion panel header and option labels</p></li><li><p><code>orientation</code> - orientation of radio buttons (column/row)</p></li></ul><h3 id="pizza-prompt" tabindex="-1">Pizza prompt <a class="header-anchor" href="#pizza-prompt" aria-label="Permalink to &quot;Pizza prompt&quot;">​</a></h3><p>First iteration for pizza estimation</p><h4 id="options-13" tabindex="-1">Options <a class="header-anchor" href="#options-13" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>badges</code> - show quantity badge on expansion panel header</p></li><li><p><code>image map settings</code> - image map settings</p><ul><li><code>labels</code> - show image map labels (options are <code>always ON</code> / <code>always OFF</code> / <code>portion size method setting</code>)</li><li><code>pinchZoom</code> - show PinchZoom control for mobile UI labels</li></ul></li></ul><h3 id="pizza-v2-prompt" tabindex="-1">Pizza V2 prompt <a class="header-anchor" href="#pizza-v2-prompt" aria-label="Permalink to &quot;Pizza V2 prompt&quot;">​</a></h3><p>Second iteration for pizza estimation</p><h4 id="options-14" tabindex="-1">Options <a class="header-anchor" href="#options-14" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>image map settings</code> - image map settings</p><ul><li><code>labels</code> - show image map labels (options are <code>always ON</code> / <code>always OFF</code> / <code>portion size method setting</code>)</li><li><code>pinchZoom</code> - show PinchZoom control for mobile UI labels</li></ul></li></ul><h3 id="portion-size-option-prompt" tabindex="-1">Portion size option prompt <a class="header-anchor" href="#portion-size-option-prompt" aria-label="Permalink to &quot;Portion size option prompt&quot;">​</a></h3><p>Portion size option selection prompt</p><h3 id="recipe-builder-prompt" tabindex="-1">Recipe builder prompt <a class="header-anchor" href="#recipe-builder-prompt" aria-label="Permalink to &quot;Recipe builder prompt&quot;">​</a></h3><p>Recipe builder prompt for foods with multiple ingredients, such as sandwiches, salads etc. Recipe foods can be defined in <a href="/admin/localization/locales#recipe-foods">locales recipe-foods</a>.</p><h4 id="food-browser-settings-2" tabindex="-1">Food browser settings <a class="header-anchor" href="#food-browser-settings-2" aria-label="Permalink to &quot;Food browser settings&quot;">​</a></h4><ul><li><strong>Show categories first</strong><ul><li><code>food browse list</code> - Show categories first in the browse list</li><li><code>food search list</code> - Show categories first in the search list</li></ul></li></ul><h3 id="standard-portion-prompt" tabindex="-1">Standard portion prompt <a class="header-anchor" href="#standard-portion-prompt" aria-label="Permalink to &quot;Standard portion prompt&quot;">​</a></h3><h2 id="custom-prompts" tabindex="-1">Custom prompts <a class="header-anchor" href="#custom-prompts" aria-label="Permalink to &quot;Custom prompts&quot;">​</a></h2><p>Prompts with customizable generic behavior. Custom prompts can be used multiple times per scheme as long as they are identified with scheme-unique <a href="/admin/surveys/prompt-editor#general"><code>Prompt ID</code></a>.</p><h3 id="aggregate-choice-prompt" tabindex="-1">Aggregate choice prompt <a class="header-anchor" href="#aggregate-choice-prompt" aria-label="Permalink to &quot;Aggregate choice prompt&quot;">​</a></h3><p>Prompt to collect single option from a list of foods.</p><h4 id="options-15" tabindex="-1">Options <a class="header-anchor" href="#options-15" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>options</code> - locale-specific list of options with properties:</p><ul><li><code>label</code> - user-facing displayed label</li><li><code>value</code> - value stored in database</li></ul></li><li><p><code>as only for specified foods</code> - conditions to limit the foods to which the prompt is applicable</p></li></ul><h3 id="checkbox-list-prompt" tabindex="-1">Checkbox list prompt <a class="header-anchor" href="#checkbox-list-prompt" aria-label="Permalink to &quot;Checkbox list prompt&quot;">​</a></h3><p>Multi-select list of options.</p><h4 id="options-16" tabindex="-1">Options <a class="header-anchor" href="#options-16" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>options</code> - locale-specific list of options with properties:</p><ul><li><code>label</code> - user-facing displayed label</li><li><code>value</code> - value stored in database</li><li><code>exclusive</code> - exclusive flag - if selected, other options are deselected</li></ul></li><li><p><code>other</code> - <code>true</code> or <code>false</code> whether to show &#39;other&#39; option, free-form text input</p></li><li><p><code>min</code> - Minimum number of answers</p></li><li><p><code>max</code> - Maximum number of answers</p></li></ul><h3 id="date-picker-prompt" tabindex="-1">Date picker prompt <a class="header-anchor" href="#date-picker-prompt" aria-label="Permalink to &quot;Date picker prompt&quot;">​</a></h3><p>Prompt to collect date information.</p><ul><li><code>current</code> - highlighted current date offset in days</li><li><code>min</code> - minimum date offset in days</li><li><code>max</code> - maximum date offset in days</li></ul><h3 id="info-prompt" tabindex="-1">Info prompt <a class="header-anchor" href="#info-prompt" aria-label="Permalink to &quot;Info prompt&quot;">​</a></h3><p>Informational prompt for acknowledging displayed information.</p><h4 id="video-options" tabindex="-1">Video options <a class="header-anchor" href="#video-options" aria-label="Permalink to &quot;Video options&quot;">​</a></h4><p>Allows to embed youtube video with optional settings.</p><ul><li><code>videoId</code> - Youtube video ID</li><li><code>height</code> - video height (default: <code>1280</code>)</li><li><code>width</code> - video width (default: <code>720</code>)</li><li><code>autoContinue</code> - continue on video end</li><li><code>autoplay</code> - autoplay video</li><li><code>required</code> - video is required to be played in full to continue</li></ul><h4 id="carousel-options" tabindex="-1">Carousel options <a class="header-anchor" href="#carousel-options" aria-label="Permalink to &quot;Carousel options&quot;">​</a></h4><p>Allows to present information in carousel/slide form.</p><ul><li><code>variant</code> - graphical presentation</li><li><code>color</code> - carousel theme color</li><li><code>required</code> - carousel is required to be walked through to continue</li><li><code>items</code><ul><li><code>image (desktop)</code> - image URL for desktop layout</li><li><code>image (mobile)</code> - image URL for mobile layout</li><li><code>text</code> - Text content (rich text editor)</li></ul></li></ul><h3 id="no-more-information-prompt" tabindex="-1">No more information prompt <a class="header-anchor" href="#no-more-information-prompt" aria-label="Permalink to &quot;No more information prompt&quot;">​</a></h3><p>Terminal prompt for <code>food</code> or <code>meal</code> when no more information is required. It should be placed in <code>foods</code> and <code>postFoods</code> sections respectively.</p><h3 id="select-prompt" tabindex="-1">Select prompt <a class="header-anchor" href="#select-prompt" aria-label="Permalink to &quot;Select prompt&quot;">​</a></h3><p>Prompt to collect single or multiple option(s) from a list of options using select box.</p><h4 id="options-17" tabindex="-1">Options <a class="header-anchor" href="#options-17" aria-label="Permalink to &quot;Options&quot;">​</a></h4><ul><li><p><code>multiple</code> - <code>true</code> or <code>false</code> whether to allow multiple options to be selected</p></li><li><p><code>options</code> - locale-specific list of options with properties:</p><ul><li><code>label</code> - user-facing displayed label</li><li><code>value</code> - value stored in database</li></ul></li></ul><h3 id="slider-prompt" tabindex="-1">Slider prompt <a class="header-anchor" href="#slider-prompt" aria-label="Permalink to &quot;Slider prompt&quot;">​</a></h3><p>Prompt to collect numeric information using slider.</p><h4 id="slider-options" tabindex="-1">Slider options <a class="header-anchor" href="#slider-options" aria-label="Permalink to &quot;Slider options&quot;">​</a></h4><ul><li><code>current</code> - current value settings <ul><li><code>label</code> - label to be displayed</li><li><code>value</code> - current value</li><li><code>size</code> - droplet size (in <code>px</code>) of the label</li></ul></li><li><code>min</code> - minimum value settings <ul><li><code>label</code> - label to be displayed at the start of the slider (min value) (use <code>{value}</code> to insert variable value into the label)</li><li><code>value</code> - minimum value</li></ul></li><li><code>max</code> - maximum value settings <ul><li><code>label</code> - label to be displayed at the end of the slider (max value) (use <code>{value}</code> to insert variable value into the label)</li><li><code>value</code> - maximum value</li></ul></li><li><code>step</code> - step size</li></ul><h3 id="radio-list-prompt" tabindex="-1">Radio list prompt <a class="header-anchor" href="#radio-list-prompt" aria-label="Permalink to &quot;Radio list prompt&quot;">​</a></h3><p>Single-select list of options.</p><ul><li><p><code>options</code> - locale-specific list of options with properties:</p><ul><li><code>label</code> - user-facing displayed label</li><li><code>value</code> - value stored in database</li></ul></li><li><p><code>other</code> - <code>true</code> or <code>false</code> whether to show &#39;other&#39; option, free-form text input</p></li><li><p><code>orientation</code> - orientation of radio buttons (<code>column</code> or <code>row</code>)</p></li></ul><h3 id="textarea-prompt" tabindex="-1">Textarea prompt <a class="header-anchor" href="#textarea-prompt" aria-label="Permalink to &quot;Textarea prompt&quot;">​</a></h3><p>Prompt to offer free-form text input.</p><h3 id="time-picker-prompt" tabindex="-1">Time picker prompt <a class="header-anchor" href="#time-picker-prompt" aria-label="Permalink to &quot;Time picker prompt&quot;">​</a></h3><p>Prompt to collect time information.</p><ul><li><p><code>allowedMinutes</code> - allowed minutes for selection (<code>1</code>, <code>5</code>, <code>10</code>, <code>15</code>, <code>20</code>, <code>30</code>)</p></li><li><p><code>format</code> - time format (<code>am/pm</code> or <code>24h</code>)</p></li><li><p><code>AM/PM toggle</code> - <code>true</code> or <code>false</code> whether to show AM/PM toggle buttons</p></li></ul><h3 id="yes-no-prompt" tabindex="-1">Yes/no prompt <a class="header-anchor" href="#yes-no-prompt" aria-label="Permalink to &quot;Yes/no prompt&quot;">​</a></h3><p>Prompt to collect <code>yes</code> / <code>no</code> (<code>true</code> / <code>false</code>) information presented as distinct buttons.</p>',149)]))}const h=o(l,[["render",r]]);export{u as __pageData,h as default};
