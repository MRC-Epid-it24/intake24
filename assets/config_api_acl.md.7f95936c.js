import{_ as e,o as a,c as o,Q as i}from"./chunks/framework.b40c9ff3.js";const m=JSON.parse('{"title":"Access control list (ACL)","description":"","frontmatter":{},"headers":[],"relativePath":"config/api/acl.md","filePath":"config/api/acl.md"}'),l={name:"config/api/acl.md"},c=i('<h1 id="access-control-list-acl" tabindex="-1">Access control list (ACL) <a class="header-anchor" href="#access-control-list-acl" aria-label="Permalink to &quot;Access control list (ACL)&quot;">​</a></h1><p>Path: <code>apps/api/src/config/acl.ts</code></p><h2 id="cache" tabindex="-1">Cache <a class="header-anchor" href="#cache" aria-label="Permalink to &quot;Cache&quot;">​</a></h2><p>Controls the permissions / roles caching</p><ul><li>object-path: <code>cache</code></li></ul><h3 id="enabled" tabindex="-1">Enabled <a class="header-anchor" href="#enabled" aria-label="Permalink to &quot;Enabled&quot;">​</a></h3><p>Enables / disables caching for permissions / roles.</p><ul><li>object-path: <code>cache.enabled</code></li><li>dotenv var: <code>ACL_CACHE_ENABLED</code></li><li>type: <code>boolean</code></li><li>default: <code>false</code></li></ul><h3 id="expires-in" tabindex="-1">Expires in <a class="header-anchor" href="#expires-in" aria-label="Permalink to &quot;Expires in&quot;">​</a></h3><p>Sets time the cache data expires at. Defined as <code>ms-formatted</code> string (see <a href="https://github.com/vercel/ms" target="_blank" rel="noreferrer">ms</a> for more information) or number in seconds.</p><ul><li>object-path: <code>cache.expiresIn</code></li><li>dotenv var: <code>ACL_CACHE_EXPIRES_IN</code></li><li>type: <code>number | string</code></li><li>default: <code>&#39;7d&#39;</code></li></ul><h2 id="roles" tabindex="-1">Roles <a class="header-anchor" href="#roles" aria-label="Permalink to &quot;Roles&quot;">​</a></h2><p>List of special-purpose roles.</p><ul><li>object-path: <code>roles</code></li></ul><h3 id="superuser" tabindex="-1">Superuser <a class="header-anchor" href="#superuser" aria-label="Permalink to &quot;Superuser&quot;">​</a></h3><p>Any newly created permission will be associated with this role.</p><ul><li>object-path: <code>roles.superuser</code></li><li>type: <code>string</code></li><li>default: <code>&#39;superuser&#39;</code></li></ul><h2 id="sign-up" tabindex="-1">Sign-up <a class="header-anchor" href="#sign-up" aria-label="Permalink to &quot;Sign-up&quot;">​</a></h2><p>Admin tool sign-up settings.</p><ul><li>object-path: <code>signup</code></li></ul><h3 id="enabled-1" tabindex="-1">Enabled <a class="header-anchor" href="#enabled-1" aria-label="Permalink to &quot;Enabled&quot;">​</a></h3><p>Enables / disables user sign-up (account creation) for Admin Tool.</p><ul><li>object-path: <code>signup.enabled</code></li><li>dotenv var: <code>ACL_SIGNUP_ENABLED</code></li><li>type: <code>boolean</code></li><li>default: <code>true</code></li></ul><h3 id="permissions" tabindex="-1">Permissions <a class="header-anchor" href="#permissions" aria-label="Permalink to &quot;Permissions&quot;">​</a></h3><p>List of permission names, that new account should be assigned with.</p><ul><li>object-path: <code>signup.permissions</code></li><li>dotenv var: <code>ACL_SIGNUP_PERMISSIONS</code> (<code>comma-delimited</code> string)</li><li>type: <code>string[]</code></li><li>default: <code>[]</code></li></ul><h3 id="roles-1" tabindex="-1">Roles <a class="header-anchor" href="#roles-1" aria-label="Permalink to &quot;Roles&quot;">​</a></h3><p>List of role names, that new account should be assigned with.</p><ul><li>object-path: <code>signup.roles</code></li><li>dotenv var: <code>ACL_SIGNUP_ROLES</code> (<code>comma-delimited</code> string)</li><li>type: <code>string[]</code></li><li>default: <code>[]</code></li></ul>',29),s=[c];function t(r,d,n,h,p,u){return a(),o("div",null,s)}const f=e(l,[["render",t]]);export{m as __pageData,f as default};