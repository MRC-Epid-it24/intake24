import{_ as a,c as s,o as e,a4 as i}from"./chunks/framework.e0tDGBa7.js";const u=JSON.parse('{"title":"Database","description":"","frontmatter":{},"headers":[],"relativePath":"overview/database.md","filePath":"overview/database.md"}'),t={name:"overview/database.md"},l=i(`<h1 id="database" tabindex="-1">Database <a class="header-anchor" href="#database" aria-label="Permalink to &quot;Database&quot;">​</a></h1><ul><li><a href="https://sequelize.org" target="_blank" rel="noreferrer">Sequelize</a> ORM is used for database layer, any of supported dialects can be used.</li></ul><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>Older version (v3) has been written only for Postgres and there are still few Postgres specifics that needs to be ported to dialect-agnostic code. Please contact Intake24 dev team for more details about current state of DB engines support.</p></div><p>Intake24 system has two main databases:</p><ul><li><code>foods</code> - contains all foods related data (e.g. foods, food groups, nutrients, etc.)</li><li><code>system</code> - contains all system related data (e.g. users, permissions, roles, feedback schemes, surveys, etc.)</li></ul><h2 id="database-migrations" tabindex="-1">Database migrations <a class="header-anchor" href="#database-migrations" aria-label="Permalink to &quot;Database migrations&quot;">​</a></h2><p>Database migrations are being handled by <a href="https://sequelize.org/" target="_blank" rel="noreferrer">sequelize</a>. Please see <a href="https://sequelize.org/docs/v6/other-topics/migrations" target="_blank" rel="noreferrer">sequelize-cli</a> docs for more details.</p><h3 id="migrate-system-database" tabindex="-1">Migrate system database <a class="header-anchor" href="#migrate-system-database" aria-label="Permalink to &quot;Migrate system database&quot;">​</a></h3><p>Migration commands can be being executed either from <code>project root</code> or <code>packages/db</code> directory.</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> db:system:migrate</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># shorthand for</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sequelize</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> db:migrate</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --options-path</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sequelize/system/options.js</span></span></code></pre></div><h3 id="migrate-foods-database" tabindex="-1">Migrate foods database <a class="header-anchor" href="#migrate-foods-database" aria-label="Permalink to &quot;Migrate foods database&quot;">​</a></h3><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> db:foods:migrate</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># shorthand for</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sequelize</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> db:migrate</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --options-path</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sequelize/foods/options.js</span></span></code></pre></div><h2 id="upgrade-guide" tabindex="-1">Upgrade guide <a class="header-anchor" href="#upgrade-guide" aria-label="Permalink to &quot;Upgrade guide&quot;">​</a></h2><p>Intake24 V3 to V4 upgrade guide (WIP)</p><h3 id="migrate-databases" tabindex="-1">Migrate databases <a class="header-anchor" href="#migrate-databases" aria-label="Permalink to &quot;Migrate databases&quot;">​</a></h3><p>Use most up-to-date V3 <code>foods</code> and <code>system</code> databases to run the migrations.</p><ol><li>Migrate system database</li></ol><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> db:system:migrate</span></span></code></pre></div><ol start="2"><li>Migrate foods database</li></ol><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> db:foods:migrate</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Depending on size of the databases, migration process can take from seconds to minutes. Both databases are being upgraded to use int8 instead of int4, which takes most of the time.</p><p>If you run into query timeout issues, you will have to increase the limits in sequelize config file (<code>packages/db/sequelize/{foods|system}/config.js</code>).</p></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>Run the migration in specified order per above.</p><p>Some of the system database migrations are using foods database data (e.g. feedback data conversion into feedback-schemes) and eventually V3 old tables are dropped. Running the migrations in wrong order will fail.</p></div><h3 id="seed-databases-with-relevant-data" tabindex="-1">Seed databases with relevant data <a class="header-anchor" href="#seed-databases-with-relevant-data" aria-label="Permalink to &quot;Seed databases with relevant data&quot;">​</a></h3><p>Some of V3 data are being moved to database. To get this data into the database, run relevant seeders.</p><h4 id="standard-units" tabindex="-1">Standard units <a class="header-anchor" href="#standard-units" aria-label="Permalink to &quot;Standard units&quot;">​</a></h4><p>Standard units are being moved from V3 translation files to database. To seed the database with V3 source code standard units, run the following command:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> packages/db</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sequelize</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> db:seed</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --seed</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> v3-standard-units.js</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --options-path</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sequelize/foods/options.js</span></span></code></pre></div><h4 id="recipe-foods" tabindex="-1">Recipe foods <a class="header-anchor" href="#recipe-foods" aria-label="Permalink to &quot;Recipe foods&quot;">​</a></h4><p>Recipe foods are being moved from V3 translation files to database. To seed the database with V3-like data, run the following command:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> packages/db</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sequelize</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> db:seed</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --seed</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> v3-recipe-foods.js</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --options-path</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sequelize/foods/options.js</span></span></code></pre></div><h2 id="system-database-clean-up" tabindex="-1">System database clean-up <a class="header-anchor" href="#system-database-clean-up" aria-label="Permalink to &quot;System database clean-up&quot;">​</a></h2><h3 id="truncate-all-tables-except-sequelize-meta" tabindex="-1">Truncate all tables except <code>sequelize_meta</code> <a class="header-anchor" href="#truncate-all-tables-except-sequelize-meta" aria-label="Permalink to &quot;Truncate all tables except \`sequelize_meta\`&quot;">​</a></h3><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">TRUNCATE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> TABLE</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`table\`</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> RESTART</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> IDENTITY</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> CASCADE;</span></span></code></pre></div><h3 id="seed-acl-data" tabindex="-1">Seed ACL data <a class="header-anchor" href="#seed-acl-data" aria-label="Permalink to &quot;Seed ACL data&quot;">​</a></h3><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> packages/db</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sequelize</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> db:seed</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --seed</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> populate-acl.js</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --options-path</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sequelize/system/options.js</span></span></code></pre></div><div class="danger custom-block"><p class="custom-block-title">DANGER</p><p>Seeder truncates all <code>permissions</code> / <code>roles</code> / <code>users</code> tables with <code>CASCADE</code>.</p></div><p>Seeder will create:</p><ul><li>creates all available permissions</li><li>creates <code>superuser</code> role with all permissions assigned</li><li>creates <code>admin</code> user with <code>superuser</code> role assigned</li></ul><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p><code>admin</code> user is being created with <code>admin</code> password.</p><p><strong>After first login:</strong></p><ol><li>Change password</li><li>Set own email in order to restore password in future</li></ol></div><h3 id="copy-over-duplicated-food-data" tabindex="-1">Copy over duplicated food data <a class="header-anchor" href="#copy-over-duplicated-food-data" aria-label="Permalink to &quot;Copy over duplicated food data&quot;">​</a></h3><p>WIP - to be automated</p><ol><li><code>food_index_language_backends</code> - all language codes in <code>food_index_language_backend_id</code> column of <code>locales</code> table need to be created</li><li><code>languages</code> - all language codes that are present in locales table record need to be created</li><li><code>locales</code></li><li><code>nutrient_units</code> - copy over all records from <code>nutrient_units</code> table</li><li><code>nutrient_types</code> - copy over all records from <code>nutrient_types</code> table</li></ol>`,42),n=[l];function d(o,p,r,h,c,k){return e(),s("div",null,n)}const b=a(t,[["render",d]]);export{u as __pageData,b as default};
