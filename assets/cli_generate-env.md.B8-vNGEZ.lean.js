import{_ as a,c as s,a2 as i,o as t}from"./chunks/framework.DneEosfm.js";const g=JSON.parse('{"title":"Generate .env files","description":"","frontmatter":{},"headers":[],"relativePath":"cli/generate-env.md","filePath":"cli/generate-env.md"}'),n={name:"cli/generate-env.md"};function o(l,e,p,c,d,r){return t(),s("div",null,e[0]||(e[0]=[i('<h1 id="generate-env-files" tabindex="-1">Generate .env files <a class="header-anchor" href="#generate-env-files" aria-label="Permalink to &quot;Generate .env files&quot;">​</a></h1><p>This command allows to quickly generate <code>.env</code> files for each application (<code>api</code>, <code>admin</code> and <code>survey</code>) when setting up the application for the first time.</p><p>It copies <code>.env-templates</code> to <code>.env</code> and generates couple of application secrets + VAPID keys.</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> cli</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> generate-env</span></span></code></pre></div><p>If files already exist, command will stop. To override the existing files, run the command with <code>-f</code> or <code>--force</code> option.</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> cli</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> generate-env</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --force</span></span></code></pre></div>',6)]))}const k=a(n,[["render",o]]);export{g as __pageData,k as default};
