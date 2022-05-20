import{_ as e,c as t,o as s,a as n}from"./app.2d6c6049.js";const h='{"title":"Testing","description":"","frontmatter":{},"headers":[{"level":2,"title":"API Server","slug":"api-server"},{"level":2,"title":"Admin & Survey apps","slug":"admin-survey-apps"}],"relativePath":"developer/testing.md"}',o={},a=n(`<h1 id="testing" tabindex="-1">Testing <a class="header-anchor" href="#testing" aria-hidden="true">#</a></h1><p>Tests are set up with <a href="https://jestjs.io" target="_blank" rel="noopener noreferrer">Jest</a> framework.</p><p>All tests can be triggered from top-level repository structure.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>API Server integration test and some unit tests interacts with database, so be sure to set up empty testing databases and <code>__tests__/.env-test</code> file correctly. See below for more details.</p></div><p>Tests are always located in <code>__tests__</code> folder in each <code>app</code> or <code>package</code> and use following directory structure convention. <code>__tests__</code> folder for <code>apps</code> has <code>unit</code> and <code>integration</code> subfolders as it will most likely have more then unit tests. While unit tests for <code>packages</code> are located directly in <code>__tests__</code>.</p><div class="language-"><pre><code>\u251C\u2500 apps
\u2502  \u2514\u2500 {application}
\u2502     \u2514\u2500 __tests__
\u2502        \u251C\u2500 unit
\u2502           \u2514\u2500 my-function1.spec.ts
\u2502        \u2514\u2500 integration
\u2502           \u2514\u2500 my-function2.spec.ts
\u251C\u2500 packages
   \u2514\u2500 {package}
      \u2514\u2500 __tests__
        \u2514\u2500 my-function3.spec.ts
</code></pre></div><p>Unit tests in <code>apps</code> folders</p><p>Use following commands to run unit tests across repository and trigger tests in <code>__tests__</code> folders and <code>__tests__/unit</code> folders for package and apps, respectively. <code>Jest</code> will search for all files with <code>.spec.ts</code> extension.</p><div class="language-sh"><pre><code>pnpm test:unit

pnpm test:unit:watch
</code></pre></div><p>Integration tests can be run with following commands. At the moment, there are only API Server integration tests, so it re-triggers the api internal npm command.</p><div class="language-sh"><pre><code>pnpm test:integration

pnpm test:integration:watch
</code></pre></div><h2 id="api-server" tabindex="-1">API Server <a class="header-anchor" href="#api-server" aria-hidden="true">#</a></h2><p>To run unit and integration tests on your local machine, start by copying your <code>.env</code> file to <code>__tests__/.env-test</code>.</p><p>Make sure to edit the <code>.env-test</code> file and change the database settings to point to test databases instead of your normal development ones. The foods and system test databases should be empty databases with the necessary extensions (e.g., <code>uuid-ossp</code>) installed.</p><div class="danger custom-block"><p class="custom-block-title">WARNING</p><p><strong>Do not run any tests</strong> unless you&#39;re sure that the database configuration settings in the <code>.env-test</code> file are correct because the test framework setup code will <strong>destroy all data</strong> in those databases!</p></div><p>If using the development VM, simply copy <code>__tests__/.env-test-dev-vm</code> to <code>__tests__/.env-test</code> and you&#39;re good to go.</p><p>Backend testing is set up for <code>unit</code> and <code>integration</code> tests. You can run tests with following commands.</p><p>Unit tests</p><div class="language-sh"><pre><code>pnpm test:unit
</code></pre></div><p>Unit tests watch for development</p><div class="language-sh"><pre><code>pnpm test:unit:watch
</code></pre></div><p>Integration tests</p><div class="language-sh"><pre><code>pnpm test:integration
</code></pre></div><p>Integration tests watch for development</p><div class="language-sh"><pre><code>pnpm test:integration:watch
</code></pre></div><h2 id="admin-survey-apps" tabindex="-1">Admin &amp; Survey apps <a class="header-anchor" href="#admin-survey-apps" aria-hidden="true">#</a></h2><p>Frontends use Vue.js Jest implementation, so you can run tests with:</p><div class="language-sh"><pre><code>pnpm test
</code></pre></div>`,28),r=[a];function i(d,c,p,l,u,_){return s(),t("div",null,r)}var m=e(o,[["render",i]]);export{h as __pageData,m as default};
