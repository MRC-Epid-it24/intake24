import{_ as e,c as r,o as t,a}from"./app.8341d59f.js";const f=JSON.parse('{"title":"Requirements","description":"","frontmatter":{},"headers":[{"level":2,"title":"API Server","slug":"api-server","link":"#api-server","children":[]},{"level":2,"title":"Admin & Survey apps","slug":"admin-survey-apps","link":"#admin-survey-apps","children":[]}],"relativePath":"overview/requirements.md"}'),s={name:"overview/requirements.md"},i=a('<h1 id="requirements" tabindex="-1">Requirements <a class="header-anchor" href="#requirements" aria-hidden="true">#</a></h1><ul><li><p><a href="https://nodejs.org" target="_blank" rel="noreferrer">Node.js</a> runtime environment. System is tested with latest LTS.</p></li><li><p><a href="https://pnpm.io" target="_blank" rel="noreferrer">PNPM</a> Package manager with support for workspaces &amp; mono-repository setup.</p></li></ul><p>Intake24 system has three main components:</p><ol><li>API server</li><li>Admin application</li><li>Survey application</li></ol><p>Source code is written in Typescript and can be flexibly deployed to various environments. Source code also provides ansible roles for deployment to Ubuntu-based OS. <a href="/deployment/">Deployment</a> section describes in detail how to use ansible scripts. For custom deployment, there are few requirements to consider.</p><h2 id="api-server" tabindex="-1">API Server <a class="header-anchor" href="#api-server" aria-hidden="true">#</a></h2><ul><li>Backend database engine. API server is using <a href="https://sequelize.org" target="_blank" rel="noreferrer">sequelize</a> ORM so any of supported dialects can be used.</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Older version (v3) has been written only for Postgres and there are still few Postgres specifics that needs to be ported to dialect-agnostic code. Please contact Intake24 dev team for more details about current state of DB engines support.</p></div><ul><li><p><a href="https://redis.io" target="_blank" rel="noreferrer">Redis</a> is used for <code>cache</code> / <code>queue</code> / <code>rate-limit</code> / <code>session</code> services.</p></li><li><p><a href="https://github.com/puppeteer/puppeteer" target="_blank" rel="noreferrer">Puppeteer</a> is used for PDF generation. Make sure OS has all necessary components to run headless Chrome.</p></li></ul><h2 id="admin-survey-apps" tabindex="-1">Admin &amp; Survey apps <a class="header-anchor" href="#admin-survey-apps" aria-hidden="true">#</a></h2><p>Both Admin and Survey frontend applications are SPA (Single page application) written in Vue.js framework and <a href="https://vitejs.dev" target="_blank" rel="noreferrer">Vite</a> is used as build tool.</p><p>They can be deployed to:</p><ol><li>Same domain site as API Server - if relative path is configured, API server automatically registers the routes to serve the application. Please see <a href="/config/">Configuration</a> section for more details.</li><li>For different domain sites, CORS needs to be configured properly. There are simple http server scripts to serve the applications.</li><li>You can use any type of 3rd party provider like e.g. AWS S3, Heroku, Netlify etc.</li></ol><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Please see <a href="https://vitejs.dev" target="_blank" rel="noreferrer">Vite</a> docs for more details how to deploy Vue.js applications.</p></div>',14),o=[i];function n(l,p,d,c,u,h){return t(),r("div",null,o)}const v=e(s,[["render",n]]);export{f as __pageData,v as default};
