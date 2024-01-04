import{_ as e,c as o,o as i,U as a}from"./chunks/framework.oMD8f2dh.js";const k=JSON.parse('{"title":"Session","description":"","frontmatter":{},"headers":[],"relativePath":"config/api/session.md","filePath":"config/api/session.md"}'),t={name:"config/api/session.md"},l=a('<h1 id="session" tabindex="-1">Session <a class="header-anchor" href="#session" aria-label="Permalink to &quot;Session&quot;">​</a></h1><p>Path: <code>apps/api/src/config/session.ts</code></p><p><a href="https://redis.io" target="_blank" rel="noreferrer">Redis</a> is used as session store driver.</p><p>Redis is also used for other parts of system (cache, queue, rate limiter), they have separate connection settings, so they can be configured independently if needed.</p><h2 id="redis-instance" tabindex="-1">Redis instance <a class="header-anchor" href="#redis-instance" aria-label="Permalink to &quot;Redis instance&quot;">​</a></h2><h3 id="host" tabindex="-1">Host <a class="header-anchor" href="#host" aria-label="Permalink to &quot;Host&quot;">​</a></h3><ul><li>object-path: <code>redis.host</code></li><li>dotenv var: <code>SESSION_REDIS_HOST</code></li><li>type: <code>string</code></li><li>default: <code>&#39;localhost&#39;</code></li></ul><h3 id="port" tabindex="-1">Port <a class="header-anchor" href="#port" aria-label="Permalink to &quot;Port&quot;">​</a></h3><ul><li>object-path: <code>redis.port</code></li><li>dotenv var: <code>SESSION_REDIS_PORT</code></li><li>type: <code>number</code></li><li>default: <code>6379</code></li></ul><h3 id="prefix" tabindex="-1">Prefix <a class="header-anchor" href="#prefix" aria-label="Permalink to &quot;Prefix&quot;">​</a></h3><p>Prefix string which is pre-pended to each key to identify cache data.</p><ul><li>object-path: <code>redis.keyPrefix</code></li><li>dotenv var: <code>SESSION_REDIS_PREFIX</code></li><li>type: <code>string</code></li><li>default: <code>&#39;it24:session:&#39;</code></li></ul><h2 id="cookie" tabindex="-1">Cookie <a class="header-anchor" href="#cookie" aria-label="Permalink to &quot;Cookie&quot;">​</a></h2><h3 id="cookie-name" tabindex="-1">Cookie name <a class="header-anchor" href="#cookie-name" aria-label="Permalink to &quot;Cookie name&quot;">​</a></h3><ul><li>object-path: <code>cookie.name</code></li><li>dotenv var: <code>SESSION_COOKIE_NAME</code></li><li>type: <code>string</code></li><li>default: <code>it24_session</code></li></ul><h3 id="cookie-maxage" tabindex="-1">Cookie maxAge <a class="header-anchor" href="#cookie-maxage" aria-label="Permalink to &quot;Cookie maxAge&quot;">​</a></h3><p>Lifetime of cookie. Defined as <code>ms-formatted</code> string, see <a href="https://github.com/vercel/ms" target="_blank" rel="noreferrer">ms</a> for more information.</p><ul><li>object-path: <code>cookie.maxAge</code></li><li>dotenv var: <code>SESSION_COOKIE_LIFETIME</code></li><li>default: <code>&#39;15m&#39;</code></li><li>type: <code>string</code></li></ul><h3 id="cookie-httponly" tabindex="-1">Cookie httpOnly <a class="header-anchor" href="#cookie-httponly" aria-label="Permalink to &quot;Cookie httpOnly&quot;">​</a></h3><ul><li>object-path: <code>cookie.httpOnly</code></li><li>type: <code>boolean</code></li><li>default: <code>true</code></li></ul><h3 id="cookie-path" tabindex="-1">Cookie path <a class="header-anchor" href="#cookie-path" aria-label="Permalink to &quot;Cookie path&quot;">​</a></h3><ul><li>object-path: <code>cookie.path</code></li><li>dotenv var: <code>SESSION_COOKIE_PATH</code></li><li>type: <code>string</code></li><li>default: <code>&#39;/api/admin/auth&#39;</code></li></ul><h3 id="cookie-samesite" tabindex="-1">Cookie sameSite <a class="header-anchor" href="#cookie-samesite" aria-label="Permalink to &quot;Cookie sameSite&quot;">​</a></h3><ul><li>object-path: <code>cookie.sameSite</code></li><li>dotenv var: <code>SESSION_COOKIE_SAME_SITE</code></li><li>type: <code>boolean | &#39;lax&#39; | &#39;strict&#39; | &#39;none&#39;</code></li><li>default: <code>&#39;lax&#39;</code></li></ul><h3 id="cookie-secure" tabindex="-1">Cookie secure <a class="header-anchor" href="#cookie-secure" aria-label="Permalink to &quot;Cookie secure&quot;">​</a></h3><ul><li>object-path: <code>cookie.httpOnly</code></li><li>dotenv var: <code>SESSION_COOKIE_SECURE</code></li><li>type: <code>boolean</code></li><li>default: <code>false</code></li></ul>',26),c=[l];function d(r,s,n,h,p,u){return i(),o("div",null,c)}const m=e(t,[["render",d]]);export{k as __pageData,m as default};
