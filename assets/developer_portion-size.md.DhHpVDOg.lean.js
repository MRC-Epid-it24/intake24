import{_ as t,c as a,a2 as i,o}from"./chunks/framework.DneEosfm.js";const s="/assets/select.LKNSHkRM.png",n="/assets/as-served.BWgF9nn-.png",r="/assets/had-more.BhmIefMg.png",l="/assets/guide-image.DpKdbGxw.png",p="/assets/quantity.CSS_93zp.png",d="/assets/drink-scale-1.rAAL7MwW.png",h="/assets/drink-scale-2.dMjg01sy.png",c="/assets/drink-scale-3.Vetb1y3E.png",m="/assets/standard-portion-1.BsvmXdJr.png",u="/assets/standard-portion-2.5WpusYeE.png",f="/assets/cereal-1.B3_qUCeJ.png",g="/assets/cereal-2.Mm8VUBTl.png",b="/assets/milk-on-cereal.gh1pvHla.png",k="/assets/pizza-1.DjEQj2FQ.png",v="/assets/pizza-2.BY7n6nm9.png",y="/assets/pizza-3.Ce-T3qk_.png",z="/assets/pizza-4.C98Cekrg.png",w="/assets/milk-in-hot-drink.D-E7tCIp.png",j=JSON.parse('{"title":"Portion size methods","description":"","frontmatter":{},"headers":[],"relativePath":"developer/portion-size.md","filePath":"developer/portion-size.md"}'),q={name:"developer/portion-size.md"};function P(_,e,T,M,I,x){return o(),a("div",null,e[0]||(e[0]=[i('<h1 id="portion-size-methods" tabindex="-1">Portion size methods <a class="header-anchor" href="#portion-size-methods" aria-label="Permalink to &quot;Portion size methods&quot;">​</a></h1><p>This page describes the portion size estimation methods used in Intake24 with respect to user interaction. See <a href="/open-api.html#tag/portionsize" target="blank">the API documentation</a> for the related API functions and data structure description.</p><h2 id="portion-size-estimation-option-selection" tabindex="-1">Portion size estimation option selection <a class="header-anchor" href="#portion-size-estimation-option-selection" aria-label="Permalink to &quot;Portion size estimation option selection&quot;">​</a></h2><p>This screen is the first step of the portion size estimation process.</p><p><img src="'+s+'" alt="Portion size estimation method selection screen"></p><p>If there is more than one way to estimate the portion size defined for the food the system will ask the respondent to choose the option they would like to use.</p><p>Each option has an associated small image and a text description. The description text is localised and displayed in the respondent&#39;s local language. Portion size estimation options don&#39;t necessarily have to use different methods (i.e. they could be several <code>as served</code> options using different sets of images).</p><p>The number of options that can be associated with a food is technically unlimited, but in practice is typically between 2 and 5.</p><p>If there is only one portion size estimation option associated with a food, this screen is not shown.</p><p>See also the <a href="/open-api.html#tag/food" target="blank">get food data</a> API function and the <a href="https://github.com/MRC-Epid-it24/survey-frontend/blob/master/SurveyClient/src/main/java/uk/ac/ncl/openlab/intake24/client/survey/prompts/ChoosePortionSizeMethodPrompt.java" target="_blank" rel="noreferrer">v3 implementation</a>.</p><h2 id="as-served" tabindex="-1">As served <a class="header-anchor" href="#as-served" aria-label="Permalink to &quot;As served&quot;">​</a></h2><p>Method id: <code>as-served</code></p><p><img src="'+n+'" alt="&quot;As served&quot; portion size estimation"></p><p>The &quot;as served&quot; portion size estimation method uses a sequence of images of food served on a plate. The weight of food shown in each image is carefully measured when the pictures are taken and is stored in the database.</p><p>Usually there are seven images covering 95% of the typical portion sizes, however this number is not fixed and some foods use fewer or more images.</p><p>The user is asked to select the image that looks most like the amount of food they were served. The images can be selected either using the <code>I had less</code> and <code>I had more buttons</code> or by clicking on a thumbnail.</p><p>There are special options to indicate that the amount of food consumed was less than in the smallest or more than in the larges portion in the available images. These options can be accessed either by clicking the <code>I had less</code> or <code>I had more</code> button while having the smallest and the largest potion size image selected respectively or by clicking on the special <code>-</code> or <code>+</code> thumbnails.</p><p><img src="'+r+'" alt="More than the largest portion option"></p><p>If this option is selected, the respondent is asked to choose the fraction of the smallest porion or the multiple of the largest portion. The fraction selection is currently implemented using arrow buttons that allow to adjust the fraction in 1/4 increments. The resulting portion weight is also displayed for reference.</p><p>The &quot;as served&quot; method can optionally include a second set of images representing the leftovers. If leftovers function is enabled, the respondent is asked to indicate how much food they had left using the same UI and the resulting portion size is calculated as <code>(serving weight) - (leftovers weight)</code>.</p><h3 id="parameters" tabindex="-1">Parameters <a class="header-anchor" href="#parameters" aria-label="Permalink to &quot;Parameters&quot;">​</a></h3><ul><li><code>serving-image-set</code>: reference to an as served image set used to estimate the size of the portion that was served to the respondent.</li><li><code>leftovers-image-set</code>: reference to an as served image sequence used to estimate the amount of food left by the respondent.</li></ul><p>See also <a href="/open-api.html#tag/portionsize/get/portion-sizes/as-served-sets/%7Bid%7D" target="blank">get as served data</a> API function and the <a href="https://github.com/MRC-Epid-it24/survey-frontend/blob/master/SurveyClient/src/main/java/uk/ac/ncl/openlab/intake24/client/survey/prompts/simple/AsServedPrompt2.java" target="_blank" rel="noreferrer">v3 implementation</a></p><h2 id="guide-image" tabindex="-1">Guide image <a class="header-anchor" href="#guide-image" aria-label="Permalink to &quot;Guide image&quot;">​</a></h2><p>Method id: <code>guide-image</code></p><p><img src="'+l+'" alt="&quot;As served&quot; portion size estimation"></p><p>The &quot;guide image&quot; portion size estimation method uses a single image showing several distinct objects. The respondent is asked to select the object that most closely matches the food they had. This could be used to determine, for example, the size of a fruit, or the shape and volume of a tin.</p><p>Objects can be selected by either clicking/tapping them directly in the image or by using the arrow keys on the keyboard.</p><p>Each object in the image is defined in terms of its outline (represented as coordinates of points of a polyline), description and weight.</p><p>In the current implementation each outline is a separate transparent overlay image generated on the server when changes are made to the list of objects in the guide image. This technique was used for compatibility purposes with older browsers but it is no longer relevant and should be replaces with a canvas or SVG based approach instead.</p><p>Having selected an object the respondent is then asked to enter how many items like that they had.</p><p><img src="'+p+'" alt="Quantity input"></p><p>The quantity input UI currently has two separate counters for whole and fractional parts. This screen has been identified as one of the more confusing ones and needs a redesign.</p><h3 id="parameters-1" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-1" aria-label="Permalink to &quot;Parameters&quot;">​</a></h3><p><code>guide-image-id</code>: reference to a guide image definition</p><p>See also <a href="/open-api.html#tag/portionsize/get/portion-sizes/guide-images/%7Bid%7D" target="blank">get guide image data</a> API function and the <a href="https://github.com/MRC-Epid-it24/survey-frontend/blob/master/SurveyClient/src/main/java/uk/ac/ncl/openlab/intake24/client/survey/prompts/simple/GuidePrompt.java" target="_blank" rel="noreferrer">v3 implementation</a>.</p><h2 id="drink-scale" tabindex="-1">Drink scale <a class="header-anchor" href="#drink-scale" aria-label="Permalink to &quot;Drink scale&quot;">​</a></h2><p>Method id: <code>drink-scale</code></p><p>This portion size estimation method is used for hot and cold drinks served in a glass, cup or mug. In the first step, the respondent is offered to choose the glass/cup/mug that they would like to use:</p><p><img src="'+d+'" alt="Drinkware choice"></p><p>The UI element used in this step is called an &quot;image map&quot;. It is similar to <a href="https://en.wikipedia.org/wiki/Image_map" target="_blank" rel="noreferrer">HTML image maps</a> but uses a custom implementation to avoid compatibility issues between browsers. An image map is a combination of a base image showing a set of distinct objects that the user can click/tap individually on to select one. In the image above, mug 2 is selected as shown by the outline.</p><p>After the appropriate mug/cup/glass is selected, the system presents a &quot;sliding scale&quot; control based on the selected item:</p><p><img src="'+h+'" alt="Sliding scale"></p><p>The sliding scale consists of a side view of a mug/cup/glass combined with an overlay that represents the fill level. Respondents can use the slider on the side or simply click/tap on the image to adjust the fill level.</p><p>Finally, the respondents are asked to indicate how much of the drink they had left. In this step the scale is limited to the initial fill level reported in the previous step:</p><p><img src="'+c+'" alt="Sliding scale leftovers"></p><h3 id="parameters-2" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-2" aria-label="Permalink to &quot;Parameters&quot;">​</a></h3><ul><li><code>drinkware-id</code>: reference to a drinkware set (see the API method)</li><li><code>initial-fill-level</code>: initial position of the fill level slider (in normalised units, 0.0 to 1.0).</li><li><code>skip-fill-level</code>: if set to true the “how full was your cup/glass” question will be omitted and the system will proceed directly to “how much you had left”. This is useful when the initial fill level is standard, e.g. for takeaway cups.</li></ul><p>See also <a href="/open-api.html#tag/portionsize/get/portion-sizes/drinkware-sets/%7Bid%7D" target="blank">get sliding scale data</a> API function and the <a href="https://github.com/MRC-Epid-it24/survey-frontend/blob/master/SurveyClient/src/main/java/uk/ac/ncl/openlab/intake24/client/survey/prompts/simple/DrinkScalePrompt.java" target="_blank" rel="noreferrer">v3 implementation</a>.</p><h2 id="standard-portion" tabindex="-1">Standard portion <a class="header-anchor" href="#standard-portion" aria-label="Permalink to &quot;Standard portion&quot;">​</a></h2><p>Method id: <code>standard-portion</code></p><p>This portion size estimation method uses pre-defined standard units instead of portion size images. First, the respondent is asked to choose what unit they would like to use to estimate their portion size:</p><p><img src="'+m+'" alt="Unit choice"></p><p>If there is only one standard unit defined in the portion size method parameters this question is omitted.</p><p>The respondent is then asked to estimate, using the selected units, the size of their portion:</p><p><img src="'+u+'" alt="Quantity prompt"></p><p>The quantity input UI consists of two counters for whole and fractional parts. Fractional counter is incremented in 1/4 steps.</p><p>There is no leftovers option for this estimation method.</p><p>See also the <a href="https://github.com/MRC-Epid-it24/survey-frontend/blob/master/SurveyClient/src/main/java/uk/ac/ncl/openlab/intake24/client/survey/prompts/simple/StandardUnitPrompt.java" target="_blank" rel="noreferrer">v3 implementation</a>.</p><h3 id="parameters-3" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-3" aria-label="Permalink to &quot;Parameters&quot;">​</a></h3><ul><li><code>units-count</code>: number of standard units that the user can choose from,</li><li><code>unitX-name</code>: name of unit #X, in plural form (e.g. “handfuls”),</li><li><code>unitX-weight</code>: weight per unit #X, in grams,</li><li><code>unitX-omit-food-description</code>: if set to true than the food description will not be used in the question. This is used to avoid questions that make no sense (e.g. “how many nuts of nuts did you have?”).</li></ul><h2 id="cereal" tabindex="-1">Cereal <a class="header-anchor" href="#cereal" aria-label="Permalink to &quot;Cereal&quot;">​</a></h2><p>Method id: <code>cereal</code></p><p>The cereal portion size method uses an image map to select the bowl type:</p><p><img src="'+f+'" alt="Bowl choice"></p><p>and then uses the &quot;as served&quot; method for that bowl:</p><p><img src="'+g+'" alt="Cereal"></p><p>The system chooses from a combination of the bowl type and the cereal type (passed in the portion size estimation method parameters) to select the correct as served set.</p><h3 id="parameters-4" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-4" aria-label="Permalink to &quot;Parameters&quot;">​</a></h3><ul><li><code>type</code>: the type of cereal used to determine the as served image set. Possible values: <code>hoop</code>, <code>flake</code> or <code>rkris</code> (for Rice Krispie type cereals)</li></ul><h2 id="milk-on-cereal" tabindex="-1">Milk on cereal <a class="header-anchor" href="#milk-on-cereal" aria-label="Permalink to &quot;Milk on cereal&quot;">​</a></h2><p>Method id: <code>milk-on-cereal</code></p><p>Milk on cereal is a special case portion size estimation that is only applicable to milk (i.e. foods listed under the &quot;Milk&quot; category) linked to a cereal.</p><p>This portion size method uses an image map based on the same bowl type used for estimation of the cereal portion and offers several options of milk levels:</p><p><img src="'+b+'" alt="Milk on cereal"></p><h3 id="parameters-5" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-5" aria-label="Permalink to &quot;Parameters&quot;">​</a></h3><p>No parameters.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>This portion size estimation method has a number of issues and needs a redesign:</p><ul><li>The cereal portion can only be estimated without milk which is not what the respondent would have seen when eating</li><li>The milk level is supposed to be estimated &quot;without cereal&quot; which is confusing and impractical</li></ul></div><h2 id="pizza" tabindex="-1">Pizza <a class="header-anchor" href="#pizza" aria-label="Permalink to &quot;Pizza&quot;">​</a></h2><p>Method id: <code>pizza</code></p><p>The pizza portion size estimation method consists of four steps.</p><p>First, the respondent is asked to choose the approximate size and shape of the pizza they had:</p><p><img src="'+k+'" alt="Pizza type"></p><p>The UI element used for this step is an image map.</p><p>Then the respondent is asked to specify how thick their pizza was:</p><p><img src="'+v+'" alt="Pizza thickness"></p><p>This stage also uses an image map (which is not ideal as the image maps aren&#39;t good at adapting to various screen sizes).</p><p>Based on the type of pizza selected in step 1 the system then asks the respondent to specify the size of the slice (or slices) they had with an option to select the whole pizza:</p><p><img src="'+y+'" alt="Pizza slice type"></p><p>Finally, the respondent is asked how many slices (or pizzas) they had:</p><p><img src="'+z+'" alt="Pizza quantity"></p><p>Please refer to <a href="https://github.com/MRC-Epid-it24/survey-frontend/blob/master/SurveyClient/src/main/java/uk/ac/ncl/openlab/intake24/client/survey/portionsize/PizzaPortionSizeScript.java" target="_blank" rel="noreferrer">v3 implementation</a> for the weight look up table based on these inputs.</p><h3 id="parameters-6" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-6" aria-label="Permalink to &quot;Parameters&quot;">​</a></h3><p>No parameters.</p><h2 id="milk-in-a-hot-drink" tabindex="-1">Milk in a hot drink <a class="header-anchor" href="#milk-in-a-hot-drink" aria-label="Permalink to &quot;Milk in a hot drink&quot;">​</a></h2><p>Method id: <code> milk-in-a-hot-drink</code></p><p>This is another special case portion size estimation method for milk that is only applicable when milk is linked to a food from the &quot;hot drinks&quot; category.</p><p>This estimation method uses a simple percentage based calculation based on the following choice:</p><p><img src="'+w+'" alt="Milk in a hot drink"></p><p>The milk percentage (by volume) is calculated as 10%, 16%, 24% of the reported hot drink volume correspondingly. These numbers can overridden in the survey scheme.</p><h3 id="parameters-7" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-7" aria-label="Permalink to &quot;Parameters&quot;">​</a></h3><p>No parameters.</p><p>See also <a href="https://github.com/MRC-Epid-it24/survey-frontend/blob/master/SurveyClient/src/main/java/uk/ac/ncl/openlab/intake24/client/ProcessMilkInHotDrinks.java" target="_blank" rel="noreferrer">v3 implementation</a>.</p><h2 id="direct-weight-input" tabindex="-1">Direct weight input <a class="header-anchor" href="#direct-weight-input" aria-label="Permalink to &quot;Direct weight input&quot;">​</a></h2><p>Method id: <code>weight</code></p><p>This portion size method consists of a simple input box where the respondent can enter the exact weight or volume of their food or a drink. This method is mainly used for recipe ingredients and is currently unused because the recipe subsystem is disabled.</p><h3 id="parameters-8" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-8" aria-label="Permalink to &quot;Parameters&quot;">​</a></h3><p>No parameters.</p>',108)]))}const C=t(q,[["render",P]]);export{j as __pageData,C as default};
