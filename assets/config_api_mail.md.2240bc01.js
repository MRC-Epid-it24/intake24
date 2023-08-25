import{_ as e,o as a,c as o,S as l}from"./chunks/framework.73d05564.js";const f=JSON.parse('{"title":"Mail","description":"","frontmatter":{},"headers":[],"relativePath":"config/api/mail.md","filePath":"config/api/mail.md"}'),i={name:"config/api/mail.md"},t=l('<h1 id="mail" tabindex="-1">Mail <a class="header-anchor" href="#mail" aria-label="Permalink to &quot;Mail&quot;">​</a></h1><p>Path: <code>packages/common-backend/src/services/mailer/config.ts</code></p><p>Mail implementation supports following transports:</p><ul><li><code>SMTP</code> - SMTP protocol</li><li><code>Log</code> - logs messages to <code>stdout</code> (for debugging purposes)</li></ul><p>Implementation is using <a href="https://nodemailer.com" target="_blank" rel="noreferrer">nodemailer</a>.</p><h2 id="mailer" tabindex="-1">Mailer <a class="header-anchor" href="#mailer" aria-label="Permalink to &quot;Mailer&quot;">​</a></h2><p>Selected mailer transport</p><ul><li>object-path: <code>mailer</code></li><li>dotenv var: <code>MAIL_MAILER</code></li><li>type: <code>&#39;smtp&#39; | &#39;log&#39;</code></li><li>default: <code>&#39;log&#39;</code></li></ul><h2 id="smtp-transport" tabindex="-1">SMTP transport <a class="header-anchor" href="#smtp-transport" aria-label="Permalink to &quot;SMTP transport&quot;">​</a></h2><h3 id="host" tabindex="-1">Host <a class="header-anchor" href="#host" aria-label="Permalink to &quot;Host&quot;">​</a></h3><ul><li>object-path: <code>mailers.smtp.host</code></li><li>dotenv var: <code>MAIL_HOST</code></li><li>type: <code>string</code></li><li>default: <code>&#39;localhost&#39;</code></li></ul><h3 id="port" tabindex="-1">Port <a class="header-anchor" href="#port" aria-label="Permalink to &quot;Port&quot;">​</a></h3><ul><li>object-path: <code>mailers.smtp.port</code></li><li>dotenv var: <code>MAIL_PORT</code></li><li>type: <code>number</code></li><li>default: <code>25</code></li></ul><h3 id="secure" tabindex="-1">Secure <a class="header-anchor" href="#secure" aria-label="Permalink to &quot;Secure&quot;">​</a></h3><ul><li>object-path: <code>mailers.smtp.secure</code></li><li>dotenv var: <code>MAIL_SECURE</code></li><li>type: <code>boolean</code></li><li>default: <code>false</code></li></ul><h3 id="ignoretls" tabindex="-1">ignoreTLS <a class="header-anchor" href="#ignoretls" aria-label="Permalink to &quot;ignoreTLS&quot;">​</a></h3><ul><li>object-path: <code>mailers.smtp.ignoreTLS</code></li><li>dotenv var: <code>MAIL_IGNORE_TLS</code></li><li>type: <code>boolean</code></li><li>default: <code>false</code></li></ul><h3 id="authentication" tabindex="-1">Authentication <a class="header-anchor" href="#authentication" aria-label="Permalink to &quot;Authentication&quot;">​</a></h3><h4 id="username" tabindex="-1">Username <a class="header-anchor" href="#username" aria-label="Permalink to &quot;Username&quot;">​</a></h4><ul><li>object-path: <code>mailers.smtp.auth.username</code></li><li>dotenv var: <code>MAIL_USERNAME</code></li><li>type: <code>string | null</code></li><li>default: <code>null</code></li></ul><h4 id="password" tabindex="-1">Password <a class="header-anchor" href="#password" aria-label="Permalink to &quot;Password&quot;">​</a></h4><ul><li>object-path: <code>mailers.smtp.auth.pass</code></li><li>dotenv var: <code>MAIL_PASSWORD</code></li><li>type: <code>string | null</code></li><li>default: <code>null</code></li></ul><h2 id="from" tabindex="-1">From <a class="header-anchor" href="#from" aria-label="Permalink to &quot;From&quot;">​</a></h2><ul><li>object-path: <code>from</code></li></ul><h3 id="address" tabindex="-1">Address <a class="header-anchor" href="#address" aria-label="Permalink to &quot;Address&quot;">​</a></h3><ul><li>object-path: <code>from.address</code></li><li>dotenv var: <code>MAIL_FROM_ADDRESS</code></li><li>type: <code>string</code></li><li>default: <code>&#39;no-reply@domain.com&#39;</code></li></ul><h3 id="name" tabindex="-1">Name <a class="header-anchor" href="#name" aria-label="Permalink to &quot;Name&quot;">​</a></h3><ul><li>object-path: <code>from.name</code></li><li>dotenv var: <code>MAIL_FROM_NAME</code></li><li>type: <code>string</code></li><li>default: <code>$APP_NAME</code></li></ul><h2 id="reply-to" tabindex="-1">Reply-To <a class="header-anchor" href="#reply-to" aria-label="Permalink to &quot;Reply-To&quot;">​</a></h2><p>Email address displayed in email footer as a reply-to address. If reply-to address is not set, reply-to footer will not be included in the email.</p><ul><li>object-path: <code>replyTo</code></li><li>dotenv var: <code>MAIL_REPLY_TO_ADDRESS</code></li><li>type: <code>string</code></li><li>default: <code>undefined</code></li></ul>',31),d=[t];function r(c,s,n,h,u,p){return a(),o("div",null,d)}const b=e(i,[["render",r]]);export{f as __pageData,b as default};