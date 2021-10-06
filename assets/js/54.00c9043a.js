(window.webpackJsonp=window.webpackJsonp||[]).push([[54],{453:function(e,t,o){"use strict";o.r(t);var _=o(29),v=Object(_.a)({},(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[o("h1",{attrs:{id:"session"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#session"}},[e._v("#")]),e._v(" Session")]),e._v(" "),o("p",[e._v("Path: "),o("code",[e._v("src/config/session.ts")])]),e._v(" "),o("p",[o("a",{attrs:{href:"https://redis.io",target:"_blank",rel:"noopener noreferrer"}},[e._v("Redis"),o("OutboundLink")],1),e._v(" is used as session driver.")]),e._v(" "),o("p",[e._v("Redis is also used for other parts of system (cache, queue), they have separate connection settings, so they can be configured independently if needed.")]),e._v(" "),o("h2",{attrs:{id:"redis-instance"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#redis-instance"}},[e._v("#")]),e._v(" Redis instance")]),e._v(" "),o("h3",{attrs:{id:"host"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#host"}},[e._v("#")]),e._v(" Host")]),e._v(" "),o("ul",[o("li",[e._v("object-path: "),o("code",[e._v("redis.host")])]),e._v(" "),o("li",[e._v("dotenv var: "),o("code",[e._v("SESSION_REDIS_HOST")])]),e._v(" "),o("li",[e._v("type: "),o("code",[e._v("string")])]),e._v(" "),o("li",[e._v("default: "),o("code",[e._v("'localhost'")])])]),e._v(" "),o("h3",{attrs:{id:"port"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#port"}},[e._v("#")]),e._v(" Port")]),e._v(" "),o("ul",[o("li",[e._v("object-path: "),o("code",[e._v("redis.port")])]),e._v(" "),o("li",[e._v("dotenv var: "),o("code",[e._v("SESSION_REDIS_PORT")])]),e._v(" "),o("li",[e._v("type: "),o("code",[e._v("number")])]),e._v(" "),o("li",[e._v("default: "),o("code",[e._v("6379")])])]),e._v(" "),o("h3",{attrs:{id:"prefix"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#prefix"}},[e._v("#")]),e._v(" Prefix")]),e._v(" "),o("p",[e._v("Prefix string which is pre-pended to each key to identify cache data.")]),e._v(" "),o("ul",[o("li",[e._v("object-path: "),o("code",[e._v("prefix")])]),e._v(" "),o("li",[e._v("dotenv var: "),o("code",[e._v("SESSION_REDIS_PREFIX")])]),e._v(" "),o("li",[e._v("type: "),o("code",[e._v("string")])]),e._v(" "),o("li",[e._v("default: "),o("code",[e._v("'it24:session:'")])])]),e._v(" "),o("h2",{attrs:{id:"cookie"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#cookie"}},[e._v("#")]),e._v(" Cookie")]),e._v(" "),o("h3",{attrs:{id:"cookie-name"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#cookie-name"}},[e._v("#")]),e._v(" Cookie name")]),e._v(" "),o("ul",[o("li",[e._v("object-path: "),o("code",[e._v("cookie.name")])]),e._v(" "),o("li",[e._v("dotenv var: "),o("code",[e._v("SESSION_COOKIE_NAME")])]),e._v(" "),o("li",[e._v("type: "),o("code",[e._v("string")])]),e._v(" "),o("li",[e._v("default: "),o("code",[e._v("it24_session")])])]),e._v(" "),o("h3",{attrs:{id:"cookie-maxage"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#cookie-maxage"}},[e._v("#")]),e._v(" Cookie maxAge")]),e._v(" "),o("p",[e._v("Lifetime of cookie. Defined as "),o("code",[e._v("ms-formatted")]),e._v(" string, see "),o("a",{attrs:{href:"https://github.com/vercel/ms",target:"_blank",rel:"noopener noreferrer"}},[e._v("ms"),o("OutboundLink")],1),e._v(" for more information.")]),e._v(" "),o("ul",[o("li",[e._v("object-path: "),o("code",[e._v("cookie.maxAge")])]),e._v(" "),o("li",[e._v("dotenv var: "),o("code",[e._v("SESSION_COOKIE_LIFETIME")])]),e._v(" "),o("li",[e._v("default: "),o("code",[e._v("'15m'")])]),e._v(" "),o("li",[e._v("type: "),o("code",[e._v("string")])])]),e._v(" "),o("h3",{attrs:{id:"cookie-httponly"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#cookie-httponly"}},[e._v("#")]),e._v(" Cookie httpOnly")]),e._v(" "),o("ul",[o("li",[e._v("object-path: "),o("code",[e._v("cookie.httpOnly")])]),e._v(" "),o("li",[e._v("type: "),o("code",[e._v("boolean")])]),e._v(" "),o("li",[e._v("default: "),o("code",[e._v("true")])])]),e._v(" "),o("h3",{attrs:{id:"cookie-path"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#cookie-path"}},[e._v("#")]),e._v(" Cookie path")]),e._v(" "),o("ul",[o("li",[e._v("object-path: "),o("code",[e._v("cookie.path")])]),e._v(" "),o("li",[e._v("dotenv var: "),o("code",[e._v("SESSION_COOKIE_PATH")])]),e._v(" "),o("li",[e._v("type: "),o("code",[e._v("string")])]),e._v(" "),o("li",[e._v("default: "),o("code",[e._v("'/api/auth'")])])]),e._v(" "),o("h3",{attrs:{id:"cookie-samesite"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#cookie-samesite"}},[e._v("#")]),e._v(" Cookie sameSite")]),e._v(" "),o("ul",[o("li",[e._v("object-path: "),o("code",[e._v("cookie.sameSite")])]),e._v(" "),o("li",[e._v("dotenv var: "),o("code",[e._v("SESSION_COOKIE_SAME_SITE")])]),e._v(" "),o("li",[e._v("type: "),o("code",[e._v("boolean | 'lax' | 'strict' | 'none'")])]),e._v(" "),o("li",[e._v("default: "),o("code",[e._v("'lax'")])])]),e._v(" "),o("h3",{attrs:{id:"cookie-secure"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#cookie-secure"}},[e._v("#")]),e._v(" Cookie secure")]),e._v(" "),o("ul",[o("li",[e._v("object-path: "),o("code",[e._v("cookie.httpOnly")])]),e._v(" "),o("li",[e._v("dotenv var: "),o("code",[e._v("SESSION_COOKIE_SECURE")])]),e._v(" "),o("li",[e._v("type: "),o("code",[e._v("boolean")])]),e._v(" "),o("li",[e._v("default: "),o("code",[e._v("false")])])])])}),[],!1,null,null,null);t.default=v.exports}}]);