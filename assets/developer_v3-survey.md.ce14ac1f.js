import{_ as e,c as t,o as a,a as s}from"./app.e32337bc.js";var o="/assets/meal-list.4f3b5a01.png",n="/assets/prompt-example.041bda74.png";const k='{"title":"Version 3 recall model","description":"","frontmatter":{},"headers":[{"level":2,"title":"Data structure summary","slug":"data-structure-summary"},{"level":2,"title":"Meal/food list","slug":"meal-food-list"},{"level":3,"title":"Linked foods","slug":"linked-foods"},{"level":2,"title":"Selection","slug":"selection"},{"level":3,"title":"Automatic selection algorithm","slug":"automatic-selection-algorithm"},{"level":2,"title":"Prompts","slug":"prompts"},{"level":3,"title":"Prompt types","slug":"prompt-types"},{"level":3,"title":"Prompt rules","slug":"prompt-rules"},{"level":2,"title":"Main recall loop","slug":"main-recall-loop"},{"level":2,"title":"Multiple-pass recall model","slug":"multiple-pass-recall-model"}],"relativePath":"developer/v3-survey.md","lastUpdated":1642417039309}',r={},l=s(`<h1 id="version-3-recall-model" tabindex="-1">Version 3 recall model <a class="header-anchor" href="#version-3-recall-model" aria-hidden="true">#</a></h1><p>This page describes the data and user interaction models used for Intake24 version 3.</p><h2 id="data-structure-summary" tabindex="-1">Data structure summary <a class="header-anchor" href="#data-structure-summary" aria-hidden="true">#</a></h2><p>A dietary recall object in Intake24 consists simply of a list of meals, each in turn consisting of a list of foods.</p><p>Every object (i.e. recall, meals, foods) has a <code>flags</code> field and a <code>customFields</code> field that can be used by custom study schemes to attach additional study-specific data to objects, for instance for meals this could be data like where the food was consumed (at school, at home etc.) and for foods this could where this specific item was bought.</p><p>The recall object has additional standard fields like the recall start time and the submission time, meals have descriptions and meal times, etc.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>This section is not intended to provide a detailed description of the version 3 data structures but to serve as a reference for version 4 developers.</p></div><p>The data structure looks approximately like this:</p><div class="language-json"><pre><code><span class="token punctuation">{</span>
  <span class="token property">&quot;startTime&quot;</span><span class="token operator">:</span> <span class="token string">&quot;...&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;endTime&quot;</span><span class="token operator">:</span> <span class="token string">&quot;...&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;flags&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>...<span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">&quot;customData&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;meals&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
     <span class="token punctuation">{</span>
      <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Breakfast&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;time&quot;</span><span class="token operator">:</span> <span class="token string">&quot;18:00&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;flags&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>...<span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token property">&quot;customData&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token property">&quot;foods&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
         <span class="token punctuation">{</span>
           code<span class="token operator">:</span> <span class="token string">&quot;ABCD123&quot;</span><span class="token punctuation">,</span> 
           searchTerm<span class="token operator">:</span> <span class="token string">&quot;...&quot;</span><span class="token punctuation">,</span>
           <span class="token property">&quot;flags&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>...<span class="token punctuation">]</span><span class="token punctuation">,</span>
           <span class="token property">&quot;customData&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">,</span>
           portionSize<span class="token operator">:</span> ...<span class="token punctuation">,</span>
           ...       
         <span class="token punctuation">}</span><span class="token punctuation">,</span>
         ... <span class="token comment">// other foods in breakfast</span>
       <span class="token punctuation">]</span>
     <span class="token punctuation">}</span><span class="token punctuation">,</span>
     ... <span class="token comment">// other meals</span>
   <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="meal-food-list" tabindex="-1">Meal/food list <a class="header-anchor" href="#meal-food-list" aria-hidden="true">#</a></h2><img src="`+o+`" style="float:right;margin-left:15px;margin-top:15px;border:2px solid lightgrey;"><p>In version 3 the meal list panel can be found on the left side of the screen. Initially it shows the standard list of meals suggested by the system (breakfast, lunch etc.) and the meals are empty. Respondents are free to delete or add more meals as required.</p><p>Every meal consists of a list of foods. The green tick marks (see screenshot on the right) represent the completion state of the food item. First pass (no ticks) is the free text entry which means that the description of the food item has been entered as an arbitrary text by the responent. Second pass (one tick) means that the free text description has been matched with a food from the database and the respondent has selected the food that they think best matches their description.</p><div style="clear:both;"></div><h3 id="linked-foods" tabindex="-1">Linked foods <a class="header-anchor" href="#linked-foods" aria-hidden="true">#</a></h3><p>Some foods in a meal can be marked as linked to some other food, which is called the <em>main food</em>. This is mostly a visual change (linked foods are always grouped under the main food) and does not affect the underlying data structure, in the sense that the final result is still a flat list of foods.</p><p>The linking information is also used by the associated foods system in order to determine what associated foods have already been entered and don&#39;t need to be suggested. For instance, if there is a spread is linked to a toast, the associated foods system will not suggest any other spreads.</p><h2 id="selection" tabindex="-1">Selection <a class="header-anchor" href="#selection" aria-hidden="true">#</a></h2><p>The central concept of the recall flow logic is the <em>current selection</em>.</p><p>The current selection can be one of the following:</p><ul><li>Nothing</li><li>Meal</li><li>Food</li></ul><p>Additionally, the system differentiates between <em>manual selection</em> and <em>automatic selection</em>.</p><p>The current selection type is set to manual when the respondent clicks on a food or a meal. The selection type is set to automatic when the system has exhausted prompts for the current selection and automatically moves on to the next item.</p><p>Prompt rules (see below) can look at the selection type to determine what prompts are applicable to the current selection, for instance some prompts will only trigger on manual selection.</p><h3 id="automatic-selection-algorithm" tabindex="-1">Automatic selection algorithm <a class="header-anchor" href="#automatic-selection-algorithm" aria-hidden="true">#</a></h3><p>The current automatic selection algorithm works as follows:</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>In the below pseudocode <strong>try</strong> means to check whether the food or meal has any active prompts by evaluating the relevant prompt rules.</p><p>If the candidate food or meal has one or more enabled prompts, it becomes the new selection and the selection is marked as automatic.</p><p>Unless stated otherwise the foods are always tried in the order they had been entered, and the meals are tried in the chronological order.</p></div><div class="language-"><pre><code>  if current selection is nothing {

    try all foods in all meals starting with the chronologically first meal;

    if none of the foods have prompts available try all meals
  }

  if (current selection is a meal) {

    try foods in the selected meal;

    try foods in the next meal;

    try foods in all other meals, starting from the first;

    if none of the foods have enabled prompts try all meals
  }

  if (current selection is a food) {

    try next food in the same meal;

    if the food is linked to some other food, try that food;

    try all other foods in the same meal starting from the first;

    try the current meal;

    try the meal that follows the current meal;

    try all foods in all meals;

    try all meals;     
  }
</code></pre></div><p>If no further item can be selected, i.e. there are no enabled prompts left for any meal or food, the recall is marked as complete and the system proceeds to the final questions about the whole recall (&quot;survey prompts&quot;).</p><p>At this point the respondent can still add meals by clicking on the &quot;Add meal&quot; button or foods by clicking on a meal in the list.</p><h2 id="prompts" tabindex="-1">Prompts <a class="header-anchor" href="#prompts" aria-hidden="true">#</a></h2><img src="`+n+`" style="float:right;margin-left:15px;margin-top:15px;border:2px solid lightgrey;"><p>The main building block of the dietary recall is called a <em>prompt</em>. A prompt is usually a simple question about the currently selected item.</p><p>For example, a meal confirmation prompt asks to confirm the time when the respondent had the meal, a ready meal prompt asks which foods from a meal were ready made etc.</p><p>Some prompts are more sophisticated (e.g, portion size estimation prompts) and could consist of several stages, however in any case the purpose of a prompt is to present a UI to ask a question and add one specific block of data to the currently selected item (or to the recall as a whole) based on the respondent&#39;s answer.</p><h3 id="prompt-types" tabindex="-1">Prompt types <a class="header-anchor" href="#prompt-types" aria-hidden="true">#</a></h3><p>There are currently four prompt types in the system. The type of a prompt determines what selection type it is applicable to.</p><p>The prompt types are:</p><h4 id="_1-food-prompts" tabindex="-1">1. Food prompts <a class="header-anchor" href="#_1-food-prompts" aria-hidden="true">#</a></h4><p>Applicable to foods regardless of context (i.e. ignoring other foods in the meal). Food prompt UI only has access to data pertaining to the selected food and can only modify this food. An example of a food prompt is the portion size estimation.</p><h4 id="_2-extended-food-prompts" tabindex="-1">2. Extended food prompts <a class="header-anchor" href="#_2-extended-food-prompts" aria-hidden="true">#</a></h4><p>Extended food prompts also apply to foods, however they also have access to other foods in the same meal. This type of prompt is used when the food context matters, such as the associated food prompts. Extended food prompts can modify the selected food or add or modify foods in the same meal.</p><h4 id="_3-meal-prompts" tabindex="-1">3. Meal prompts <a class="header-anchor" href="#_3-meal-prompts" aria-hidden="true">#</a></h4><p>Meal prompts apply to meals. They can modify both the data about the meal itself, change the list of foods, and any data about the foods in the meal.</p><p>Examples of meal prompts are the meal confirmation prompt that asks for the time of the meal, the free text food entry prompt, or the drinks reminder prompt.</p><h4 id="_4-survey-prompts" tabindex="-1">4. Survey prompts <a class="header-anchor" href="#_4-survey-prompts" aria-hidden="true">#</a></h4><p>Finally, survey prompts are prompts that collect information about the whole recall. This is typically additional questions such as the context of the submission (&quot;was it a usual day?&quot;, &quot;are you following a diet?&quot;) or questions that relate to the whole day (&quot;did you take any dietary supplements?&quot;).</p><div style="clear:both;"></div><h3 id="prompt-rules" tabindex="-1">Prompt rules <a class="header-anchor" href="#prompt-rules" aria-hidden="true">#</a></h3><p>Prompt rules are special functions that are used to determine if a prompt can be shown for the given food or meal. Typically they inspect the current state of the meal or food, however some rules can also take the overall state of the recall into consideration. For instance, some prompts are only applicable during the second pass of the multi-pass model and the current pass is determined by a global survey flag.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Prompt rules are associated with the corresponding prompt type UI, which means that a collection of prompt rules is all that is needed to define and customise the recall flow.</p></div><h2 id="main-recall-loop" tabindex="-1">Main recall loop <a class="header-anchor" href="#main-recall-loop" aria-hidden="true">#</a></h2><p>When selecting the next prompt from a set of enabled prompts (i.e. the current selection has more than one enabled prompt) Intake24 v3 uses a prompt priority score, however these priorities are currently equivalent to the order in which the prompt rules are listed in the code and should be removed.</p><p>In version 3 the main recall loop is implemented with a recursive function <strong>showNextPrompt()</strong>:</p><div class="language-"><pre><code>function showNextPrompt() {

  get next prompt for current selection;

  if (next prompt available) {
     show prompt UI;
     when prompt completes, show next prompt;
  } else {
     select next item that has an enabled prompt; // see selection algorithm above
     
     if (selection available) {
       show next prompt;
     } else {

        get next prompt for survey; // prompts related to the whole recall and not individual
                                       items

        if (next prompt available) {
           show prompt UI;
           when prompt completes, show next prompt;
        } else {
           show submission page;
        }
     }
  }
}

</code></pre></div><h2 id="multiple-pass-recall-model" tabindex="-1">Multiple-pass recall model <a class="header-anchor" href="#multiple-pass-recall-model" aria-hidden="true">#</a></h2><p>Intake24 uses the so-called multiple-pass recall model. The multiple-pass approach simply means that the questions are grouped into &quot;passes&quot; and the system will not ask any questions associated with subsequent passes until all of the questions in the previous passes are exhausted.</p><p>In other words the system will initially go over all of the meals and foods and ask questions from the first pass only, and when no more questions remain it will go back to the first meal and start asking question from the second pass.</p><p>This model is somewhat complicated by the ability of the respondent to freely add or delete meals and foods at any point during the recall. Although the first pass could have been finished prompts from this pass still have to be shown for the new entries.</p><p>In Intake24 v3 this logic is implemented using global recall flags in combination with prompt rule logic. For instance, when the first pass prompts have been exhausted the system will mark the recall with a special flag that will unlock the second pass prompts, however if a new food is added the first pass prompts will still be shown for that food.</p><p>This interaction can sometimes lead to complicated interaction between prompts and the selection order.</p>`,61),p=[l];function i(c,d,h,m,u,f){return a(),t("div",null,p)}var g=e(r,[["render",i]]);export{k as __pageData,g as default};
