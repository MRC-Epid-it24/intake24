import{_ as s,c as e,o as a,a as n}from"./app.a95cc4c4.js";const k='{"title":"Portion size data","description":"","frontmatter":{},"headers":[{"level":2,"title":"Get food data","slug":"get-food-data"},{"level":3,"title":"Request","slug":"request"},{"level":3,"title":"Response","slug":"response"},{"level":2,"title":"Get as served image set data","slug":"get-as-served-image-set-data"},{"level":3,"title":"Request","slug":"request-1"},{"level":3,"title":"Response","slug":"response-1"},{"level":2,"title":"Get multiple as served image sets data","slug":"get-multiple-as-served-image-sets-data"},{"level":3,"title":"Request","slug":"request-2"},{"level":3,"title":"Response","slug":"response-2"},{"level":2,"title":"Get guide image data","slug":"get-guide-image-data"},{"level":3,"title":"Request","slug":"request-3"},{"level":3,"title":"Response","slug":"response-3"},{"level":2,"title":"Get multiple guide image data","slug":"get-multiple-guide-image-data"},{"level":3,"title":"Request","slug":"request-4"},{"level":3,"title":"Response","slug":"response-4"},{"level":2,"title":"Get image map data","slug":"get-image-map-data"},{"level":3,"title":"Request","slug":"request-5"},{"level":3,"title":"Response","slug":"response-5"},{"level":2,"title":"Get multiple image maps data","slug":"get-multiple-image-maps-data"},{"level":3,"title":"Request","slug":"request-6"},{"level":3,"title":"Response","slug":"response-6"},{"level":2,"title":"Get drink scale data","slug":"get-drink-scale-data"},{"level":3,"title":"Request","slug":"request-7"},{"level":3,"title":"Response","slug":"response-7"},{"level":2,"title":"Get multiple drinkware sets data","slug":"get-multiple-drinkware-sets-data"},{"level":3,"title":"Request","slug":"request-8"},{"level":3,"title":"Response","slug":"response-8"},{"level":2,"title":"Weight entry dummy","slug":"weight-entry-dummy"},{"level":3,"title":"Request","slug":"request-9"},{"level":3,"title":"Response","slug":"response-9"},{"level":2,"title":"Get automatic associated foods suggestions","slug":"get-automatic-associated-foods-suggestions"},{"level":3,"title":"Request","slug":"request-10"},{"level":3,"title":"Response","slug":"response-10"}],"relativePath":"api/respondent/food-data.md","lastUpdated":1642613177047}',t={},o=n(`<h1 id="portion-size-data" tabindex="-1">Portion size data <a class="header-anchor" href="#portion-size-data" aria-hidden="true">#</a></h1><p>Functions related to portion size estimation and browsing the food database as a survey respondent.</p><h2 id="get-food-data" tabindex="-1">Get food data <a class="header-anchor" href="#get-food-data" aria-hidden="true">#</a></h2><p>Get portion size estimation options, associated foods and related data for a food from the database.</p><p><a href="https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/food/user/FoodDataController.scala#L96-L112" target="_blank" rel="noopener noreferrer">v3 implementation</a></p><p><a href="https://github.com/MRC-Epid-it24/intake24/blob/master/apps/api/src/http/controllers/food.controller.ts" target="_blank" rel="noopener noreferrer">v4 food boilerplate</a></p><h3 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/foods/{locale}/{code}    

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><p>where</p><p><strong>locale</strong> is the locale ID to get the food data for,</p><p><strong>code</strong> is the Intake24 food code.</p><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;code&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;localDescription&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;readyMealOption&quot;</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span>
  <span class="token property">&quot;sameAsBeforeOption&quot;</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span>
  <span class="token property">&quot;caloriesPer100g&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
  <span class="token property">&quot;brands&quot;</span><span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">&quot;categories&quot;</span><span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">&quot;associatedFoods&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">&quot;foodOrCategoryCode&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> string<span class="token punctuation">]</span> | <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> string<span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token property">&quot;promptText&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;linkAsMain&quot;</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span>
      <span class="token property">&quot;genericName&quot;</span><span class="token operator">:</span> string
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    ...
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">&quot;portionSizeMethods&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">&quot;method&quot;</span><span class="token operator">:</span> <span class="token string">&quot;standard-portion&quot;</span> | <span class="token string">&quot;as-served&quot;</span> | <span class="token string">&quot;guide-image&quot;</span> | <span class="token string">&quot;cereal&quot;</span> 
                | <span class="token string">&quot;drink-scale&quot;</span> | <span class="token string">&quot;milk-on-cereal&quot;</span> | <span class="token string">&quot;milk-in-a-hot-drink&quot;</span> | <span class="token string">&quot;pizza&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;imageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;useForRecipes&quot;</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span>
      <span class="token string">&quot;conversionFactor&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;parameters&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
         <span class="token property">&quot;...&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
          ...
       <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><p>where</p><p><strong>code</strong> is the Intake24 food code,</p><p><strong>localDescription</strong> is the name of the food in the current locale,</p><p><strong>readyMealOption</strong> controls whether to display the ready meal prompt for this food,</p><p><strong>sameAsBeforeOption</strong> controls whether to enable the same-as-before feature for this food,</p><p><strong>caloriesPer100g</strong> is the amount of kcal per 100g of this food, used to trigger the low total energy prompt,</p><p><strong>brands</strong> is the list of known brands for this food, used in the brands prompt,</p><p><strong>categories</strong> is the list of all parent categories for this food, including transitive,</p><p><strong>associatedFoods</strong> is the list of associated food suggestions, where:</p><div class="nested-description"><p><strong>foodOrCategoryCode</strong> is an array of 2 elements where the first element is either 0 or 1. If the first element is 0, then the second element is a food code, or, if the first element is 1, the second element is a category code,</p><p><strong>promptText</strong> is the wording of the associated food question,</p><p><strong>linkAsMain</strong> controls whether accepted associated food suggestions should be created as &quot;main&quot; or &quot;linked&quot;,</p><p><strong>genericName</strong> is the simple name of the associated food, used by some UI elements (e.g., &quot;bread&quot;, &quot;sauce&quot;)</p></div><p><strong>portionSizeMethods</strong> is the list of available portion size estimation options, where:</p><div class="nested-description"><p><strong>method</strong> is ID of the portion size estimation method to use. See the <a href="./../../developer/portion-size.html">portion size methods</a> guide for the list of currently supported methods.</p><p><strong>description</strong> is the description of this portion size estimation option for the selection screen (localised string key),</p><p><strong>imageUrl</strong> is the link to the image for the selection screen,</p><p><strong>useForRecipes</strong> controls whether this portion size estimation option is appropriate for recipe ingredients,</p><p><strong>conversionFactor</strong> is the multiplier for the final potion weight calculation (e.g. when portion size images do not represent the exact food but something similar that could have different density),</p><p><strong>parameters</strong> is the object with fields specific to the portion size method. See the <a href="./../../developer/portion-size.html">portion size methods</a> guide for details.</p></div><h2 id="get-as-served-image-set-data" tabindex="-1">Get as served image set data <a class="header-anchor" href="#get-as-served-image-set-data" aria-hidden="true">#</a></h2><p>Get as served image definitions for the given as served set.</p><h3 id="request-1" tabindex="-1">Request <a class="header-anchor" href="#request-1" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/portion-sizes/as-served-sets/{id}

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><p>where <strong>id</strong> is the as served image set ID.</p><h3 id="response-1" tabindex="-1">Response <a class="header-anchor" href="#response-1" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;selectionImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;images&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;mainImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;thumbnailUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;weight&quot;</span><span class="token operator">:</span> number
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      ...
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><p>where</p><p><strong>selectionImageUrl</strong> is the URL of the image to use for portion size option selection screen,</p><p><strong>images</strong> is the list of as served image definitions, where</p><div class="nested-description"><p><strong>mainImageUrl</strong> is the URL of the full-sized portion size image,</p><p><strong>thumbnailUrl</strong> is the URL of the corresponding thumbnail image,</p><p><strong>weight</strong> is the weight (in grams) of the food in this image</p></div><h2 id="get-multiple-as-served-image-sets-data" tabindex="-1">Get multiple as served image sets data <a class="header-anchor" href="#get-multiple-as-served-image-sets-data" aria-hidden="true">#</a></h2><p>Same as above, but fetches data for multiple as served image sets at once.</p><h3 id="request-2" tabindex="-1">Request <a class="header-anchor" href="#request-2" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/portion-sizes/as-served-sets/?id[]={id}

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><p>where <strong>id</strong> is the list of as served image set ids to return.</p><h3 id="response-2" tabindex="-1">Response <a class="header-anchor" href="#response-2" aria-hidden="true">#</a></h3><p>Same as the regular as served data response, but returns an array of as served set objects:</p><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;selectionImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;images&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;mainImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;thumbnailUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;weight&quot;</span><span class="token operator">:</span> number
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      ...
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  ...
<span class="token punctuation">]</span>
</code></pre></div><h2 id="get-guide-image-data" tabindex="-1">Get guide image data <a class="header-anchor" href="#get-guide-image-data" aria-hidden="true">#</a></h2><p>Get definition of an image map which is an image of multiple objects from which one can be selected. Every object has an associated weight that is used for portion size weight calculations.</p><h3 id="request-3" tabindex="-1">Request <a class="header-anchor" href="#request-3" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/portion-sizes/guide-images/{id}

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><p>where <strong>id</strong> is the guide image ID.</p><h3 id="response-3" tabindex="-1">Response <a class="header-anchor" href="#response-3" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;imageMap&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;baseImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;objects&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
        <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;overlayUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;outline&quot;</span><span class="token operator">:</span> number<span class="token punctuation">[</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      ...
    <span class="token punctuation">]</span>
   <span class="token punctuation">}</span><span class="token punctuation">,</span>
   <span class="token property">&quot;weights&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;1&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
      <span class="token property">&quot;2&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
      ...
   <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><p>where</p><p><strong>description</strong> is the human-friendly description of the guide image,</p><p><strong>imageMap</strong> is the underlying image map definition, where</p><div class="nested-description"><p><strong>baseImageUrl</strong> is the URL of the image with the selectable objects,</p><p><strong>objects</strong> is the list of individual objects that can be selected, where</p><div class="nested-description"><p><strong>id</strong> is the object&#39;s index,</p><p><strong>description</strong> is the human-friendly description of the object,</p><p><strong>overlayUrl</strong> is the URL of the transparent image with the object&#39;s outline used to highlight the current selection. The image has the same dimensions as the main image.</p><p><strong>outline</strong> is the coordinates of the vertices of a polyline outline around the object used to detect which object in the image was clicked/tapped. The coordinates come in <code>(x, y)</code> pairs (i.e. the length of the array is always even) and are normalized such that the <code>x</code> coordinates are in the range <code>[0, 1]</code> and <code>y</code> coordinates are in the range <code>[0, image width / image height]</code>.</p></div></div><p><strong>weights</strong> is the map of selectable object indices to weights in grams.</p><h2 id="get-multiple-guide-image-data" tabindex="-1">Get multiple guide image data <a class="header-anchor" href="#get-multiple-guide-image-data" aria-hidden="true">#</a></h2><p>Same as above, but returns several guide images at once.</p><h3 id="request-4" tabindex="-1">Request <a class="header-anchor" href="#request-4" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/portion-sizes/guide-images/?id[]={id}

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><p>where <strong>id</strong> is the list of guide image IDs.</p><h3 id="response-4" tabindex="-1">Response <a class="header-anchor" href="#response-4" aria-hidden="true">#</a></h3><p>Same as the regular guide image data request (see above), but returns an array of guide image objects.</p><h2 id="get-image-map-data" tabindex="-1">Get image map data <a class="header-anchor" href="#get-image-map-data" aria-hidden="true">#</a></h2><p>Returns an image map definition similar to guide images, but without the associated weights. Used for selecting objects from images where the object is not directly associated with a weight, e.g. selecting pizza slice sizes whose final weight also depends on pizza thickness and type.</p><h3 id="request-5" tabindex="-1">Request <a class="header-anchor" href="#request-5" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/portion-sizes/image-maps/{id}

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><p>where <strong>id</strong> is the image map ID.</p><h3 id="response-5" tabindex="-1">Response <a class="header-anchor" href="#response-5" aria-hidden="true">#</a></h3><p>Same as a guide image (see above), but without the weights:</p><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;baseImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;objects&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
      <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;navigationIndex&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
      <span class="token property">&quot;overlayUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;outline&quot;</span><span class="token operator">:</span> number<span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    ...
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="get-multiple-image-maps-data" tabindex="-1">Get multiple image maps data <a class="header-anchor" href="#get-multiple-image-maps-data" aria-hidden="true">#</a></h2><p>Same as above, but returns several image maps at once.</p><h3 id="request-6" tabindex="-1">Request <a class="header-anchor" href="#request-6" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/portion-sizes/image-maps/?id[]={id}

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><p>where <strong>id</strong> is the list of image map IDs.</p><h3 id="response-6" tabindex="-1">Response <a class="header-anchor" href="#response-6" aria-hidden="true">#</a></h3><p>Same as the regular image map data request (see above), but returns an array of image map objects.</p><h2 id="get-drink-scale-data" tabindex="-1">Get drink scale data <a class="header-anchor" href="#get-drink-scale-data" aria-hidden="true">#</a></h2><p>Get the definition of &quot;sliding scale&quot; which is the portion size estimation for hot and cold drinks.</p><h3 id="request-7" tabindex="-1">Request <a class="header-anchor" href="#request-7" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/portion-sizes/drinkware-sets/{id}

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><p>where <strong>id</strong> is the drink scale ID.</p><h3 id="response-7" tabindex="-1">Response <a class="header-anchor" href="#response-7" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;guideImageId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;scales&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">&quot;baseImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;overlayImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
      <span class="token property">&quot;choiceId&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
      <span class="token property">&quot;width&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
      <span class="token property">&quot;height&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
      <span class="token property">&quot;emptyLevel&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
      <span class="token property">&quot;fullLevel&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
      <span class="token property">&quot;volumeSamples&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
         <span class="token punctuation">{</span>
           <span class="token property">&quot;fill&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
           <span class="token property">&quot;volume&quot;</span><span class="token operator">:</span> number
         <span class="token punctuation">}</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    ...
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><p>where</p><p><strong>id</strong> is the drink scale ID.</p><p><strong>guideImageId</strong> is the ID of the image map (called guide due to legacy reasons) for the drinkware selection screen, e.g. an image with glasses of different shapes and sizes from which the respondent is asked to select one they would like to use.</p><p><strong>scales</strong> is the list of sliding scale image definitions corresponding to objects in the image map <code>guideImageId</code>, where:</p><div class="nested-description"><p><strong>baseImageUrl</strong> is the URL of the image with the individual empty glass/mug/cup,</p><p><strong>overlayImageUrl</strong> is the URL of the transparent image with the filled outline of the same glass/mug/cup, used to represent the liquid level,</p><p><strong>choiceId</strong> is the ID of the object (glass/mug/cup) from the <code>guideImageId</code> image map this scale corresponds to,</p><p><strong>width</strong> is the width of the image at <code>baseImageUrl</code>,</p><p><strong>height</strong> is the height of the image at <code>baseImageUrl</code>,</p><p><strong>emptyLevel</strong> is the offset in pixels from the bottom of the base image where the sliding scale starts (i.e. the bottom of the glass/mug/cup),</p><p><strong>fullLevel</strong> is the offset in pixels from the bottom of the base image where the sliding scale ends (i.e. the top of the glass/mug/cup),</p><p><strong>volumeSamples</strong> is an array with the liquid volume samples taken at different fill levels, where:</p><div class="nested-description"><p><strong>fill</strong> is the normalised fill level, from <code>0</code> (corresponding to the bottom of the glass) to <code>1</code> (corresponding to the top of the glass),</p><p><strong>volume</strong> is the volume of liquid measured at this fill level</p></div></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>The volume of the liquid is calculated by taking the current normalised fill level (i.e. <code>(current slider position - emptyLevel) / (fullLevel - emptyLevel)</code>) and interpolating between the nearest two sample points from the <code>volumeSamples</code> array.</p><p>See <a href="https://github.com/MRC-Epid-it24/survey-frontend/blob/master/SurveyClient/src/main/java/uk/ac/ncl/openlab/intake24/client/api/foods/DrinkScale.java#L47-L63" target="_blank" rel="noopener noreferrer">v3 implementation</a>.</p></div><h2 id="get-multiple-drinkware-sets-data" tabindex="-1">Get multiple drinkware sets data <a class="header-anchor" href="#get-multiple-drinkware-sets-data" aria-hidden="true">#</a></h2><p>Same as above, but fetches data for multiple drinkware sets at once.</p><h3 id="request-8" tabindex="-1">Request <a class="header-anchor" href="#request-8" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/portion-sizes/drinkware-sets/?id[]={id}

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><p>where <strong>id</strong> is the list of drinkware set ids to return.</p><h3 id="response-8" tabindex="-1">Response <a class="header-anchor" href="#response-8" aria-hidden="true">#</a></h3><p>Same as the regular drinkware set data response, but returns an array of drinkware set objects:</p><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;guideImageId&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;scales&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;baseImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;overlayImageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token property">&quot;choiceId&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
        <span class="token property">&quot;width&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
        <span class="token property">&quot;height&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
        <span class="token property">&quot;emptyLevel&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
        <span class="token property">&quot;fullLevel&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
        <span class="token property">&quot;volumeSamples&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
            <span class="token property">&quot;fill&quot;</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
            <span class="token property">&quot;volume&quot;</span><span class="token operator">:</span> number
          <span class="token punctuation">}</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      ...
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span>
</code></pre></div><h2 id="weight-entry-dummy" tabindex="-1">Weight entry dummy <a class="header-anchor" href="#weight-entry-dummy" aria-hidden="true">#</a></h2><p>Dummy endpoint for manual weight entry estimation method. The method has no parameters and this request is needed to get the image URL for the portion size option selection screen.</p><h3 id="request-9" tabindex="-1">Request <a class="header-anchor" href="#request-9" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/portion-sizes/weight

<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><h3 id="response-9" tabindex="-1">Response <a class="header-anchor" href="#response-9" aria-hidden="true">#</a></h3><div class="language-json"><pre><code><span class="token number">200</span> OK

<span class="token punctuation">{</span>
  <span class="token property">&quot;method&quot;</span><span class="token operator">:</span> <span class="token string">&quot;weight&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> <span class="token string">&quot;weight&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;parameters&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;imageUrl&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token property">&quot;useForRecipes&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token property">&quot;conversionFactor&quot;</span><span class="token operator">:</span> <span class="token number">1.0</span>
<span class="token punctuation">}</span>
</code></pre></div><p>where only the <strong>imageUrl</strong> parameter is meaningful and everything else is constant.</p><h2 id="get-automatic-associated-foods-suggestions" tabindex="-1">Get automatic associated foods suggestions <a class="header-anchor" href="#get-automatic-associated-foods-suggestions" aria-hidden="true">#</a></h2><p>Get the automatically generated associated foods based on the pairwise associations algorithm. This method will always suggest categories (as opposed to manually set up associated foods that can point to individual foods as well as categories).</p><p><a href="https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/food/user/FoodDataController.scala#L154-L186" target="_blank" rel="noopener noreferrer">v3 implementation</a></p><h3 id="request-10" tabindex="-1">Request <a class="header-anchor" href="#request-10" aria-hidden="true">#</a></h3><div class="language-http"><pre><code>GET /api/foods/associated/{locale}?f={foodCode}&amp;f={foodCode}...
    
<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Bearer {accessToken}</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
</code></pre></div><p>where</p><p><strong>locale</strong> is the current locale ID,</p><p><strong>f</strong> is the list of food codes in the meal (can be repeated)</p><h3 id="response-10" tabindex="-1">Response <a class="header-anchor" href="#response-10" aria-hidden="true">#</a></h3><p>A list of categories:</p><div class="language-json"><pre><code><span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token property">&quot;code&quot;</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
    <span class="token property">&quot;localDescription&quot;</span><span class="token operator">:</span> string
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span>
</code></pre></div><p>where</p><p><strong>code</strong> is the Intake24 category code,</p><p><strong>localDescription</strong> is the name of the category in the local language,</p>`,120),p=[o];function r(i,c,l,u,d,h){return a(),e("div",null,p)}var m=s(t,[["render",r]]);export{k as __pageData,m as default};
