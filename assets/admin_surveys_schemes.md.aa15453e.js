import{_ as e,o,c as d,S as i}from"./chunks/framework.73d05564.js";const p=JSON.parse('{"title":"Survey schemes","description":"","frontmatter":{},"headers":[],"relativePath":"admin/surveys/schemes.md","filePath":"admin/surveys/schemes.md"}'),t={name:"admin/surveys/schemes.md"},s=i('<h1 id="survey-schemes" tabindex="-1">Survey schemes <a class="header-anchor" href="#survey-schemes" aria-label="Permalink to &quot;Survey schemes&quot;">​</a></h1><p>Survey recall flow is defined by scheme, which has couple of sections.</p><h2 id="detail" tabindex="-1">Detail <a class="header-anchor" href="#detail" aria-label="Permalink to &quot;Detail&quot;">​</a></h2><p>Detail tab displays selected survey scheme info.</p><h2 id="create-edit" tabindex="-1">Create / Edit <a class="header-anchor" href="#create-edit" aria-label="Permalink to &quot;Create / Edit&quot;">​</a></h2><p>Edit tab allows to modify selected survey scheme.</p><ul><li><p><code>Name</code> - <code>survey-scheme-wide</code> unique name</p></li><li><p><code>Type</code> - Placeholder at the moment for future to allow to define various types of survey schemes</p></li><li><p><code>Default meals</code> - List of predefined meals that will appear at the start of the recall.</p><ul><li>It allows to: <ul><li>Create new meals with default time and localized name</li><li>Remove meals</li><li>Load whole meal list from different scheme</li><li>Reset the list to default one</li></ul></li></ul></li></ul><h2 id="prompts" tabindex="-1">Prompts <a class="header-anchor" href="#prompts" aria-label="Permalink to &quot;Prompts&quot;">​</a></h2><p>Prompts tab allows to design dietary survey recall flow and define details about each prompt asked.</p><p>Prompts are categorized to sections and they are asked in specified fixed order. See table below.</p><h3 id="recall-sections" tabindex="-1">Recall sections <a class="header-anchor" href="#recall-sections" aria-label="Permalink to &quot;Recall sections&quot;">​</a></h3><table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td>1. Pre-meal</td><td>Prompts asked about whole recall before dietary data entered</td></tr><tr><td>2. Pre-foods</td><td>Prompts asked about meal before foods were entered</td></tr><tr><td>3. Foods</td><td>Prompts asked about the foods</td></tr><tr><td>4. Post-foods</td><td>Prompts asked about meal after foods were entered</td></tr><tr><td>5. Post-meal</td><td>Prompts asked about whole recall after dietary data</td></tr><tr><td>6. Submission</td><td>Prompts asked during data submissions</td></tr></tbody></table><p>Whole prompt sections group can be loaded from another scheme using <code>load from scheme</code> button.</p><p>When prompt section is selected, list of prompts appear below:</p><ul><li>New prompts can be added</li><li>Prompts can be removed</li><li>List of prompts can be re-arranged by drag &amp; drop</li><li>Prompt can be loaded from <code>template</code> defined in <code>scheme prompts</code> section</li><li>Prompt can be saved as <code>template</code> if it doesn&#39;t exist yet (determined by unique <code>prompt id</code>)</li><li>Prompt&#39;s settings can be synced from <code>template</code> if it exists (determined by unique <code>prompt id</code>)</li></ul><h2 id="data-export" tabindex="-1">Data export <a class="header-anchor" href="#data-export" aria-label="Permalink to &quot;Data export&quot;">​</a></h2><p>Data export tab allows to define fields, which will get exported to flattened CSV file having <code>food-per-row</code> with all additional fields.</p><p>There is a fixed list of possible data export sections</p><h3 id="sections" tabindex="-1">Sections <a class="header-anchor" href="#sections" aria-label="Permalink to &quot;Sections&quot;">​</a></h3><table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td>User record fields</td><td><code>users</code> table row based fields</td></tr><tr><td>User custom fields</td><td><code>key:value</code> pairs from <code>user_custom_fields</code> table</td></tr><tr><td>Survey record fields</td><td><code>surveys</code> table row based fields</td></tr><tr><td>Submission record fields</td><td><code>survey_submissions</code> table row based fields</td></tr><tr><td>Submission custom fields</td><td><code>key:value</code> pairs from <code>survey_submission_custom_fields</code> table</td></tr><tr><td>Meal record fields</td><td><code>survey_submission_meals</code> table row based fields</td></tr><tr><td>Meal custom fields</td><td><code>key:value</code> pairs from <code>survey_submission_meal_custom_fields</code> table</td></tr><tr><td>Food record fields</td><td><code>survey_submission_foods</code> and <code>survey_submission_missing_foods</code> table row based fields</td></tr><tr><td>Food custom fields</td><td><code>key:value</code> pairs from <code>survey_submission_food_custom_fields</code> table</td></tr><tr><td>Food composition fields</td><td><code>key:value</code> pairs from <code>nutrient_table_records_fields</code> table</td></tr><tr><td>Food nutrient fields</td><td><code>nutrient_types</code> table row based fields</td></tr><tr><td>Portion size fields</td><td><code>key:value</code> pairs from <code>survey_submission_portion_size_fields</code> table</td></tr></tbody></table><p>Sections can be re-arranged by drag &amp; drop and they will appear accordingly in export file.</p><p>Each section can be edited. Screen is divided in half to show included fields on left and available fields for inclusion on right.</p><p>Each field has:</p><ul><li><code>Field ID</code> - unique field identifier to internal link the data</li><li><code>Field label</code> - customizable CSV column header in export file</li></ul><h4 id="user-record-fields" tabindex="-1">User record fields <a class="header-anchor" href="#user-record-fields" aria-label="Permalink to &quot;User record fields&quot;">​</a></h4><ul><li><code>userId</code> - unique user identifier, sequence number</li><li><code>name</code> - user name</li><li><code>simpleName</code> - transformed user name, stripped off any diacritic / accent characters</li><li><code>email</code> - user email</li><li><code>phone</code> - user phone number</li></ul><h4 id="user-custom-fields" tabindex="-1">User custom fields <a class="header-anchor" href="#user-custom-fields" aria-label="Permalink to &quot;User custom fields&quot;">​</a></h4><p>User custom fields are key-value pairs, set up during respondent account creation.</p><h4 id="survey-record-fields" tabindex="-1">Survey record fields <a class="header-anchor" href="#survey-record-fields" aria-label="Permalink to &quot;Survey record fields&quot;">​</a></h4><ul><li><code>surveyId</code> - unique survey identifier, sequence number</li><li><code>username</code> - survey-unique respondent identifier attached to both user and survey record (aka <code>user survey alias</code>)</li></ul><h4 id="submission-record-fields" tabindex="-1">Submission record fields <a class="header-anchor" href="#submission-record-fields" aria-label="Permalink to &quot;Submission record fields&quot;">​</a></h4><ul><li><code>submissionId</code> - unique submission identifier, UUIDv4</li><li><code>startTime</code> - client-recorded recall start time, ISO 8601 format</li><li><code>endTime</code> - client-recorded recall end time, ISO 8601 format</li><li><code>submissionTime</code> - server-recorded submission time, ISO 8601 format</li><li><code>recallDuration</code> - recall duration in mins (rounded to whole number using <code>truncate</code>)</li><li><code>userAgent</code> - client device raw user agent header</li><li><code>browser</code> - client device browser name (user-agent parsed)</li><li><code>engine</code> - client device browser engine name (user-agent parsed)</li><li><code>device</code> - client device name (user-agent parsed)</li><li><code>os</code> - client device operating system name (user-agent parsed)</li><li><code>cpu</code> - client device CPU architecture (user-agent parsed)</li></ul><h4 id="submission-custom-fields" tabindex="-1">Submission custom fields <a class="header-anchor" href="#submission-custom-fields" aria-label="Permalink to &quot;Submission custom fields&quot;">​</a></h4><p>Submission-level custom data collected during the recall.</p><ul><li><code>Field ID</code> is the unique <code>Prompt ID</code> set up in scheme prompts section</li></ul><h4 id="meal-record-fields" tabindex="-1">Meal record fields <a class="header-anchor" href="#meal-record-fields" aria-label="Permalink to &quot;Meal record fields&quot;">​</a></h4><ul><li><code>mealIndex</code> - zero-based meal index in the recall generated during data-export based on meal time</li><li><code>mealId</code> - unique meal identifier, UUIDv4</li><li><code>name</code> - meal name</li><li><code>time</code> - meal time (HH:mm)</li><li><code>duration</code> - meal duration (mins)</li></ul><h4 id="meal-custom-fields" tabindex="-1">Meal custom fields <a class="header-anchor" href="#meal-custom-fields" aria-label="Permalink to &quot;Meal custom fields&quot;">​</a></h4><p>Meal-level custom data collected during the recall.</p><ul><li><code>Field ID</code> is the unique <code>Prompt ID</code> set up in scheme prompts section</li></ul><h4 id="food-record-fields" tabindex="-1">Food record fields <a class="header-anchor" href="#food-record-fields" aria-label="Permalink to &quot;Food record fields&quot;">​</a></h4><p>Contains <code>encoded food</code> and <code>missing food</code> records data</p><p><strong>Common fields</strong></p><ul><li><code>foodIndex</code> - zero-based food index within a meal (includes encoded food and missing food records)</li><li><code>parentId</code> - unique food identifier of parent food, UUIDv4</li></ul><p><strong>Food record fields</strong></p><ul><li><code>foodId</code> - unique food identifier, UUIDv4</li><li><code>code</code> - Food code</li><li><code>englishName</code> - Food name (English)</li><li><code>localName</code> - Food name (local)</li><li><code>readyMeal</code> - Flag indicating if food is ready meal</li><li><code>searchTerm</code> - Search term used to find the food</li><li><code>reasonableAmount</code> - Flag indicating if food amount is reasonable</li><li><code>foodGroupId</code> - Food group identifier, sequence number</li><li><code>foodGroupEnglishName</code> - Food group name (English)</li><li><code>foodGroupLocalName</code> - Food group name (local)</li><li><code>brand</code> - Food brand</li><li><code>barcode</code> - Food barcode</li><li><code>nutrientTableId</code> - Nutrient table identifier</li><li><code>nutrientTableCode</code> - Nutrient table code</li></ul><p><strong>Missing Food record fields</strong></p><ul><li><code>missingId</code> - unique missing food identifier, UUIDv4</li><li><code>missingName</code> - Missing food name</li><li><code>missingBrand</code> - Missing food brand</li><li><code>missingBarcode</code> - Missing food barcode</li><li><code>missingDescription</code> - Missing food description</li><li><code>missingPortionSize</code> - Missing food portion size</li><li><code>missingLeftovers</code> - Missing food leftovers</li></ul><h4 id="food-custom-fields" tabindex="-1">Food custom fields <a class="header-anchor" href="#food-custom-fields" aria-label="Permalink to &quot;Food custom fields&quot;">​</a></h4><p>Food-level custom data collected during the recall.</p><ul><li><code>Field ID</code> is the unique <code>Prompt ID</code> set up in scheme prompts section</li></ul><h4 id="food-composition-fields" tabindex="-1">Food composition fields <a class="header-anchor" href="#food-composition-fields" aria-label="Permalink to &quot;Food composition fields&quot;">​</a></h4><p>List of available food composition fields from nutrient table</p><h4 id="food-nutrient-fields" tabindex="-1">Food nutrient fields <a class="header-anchor" href="#food-nutrient-fields" aria-label="Permalink to &quot;Food nutrient fields&quot;">​</a></h4><p>List of available nutrient type fields</p><h4 id="portion-size-fields" tabindex="-1">Portion size fields <a class="header-anchor" href="#portion-size-fields" aria-label="Permalink to &quot;Portion size fields&quot;">​</a></h4><p>List of portion size fields based on collection portion size methods</p><ul><li><code>portion</code> - Stringified whole portion size object</li><li><code>portionMethod</code> - Portion size method ID</li><li><code>portionWeight</code> - Calculated portion weight (<code>servingWeight</code> - <code>leftoversWeight</code>)</li><li><code>servingWeight</code> - Food weight in grams</li><li><code>leftoversWeight</code> - Leftovers weight in grams</li></ul>',58),a=[s];function l(r,c,n,u,m,f){return o(),d("div",null,a)}const b=e(t,[["render",l]]);export{p as __pageData,b as default};
