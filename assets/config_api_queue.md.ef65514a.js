import{_ as e,c as r,o as t,a}from"./app.af605059.js";const f=JSON.parse('{"title":"Queue","description":"","frontmatter":{},"headers":[{"level":2,"title":"Redis instance","slug":"redis-instance","link":"#redis-instance","children":[{"level":3,"title":"Host","slug":"host","link":"#host","children":[]},{"level":3,"title":"Port","slug":"port","link":"#port","children":[]},{"level":3,"title":"Workers","slug":"workers","link":"#workers","children":[]}]}],"relativePath":"config/api/queue.md"}'),i={name:"config/api/queue.md"},o=a('<h1 id="queue" tabindex="-1">Queue <a class="header-anchor" href="#queue" aria-hidden="true">#</a></h1><p>Path: <code>apps/api/src/config/queue.ts</code></p><p>Queueing system is handled by <a href="https://redis.io" target="_blank" rel="noreferrer">Redis</a> &amp; <a href="https://github.com/taskforcesh/bullmq" target="_blank" rel="noreferrer">bullmq</a></p><h2 id="redis-instance" tabindex="-1">Redis instance <a class="header-anchor" href="#redis-instance" aria-hidden="true">#</a></h2><h3 id="host" tabindex="-1">Host <a class="header-anchor" href="#host" aria-hidden="true">#</a></h3><ul><li>object-path: <code>redis.host</code></li><li>dotenv var: <code>QUEUE_REDIS_HOST</code></li><li>type: <code>string</code></li><li>default: <code>&#39;localhost&#39;</code></li></ul><h3 id="port" tabindex="-1">Port <a class="header-anchor" href="#port" aria-hidden="true">#</a></h3><ul><li>object-path: <code>redis.port</code></li><li>dotenv var: <code>QUEUE_REDIS_PORT</code></li><li>type: <code>number</code></li><li>default: <code>6379</code></li></ul><h3 id="workers" tabindex="-1">Workers <a class="header-anchor" href="#workers" aria-hidden="true">#</a></h3><p>Number of workers to spawn for job queue</p><ul><li>object-path: <code>workers</code></li><li>dotenv var: <code>QUEUE_WORKERS</code></li><li>type: <code>number</code></li><li>default: <code>3</code></li></ul>',11),d=[o];function l(s,c,n,h,u,p){return t(),r("div",null,d)}const b=e(i,[["render",l]]);export{f as __pageData,b as default};
