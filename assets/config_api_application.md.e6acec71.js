import{_ as e,c as l,o as i,a as o}from"./app.ecc69394.js";const m=JSON.parse('{"title":"Application","description":"","frontmatter":{},"headers":[{"level":2,"title":"Node environment","slug":"node-environment","link":"#node-environment","children":[]},{"level":2,"title":"Name","slug":"name","link":"#name","children":[]},{"level":2,"title":"Host","slug":"host","link":"#host","children":[]},{"level":2,"title":"Port","slug":"port","link":"#port","children":[]},{"level":2,"title":"Secret","slug":"secret","link":"#secret","children":[]},{"level":2,"title":"Sites URLs","slug":"sites-urls","link":"#sites-urls","children":[{"level":3,"title":"Base URL / Domain","slug":"base-url-domain","link":"#base-url-domain","children":[]},{"level":3,"title":"Admin URL","slug":"admin-url","link":"#admin-url","children":[]},{"level":3,"title":"Documentation URL","slug":"documentation-url","link":"#documentation-url","children":[]},{"level":3,"title":"Survey URL","slug":"survey-url","link":"#survey-url","children":[]},{"level":3,"title":"Images URL","slug":"images-url","link":"#images-url","children":[]}]},{"level":2,"title":"Enabled locales","slug":"enabled-locales","link":"#enabled-locales","children":[]}],"relativePath":"config/api/application.md"}'),a={name:"config/api/application.md"},t=o('<h1 id="application" tabindex="-1">Application <a class="header-anchor" href="#application" aria-hidden="true">#</a></h1><p>Path: <code>apps/api/src/config/app.ts</code></p><h2 id="node-environment" tabindex="-1">Node environment <a class="header-anchor" href="#node-environment" aria-hidden="true">#</a></h2><p>Node environment to start the application in.</p><ul><li>object-path: <code>env</code></li><li>dotenv var: <code>NODE_ENV</code></li><li>type: <code>&#39;development&#39; | &#39;test&#39; | &#39;production&#39;</code></li><li>default: <code>&#39;development&#39;</code></li></ul><h2 id="name" tabindex="-1">Name <a class="header-anchor" href="#name" aria-hidden="true">#</a></h2><p>Application name.</p><ul><li>object-path: <code>env</code></li><li>dotenv var: <code>APP_NAME</code></li><li>type: <code>string</code></li><li>default: <code>&#39;Intake24&#39;</code></li></ul><h2 id="host" tabindex="-1">Host <a class="header-anchor" href="#host" aria-hidden="true">#</a></h2><p>Internal hostname application listens on.</p><ul><li>object-path: <code>host</code></li><li>dotenv var: <code>APP_HOST</code></li><li>type: <code>string</code></li><li>default: <code>&#39;localhost&#39;</code></li></ul><h2 id="port" tabindex="-1">Port <a class="header-anchor" href="#port" aria-hidden="true">#</a></h2><p>Internal port application listens on.</p><ul><li>object-path: <code>port</code></li><li>dotenv var: <code>APP_PORT</code></li><li>type: <code>number</code></li><li>default: <code>3100</code></li></ul><h2 id="secret" tabindex="-1">Secret <a class="header-anchor" href="#secret" aria-hidden="true">#</a></h2><p>Secret key to use for in-app signing/encryption (cookie/session)</p><ul><li>object-path: <code>secret</code></li><li>dotenv var: <code>APP_SECRET</code></li><li>type: <code>string</code></li><li>default: <code>&#39;&#39;</code></li></ul><h2 id="sites-urls" tabindex="-1">Sites URLs <a class="header-anchor" href="#sites-urls" aria-hidden="true">#</a></h2><p>List of sites URLs. These can either be relative or absolute URLs.</p><ul><li>absolute URL -&gt; site is hosted on different domain</li><li>relative URL -&gt; site is hosted on same domain. URL gets registered as route.</li></ul><h3 id="base-url-domain" tabindex="-1">Base URL / Domain <a class="header-anchor" href="#base-url-domain" aria-hidden="true">#</a></h3><p>Domain / base url to resolve fully qualified sites URLs (if relative)</p><ul><li>object-path: <code>url.base</code></li><li>dotenv var: <code>APP_URL_BASE</code></li><li>type: <code>string</code></li><li>default: <code>&#39;localhost:3100&#39;</code></li></ul><h3 id="admin-url" tabindex="-1">Admin URL <a class="header-anchor" href="#admin-url" aria-hidden="true">#</a></h3><p>URL of admin site.</p><ul><li>object-path: <code>url.admin</code></li><li>dotenv var: <code>APP_URL_ADMIN</code></li><li>type: <code>string</code></li><li>default: <code>&#39;/admin&#39;</code></li></ul><h3 id="documentation-url" tabindex="-1">Documentation URL <a class="header-anchor" href="#documentation-url" aria-hidden="true">#</a></h3><p>URL of documentation site.</p><ul><li>object-path: <code>url.docs</code></li><li>dotenv var: <code>APP_URL_DOCS</code></li><li>type: <code>string</code></li><li>default: <code>&#39;/docs&#39;</code></li></ul><h3 id="survey-url" tabindex="-1">Survey URL <a class="header-anchor" href="#survey-url" aria-hidden="true">#</a></h3><p>URL of survey site.</p><ul><li>object-path: <code>url.survey</code></li><li>dotenv var: <code>APP_URL_SURVEY</code></li><li>type: <code>string</code></li><li>default: <code>&#39;/survey&#39;</code></li></ul><h3 id="images-url" tabindex="-1">Images URL <a class="header-anchor" href="#images-url" aria-hidden="true">#</a></h3><p>URL of images.</p><ul><li>object-path: <code>url.images</code></li><li>dotenv var: <code>APP_URL_IMAGES</code></li><li>type: <code>string</code></li><li>default: <code>&#39;localhost:3100/images&#39;</code></li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Default setup allows local images serving - ideal for development purposes. For production, use reverse proxy, CDN etc.</p></div><h2 id="enabled-locales" tabindex="-1">Enabled locales <a class="header-anchor" href="#enabled-locales" aria-hidden="true">#</a></h2><p>Enabled locales for food indexing.</p><ul><li>object-path: <code>enabledLocales</code></li><li>dotenv var: <code>APP_ENABLED_LOCALES</code></li><li>type: <code>string[] | null</code></li><li>default: <code>null</code></li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>When setting <code>APP_ENABLED_LOCALES</code> env value:</p><ul><li>for all locales use <code>*</code>, translates to <code>null</code></li><li>for selected locales use JSON string array <code>[&quot;en&quot;, &quot;fr&quot;]</code></li></ul></div>',40),d=[t];function c(n,r,s,u,h,p){return i(),l("div",null,d)}const f=e(a,[["render",c]]);export{m as __pageData,f as default};
