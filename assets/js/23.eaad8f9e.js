(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{406:function(s,t,a){"use strict";a.r(t);var e=a(25),r=Object(e.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"surveys"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#surveys"}},[s._v("#")]),s._v(" Surveys")]),s._v(" "),a("h2",{attrs:{id:"list-surveys"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#list-surveys"}},[s._v("#")]),s._v(" List surveys")]),s._v(" "),a("p",[s._v("Browse paginated survey list")]),s._v(" "),a("h3",{attrs:{id:"request"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#request"}},[s._v("#")]),s._v(" Request")]),s._v(" "),a("div",{staticClass:"language-http extra-class"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[s._v("GET /api/admin/surveys\n    ?search={searchText}\n    &page={page}\n    &limit={limit}\n\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json\n")])])]),a("h3",{attrs:{id:"response"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#response"}},[s._v("#")]),s._v(" Response")]),s._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"data"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("..."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"meta"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("..."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),a("h2",{attrs:{id:"create-survey"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#create-survey"}},[s._v("#")]),s._v(" Create survey")]),s._v(" "),a("p",[s._v("Create new survey entry")]),s._v(" "),a("h3",{attrs:{id:"request-2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#request-2"}},[s._v("#")]),s._v(" Request")]),s._v(" "),a("div",{staticClass:"language-http extra-class"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[s._v("POST /api/admin/surveys\n\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json"),a("span",{pre:!0,attrs:{class:"token application-json"}},[s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"id"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"state"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" | "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" | "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"startDate"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" Date"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"endDate"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" Date"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"schemeId"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"locale"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"allowGenUsers"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" boolean"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"suspensionReason"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"surveyMonkeyUrl"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"supportEmail"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"originatingUrl"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"description"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"feedbackEnabled"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" boolean"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"feedbackStyle"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"submissionNotificationUrl"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"storeUserSessionOnServer"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" boolean"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"numberOfSubmissionsForFeedback"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" number"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"finalPageHtml"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])])]),a("h3",{attrs:{id:"response-2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#response-2"}},[s._v("#")]),s._v(" Response")]),s._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token number"}},[s._v("201")]),s._v(" Created\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"data"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("..."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),a("h2",{attrs:{id:"get-survey"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#get-survey"}},[s._v("#")]),s._v(" Get survey")]),s._v(" "),a("p",[s._v("Get survey entry")]),s._v(" "),a("h3",{attrs:{id:"request-url"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#request-url"}},[s._v("#")]),s._v(" Request url")]),s._v(" "),a("div",{staticClass:"language-http extra-class"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[s._v("GET /api/admin/surveys/:surveyId\n\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json\n")])])]),a("h3",{attrs:{id:"response-3"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#response-3"}},[s._v("#")]),s._v(" Response")]),s._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"data"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("..."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"refs"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("..."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),a("h2",{attrs:{id:"update-survey"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#update-survey"}},[s._v("#")]),s._v(" Update survey")]),s._v(" "),a("p",[s._v("Update survey entry")]),s._v(" "),a("h3",{attrs:{id:"request-url-2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#request-url-2"}},[s._v("#")]),s._v(" Request url")]),s._v(" "),a("div",{staticClass:"language-http extra-class"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[s._v("PUT /api/admin/surveys/:surveyId\n\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json"),a("span",{pre:!0,attrs:{class:"token application-json"}},[s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"state"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" | "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" | "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"startDate"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" Date"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"endDate"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" Date"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"schemeId"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"locale"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"allowGenUsers"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" boolean"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"suspensionReason"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"surveyMonkeyUrl"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"supportEmail"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"originatingUrl"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"description"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"feedbackEnabled"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" boolean"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"feedbackStyle"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"submissionNotificationUrl"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"storeUserSessionOnServer"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" boolean"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"numberOfSubmissionsForFeedback"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" number"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"finalPageHtml"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])])]),a("h3",{attrs:{id:"response-4"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#response-4"}},[s._v("#")]),s._v(" Response")]),s._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"data"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("..."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"refs"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("..."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),a("h2",{attrs:{id:"delete-survey"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#delete-survey"}},[s._v("#")]),s._v(" Delete survey")]),s._v(" "),a("p",[s._v("Delete survey entry")]),s._v(" "),a("h3",{attrs:{id:"request-3"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#request-3"}},[s._v("#")]),s._v(" Request")]),s._v(" "),a("div",{staticClass:"language-http extra-class"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[s._v("DELETE /api/admin/surveys/:surveyId\n\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json\n")])])]),a("h3",{attrs:{id:"response-5"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#response-5"}},[s._v("#")]),s._v(" Response")]),s._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token number"}},[s._v("204")]),s._v(" No Content\n")])])]),a("h2",{attrs:{id:"list-management-users"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#list-management-users"}},[s._v("#")]),s._v(" List management users")]),s._v(" "),a("p",[s._v("Get list of survey management users.")]),s._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("List content")]),s._v(" "),a("p",[s._v("List includes users with "),a("code",[s._v("{surveyId}/staff")]),s._v(" and "),a("code",[s._v("{surveyId}/support")]),s._v(" roles.")])]),s._v(" "),a("h3",{attrs:{id:"request-4"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#request-4"}},[s._v("#")]),s._v(" Request")]),s._v(" "),a("div",{staticClass:"language-http extra-class"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[s._v("GET /api/admin/surveys/:surveyId/mgmt\n    ?search={searchText}\n    &page={page}\n    &limit={limit}\n\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json\n")])])]),a("h3",{attrs:{id:"response-6"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#response-6"}},[s._v("#")]),s._v(" Response")]),s._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"data"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("..."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"meta"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("..."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),a("h2",{attrs:{id:"list-available-management-users"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#list-available-management-users"}},[s._v("#")]),s._v(" List available management users")]),s._v(" "),a("p",[s._v("Get list of users, which can be assigned as survey management.")]),s._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("List content")]),s._v(" "),a("p",[s._v("List includes users with "),a("code",[s._v("system account")]),s._v(" and no "),a("code",[s._v("{surveyId}/staff")]),s._v(" or "),a("code",[s._v("{surveyId}/support")]),s._v(" role.")])]),s._v(" "),a("h3",{attrs:{id:"request-5"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#request-5"}},[s._v("#")]),s._v(" Request")]),s._v(" "),a("div",{staticClass:"language-http extra-class"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[s._v("GET /api/admin/surveys/:surveyId/mgmt/available\n\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json\n")])])]),a("h3",{attrs:{id:"response-7"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#response-7"}},[s._v("#")]),s._v(" Response")]),s._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"data"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("..."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),a("h2",{attrs:{id:"update-management-user"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#update-management-user"}},[s._v("#")]),s._v(" Update management user")]),s._v(" "),a("p",[s._v("Assign list of survey management roles to specified user")]),s._v(" "),a("ul",[a("li",[a("code",[s._v("{surveyId}/staff")])]),s._v(" "),a("li",[a("code",[s._v("{surveyId}/support")])])]),s._v(" "),a("h3",{attrs:{id:"request-6"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#request-6"}},[s._v("#")]),s._v(" Request")]),s._v(" "),a("div",{staticClass:"language-http extra-class"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[s._v("PUT /api/admin/surveys/:surveyId/mgmt/:userId\n\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json"),a("span",{pre:!0,attrs:{class:"token application-json"}},[s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"roles"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])])]),a("h3",{attrs:{id:"response-8"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#response-8"}},[s._v("#")]),s._v(" Response")]),s._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n")])])]),a("h2",{attrs:{id:"list-respondents"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#list-respondents"}},[s._v("#")]),s._v(" List respondents")]),s._v(" "),a("p",[s._v("Get list of survey respondents.")]),s._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("List content")]),s._v(" "),a("p",[s._v("List includes users with "),a("code",[s._v("{surveyId}/respondent")]),s._v(" role.")])]),s._v(" "),a("h3",{attrs:{id:"request-7"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#request-7"}},[s._v("#")]),s._v(" Request")]),s._v(" "),a("div",{staticClass:"language-http extra-class"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[s._v("GET /api/admin/surveys/:surveyId/respondents\n    ?search={searchText}\n    &page={page}\n    &limit={limit}\n\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json\n")])])]),a("h3",{attrs:{id:"response-9"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#response-9"}},[s._v("#")]),s._v(" Response")]),s._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"data"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("..."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"meta"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("..."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),a("h2",{attrs:{id:"create-respondent"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#create-respondent"}},[s._v("#")]),s._v(" Create respondent")]),s._v(" "),a("p",[s._v("Create new survey respondent")]),s._v(" "),a("h3",{attrs:{id:"request-8"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#request-8"}},[s._v("#")]),s._v(" Request")]),s._v(" "),a("div",{staticClass:"language-http extra-class"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[s._v("POST /api/admin/surveys/:surveyId/respondents\n\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json"),a("span",{pre:!0,attrs:{class:"token application-json"}},[s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"userName"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"name"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"email"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"phone"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"password"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"passwordConfirm"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"customFields"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"name"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"value"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])])]),a("h3",{attrs:{id:"response-10"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#response-10"}},[s._v("#")]),s._v(" Response")]),s._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token number"}},[s._v("201")]),s._v(" Created\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"data"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("..."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),a("h2",{attrs:{id:"update-respondent"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#update-respondent"}},[s._v("#")]),s._v(" Update respondent")]),s._v(" "),a("p",[s._v("Update survey respondent")]),s._v(" "),a("h3",{attrs:{id:"request-9"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#request-9"}},[s._v("#")]),s._v(" Request")]),s._v(" "),a("div",{staticClass:"language-http extra-class"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[s._v("PUT /api/admin/surveys/:surveyId/respondents/:userId\n\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json"),a("span",{pre:!0,attrs:{class:"token application-json"}},[s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"userName"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"name"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"email"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"phone"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"password"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"passwordConfirm"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" string\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])])]),a("h3",{attrs:{id:"response-11"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#response-11"}},[s._v("#")]),s._v(" Response")]),s._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" OK\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"data"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("..."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),a("h2",{attrs:{id:"delete-respondent"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#delete-respondent"}},[s._v("#")]),s._v(" Delete respondent")]),s._v(" "),a("p",[s._v("Delete respondent")]),s._v(" "),a("h3",{attrs:{id:"request-10"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#request-10"}},[s._v("#")]),s._v(" Request")]),s._v(" "),a("div",{staticClass:"language-http extra-class"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[s._v("DELETE /api/admin/surveys/:surveyId/respondents/:userId\n\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Authorization:")]),s._v(" Bearer {accessToken}\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("Content-Type:")]),s._v(" application/json\n")])])]),a("h3",{attrs:{id:"response-12"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#response-12"}},[s._v("#")]),s._v(" Response")]),s._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token number"}},[s._v("204")]),s._v(" No Content\n")])])])])}),[],!1,null,null,null);t.default=r.exports}}]);