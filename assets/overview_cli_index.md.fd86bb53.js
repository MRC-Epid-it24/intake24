import{_ as e,c as a,o as t,a as o}from"./app.e32337bc.js";const m='{"title":"Introduction","description":"","frontmatter":{},"headers":[{"level":2,"title":"Installation","slug":"installation"},{"level":2,"title":"Usage","slug":"usage"}],"relativePath":"overview/cli/index.md","lastUpdated":1642417039309}',i={},n=o(`<h1 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-hidden="true">#</a></h1><p>Command line interface to run specific scripts / tasks is implemented as standalone app <code>apps/cli</code>.</p><h2 id="installation" tabindex="-1">Installation <a class="header-anchor" href="#installation" aria-hidden="true">#</a></h2><p>Navigate to application folder</p><div class="language-sh"><pre><code>cd apps/cli
</code></pre></div><p>Build the project for production</p><div class="language-sh"><pre><code>pnpm prod
</code></pre></div><p>or for development (with file watching and reloads)</p><div class="language-sh"><pre><code>pnpm dev
</code></pre></div><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-hidden="true">#</a></h2><p>You can run commands either on top/root level repository or within <code>apps/cli</code>.</p><div class="language-sh"><pre><code>pnpm cli -- &lt;command&gt; &lt;options&gt;
</code></pre></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>Please note the syntax and double-dash. Double-dash will pass the arguments to the script. If omitted <code>pnpm</code> would try to interpret them as well.</p></div>`,13),s=[n];function d(c,r,l,p,h,u){return t(),a("div",null,s)}var g=e(i,[["render",d]]);export{m as __pageData,g as default};
