import{_ as o,c as d,ag as c,o as a}from"./chunks/framework.CB8iguzh.js";const u=JSON.parse('{"title":"Database","description":"","frontmatter":{},"headers":[],"relativePath":"config/api/database.md","filePath":"config/api/database.md"}'),l={name:"config/api/database.md"};function t(i,e,n,s,r,_){return a(),d("div",null,e[0]||(e[0]=[c('<h1 id="database" tabindex="-1">Database <a class="header-anchor" href="#database" aria-label="Permalink to &quot;Database&quot;">​</a></h1><p>Path: <code>packages/db/src/config.ts</code></p><p>Connection info is defined per-environment and per-database.</p><p>System consists of two databases:</p><ul><li><code>Foods</code> - food-related information, mostly static content</li><li><code>System</code> - users / surveys related information, system configuration etc</li></ul><p><strong>Environments</strong>:</p><ul><li><code>development</code> - local development environment</li><li><code>test</code> - local tests and CI environment</li><li><code>production</code> - production environment</li></ul><p><strong>Connection types</strong></p><ol><li>Connection URL - use <code>url</code> property</li><li>Connection credentials - use <code>host</code>, <code>port</code>, <code>database</code>, <code>username</code> and <code>password</code> properties</li></ol><h2 id="url" tabindex="-1">URL <a class="header-anchor" href="#url" aria-label="Permalink to &quot;URL&quot;">​</a></h2><p>Examples</p><p><code>DB_DEV_SYSTEM_URL=postgres://user:password@localhost:5432/intake24_system_dev</code></p><p><code>DB_DEV_FOODS_URL=postgres://user:password@localhost:5432/intake24_foods_dev</code></p><ul><li>object-path: <code>[environment][database].url</code></li><li>dotenv vars: <ul><li><code>development</code>: <code>DB_DEV_FOODS_URL</code> and <code>DB_DEV_SYSTEM_URL</code></li><li><code>test</code>: <code>DB_TEST_FOODS_URL</code> and <code>DB_TEST_SYSTEM_URL</code></li><li><code>production</code>: <code>DB_FOODS_URL</code> and <code>DB_SYSTEM_URL</code></li></ul></li><li>type: <code>string | undefined</code></li><li>default: <code>undefined</code></li></ul><h2 id="host" tabindex="-1">Host <a class="header-anchor" href="#host" aria-label="Permalink to &quot;Host&quot;">​</a></h2><ul><li>object-path: <code>[environment][database].host</code></li><li>dotenv vars: <ul><li><code>development</code>: <code>DB_DEV_FOODS_HOST</code> and <code>DB_DEV_SYSTEM_HOST</code></li><li><code>test</code>: <code>DB_TEST_FOODS_HOST</code> and <code>DB_TEST_SYSTEM_HOST</code></li><li><code>production</code>: <code>DB_FOODS_HOST</code> and <code>DB_SYSTEM_HOST</code></li></ul></li><li>type: <code>string | undefined</code></li><li>default: <code>undefined</code></li></ul><h2 id="port" tabindex="-1">Port <a class="header-anchor" href="#port" aria-label="Permalink to &quot;Port&quot;">​</a></h2><ul><li>object-path: <code>[environment][database].port</code></li><li>dotenv vars: <ul><li><code>development</code>: <code>DB_DEV_FOODS_PORT</code> and <code>DB_DEV_SYSTEM_PORT</code></li><li><code>test</code>: <code>DB_TEST_FOODS_PORT</code> and <code>DB_TEST_SYSTEM_PORT</code></li><li><code>production</code>: <code>DB_FOODS_PORT</code> and <code>DB_SYSTEM_PORT</code></li></ul></li><li>type: <code>number | undefined</code></li><li>default: <code>undefined</code></li></ul><h2 id="database-1" tabindex="-1">Database <a class="header-anchor" href="#database-1" aria-label="Permalink to &quot;Database&quot;">​</a></h2><ul><li>object-path: <code>[environment][database].database</code></li><li>dotenv vars: <ul><li><code>development</code>: <code>DB_DEV_FOODS_DATABASE</code> and <code>DB_DEV_SYSTEM_DATABASE</code></li><li><code>test</code>: <code>DB_TEST_FOODS_DATABASE</code> and <code>DB_TEST_SYSTEM_DATABASE</code></li><li><code>production</code>: <code>DB_FOODS_DATABASE</code> and <code>DB_SYSTEM_DATABASE</code></li></ul></li><li>type: <code>string | undefined</code></li><li>default: <code>undefined</code></li></ul><h2 id="username" tabindex="-1">Username <a class="header-anchor" href="#username" aria-label="Permalink to &quot;Username&quot;">​</a></h2><ul><li>object-path: <code>[environment][database].username</code></li><li>dotenv vars: <ul><li><code>development</code>: <code>DB_DEV_FOODS_USERNAME</code> and <code>DB_DEV_SYSTEM_USERNAME</code></li><li><code>test</code>: <code>DB_TEST_FOODS_USERNAME</code> and <code>DB_TEST_SYSTEM_USERNAME</code></li><li><code>production</code>: <code>DB_FOODS_USERNAME</code> and <code>DB_SYSTEM_USERNAME</code></li></ul></li><li>type: <code>string | undefined</code></li><li>default: <code>undefined</code></li></ul><h2 id="password" tabindex="-1">Password <a class="header-anchor" href="#password" aria-label="Permalink to &quot;Password&quot;">​</a></h2><ul><li>object-path: <code>[environment][database].password</code></li><li>dotenv vars: <ul><li><code>development</code>: <code>DB_DEV_FOODS_PASSWORD</code> and <code>DB_DEV_SYSTEM_PASSWORD</code></li><li><code>test</code>: <code>DB_TEST_FOODS_PASSWORD</code> and <code>DB_TEST_SYSTEM_PASSWORD</code></li><li><code>production</code>: <code>DB_FOODS_PASSWORD</code> and <code>DB_SYSTEM_PASSWORD</code></li></ul></li><li>type: <code>string | undefined</code></li><li>default: <code>undefined</code></li></ul><h2 id="dialect" tabindex="-1">Dialect <a class="header-anchor" href="#dialect" aria-label="Permalink to &quot;Dialect&quot;">​</a></h2><ul><li>object-path: <code>[environment][database].dialect</code></li><li>dotenv vars: <ul><li><code>development</code>: <code>DB_DEV_FOODS_DRIVER</code> and <code>DB_DEV_SYSTEM_DRIVER</code></li><li><code>test</code>: <code>DB_TEST_FOODS_DRIVER</code> and <code>DB_TEST_SYSTEM_DRIVER</code></li><li><code>production</code>: <code>DB_FOODS_DRIVER</code> and <code>DB_SYSTEM_DRIVER</code></li></ul></li><li>type: <code>&#39;mysql&#39; | &#39;postgres&#39; | &#39;sqlite&#39; | &#39;mariadb&#39; | &#39;mssql&#39;</code></li><li>default: <code>&#39;postgres&#39;</code></li></ul><h2 id="security" tabindex="-1">Security <a class="header-anchor" href="#security" aria-label="Permalink to &quot;Security&quot;">​</a></h2><p>In developement environment, <code>DB_CONNECTION_SSL</code> can set to <code>false</code> to skip using SSL protocol.</p><ul><li>object-path: <code>[environment].security</code></li><li>dotenv vars: <ul><li><code>development</code>: <code>DB_CONNECTION_SSL</code></li><li><code>test</code>: <code>DB_CONNECTION_SSL</code></li><li><code>production</code>: <code>DB_CONNECTION_SSL</code></li></ul></li><li>type: <code>&#39;true&#39; | &#39;false&#39;</code></li><li>default: <code>&#39;true&#39;</code></li></ul>',29)]))}const D=o(l,[["render",t]]);export{u as __pageData,D as default};
