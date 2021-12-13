(window.webpackJsonp=window.webpackJsonp||[]).push([[50],{463:function(e,s,t){"use strict";t.r(s);var o=t(31),r=Object(o.a)({},(function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"access-control-list-acl"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#access-control-list-acl"}},[e._v("#")]),e._v(" Access control list (ACL)")]),e._v(" "),t("p",[e._v("Path: "),t("code",[e._v("src/config/acl.ts")])]),e._v(" "),t("p",[e._v("Access control list ("),t("code",[e._v("ACL")]),e._v(") implementation is based on three models:")]),e._v(" "),t("ul",[t("li",[t("code",[e._v("user")])]),e._v(" "),t("li",[t("code",[e._v("role")])]),e._v(" "),t("li",[t("code",[e._v("permission")])])]),e._v(" "),t("p",[e._v("Relations between the models are defined as follows:")]),e._v(" "),t("ul",[t("li",[t("code",[e._v("many-to-many")]),e._v(" between "),t("code",[e._v("user")]),e._v(" and "),t("code",[e._v("role")])]),e._v(" "),t("li",[t("code",[e._v("many-to-many")]),e._v(" between "),t("code",[e._v("user")]),e._v(" and "),t("code",[e._v("permission")])]),e._v(" "),t("li",[t("code",[e._v("many-to-many")]),e._v(" between "),t("code",[e._v("role")]),e._v(" and "),t("code",[e._v("permission")])])]),e._v(" "),t("p",[e._v("This allows to grant permissions to users in two ways:")]),e._v(" "),t("ul",[t("li",[e._v("directly associate "),t("code",[e._v("permission")]),e._v(" with "),t("code",[e._v("user")])]),e._v(" "),t("li",[e._v("associate "),t("code",[e._v("permission")]),e._v(" with "),t("code",[e._v("user")]),e._v(" through "),t("code",[e._v("role")]),e._v(" (acting as grouping record for a set of permissions)")])]),e._v(" "),t("p",[e._v("Path: "),t("code",[e._v("src/config/acl.ts")])]),e._v(" "),t("h2",{attrs:{id:"cache"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#cache"}},[e._v("#")]),e._v(" Cache")]),e._v(" "),t("p",[e._v("Controls the permissions / roles caching")]),e._v(" "),t("h3",{attrs:{id:"enabled"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#enabled"}},[e._v("#")]),e._v(" Enabled")]),e._v(" "),t("p",[e._v("Enables / disables caching for permissions / roles.")]),e._v(" "),t("ul",[t("li",[e._v("object-path: "),t("code",[e._v("cache.enabled")])]),e._v(" "),t("li",[e._v("dotenv var: "),t("code",[e._v("ACL_CACHE_ENABLED")])]),e._v(" "),t("li",[e._v("type: "),t("code",[e._v("boolean")])]),e._v(" "),t("li",[e._v("default: "),t("code",[e._v("false")])])]),e._v(" "),t("h3",{attrs:{id:"expires-in"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#expires-in"}},[e._v("#")]),e._v(" Expires in")]),e._v(" "),t("p",[e._v("Sets time the cache data expires at. Defined as "),t("code",[e._v("ms-formatted")]),e._v(" string (see "),t("a",{attrs:{href:"https://github.com/vercel/ms",target:"_blank",rel:"noopener noreferrer"}},[e._v("ms"),t("OutboundLink")],1),e._v(" for more information) or number in seconds.")]),e._v(" "),t("ul",[t("li",[e._v("object-path: "),t("code",[e._v("cache.expiresIn")])]),e._v(" "),t("li",[e._v("dotenv var: "),t("code",[e._v("ACL_CACHE_EXPIRES_IN")])]),e._v(" "),t("li",[e._v("type: "),t("code",[e._v("number | string")])]),e._v(" "),t("li",[e._v("default: "),t("code",[e._v("'7d'")])])]),e._v(" "),t("h2",{attrs:{id:"roles"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#roles"}},[e._v("#")]),e._v(" Roles")]),e._v(" "),t("p",[e._v("List of special-purpose roles.")]),e._v(" "),t("ul",[t("li",[e._v("object-path: "),t("code",[e._v("roles")])])]),e._v(" "),t("h3",{attrs:{id:"superuser"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#superuser"}},[e._v("#")]),e._v(" Superuser")]),e._v(" "),t("p",[e._v("Any newly created permission will be associated with this role.")]),e._v(" "),t("ul",[t("li",[e._v("object-path: "),t("code",[e._v("roles.superuser")])]),e._v(" "),t("li",[e._v("type: "),t("code",[e._v("string")])]),e._v(" "),t("li",[e._v("default: "),t("code",[e._v("'superuser'")])])])])}),[],!1,null,null,null);s.default=r.exports}}]);