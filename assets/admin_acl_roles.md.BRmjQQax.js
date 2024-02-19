import{_ as e,c as o,o as a,a4 as t}from"./chunks/framework.D2Q_DY5z.js";const f=JSON.parse('{"title":"Roles","description":"","frontmatter":{},"headers":[],"relativePath":"admin/acl/roles.md","filePath":"admin/acl/roles.md"}'),i={name:"admin/acl/roles.md"},s=t('<h1 id="roles" tabindex="-1">Roles <a class="header-anchor" href="#roles" aria-label="Permalink to &quot;Roles&quot;">​</a></h1><p>Roles resource allows to define groups, that can be associated with <code>permission</code> and <code>user</code> records. This allows to create a role with common permissions to be assigned to specific set of users without the needs to attach permissions directly to each user.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Intake24 treats one specific role as <code>superuser</code> (name can be adjusted in <a href="/config/api/acl.html">ACL Config</a>). Whenever new permission is created, it is assigned automatically to this role.</p></div><h2 id="detail" tabindex="-1">Detail <a class="header-anchor" href="#detail" aria-label="Permalink to &quot;Detail&quot;">​</a></h2><p>Detail tab displays selected role info.</p><h2 id="create-edit" tabindex="-1">Create / Edit <a class="header-anchor" href="#create-edit" aria-label="Permalink to &quot;Create / Edit&quot;">​</a></h2><p>Edit tab allows to modify selected role with permissions assignment.</p><ul><li><p><code>Name</code> - Unique permission name within <code>permission</code> records</p></li><li><p><code>Display name</code> - User friendly role name</p></li><li><p><code>Description</code> - Free text, any role specific details</p></li></ul><h2 id="deletion" tabindex="-1">Deletion <a class="header-anchor" href="#deletion" aria-label="Permalink to &quot;Deletion&quot;">​</a></h2><p>Deletion will also wipe <code>permission</code> and <code>user</code> related pivot table records.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>Do not delete <code>superuser</code> defined in <a href="/config/api/acl.html">ACL Config</a> or you could loose access to the parts of the system.</p></div>',11),l=[s];function r(c,d,n,p,h,m){return a(),o("div",null,l)}const _=e(i,[["render",r]]);export{f as __pageData,_ as default};
