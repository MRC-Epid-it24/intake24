import{_ as e,c as s,o as i,R as a}from"./chunks/framework.bdd825cc.js";const _=JSON.parse('{"title":"Permissions","description":"","frontmatter":{},"headers":[],"relativePath":"admin/acl/permissions.md","filePath":"admin/acl/permissions.md"}'),t={name:"admin/acl/permissions.md"},o=a('<h1 id="permissions" tabindex="-1">Permissions <a class="header-anchor" href="#permissions" aria-label="Permalink to &quot;Permissions&quot;">​</a></h1><p>Permissions resource defines system-level implemented access control.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>Usually, there is no need to create / edit / delete permissions as they are distributed as database migrations to ensure system functionality.</p></div><h2 id="detail" tabindex="-1">Detail <a class="header-anchor" href="#detail" aria-label="Permalink to &quot;Detail&quot;">​</a></h2><p>Detail tab displays selected permission info.</p><h2 id="create-edit" tabindex="-1">Create / Edit <a class="header-anchor" href="#create-edit" aria-label="Permalink to &quot;Create / Edit&quot;">​</a></h2><p>Edit tab allows to modify selected permission.</p><ul><li><p><code>Name</code> - Unique <code>slug-based</code> permission name within <code>permission</code> records</p></li><li><p><code>Display name</code> - User friendly permission name</p></li><li><p><code>Description</code> - Free text, any permission specific details</p></li></ul><h2 id="deletion" tabindex="-1">Deletion <a class="header-anchor" href="#deletion" aria-label="Permalink to &quot;Deletion&quot;">​</a></h2><p><code>System-level</code> defined permission can prevent normal functionality, loosing access to various parts of the system. So should be treated as such. Deletion will also wipe <code>role</code> and <code>user</code> related pivot table records.</p>',10),r=[o];function n(l,d,c,p,m,h){return i(),s("div",null,r)}const f=e(t,[["render",n]]);export{_ as __pageData,f as default};
