(window.webpackJsonp=window.webpackJsonp||[]).push([[71],{487:function(e,t,s){"use strict";s.r(t);var a=s(31),n=Object(a.a)({},(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[s("h1",{attrs:{id:"installation"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#installation"}},[e._v("#")]),e._v(" Installation")]),e._v(" "),s("p",[e._v("This section briefly describes how to configure, compile and start the components of Intake24.")]),e._v(" "),s("p",[e._v("Source code also provides ansible roles for deployment to Ubuntu-based OS. "),s("RouterLink",{attrs:{to:"/deployment/"}},[e._v("Deployment")]),e._v(" section describes in detail how to use ansible scripts.")],1),e._v(" "),s("p",[e._v("Clone the repository:")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" clone https://github.com/MRC-Epid-it24/intake24\n")])])]),s("h2",{attrs:{id:"repository-structure"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#repository-structure"}},[e._v("#")]),e._v(" Repository structure")]),e._v(" "),s("p",[e._v("Repository is set with "),s("a",{attrs:{href:"https://docs.npmjs.com/cli/v7/using-npm/workspaces",target:"_blank",rel:"noopener noreferrer"}},[e._v("workspaces"),s("OutboundLink")],1),e._v(".")]),e._v(" "),s("p",[e._v("Shared components are in "),s("code",[e._v("packages")]),e._v(" folder. Applications are in "),s("code",[e._v("apps")]),e._v(" folder.")]),e._v(" "),s("p",[e._v("You can install all dependencies from root-level running")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[e._v("npm")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("install")]),e._v("\n")])])]),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),s("p",[e._v("Installing deps from top-level isn't 100% perfect. Few observations:")]),e._v(" "),s("ul",[s("li",[e._v("it works fine for frontend apps")]),e._v(" "),s("li",[s("code",[e._v("apps/api")]),e._v(" can cause some platform-specific issues, where not all dependencies are correctly resolved. If you cannot boot it up due to missing dependencies, run "),s("code",[e._v("npm install")]),e._v(" in "),s("code",[e._v("app/api")]),e._v(" folder.")]),e._v(" "),s("li",[e._v("some IDEs have issues to see all dependencies correctly and can show some false-positive issues of missing dependencies. This might require you to tweak your IDE to work correctly with multi-repository structure.")])])]),e._v(" "),s("p",[e._v("If you are running "),s("code",[e._v("npm install")]),e._v(" separately for each application, do not forget to run it in all "),s("code",[e._v("package/*")]),e._v(" folders")]),e._v(" "),s("p",[e._v("Navigate to "),s("code",[e._v("packages/*")]),e._v(" directory and install project dependencies.")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" packages/*\n\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("npm")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("install")]),e._v("\n")])])]),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),s("p",[e._v("Code is using "),s("code",[e._v(".env")]),e._v(" environment files. Each project contains a template file ("),s("code",[e._v(".env-template")]),e._v("). If you're setting up fresh project, you can run CLI command, which generates all the files and couple of required specific keys. Follow the "),s("a",{attrs:{href:"/overview/cli/global"}},[e._v("CLI instructions")]),e._v(" and how to run "),s("a",{attrs:{href:"/overview/cli/generate-env"}},[e._v("generate-env")]),e._v(".")])]),e._v(" "),s("h2",{attrs:{id:"api-server"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#api-server"}},[e._v("#")]),e._v(" API Server")]),e._v(" "),s("p",[e._v("Navigate to "),s("code",[e._v("apps/api")]),e._v(" directory and install project dependencies.")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" apps/api\n\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("npm")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("install")]),e._v("\n")])])]),s("p",[e._v("Copy template of configuration file and edit it as required. Please see "),s("RouterLink",{attrs:{to:"/config/"}},[e._v("Configuration")]),e._v(" section for detailed description of configuration options.")],1),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[e._v("cp")]),e._v(" .env-template .env\n")])])]),s("p",[e._v("Build the application")]),e._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[e._v("npm run prod\n")])])]),s("p",[e._v("Start the application")]),e._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[e._v("npm run start\n")])])]),s("h3",{attrs:{id:"for-production-consider"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#for-production-consider"}},[e._v("#")]),e._v(" For production, consider:")]),e._v(" "),s("ol",[s("li",[e._v("Deploy as dedicated service. Refer to your OS environment how to set that up.")]),e._v(" "),s("li",[e._v("User process manager, e.g. "),s("a",{attrs:{href:"https://pm2.keymetrics.io",target:"_blank",rel:"noopener noreferrer"}},[e._v("PM2"),s("OutboundLink")],1)]),e._v(" "),s("li",[e._v("Deploy behind proper http server, e.g. "),s("a",{attrs:{href:"https://www.nginx.com",target:"_blank",rel:"noopener noreferrer"}},[e._v("Nginx"),s("OutboundLink")],1),e._v(", "),s("a",{attrs:{href:"https://www.apache.org",target:"_blank",rel:"noopener noreferrer"}},[e._v("Apache"),s("OutboundLink")],1),e._v(" etc.")])]),e._v(" "),s("p",[e._v("Deployment section / ansible scripts provide examples how to use dedicated service on Ubuntu and run it behind Nginx reverse proxy.")]),e._v(" "),s("h2",{attrs:{id:"admin-client"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#admin-client"}},[e._v("#")]),e._v(" Admin client")]),e._v(" "),s("p",[e._v("Navigate to "),s("code",[e._v("apps/admin")]),e._v(" directory and install project dependencies.")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" apps/admin\n\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("npm")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("install")]),e._v("\n")])])]),s("p",[e._v("Copy template of configuration file and edit it as required. Please see "),s("RouterLink",{attrs:{to:"/config/"}},[e._v("Configuration")]),e._v(" section for detailed description of configuration options.")],1),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[e._v("cp")]),e._v(" .env-template .env\n")])])]),s("p",[e._v("Build the application")]),e._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[e._v("npm run build\n")])])]),s("p",[e._v("Start the application")]),e._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[e._v("npm run start\n")])])]),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),s("p",[e._v("This should only be used if you host the client on separate domain. It will start separate http server to serve the application.")])]),e._v(" "),s("h2",{attrs:{id:"survey-client"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#survey-client"}},[e._v("#")]),e._v(" Survey client")]),e._v(" "),s("p",[e._v("Navigate to "),s("code",[e._v("apps/survey")]),e._v(" directory and install project dependencies.")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" apps/survey\n\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("npm")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("install")]),e._v("\n")])])]),s("p",[e._v("Copy template of configuration file and edit it as required. Please see "),s("RouterLink",{attrs:{to:"/config/"}},[e._v("Configuration")]),e._v(" section for detailed description of configuration options.")],1),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[e._v("cp")]),e._v(" .env-template .env\n")])])]),s("p",[e._v("Build the application")]),e._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[e._v("npm run build\n")])])]),s("p",[e._v("Start the application")]),e._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[e._v("npm run start\n")])])]),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),s("p",[e._v("This should only be used if you host the client on separate domain. It will start separate http server to serve the application.")])])])}),[],!1,null,null,null);t.default=n.exports}}]);