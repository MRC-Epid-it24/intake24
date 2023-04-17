import{_ as e,c as t,o as a,V as o}from"./chunks/framework.223e0ded.js";const v=JSON.parse('{"title":"Introduction","description":"","frontmatter":{},"headers":[],"relativePath":"config/index.md"}'),n={name:"config/index.md"},s=o('<h1 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-label="Permalink to &quot;Introduction&quot;">​</a></h1><p>All parts of the system are using environment variables. Environment specific configuration is parsed to <code>p<wbr>rocess.env</code> variables. All applications are using <a href="https://github.com/motdotla/dotenv" target="_blank" rel="noreferrer"><code>dotenv</code></a> and <a href="https://github.com/motdotla/dotenv-expand" target="_blank" rel="noreferrer"><code>dotenv-expand</code></a> to set environment variables.</p><p>Each <code>application</code> / <code>package</code> loads <code>.env</code> file in respective directory. There is an example file (<code>.env-template</code>) in each relevant directory, which can be used as template.</p><p>Copy the <code>.env-template</code> file and modify the <code>.env</code> file as needed.</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">cp</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">.env-template</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">.env</span></span></code></pre></div>',5),c=[s];function r(i,d,l,p,h,_){return a(),t("div",null,c)}const f=e(n,[["render",r]]);export{v as __pageData,f as default};
