import{_ as e,c as a,o,a as n}from"./app.e32337bc.js";const g='{"title":"Introduction","description":"","frontmatter":{},"headers":[{"level":2,"title":"Node.js","slug":"node-js"},{"level":2,"title":"Package managers","slug":"package-managers"}],"relativePath":"developer/index.md","lastUpdated":1642417039309}',t={},r=n(`<h1 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-hidden="true">#</a></h1><h2 id="node-js" tabindex="-1">Node.js <a class="header-anchor" href="#node-js" aria-hidden="true">#</a></h2><p>Install <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">Node.js</a>, ideally latest LTS (v16).</p><p>Source code is written in Typescript. Backend apps (<code>API server</code> and <code>CLI</code>) are using <code>Node.js</code>. Frontend apps (<code>Admin tool</code> and <code>Survey application</code>) are built using <code>Vue.js</code> framework.</p><h2 id="package-managers" tabindex="-1">Package managers <a class="header-anchor" href="#package-managers" aria-hidden="true">#</a></h2><p>Node.js ecosystem has couple of package managers.</p><p>Historically, <code>npm</code> is shipped with Node.js binaries and was default package manager. However, it does have some drawbacks like dependencies install / tree resolve time, support for monorepos etc.</p><p>There are two 3rd party ones, <code>yarn</code> (facebook backed) and <code>pnpm</code> (community backed), both with great support support and comes with better speeds / features like monorepos.</p><p>Node.js v16.9 comes with <code>corepack</code>, which is sort of a bridge between managers and can be used to install other managers. Though, you can install them usually juts through <code>npm</code> like any other package.</p><p>There are some caveats with using <code>npm</code> and workspaces &amp; monorepo implementation. So <code>pnpm</code> is now set up for Intake24 components. Documentation is still using <code>npm</code>.</p><p>Install <code>pnpm</code> using built-in <code>npm</code> or see <a href="https://pnpm.io" target="_blank" rel="noopener noreferrer">pnpm docs</a> for further options.</p><div class="language-sh"><pre><code>npm install -g pnpm
</code></pre></div>`,12),s=[r];function d(c,p,i,l,h,m){return o(),a("div",null,s)}var _=e(t,[["render",d]]);export{g as __pageData,_ as default};
