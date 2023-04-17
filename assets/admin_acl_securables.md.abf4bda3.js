import{_ as e,c as r,o as t,V as o}from"./chunks/framework.223e0ded.js";const m=JSON.parse('{"title":"Securables","description":"","frontmatter":{},"headers":[],"relativePath":"admin/acl/securables.md"}'),c={name:"admin/acl/securables.md"},s=o('<h1 id="securables" tabindex="-1">Securables <a class="header-anchor" href="#securables" aria-label="Permalink to &quot;Securables&quot;">​</a></h1><p>Following resources / record types implement <code>securable</code> per-record access.</p><ul><li><code>Feedback scheme</code></li><li><code>Survey scheme</code></li><li><code>Surveys</code></li></ul><p>Securable permissions can be granted / revoked for any specific record in <code>Security</code> tab of the record.</p><p><code>Security</code> tab allows to control:</p><ul><li><a href="#securable-permissions">Securable permissions</a></li><li><a href="#record-ownership">Record ownership</a></li></ul><h2 id="securable-permissions" tabindex="-1">Securable permissions <a class="header-anchor" href="#securable-permissions" aria-label="Permalink to &quot;Securable permissions&quot;">​</a></h2><table><thead><tr><th>Permission</th><th>Description</th></tr></thead><tbody><tr><td>browse</td><td>Browse / list record</td></tr><tr><td>read</td><td>Read record details</td></tr><tr><td>edit</td><td>Edit record</td></tr><tr><td>delete</td><td>Delete record</td></tr><tr><td>securables</td><td>Control <code>securable</code> permissions</td></tr><tr><td>[action]</td><td>Specific record action</td></tr></tbody></table><h2 id="record-ownership" tabindex="-1">Record ownership <a class="header-anchor" href="#record-ownership" aria-label="Permalink to &quot;Record ownership&quot;">​</a></h2><p><code>Security</code> also allows to manage ownership of the record. Ownership can be added / modified / removed.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>If user <code>creates new record</code> or <code>copies existing record</code>, user automatically becomes the owner of the record.</p><p>Owner of the record has full access to the record, without the need to grant additional permissions from above table.</p></div>',11),a=[s];function d(i,l,n,p,h,u){return t(),r("div",null,a)}const _=e(c,[["render",d]]);export{m as __pageData,_ as default};
