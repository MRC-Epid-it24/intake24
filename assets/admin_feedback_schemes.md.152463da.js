import{_ as e,o as a,c as o,R as d}from"./chunks/framework.8e8e72cd.js";const m=JSON.parse('{"title":"Feedback schemes","description":"","frontmatter":{},"headers":[],"relativePath":"admin/feedback/schemes.md","filePath":"admin/feedback/schemes.md"}'),i={name:"admin/feedback/schemes.md"},t=d('<h1 id="feedback-schemes" tabindex="-1">Feedback schemes <a class="header-anchor" href="#feedback-schemes" aria-label="Permalink to &quot;Feedback schemes&quot;">​</a></h1><p>Feedback output is defined by feedback scheme, which has couple of sections.</p><h2 id="detail" tabindex="-1">Detail <a class="header-anchor" href="#detail" aria-label="Permalink to &quot;Detail&quot;">​</a></h2><p>Detail tab displays selected feedback scheme info.</p><h2 id="create-edit" tabindex="-1">Create / Edit <a class="header-anchor" href="#create-edit" aria-label="Permalink to &quot;Create / Edit&quot;">​</a></h2><p>Edit tab allows to modify selected feedback scheme.</p><ul><li><p><code>Name</code> - <code>feedback-scheme-wide</code> unique name</p></li><li><p><code>Type</code> - Placeholder at the moment for future to allow to define various types of feedback schemes</p></li><li><p><code>Outputs</code> - List of outputs that are allowed / offered to user. Possible outputs are <code>print</code>, <code>download</code> and <code>email</code>.</p></li><li><p><code>Physical data inputs</code> - List of physical data inputs / identifiers, which are required to be collected for feedback calculation</p></li><li><p><code>Sections</code> - List of feedback sections to be included in feedback</p><ul><li><p>drag &amp; drop re-ordering of sections</p></li><li><p>tick / untick to include / exclude section from feedback</p></li><li><p>available sections are:</p><ul><li><code>topFoods</code> - Top foods</li><li><code>cards</code> - Feedback cards</li><li><code>meals</code> - Meals per-day breakdown</li></ul></li></ul></li></ul><h2 id="top-foods" tabindex="-1">Top foods <a class="header-anchor" href="#top-foods" aria-label="Permalink to &quot;Top foods&quot;">​</a></h2><p>Settings to populate top foods feedback section. It controls top foods lists and nutrient composition pie charts.</p><h3 id="number-of-foods" tabindex="-1">Number of foods <a class="header-anchor" href="#number-of-foods" aria-label="Permalink to &quot;Number of foods&quot;">​</a></h3><ul><li>allows to set number of top foods to display + rest as <code>other food</code></li><li>preferred colors can be assigned to each food, which will be displayed both in lists &amp; pie charts</li></ul><h3 id="nutrient-types" tabindex="-1">Nutrient types <a class="header-anchor" href="#nutrient-types" aria-label="Permalink to &quot;Nutrient types&quot;">​</a></h3><ul><li>list of nutrient types to be displayed, which translates to number of lists &amp; pie charts per nutrient type</li></ul><h2 id="cards" tabindex="-1">Cards <a class="header-anchor" href="#cards" aria-label="Permalink to &quot;Cards&quot;">​</a></h2><p>List of cards to be included in feedback.</p><p>There are couple of feedback card types that can be used:</p><ul><li><p><code>Character</code> - Assigns nutrient types, which gets matched with demographic groups.</p></li><li><p><code>Nutrient group</code> - Allows to define group of nutrients &amp; thresholds to provide aggregated intake.</p></li><li><p><code>Five a day</code> - Defines <code>five-a-day</code> feedback for fruit &amp; vegetables.</p></li></ul><h2 id="demographic-groups" tabindex="-1">Demographic groups <a class="header-anchor" href="#demographic-groups" aria-label="Permalink to &quot;Demographic groups&quot;">​</a></h2><p>List of demographic groups definitions, which are used for matching with <code>character</code> cards based on the defined criteria.</p><h2 id="henry-coefficients" tabindex="-1">Henry coefficients <a class="header-anchor" href="#henry-coefficients" aria-label="Permalink to &quot;Henry coefficients&quot;">​</a></h2><p>List of Henry coefficients used for calculations (BMR etc).</p><h2 id="meals-per-day-breakdown" tabindex="-1">Meals per-day breakdown <a class="header-anchor" href="#meals-per-day-breakdown" aria-label="Permalink to &quot;Meals per-day breakdown&quot;">​</a></h2><p>Meals per-day breakdown statistics.</p><h3 id="chart-breakdown" tabindex="-1">Chart breakdown <a class="header-anchor" href="#chart-breakdown" aria-label="Permalink to &quot;Chart breakdown&quot;">​</a></h3><p>Meal per-day breakdown chart for selected nutrient type(s).</p><ul><li><p><code>Colors</code> - list of colors to use for meal chart</p></li><li><p><code>Nutrient types</code> - list of nutrient types groups, displayed chart per nutrient type group</p></li></ul><h3 id="table-breakdown" tabindex="-1">Table breakdown <a class="header-anchor" href="#table-breakdown" aria-label="Permalink to &quot;Table breakdown&quot;">​</a></h3><p>Meal per-day breakdown table with selected meal specific fields.</p><p>List of columns to be displayed in meal per-day breakdown table. List can be re-ordered by drag &amp; drop.</p><ol><li>There are common field properties for all field types:</li></ol><ul><li><p><code>header</code> - localized column header name</p></li><li><p><code>value</code> - localized field value</p></li></ul><div class="tip custom-block"><p class="custom-block-title">Value formatting</p><p>If field value is empty, then field value is display as is. If additional formatting is needed, use <code>{value}</code> placeholder to display field value.</p></div><ul><li><code>type</code> - field type, possible values <code>standard</code>, <code>custom</code> or <code>nutrient</code></li></ul><ol start="2"><li>Depending on selected field type, there are additional properties to be set:</li></ol><ul><li><code>fieldId</code> - field id, which is used to match with meal specific field</li></ul><h4 id="standard-field-ids" tabindex="-1"><code>Standard</code> field IDs <a class="header-anchor" href="#standard-field-ids" aria-label="Permalink to &quot;`Standard` field IDs&quot;">​</a></h4><ul><li><code>Name</code> - Meal name (Breakfast, Lunch, Dinner, Snack, ...)</li><li><code>Time</code> - Meal time to display (HH:MM)</li><li><code>Hours</code> - Hours part of meal time to display (HH)</li><li><code>Minutes</code> - Minutes part of meal time minutes to display (MM)</li><li><code>Duration</code> - Meal duration in minutes</li></ul><h4 id="custom-field-ids" tabindex="-1"><code>Custom</code> field IDs <a class="header-anchor" href="#custom-field-ids" aria-label="Permalink to &quot;`Custom` field IDs&quot;">​</a></h4><p>When <code>custom</code> field type is selected, <code>fieldId</code> must be set to match specific <code>meal prompt ID</code> from selected <code>survey scheme</code>.</p><h4 id="nutrient-field-ids" tabindex="-1"><code>Nutrient</code> field IDs <a class="header-anchor" href="#nutrient-field-ids" aria-label="Permalink to &quot;`Nutrient` field IDs&quot;">​</a></h4><p>When <code>nutrient</code> field type is selected, <code>fieldId</code> is generated automatically based on selected <code>nutrient type</code> list.</p>',41),l=[t];function s(c,r,n,p,h,u){return a(),o("div",null,l)}const b=e(i,[["render",s]]);export{m as __pageData,b as default};
