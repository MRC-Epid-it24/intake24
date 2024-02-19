import{_ as e,c as t,o as a,a4 as o}from"./chunks/framework.D2Q_DY5z.js";const f=JSON.parse('{"title":"Introduction","description":"","frontmatter":{},"headers":[],"relativePath":"config/index.md","filePath":"config/index.md"}'),n={name:"config/index.md"},i=o('<h1 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-label="Permalink to &quot;Introduction&quot;">​</a></h1><p>All parts of the system are using environment variables. Environment specific configuration is parsed to <code>process.env</code> variables. All applications are using <a href="https://github.com/motdotla/dotenv" target="_blank" rel="noreferrer"><code>dotenv</code></a> and <a href="https://github.com/motdotla/dotenv-expand" target="_blank" rel="noreferrer"><code>dotenv-expand</code></a> to set environment variables.</p><p>Each <code>application</code> / <code>package</code> loads <code>.env</code> file in respective directory. There is an example file (<code>.env-template</code>) in each relevant directory, which can be used as template.</p><p>Copy the <code>.env-template</code> file and modify the <code>.env</code> file as needed.</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cp</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> .env-template .env</span></span></code></pre></div>',5),s=[i];function c(d,r,l,p,h,m){return a(),t("div",null,s)}const u=e(n,[["render",c]]);export{f as __pageData,u as default};
