(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{444:function(s,a,t){"use strict";t.r(a);var e=t(31),r=Object(e.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"survey-management"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#survey-management"}},[s._v("#")]),s._v(" Survey management")]),s._v(" "),t("p",[s._v("Survey management works with following permissions.")]),s._v(" "),t("h3",{attrs:{id:"survey-resource-permissions"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#survey-resource-permissions"}},[s._v("#")]),s._v(" Survey resource permissions:")]),s._v(" "),t("ul",[t("li",[t("code",[s._v("surveys-browse")]),s._v(" - allows to browse survey list")]),s._v(" "),t("li",[t("code",[s._v("surveys-create")]),s._v(" - allows to create survey record")]),s._v(" "),t("li",[t("code",[s._v("surveys-read")]),s._v(" - allows to read survey record")]),s._v(" "),t("li",[t("code",[s._v("surveys-edit")]),s._v(" - allows to edit the survey list")]),s._v(" "),t("li",[t("code",[s._v("surveys-delete")]),s._v(" - allows to browse the survey list")]),s._v(" "),t("li",[t("code",[s._v("surveys-overrides")]),s._v(" - allows to manage survey scheme overrides")]),s._v(" "),t("li",[t("code",[s._v("surveys-mgmt")]),s._v(" - allows to manage staff accounts")]),s._v(" "),t("li",[t("code",[s._v("surveys-respondents")]),s._v(" - allows to manage respondents accounts")]),s._v(" "),t("li",[t("code",[s._v("surveys-submissions")]),s._v(" - allows to read survey submissions")]),s._v(" "),t("li",[t("code",[s._v("surveys-data-export")]),s._v(" - allows to export survey submission data")])]),s._v(" "),t("h3",{attrs:{id:"two-specific-permissions"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#two-specific-permissions"}},[s._v("#")]),s._v(" Two specific permissions:")]),s._v(" "),t("ul",[t("li",[t("code",[s._v("{surveyId}/staff")]),s._v(" - gives access to particular study record")]),s._v(" "),t("li",[t("code",[s._v("{surveyId}/support")]),s._v(" - user will receive any help queries from survey respondents")])]),s._v(" "),t("h2",{attrs:{id:"browse-management-users"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#browse-management-users"}},[s._v("#")]),s._v(" Browse management users")]),s._v(" "),t("p",[s._v("Get list of survey management users having at least one of the above permission list.")]),s._v(" "),t("h3",{attrs:{id:"request"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#request"}},[s._v("#")]),s._v(" Request")]),s._v(" "),t("div",{staticClass:"language-http extra-class"},[t("pre",{pre:!0,attrs:{class:"language-http"}},[t("code",[s._v("GET /api/admin/surveys/:surveyId/mgmt\n    ?search={searchText}\n    &page={page}\n    &limit={limit}\n\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json\n")])])]),t("h3",{attrs:{id:"response"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#response"}},[s._v("#")]),s._v(" Response")]),s._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"data"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"id"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"name"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"email"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"permissions"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n                    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"id"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n                    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"name"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n                    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"displayName"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"meta"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("..."),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),t("h2",{attrs:{id:"available-management-permissions"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#available-management-permissions"}},[s._v("#")]),s._v(" Available management permissions")]),s._v(" "),t("p",[s._v("Get list of permissions, which can be assigned to survey management users.")]),s._v(" "),t("h3",{attrs:{id:"request-2"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#request-2"}},[s._v("#")]),s._v(" Request")]),s._v(" "),t("div",{staticClass:"language-http extra-class"},[t("pre",{pre:!0,attrs:{class:"language-http"}},[t("code",[s._v("GET /api/admin/surveys/:surveyId/mgmt/permissions\n\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json\n")])])]),t("h3",{attrs:{id:"response-2"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#response-2"}},[s._v("#")]),s._v(" Response")]),s._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"id"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"name"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"displayName"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n")])])]),t("h2",{attrs:{id:"available-management-users"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#available-management-users"}},[s._v("#")]),s._v(" Available management users")]),s._v(" "),t("p",[s._v("Get list of users with system active account and no permission from above permission list.")]),s._v(" "),t("h3",{attrs:{id:"request-3"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#request-3"}},[s._v("#")]),s._v(" Request")]),s._v(" "),t("div",{staticClass:"language-http extra-class"},[t("pre",{pre:!0,attrs:{class:"language-http"}},[t("code",[s._v("GET /api/admin/surveys/:surveyId/mgmt/users?search={searchText}\n\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json\n")])])]),t("h3",{attrs:{id:"response-3"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#response-3"}},[s._v("#")]),s._v(" Response")]),s._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"id"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"name"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"email"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n")])])]),t("h2",{attrs:{id:"create-management-user"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#create-management-user"}},[s._v("#")]),s._v(" Create management user")]),s._v(" "),t("p",[s._v("Assign list of survey management roles to specified user")]),s._v(" "),t("ul",[t("li",[t("code",[s._v("{surveyId}/staff")])]),s._v(" "),t("li",[t("code",[s._v("{surveyId}/support")])])]),s._v(" "),t("h3",{attrs:{id:"request-4"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#request-4"}},[s._v("#")]),s._v(" Request")]),s._v(" "),t("div",{staticClass:"language-http extra-class"},[t("pre",{pre:!0,attrs:{class:"language-http"}},[t("code",[s._v("POST /api/admin/surveys/:surveyId/mgmt\n\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json"),t("span",{pre:!0,attrs:{class:"token application-json"}},[s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"email"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"name"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string | undefined"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"phone"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string | undefined"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"permissions"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])])]),t("h3",{attrs:{id:"response-4"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#response-4"}},[s._v("#")]),s._v(" Response")]),s._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token number"}},[s._v("201")]),s._v(" OK\n")])])]),t("h2",{attrs:{id:"update-management-user"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#update-management-user"}},[s._v("#")]),s._v(" Update management user")]),s._v(" "),t("p",[s._v("Assign list of survey management permissions to specified user")]),s._v(" "),t("h3",{attrs:{id:"request-5"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#request-5"}},[s._v("#")]),s._v(" Request")]),s._v(" "),t("div",{staticClass:"language-http extra-class"},[t("pre",{pre:!0,attrs:{class:"language-http"}},[t("code",[s._v("PATCH /api/admin/surveys/:surveyId/mgmt/:userId\n\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),t("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json"),t("span",{pre:!0,attrs:{class:"token application-json"}},[s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"permissions"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])])]),t("h3",{attrs:{id:"response-5"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#response-5"}},[s._v("#")]),s._v(" Response")]),s._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n")])])])])}),[],!1,null,null,null);a.default=r.exports}}]);