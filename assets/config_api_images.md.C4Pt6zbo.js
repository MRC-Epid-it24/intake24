import{_ as e,c as i,o as a,a4 as t}from"./chunks/framework.D2Q_DY5z.js";const u=JSON.parse('{"title":"Image processing","description":"","frontmatter":{},"headers":[],"relativePath":"config/api/images.md","filePath":"config/api/images.md"}'),o={name:"config/api/images.md"},s=t('<h1 id="image-processing" tabindex="-1">Image processing <a class="header-anchor" href="#image-processing" aria-label="Permalink to &quot;Image processing&quot;">​</a></h1><p>Path: <code>apps/api/src/config/image-processor.ts</code></p><p>The strategy for managing image uploads in Intake24 is to accept image files of any size/resolution.</p><p>Before they are served to clients the images are resized to and cached at a specific standardised size configurable in this section.</p><p>The source image files are stored separately so the standard-sized images can be recreated at any time without loss of data.</p><p>All the sizes below are measured in pixels.</p><h2 id="source-images" tabindex="-1">Source images <a class="header-anchor" href="#source-images" aria-label="Permalink to &quot;Source images&quot;">​</a></h2><p>Any image uploaded to the system is first stored as-is as a &#39;source&#39; image before being processed and resized for use in a specific portion size estimation method.</p><p>Source image thumbnails are used for previews in the image management section of the admin interface.</p><h3 id="thumbnail-width" tabindex="-1">Thumbnail width <a class="header-anchor" href="#thumbnail-width" aria-label="Permalink to &quot;Thumbnail width&quot;">​</a></h3><ul><li>object-path: <code>imageProcessor.source.thumbnailWidth</code></li><li>dotenv var: <code>IMAGE_SOURCE_THUMB_WIDTH</code></li><li>type: <code>integer number</code></li><li>default: <code>768</code></li></ul><h3 id="thumbnail-height" tabindex="-1">Thumbnail height <a class="header-anchor" href="#thumbnail-height" aria-label="Permalink to &quot;Thumbnail height&quot;">​</a></h3><ul><li>object-path: <code>imageProcessor.source.thumbnailHeight</code></li><li>dotenv var: <code>IMAGE_SOURCE_THUMB_HEIGHT</code></li><li>type: <code>integer number</code></li><li>default: <code>432</code></li></ul><h2 id="as-served-images" tabindex="-1">As served images <a class="header-anchor" href="#as-served-images" aria-label="Permalink to &quot;As served images&quot;">​</a></h2><h3 id="main-image-size" tabindex="-1">Main image size <a class="header-anchor" href="#main-image-size" aria-label="Permalink to &quot;Main image size&quot;">​</a></h3><p>The standard width of the &#39;as-served&#39; portion size images. Height is calculated automatically to preserve the aspect ratio of the original image.</p><ul><li>object-path: <code>imageProcessor.asServed.width</code></li><li>dotenv var: <code>IMAGE_AS_SERVED_WIDTH</code></li><li>type: <code>integer number</code></li><li>default: <code>1000</code></li></ul><h3 id="thumbnail-image-size" tabindex="-1">Thumbnail image size <a class="header-anchor" href="#thumbnail-image-size" aria-label="Permalink to &quot;Thumbnail image size&quot;">​</a></h3><p>Smaller &#39;as-served&#39; image previews displayed below the main image.</p><ul><li>object-path: <code>imageProcessor.asServed.thumbnailWidth</code></li><li>dotenv var: <code>IMAGE_AS_SERVED_THUMB_WIDTH</code></li><li>type: <code>integer number</code></li><li>default: <code>200</code></li></ul><h2 id="image-maps" tabindex="-1">Image maps <a class="header-anchor" href="#image-maps" aria-label="Permalink to &quot;Image maps&quot;">​</a></h2><p>Image maps are images containing several objects that the user can choose from by clicking/tapping on a specific object.</p><p>The shapes of the object are stored separately in vector form and are overlaid at runtime and this setting affects the size of the base image.</p><p>Height is calculated automatically to preserve the aspect ratio of the original image.</p><h3 id="base-image-size-width" tabindex="-1">Base image size width <a class="header-anchor" href="#base-image-size-width" aria-label="Permalink to &quot;Base image size width&quot;">​</a></h3><ul><li>object-path: <code>imageProcessor.imageMaps.width</code></li><li>dotenv var: <code>IMAGE_MAP_WIDTH</code></li><li>type: <code>integer number</code></li><li>default: <code>1000</code></li></ul><h2 id="drink-scales" tabindex="-1">Drink scales <a class="header-anchor" href="#drink-scales" aria-label="Permalink to &quot;Drink scales&quot;">​</a></h2><p>Drink (also called sliding) scales are images of cups/mugs/glasses used to estimate the volume of liquids.</p><p>Similar to image maps, the shape of the fillable volume is stored in vector form and this setting applies to the base image.</p><p>Height is calculated automatically to preserve the aspect ratio of the original image.</p><h3 id="base-image-size-width-1" tabindex="-1">Base image size width <a class="header-anchor" href="#base-image-size-width-1" aria-label="Permalink to &quot;Base image size width&quot;">​</a></h3><ul><li>object-path: <code>imageProcessor.drinkScale.width</code></li><li>dotenv var: <code>IMAGE_DRINK_SCALE_WIDTH</code></li><li>type: <code>integer number</code></li><li>default: <code>1000</code></li></ul><h2 id="portion-size-estimation-option-selection" tabindex="-1">Portion size estimation option selection <a class="header-anchor" href="#portion-size-estimation-option-selection" aria-label="Permalink to &quot;Portion size estimation option selection&quot;">​</a></h2><p>These images are used when there is more than one portion size estimation method available and the respondent is asked to choose which one to use.</p><p>They are automatically generated from one of the portion size estimation images and are arranged in a grid in the option selection screen.</p><h3 id="option-selection-image-width" tabindex="-1">Option selection image width <a class="header-anchor" href="#option-selection-image-width" aria-label="Permalink to &quot;Option selection image width&quot;">​</a></h3><ul><li>object-path: <code>imageProcessor.optionSelection.width</code></li><li>dotenv var: <code>IMAGE_OPTION_SELECTION_WIDTH</code></li><li>type: <code>integer number</code></li><li>default: <code>300</code></li></ul><h3 id="option-selection-image-height" tabindex="-1">Option selection image height <a class="header-anchor" href="#option-selection-image-height" aria-label="Permalink to &quot;Option selection image height&quot;">​</a></h3><ul><li>object-path: <code>imageProcessor.optionSelection.height</code></li><li>dotenv var: <code>IMAGE_OPTION_SELECTION_HEIGHT</code></li><li>type: <code>integer number</code></li><li>default: <code>200</code></li></ul>',39),l=[s];function r(n,d,c,h,m,g){return a(),i("div",null,l)}const b=e(o,[["render",r]]);export{u as __pageData,b as default};
