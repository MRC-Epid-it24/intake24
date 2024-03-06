import{_ as e,c as a,o,a4 as t}from"./chunks/framework.CvR0xHCp.js";const f=JSON.parse('{"title":"Queue","description":"","frontmatter":{},"headers":[],"relativePath":"config/api/queue.md","filePath":"config/api/queue.md"}'),r={name:"config/api/queue.md"},i=t('<h1 id="queue" tabindex="-1">Queue <a class="header-anchor" href="#queue" aria-label="Permalink to &quot;Queue&quot;">​</a></h1><p>Path: <code>apps/api/src/config/queue.ts</code></p><p>Queueing system is handled by <a href="https://redis.io" target="_blank" rel="noreferrer">Redis</a> &amp; <a href="https://github.com/taskforcesh/bullmq" target="_blank" rel="noreferrer">bullmq</a></p><h2 id="redis-instance" tabindex="-1">Redis instance <a class="header-anchor" href="#redis-instance" aria-label="Permalink to &quot;Redis instance&quot;">​</a></h2><h3 id="host" tabindex="-1">Host <a class="header-anchor" href="#host" aria-label="Permalink to &quot;Host&quot;">​</a></h3><ul><li>object-path: <code>redis.host</code></li><li>dotenv var: <code>QUEUE_REDIS_HOST</code></li><li>type: <code>string</code></li><li>default: <code>&#39;localhost&#39;</code></li></ul><h3 id="port" tabindex="-1">Port <a class="header-anchor" href="#port" aria-label="Permalink to &quot;Port&quot;">​</a></h3><ul><li>object-path: <code>redis.port</code></li><li>dotenv var: <code>QUEUE_REDIS_PORT</code></li><li>type: <code>number</code></li><li>default: <code>6379</code></li></ul><h3 id="workers" tabindex="-1">Workers <a class="header-anchor" href="#workers" aria-label="Permalink to &quot;Workers&quot;">​</a></h3><p>Number of workers to spawn for job queue</p><ul><li>object-path: <code>workers</code></li><li>dotenv var: <code>QUEUE_WORKERS</code></li><li>type: <code>number</code></li><li>default: <code>3</code></li></ul>',11),l=[i];function c(d,s,n,u,h,p){return o(),a("div",null,l)}const b=e(r,[["render",c]]);export{f as __pageData,b as default};