import{_ as e,c as a,o as t,a as o}from"./app.e79dd453.js";const g='{"title":"Introduction","description":"","frontmatter":{},"headers":[{"level":2,"title":"Installation","slug":"installation"},{"level":2,"title":"Usage","slug":"usage"}],"relativePath":"cli/index.md"}',n={},i=o(`<h1 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-hidden="true">#</a></h1><p>Command line interface to run specific scripts / tasks. It is implemented as standalone app <code>apps/cli</code>.</p><h2 id="installation" tabindex="-1">Installation <a class="header-anchor" href="#installation" aria-hidden="true">#</a></h2><p>Navigate to application folder</p><div class="language-sh"><pre><code>cd apps/cli
</code></pre></div><p>Build the project for production</p><div class="language-sh"><pre><code>pnpm build
</code></pre></div><p>Run CLI</p><div class="language-sh"><pre><code>pnpm cli
</code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>CLI can also be executed from top-level running <code>pnpm cli</code></p></div><p>Run CLI in development mode</p><p>Run through <code>ts-node</code>.</p><div class="language-sh"><pre><code>pnpm cli:dev
</code></pre></div><p>For development (with file watching and reloads)</p><div class="language-sh"><pre><code>pnpm dev
</code></pre></div><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-hidden="true">#</a></h2><p>You can run commands either on top/root level repository or within <code>apps/cli</code>.</p><div class="language-sh"><pre><code>pnpm cli -- &lt;command&gt; &lt;options&gt;
</code></pre></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>Please note the syntax and double-dash. Double-dash will pass the arguments to the script. If omitted <code>pnpm</code> would try to interpret them as well.</p></div>`,19),d=[i];function s(c,l,p,r,u,h){return t(),a("div",null,d)}var v=e(n,[["render",s]]);export{g as __pageData,v as default};
