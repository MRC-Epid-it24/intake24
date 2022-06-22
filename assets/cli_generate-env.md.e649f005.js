import{_ as e,c as a,o,a as t}from"./app.e79dd453.js";const v='{"title":"Generate .env files","description":"","frontmatter":{},"headers":[],"relativePath":"cli/generate-env.md"}',n={},c=t(`<h1 id="generate-env-files" tabindex="-1">Generate .env files <a class="header-anchor" href="#generate-env-files" aria-hidden="true">#</a></h1><p>This command allows to quickly generate <code>.env</code> files for each application (<code>api</code>, <code>admin</code> and <code>survey</code>) when setting up the application for the first time.</p><p>It copies <code>.env-templates</code> to <code>.env</code> and generates couples of application secrets + VAPID keys.</p><div class="language-sh"><pre><code>pnpm cli -- generate-env
</code></pre></div><p>If files already exist, command will stop. To override the existing files, run the command with <code>-f</code> or <code>--force</code> option.</p><div class="language-sh"><pre><code>pnpm cli -- generate-env --force
</code></pre></div>`,6),i=[c];function r(s,d,p,l,_,f){return o(),a("div",null,i)}var m=e(n,[["render",r]]);export{v as __pageData,m as default};
