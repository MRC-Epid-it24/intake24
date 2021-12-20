(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{441:function(s,a,t){"use strict";t.r(a);var e=t(31),r=Object(e.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"roles"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#roles"}},[s._v("#")]),s._v(" Roles")]),s._v(" "),t("h2",{attrs:{id:"browse-roles"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#browse-roles"}},[s._v("#")]),s._v(" Browse roles")]),s._v(" "),t("p",[s._v("Browse paginated role list")]),s._v(" "),t("h3",{attrs:{id:"request"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#request"}},[s._v("#")]),s._v(" Request")]),s._v(" "),t("div",{staticClass:"language-http extra-class"},[t("pre",{pre:!0,attrs:{class:"language-http"}},[t("code",[s._v("GET /api/admin/roles\n    ?search={searchText}\n    &page={page}\n    &limit={limit}\n\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json\n")])])]),t("h3",{attrs:{id:"response"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#response"}},[s._v("#")]),s._v(" Response")]),s._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    ...\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),t("h2",{attrs:{id:"create-role"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#create-role"}},[s._v("#")]),s._v(" Create role")]),s._v(" "),t("p",[s._v("Create new role entry")]),s._v(" "),t("h3",{attrs:{id:"request-2"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#request-2"}},[s._v("#")]),s._v(" Request")]),s._v(" "),t("div",{staticClass:"language-http extra-class"},[t("pre",{pre:!0,attrs:{class:"language-http"}},[t("code",[s._v("POST /api/admin/roles\n\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json"),t("span",{pre:!0,attrs:{class:"token application-json"}},[s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"name"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"displayName"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"description"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"permissions"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" number"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])])]),t("h3",{attrs:{id:"response-2"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#response-2"}},[s._v("#")]),s._v(" Response")]),s._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token number"}},[s._v("201")]),s._v(" Created\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    ...\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),t("h2",{attrs:{id:"get-role"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#get-role"}},[s._v("#")]),s._v(" Get role")]),s._v(" "),t("p",[s._v("Get role entry")]),s._v(" "),t("h3",{attrs:{id:"request-3"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#request-3"}},[s._v("#")]),s._v(" Request")]),s._v(" "),t("div",{staticClass:"language-http extra-class"},[t("pre",{pre:!0,attrs:{class:"language-http"}},[t("code",[s._v("GET /api/admin/roles/:roleId\n\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json\n")])])]),t("h3",{attrs:{id:"response-3"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#response-3"}},[s._v("#")]),s._v(" Response")]),s._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    ...\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),t("h2",{attrs:{id:"update-role"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#update-role"}},[s._v("#")]),s._v(" Update role")]),s._v(" "),t("p",[s._v("Update role entry")]),s._v(" "),t("h3",{attrs:{id:"request-4"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#request-4"}},[s._v("#")]),s._v(" Request")]),s._v(" "),t("div",{staticClass:"language-http extra-class"},[t("pre",{pre:!0,attrs:{class:"language-http"}},[t("code",[s._v("PUT /api/admin/roles/:roleId\n\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json"),t("span",{pre:!0,attrs:{class:"token application-json"}},[s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"name"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"displayName"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"description"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"permissions"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" number"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])])]),t("h3",{attrs:{id:"response-4"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#response-4"}},[s._v("#")]),s._v(" Response")]),s._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    ...\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),t("h2",{attrs:{id:"delete-role"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#delete-role"}},[s._v("#")]),s._v(" Delete role")]),s._v(" "),t("p",[s._v("Delete role entry")]),s._v(" "),t("h3",{attrs:{id:"request-5"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#request-5"}},[s._v("#")]),s._v(" Request")]),s._v(" "),t("div",{staticClass:"language-http extra-class"},[t("pre",{pre:!0,attrs:{class:"language-http"}},[t("code",[s._v("DELETE /api/admin/roles/:roleId\n\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json\n")])])]),t("h3",{attrs:{id:"response-5"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#response-5"}},[s._v("#")]),s._v(" Response")]),s._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token number"}},[s._v("204")]),s._v(" No Content\n")])])]),t("h2",{attrs:{id:"role-references"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#role-references"}},[s._v("#")]),s._v(" Role references")]),s._v(" "),t("p",[s._v("Get role references")]),s._v(" "),t("h3",{attrs:{id:"request-6"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#request-6"}},[s._v("#")]),s._v(" Request")]),s._v(" "),t("div",{staticClass:"language-http extra-class"},[t("pre",{pre:!0,attrs:{class:"language-http"}},[t("code",[s._v("GET /api/admin/roles/refs\n\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json\n")])])]),t("h3",{attrs:{id:"response-6"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#response-6"}},[s._v("#")]),s._v(" Response")]),s._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"permissions"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"id"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"name"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"displayName"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string\n        "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n        ...\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])])])}),[],!1,null,null,null);a.default=r.exports}}]);