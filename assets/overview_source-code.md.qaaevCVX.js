import{_ as e,o as a,c as s,R as n}from"./chunks/framework.j44i4Sp2.js";const m=JSON.parse('{"title":"Source code","description":"","frontmatter":{},"headers":[],"relativePath":"overview/source-code.md","filePath":"overview/source-code.md"}'),t={name:"overview/source-code.md"},i=n(`<h1 id="source-code" tabindex="-1">Source code <a class="header-anchor" href="#source-code" aria-label="Permalink to &quot;Source code&quot;">​</a></h1><p>Project is using <code>git</code> versioning system is hosted on <a href="https://github.com/MRC-Epid-it24/intake24" target="_blank" rel="noreferrer">github</a>.</p><p>Clone the repository</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> clone</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://github.com/MRC-Epid-it24/intake24</span></span></code></pre></div><h2 id="repository-structure" tabindex="-1">Repository structure <a class="header-anchor" href="#repository-structure" aria-label="Permalink to &quot;Repository structure&quot;">​</a></h2><p>Repository is set as <code>mono-repository</code> with <a href="https://docs.npmjs.com/cli/v7/using-npm/workspaces" target="_blank" rel="noreferrer">workspaces</a>.</p><p>Deployable applications are in <code>apps</code> folder. Shared components are in <code>packages</code> folder.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>.</span></span>
<span class="line"><span>├─ .github -&gt; Github actions / workflows</span></span>
<span class="line"><span>├─ apps -&gt; Applications</span></span>
<span class="line"><span>│  ├─ api -&gt; API Server</span></span>
<span class="line"><span>│  ├─ admin -&gt; Admin tool</span></span>
<span class="line"><span>│  ├─ cli -&gt; Command line interface</span></span>
<span class="line"><span>│  ├─ portal -&gt; Portal website</span></span>
<span class="line"><span>│  └─ survey -&gt; Survey application</span></span>
<span class="line"><span>├─ deployment - Ansible playbooks / scripts for deployment</span></span>
<span class="line"><span>├─ docker - Docker files for development</span></span>
<span class="line"><span>├─ docs -&gt; Documentation</span></span>
<span class="line"><span>└─ packages</span></span>
<span class="line"><span>   ├─ api-client-v3 -&gt; API Client (Intake23 V3)</span></span>
<span class="line"><span>   ├─ api-client-v4 -&gt; API Client (Intake23 V4 - current)</span></span>
<span class="line"><span>   ├─ common -&gt; repository-wide shared code</span></span>
<span class="line"><span>   ├─ common-backend -&gt; backend shared code, e.g. services</span></span>
<span class="line"><span>   ├─ db -&gt; database layer (models, migrations, etc.)</span></span>
<span class="line"><span>   ├─ i18n -&gt; translation files for all applications</span></span>
<span class="line"><span>   └─ ui -&gt; frontend shared code (admin / survey)</span></span></code></pre></div><h2 id="dependencies" tabindex="-1">Dependencies <a class="header-anchor" href="#dependencies" aria-label="Permalink to &quot;Dependencies&quot;">​</a></h2><p>Project is using <a href="https://pnpm.io" target="_blank" rel="noreferrer">pnpm</a> as a package manager.</p><p>Install <code>pnpm</code> using corepack or see <a href="https://pnpm.io" target="_blank" rel="noreferrer">pnpm docs</a> for further installation options.</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">corepack</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> enable</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">corepack</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> prepare</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> pnpm@latest</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --activate</span></span></code></pre></div><p>Install all dependencies from root-level</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span></span></code></pre></div><h2 id="commit-convention" tabindex="-1">Commit convention <a class="header-anchor" href="#commit-convention" aria-label="Permalink to &quot;Commit convention&quot;">​</a></h2><p>Commit messages are restricted to follow <code>conventional-changelog</code> convention, adapted from <a href="https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular" target="_blank" rel="noreferrer">Angular&#39;s commit convention</a>.</p><p>Please see <a href="https://github.com/MRC-Epid-it24/intake24/blob/master/.github/commit-convention.md" target="_blank" rel="noreferrer"><code>.github/commit-convention.md</code></a> for more details.</p><p>Please see <a href="https://github.com/MRC-Epid-it24/intake24/blob/master/scripts/verify-commit.ts" target="_blank" rel="noreferrer"><code>scripts/verify-commit.ts</code></a> for implementation.</p><h2 id="code-style" tabindex="-1">Code style <a class="header-anchor" href="#code-style" aria-label="Permalink to &quot;Code style&quot;">​</a></h2><p>Project is set up with <a href="https://eslint.org/" target="_blank" rel="noreferrer">eslint</a> and <a href="https://prettier.io/" target="_blank" rel="noreferrer">prettier</a> to help to keep clean and maintainable code.</p><p>Both integrate very well with most of the IDEs. Install respective plugins / extensions and configure it to run on <code>save</code> to have immediate effect.</p><p>You can also run lint process manually from root-level or in each <code>app</code> / <code>package</code>.</p><p>Run linting and try to fix as much as possible automatically</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> lint</span></span></code></pre></div><p>Lint step also runs for each staged file, when changes are being committed (using git hooks).</p><h2 id="renovate" tabindex="-1">Renovate <a class="header-anchor" href="#renovate" aria-label="Permalink to &quot;Renovate&quot;">​</a></h2><p>Repository is set up with <a href="https://github.com/renovatebot/renovate" target="_blank" rel="noreferrer">renovate bot</a>, which checks repository for up-to-date dependencies and prepares PRs to be merged. Renovate job runs on weekly basis and can be configured through <a href="https://github.com/MRC-Epid-it24/intake24/blob/master/.github/renovate.json5" target="_blank" rel="noreferrer"><code>.github/renovate.json5</code></a> config file.</p><h2 id="continuous-integration" tabindex="-1">Continuous integration <a class="header-anchor" href="#continuous-integration" aria-label="Permalink to &quot;Continuous integration&quot;">​</a></h2><h3 id="build" tabindex="-1">Build <a class="header-anchor" href="#build" aria-label="Permalink to &quot;Build&quot;">​</a></h3><p><a href="https://github.com/MRC-Epid-it24/intake24/blob/master/.github/workflows/ci.yml" target="_blank" rel="noreferrer">Main CI</a> action is triggered on any source code change and it runs lint / build / tests / steps for each of the components.</p><h3 id="documentation" tabindex="-1">Documentation <a class="header-anchor" href="#documentation" aria-label="Permalink to &quot;Documentation&quot;">​</a></h3><p><a href="https://github.com/MRC-Epid-it24/intake24/blob/master/.github/workflows/docs.yml" target="_blank" rel="noreferrer">Docs CI</a> action is triggered on <code>docs</code> folder source code change and documentation site is automatically rebuilt and deployed to GitHub pages.</p>`,32),o=[i];function r(p,l,c,d,h,g){return a(),s("div",null,o)}const k=e(t,[["render",r]]);export{m as __pageData,k as default};
