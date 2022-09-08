import{_ as e,c as i,o as d,a as t}from"./app.af605059.js";const w=JSON.parse('{"title":"Rate limiter","description":"","frontmatter":{},"headers":[{"level":2,"title":"Redis instance","slug":"redis-instance","link":"#redis-instance","children":[{"level":3,"title":"Host","slug":"host","link":"#host","children":[]},{"level":3,"title":"Port","slug":"port","link":"#port","children":[]},{"level":3,"title":"Prefix","slug":"prefix","link":"#prefix","children":[]}]},{"level":2,"title":"Login","slug":"login","link":"#login","children":[{"level":3,"title":"Window","slug":"window","link":"#window","children":[]},{"level":3,"title":"Max","slug":"max","link":"#max","children":[]}]},{"level":2,"title":"Password","slug":"password","link":"#password","children":[{"level":3,"title":"Window","slug":"window-1","link":"#window-1","children":[]},{"level":3,"title":"Max","slug":"max-1","link":"#max-1","children":[]}]},{"level":2,"title":"Generate user","slug":"generate-user","link":"#generate-user","children":[{"level":3,"title":"Window","slug":"window-2","link":"#window-2","children":[]},{"level":3,"title":"Max","slug":"max-2","link":"#max-2","children":[]}]},{"level":2,"title":"PDF outputs","slug":"pdf-outputs","link":"#pdf-outputs","children":[{"level":3,"title":"Window","slug":"window-3","link":"#window-3","children":[]},{"level":3,"title":"Max","slug":"max-3","link":"#max-3","children":[]}]}],"relativePath":"config/api/rate-limiter.md"}'),a={name:"config/api/rate-limiter.md"},o=t('<h1 id="rate-limiter" tabindex="-1">Rate limiter <a class="header-anchor" href="#rate-limiter" aria-hidden="true">#</a></h1><p>Path: <code>apps/api/src/config/rate-limiter.ts</code></p><p><a href="https://redis.io" target="_blank" rel="noreferrer">Redis</a> is used as rate-limiter store driver.</p><p>Redis is also used for other parts of system (cache, queue, session), they have separate connection settings, so they can be configured independently if needed.</p><div class="tip custom-block"><p class="custom-block-title">Rate limiter time window definition</p><p>Time window to track the requests is defined as <code>ms-formatted</code> string, see <a href="https://github.com/vercel/ms" target="_blank" rel="noreferrer">ms</a> for more information.</p></div><h2 id="redis-instance" tabindex="-1">Redis instance <a class="header-anchor" href="#redis-instance" aria-hidden="true">#</a></h2><h3 id="host" tabindex="-1">Host <a class="header-anchor" href="#host" aria-hidden="true">#</a></h3><ul><li>object-path: <code>redis.host</code></li><li>dotenv var: <code>RATE_LIMITER_REDIS_HOST</code></li><li>type: <code>string</code></li><li>default: <code>&#39;localhost&#39;</code></li></ul><h3 id="port" tabindex="-1">Port <a class="header-anchor" href="#port" aria-hidden="true">#</a></h3><ul><li>object-path: <code>redis.port</code></li><li>dotenv var: <code>RATE_LIMITER_REDIS_PORT</code></li><li>type: <code>number</code></li><li>default: <code>6379</code></li></ul><h3 id="prefix" tabindex="-1">Prefix <a class="header-anchor" href="#prefix" aria-hidden="true">#</a></h3><p>Prefix string which is pre-pended to each key to identify cache data.</p><ul><li>object-path: <code>redis.keyPrefix</code></li><li>dotenv var: <code>RATE_LIMITER_REDIS_PREFIX</code></li><li>type: <code>string</code></li><li>default: <code>&#39;it24:rate-limiter:&#39;</code></li></ul><h2 id="login" tabindex="-1">Login <a class="header-anchor" href="#login" aria-hidden="true">#</a></h2><p>Rate limit settings for <code>/api/auth/login | /api/auth/login/alias | /api/auth/login/token</code> routes.</p><h3 id="window" tabindex="-1">Window <a class="header-anchor" href="#window" aria-hidden="true">#</a></h3><p>Time window to track the requests.</p><ul><li>object-path: <code>login.window</code></li><li>dotenv var: <code>RATE_LIMITER_LOGIN_WINDOW</code></li><li>type: <code>string</code></li><li>default: <code>&#39;15m&#39;</code></li></ul><h3 id="max" tabindex="-1">Max <a class="header-anchor" href="#max" aria-hidden="true">#</a></h3><p>Maximum number of requests that can be made within the specified time window.</p><ul><li>object-path: <code>login.max</code></li><li>dotenv var: <code>RATE_LIMITER_LOGIN_MAX</code></li><li>type: <code>number</code></li><li>default: <code>5</code></li></ul><h2 id="password" tabindex="-1">Password <a class="header-anchor" href="#password" aria-hidden="true">#</a></h2><p>Rate limit settings for <code>/api/password</code> routes.</p><h3 id="window-1" tabindex="-1">Window <a class="header-anchor" href="#window-1" aria-hidden="true">#</a></h3><p>Time window to track the requests.</p><ul><li>object-path: <code>password.window</code></li><li>dotenv var: <code>RATE_LIMITER_PASSWORD_WINDOW</code></li><li>type: <code>string</code></li><li>default: <code>&#39;5m&#39;</code></li></ul><h3 id="max-1" tabindex="-1">Max <a class="header-anchor" href="#max-1" aria-hidden="true">#</a></h3><p>Maximum number of requests that can be made within the specified time window.</p><ul><li>object-path: <code>password.max</code></li><li>dotenv var: <code>RATE_LIMITER_PASSWORD_MAX</code></li><li>type: <code>number</code></li><li>default: <code>1</code></li></ul><h2 id="generate-user" tabindex="-1">Generate user <a class="header-anchor" href="#generate-user" aria-hidden="true">#</a></h2><p>Rate limit settings for <code>/api/surveys/:surveyId/generate-user</code> routes.</p><h3 id="window-2" tabindex="-1">Window <a class="header-anchor" href="#window-2" aria-hidden="true">#</a></h3><p>Time window to track the requests.</p><ul><li>object-path: <code>generateUser.window</code></li><li>dotenv var: <code>RATE_LIMITER_GEN_USER_WINDOW</code></li><li>type: <code>string</code></li><li>default: <code>&#39;5m&#39;</code></li></ul><h3 id="max-2" tabindex="-1">Max <a class="header-anchor" href="#max-2" aria-hidden="true">#</a></h3><p>Maximum number of requests that can be made within the specified time window.</p><ul><li>object-path: <code>generateUser.max</code></li><li>dotenv var: <code>RATE_LIMITER_GEN_USER_MAX</code></li><li>type: <code>number</code></li><li>default: <code>1</code></li></ul><h2 id="pdf-outputs" tabindex="-1">PDF outputs <a class="header-anchor" href="#pdf-outputs" aria-hidden="true">#</a></h2><p>Rate limit settings for <code>/api/user/feedback</code> - <code>download</code> and <code>email</code> routes.</p><h3 id="window-3" tabindex="-1">Window <a class="header-anchor" href="#window-3" aria-hidden="true">#</a></h3><p>Time window to track the requests.</p><ul><li>object-path: <code>feedback.window</code></li><li>dotenv var: <code>RATE_LIMITER_FEEDBACK_WINDOW</code></li><li>type: <code>string</code></li><li>default: <code>&#39;1m&#39;</code></li></ul><h3 id="max-3" tabindex="-1">Max <a class="header-anchor" href="#max-3" aria-hidden="true">#</a></h3><p>Maximum number of requests that can be made within the specified time window.</p><ul><li>object-path: <code>feedback.max</code></li><li>dotenv var: <code>RATE_LIMITER_FEEDBACK_MAX</code></li><li>type: <code>number</code></li><li>default: <code>1</code></li></ul>',45),l=[o];function r(n,c,s,h,u,p){return d(),i("div",null,l)}const f=e(a,[["render",r]]);export{w as __pageData,f as default};
