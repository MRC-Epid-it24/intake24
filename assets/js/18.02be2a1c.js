(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{400:function(a,t,s){"use strict";s.r(t);var e=s(26),n=Object(e.a)({},(function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[s("h1",{attrs:{id:"guide-image"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#guide-image"}},[a._v("#")]),a._v(" Guide image")]),a._v(" "),s("h2",{attrs:{id:"browse-guide-images"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#browse-guide-images"}},[a._v("#")]),a._v(" Browse guide images")]),a._v(" "),s("p",[a._v("Browse paginated guide image list")]),a._v(" "),s("h3",{attrs:{id:"request"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#request"}},[a._v("#")]),a._v(" Request")]),a._v(" "),s("div",{staticClass:"language-http extra-class"},[s("pre",{pre:!0,attrs:{class:"language-http"}},[s("code",[a._v("GET /api/admin/images/guides\n    ?search={searchText}\n    &page={page}\n    &limit={limit}\n\n"),s("span",{pre:!0,attrs:{class:"token header-name keyword"}},[a._v("Authorization:")]),a._v(" Bearer {accessToken}\n"),s("span",{pre:!0,attrs:{class:"token header-name keyword"}},[a._v("Content-Type:")]),a._v(" application/json\n")])])]),s("h3",{attrs:{id:"response"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#response"}},[a._v("#")]),a._v(" Response")]),a._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token number"}},[a._v("200")]),a._v(" OK\n\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[a._v('"data"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("..."),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[a._v('"meta"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("..."),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])])]),s("h2",{attrs:{id:"create-guide-image"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#create-guide-image"}},[a._v("#")]),a._v(" Create guide image")]),a._v(" "),s("p",[a._v("Create new guide image entry")]),a._v(" "),s("h3",{attrs:{id:"request-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#request-2"}},[a._v("#")]),a._v(" Request")]),a._v(" "),s("div",{staticClass:"language-http extra-class"},[s("pre",{pre:!0,attrs:{class:"language-http"}},[s("code",[a._v("POST /api/admin/images/guides\n\n"),s("span",{pre:!0,attrs:{class:"token header-name keyword"}},[a._v("Authorization:")]),a._v(" Bearer {accessToken}\n"),s("span",{pre:!0,attrs:{class:"token header-name keyword"}},[a._v("Content-Type:")]),a._v(" application/json"),s("span",{pre:!0,attrs:{class:"token application-json"}},[a._v("\n\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[a._v('"id"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" string"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[a._v('"imageMapId"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" string"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[a._v('"description"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" string\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])])])]),s("h3",{attrs:{id:"response-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#response-2"}},[a._v("#")]),a._v(" Response")]),a._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token number"}},[a._v("201")]),a._v(" Created\n\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[a._v('"data"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("..."),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])])]),s("h2",{attrs:{id:"get-guide-image"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#get-guide-image"}},[a._v("#")]),a._v(" Get guide image")]),a._v(" "),s("p",[a._v("Get guide image entry")]),a._v(" "),s("h3",{attrs:{id:"request-3"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#request-3"}},[a._v("#")]),a._v(" Request")]),a._v(" "),s("div",{staticClass:"language-http extra-class"},[s("pre",{pre:!0,attrs:{class:"language-http"}},[s("code",[a._v("GET /api/admin/images/guides/:guideImageId\n\n"),s("span",{pre:!0,attrs:{class:"token header-name keyword"}},[a._v("Authorization:")]),a._v(" Bearer {accessToken}\n"),s("span",{pre:!0,attrs:{class:"token header-name keyword"}},[a._v("Content-Type:")]),a._v(" application/json\n")])])]),s("h3",{attrs:{id:"response-3"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#response-3"}},[a._v("#")]),a._v(" Response")]),a._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token number"}},[a._v("200")]),a._v(" OK\n\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[a._v('"data"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("..."),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[a._v('"refs"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("..."),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])])]),s("h2",{attrs:{id:"update-guide-image"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#update-guide-image"}},[a._v("#")]),a._v(" Update guide image")]),a._v(" "),s("p",[a._v("Update guide image entry")]),a._v(" "),s("h3",{attrs:{id:"request-4"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#request-4"}},[a._v("#")]),a._v(" Request")]),a._v(" "),s("div",{staticClass:"language-http extra-class"},[s("pre",{pre:!0,attrs:{class:"language-http"}},[s("code",[a._v("PUT /api/admin/images/guides/:guideImageId\n\n"),s("span",{pre:!0,attrs:{class:"token header-name keyword"}},[a._v("Authorization:")]),a._v(" Bearer {accessToken}\n"),s("span",{pre:!0,attrs:{class:"token header-name keyword"}},[a._v("Content-Type:")]),a._v(" application/json"),s("span",{pre:!0,attrs:{class:"token application-json"}},[a._v("\n\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[a._v('"description"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" string"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[a._v('"objects"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),a._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n            "),s("span",{pre:!0,attrs:{class:"token property"}},[a._v('"id"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" number"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n            "),s("span",{pre:!0,attrs:{class:"token property"}},[a._v('"weight"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" number\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n        ...\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])])])]),s("h3",{attrs:{id:"response-4"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#response-4"}},[a._v("#")]),a._v(" Response")]),a._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token number"}},[a._v("200")]),a._v(" OK\n\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[a._v('"data"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("..."),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[a._v('"refs"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("..."),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])])]),s("h2",{attrs:{id:"delete-guide-image"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#delete-guide-image"}},[a._v("#")]),a._v(" Delete guide image")]),a._v(" "),s("p",[a._v("Delete guide image entry")]),a._v(" "),s("h3",{attrs:{id:"request-5"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#request-5"}},[a._v("#")]),a._v(" Request")]),a._v(" "),s("div",{staticClass:"language-http extra-class"},[s("pre",{pre:!0,attrs:{class:"language-http"}},[s("code",[a._v("DELETE /api/admin/images/guides/:guideImageId\n\n"),s("span",{pre:!0,attrs:{class:"token header-name keyword"}},[a._v("Authorization:")]),a._v(" Bearer {accessToken}\n"),s("span",{pre:!0,attrs:{class:"token header-name keyword"}},[a._v("Content-Type:")]),a._v(" application/json\n")])])]),s("h3",{attrs:{id:"response-5"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#response-5"}},[a._v("#")]),a._v(" Response")]),a._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token number"}},[a._v("204")]),a._v(" No Content\n")])])])])}),[],!1,null,null,null);t.default=n.exports}}]);