import{_ as e,c as i,o,a as t}from"./app.88b8cbf2.js";const g='{"title":"Security","description":"","frontmatter":{},"headers":[{"level":2,"title":"Cross-origin resource sharing (CORS)","slug":"cross-origin-resource-sharing-cors"},{"level":3,"title":"CORS Origin","slug":"cors-origin"},{"level":2,"title":"Proxy","slug":"proxy"},{"level":2,"title":"JSON web tokens","slug":"json-web-tokens"},{"level":3,"title":"Issuer","slug":"issuer"},{"level":3,"title":"Access token secret","slug":"access-token-secret"},{"level":3,"title":"Admin application settings","slug":"admin-application-settings"},{"level":3,"title":"Survey application settings","slug":"survey-application-settings"},{"level":2,"title":"Multi-factor authentication (MFA)","slug":"multi-factor-authentication-mfa"},{"level":3,"title":"Enabled","slug":"enabled"},{"level":3,"title":"Provider","slug":"provider"},{"level":3,"title":"Duo provider settings","slug":"duo-provider-settings"},{"level":2,"title":"Passwords","slug":"passwords"},{"level":3,"title":"Expire","slug":"expire"},{"level":2,"title":"Authentication tokens","slug":"authentication-tokens"},{"level":3,"title":"Size","slug":"size"},{"level":3,"title":"Alphabet","slug":"alphabet"},{"level":2,"title":"Sign-in logging","slug":"sign-in-logging"},{"level":3,"title":"Enabled","slug":"enabled-1"}],"relativePath":"config/api/security.md"}',a={},r=t('<h1 id="security" tabindex="-1">Security <a class="header-anchor" href="#security" aria-hidden="true">#</a></h1><p>Path: <code>apps/api/src/config/security.ts</code></p><h2 id="cross-origin-resource-sharing-cors" tabindex="-1">Cross-origin resource sharing (CORS) <a class="header-anchor" href="#cross-origin-resource-sharing-cors" aria-hidden="true">#</a></h2><h3 id="cors-origin" tabindex="-1">CORS Origin <a class="header-anchor" href="#cors-origin" aria-hidden="true">#</a></h3><p>Single origin or list of origins to allow cross-origin resource sharing. Define these, when SPA applications (<code>Admin client</code> and <code>Survey client</code>) are deployed to different domain than <code>API server</code>.</p><ul><li>object-path: <code>cors.origin</code></li><li>dotenv var: <code>CORS_ORIGIN</code> (for list of origins, use <code>comma-delimited</code> string)</li><li>type: <code>string | string[] | boolean</code></li><li>default: <code>false</code></li></ul><h2 id="proxy" tabindex="-1">Proxy <a class="header-anchor" href="#proxy" aria-hidden="true">#</a></h2><p>List of trusted proxies. It allows to define list proxies if application is behind multiple reverse proxies / load balancers.</p><p>Since application is usually at least behind local reverse proxy, set as <code>loopback</code> (which translates to <code>127.0.0.1 / ::1</code>).</p><ul><li>object-path: <code>proxy</code></li><li>dotenv var: <code>PROXY</code> (<code>comma-delimited</code> string list)</li><li>type: <code>string[] | boolean</code></li><li>default: <code>false</code></li></ul><h2 id="json-web-tokens" tabindex="-1">JSON web tokens <a class="header-anchor" href="#json-web-tokens" aria-hidden="true">#</a></h2><p>JSON web tokens (<code>JWT</code>) settings</p><h3 id="issuer" tabindex="-1">Issuer <a class="header-anchor" href="#issuer" aria-hidden="true">#</a></h3><p>Issuer claim for signing JWT tokens</p><ul><li>object-path: <code>jwt.issuer</code></li><li>dotenv var: <code>JWT_ISSUER</code></li><li>type: <code>string</code></li><li>default: <code>&#39;intake24&#39;</code></li></ul><h3 id="access-token-secret" tabindex="-1">Access token secret <a class="header-anchor" href="#access-token-secret" aria-hidden="true">#</a></h3><p>Secret to sign JWT access token</p><ul><li>object-path: <code>jwt.access.secret</code></li><li>dotenv var: <code>JWT_ACCESS_SECRET</code></li><li>type: <code>string</code></li></ul><h3 id="admin-application-settings" tabindex="-1">Admin application settings <a class="header-anchor" href="#admin-application-settings" aria-hidden="true">#</a></h3><p>JWT settings for admin frontend application.</p><h4 id="access-token-audience" tabindex="-1">Access token audience <a class="header-anchor" href="#access-token-audience" aria-hidden="true">#</a></h4><p>Audience claim to sign JWT access token</p><ul><li>object-path: <code>jwt.admin.access.audience</code></li><li>type: <code>string[]</code></li><li>default: <code>[&#39;admin&#39;, &#39;access&#39;]</code></li></ul><h4 id="access-token-lifetime" tabindex="-1">Access token lifetime <a class="header-anchor" href="#access-token-lifetime" aria-hidden="true">#</a></h4><p>Lifetime of JWT access token. Defined as <code>ms-formatted</code> string, see <a href="https://github.com/vercel/ms" target="_blank" rel="noopener noreferrer">ms</a> for more information.</p><ul><li>object-path: <code>jwt.admin.access.lifetime</code></li><li>dotenv var: <code>JWT_ADMIN_ACCESS_LIFETIME</code></li><li>type: <code>string</code></li><li>default: <code>&#39;15m&#39;</code></li></ul><h4 id="refresh-token-secret" tabindex="-1">Refresh token secret <a class="header-anchor" href="#refresh-token-secret" aria-hidden="true">#</a></h4><p>Secret to sign JWT refresh token</p><ul><li>object-path: <code>jwt.admin.refresh.secret</code></li><li>dotenv var: <code>JWT_ADMIN_REFRESH_SECRET</code></li><li>type: <code>string</code></li></ul><h4 id="refresh-token-audience" tabindex="-1">Refresh token audience <a class="header-anchor" href="#refresh-token-audience" aria-hidden="true">#</a></h4><p>Audience claim to sign JWT refresh token</p><ul><li>object-path: <code>jwt.admin.refresh.audience</code></li><li>type: <code>string[]</code></li><li>default: <code>[&#39;admin&#39;, &#39;refresh&#39;]</code></li></ul><h4 id="refresh-token-lifetime" tabindex="-1">Refresh token lifetime <a class="header-anchor" href="#refresh-token-lifetime" aria-hidden="true">#</a></h4><p>Lifetime of JWT refresh token. Defined as <code>ms-formatted</code> string, see <a href="https://github.com/vercel/ms" target="_blank" rel="noopener noreferrer">ms</a> for more information.</p><ul><li>object-path: <code>jwt.admin.refresh.lifetime</code></li><li>dotenv var: <code>JWT_ADMIN_REFRESH_LIFETIME</code></li><li>type: <code>string</code></li><li>default: <code>&#39;1d&#39;</code></li></ul><h4 id="jwt-refresh-token-cookie" tabindex="-1">JWT Refresh token cookie <a class="header-anchor" href="#jwt-refresh-token-cookie" aria-hidden="true">#</a></h4><p>Refresh token is stored in <code>http-only</code> cookie in client&#39;s browser. There are several properties to configure refresh token cookie.</p><h4 id="cookie-name" tabindex="-1">Cookie name <a class="header-anchor" href="#cookie-name" aria-hidden="true">#</a></h4><ul><li>object-path: <code>jwt.admin.cookie.name</code></li><li>type: <code>string</code></li><li>default: <code>it24a_refresh_token</code></li></ul><h4 id="cookie-maxage" tabindex="-1">Cookie maxAge <a class="header-anchor" href="#cookie-maxage" aria-hidden="true">#</a></h4><p>Lifetime of cookie. Defined as <code>ms-formatted</code> string, see <a href="https://github.com/vercel/ms" target="_blank" rel="noopener noreferrer">ms</a> for more information.</p><ul><li>object-path: <code>jwt.admin.cookie.maxAge</code></li><li>default: <code>jwt.admin.refresh.lifetime</code> value</li><li>type: <code>string</code></li></ul><h4 id="cookie-httponly" tabindex="-1">Cookie httpOnly <a class="header-anchor" href="#cookie-httponly" aria-hidden="true">#</a></h4><ul><li>object-path: <code>jwt.admin.cookie.httpOnly</code></li><li>type: <code>boolean</code></li><li>default: <code>true</code></li></ul><h4 id="cookie-path" tabindex="-1">Cookie path <a class="header-anchor" href="#cookie-path" aria-hidden="true">#</a></h4><ul><li>object-path: <code>jwt.admin.cookie.path</code></li><li>dotenv var: <code>JWT_ADMIN_COOKIE_PATH</code></li><li>type: <code>string</code></li><li>default: <code>&#39;/api/admin/auth&#39;</code></li></ul><h4 id="cookie-samesite" tabindex="-1">Cookie sameSite <a class="header-anchor" href="#cookie-samesite" aria-hidden="true">#</a></h4><ul><li>object-path: <code>jwt.admin.cookie.sameSite</code></li><li>dotenv var: <code>JWT_ADMIN_COOKIE_SAMESITE</code></li><li>type: <code>boolean | &#39;lax&#39; | &#39;strict&#39; | &#39;none&#39;</code></li><li>default: <code>&#39;lax&#39;</code></li></ul><h4 id="cookie-secure" tabindex="-1">Cookie secure <a class="header-anchor" href="#cookie-secure" aria-hidden="true">#</a></h4><ul><li>object-path: <code>jwt.admin.cookie.secure</code></li><li>dotenv var: <code>JWT_ADMIN_COOKIE_SECURE</code></li><li>type: <code>boolean</code></li><li>default: <code>false</code></li></ul><h3 id="survey-application-settings" tabindex="-1">Survey application settings <a class="header-anchor" href="#survey-application-settings" aria-hidden="true">#</a></h3><p>JWT settings for survey frontend application.</p><h4 id="access-token-audience-1" tabindex="-1">Access token audience <a class="header-anchor" href="#access-token-audience-1" aria-hidden="true">#</a></h4><p>Audience claim to sign JWT access token</p><ul><li>object-path: <code>jwt.survey.access.audience</code></li><li>type: <code>string[]</code></li><li>default: <code>[&#39;survey&#39;, &#39;access&#39;]</code></li></ul><h4 id="access-token-lifetime-1" tabindex="-1">Access token lifetime <a class="header-anchor" href="#access-token-lifetime-1" aria-hidden="true">#</a></h4><p>Lifetime of JWT access token. Defined as <code>ms-formatted</code> string, see <a href="https://github.com/vercel/ms" target="_blank" rel="noopener noreferrer">ms</a> for more information.</p><ul><li>object-path: <code>jwt.survey.access.lifetime</code></li><li>dotenv var: <code>JWT_SURVEY_ACCESS_LIFETIME</code></li><li>type: <code>string</code></li><li>default: <code>&#39;15m&#39;</code></li></ul><h4 id="refresh-token-secret-1" tabindex="-1">Refresh token secret <a class="header-anchor" href="#refresh-token-secret-1" aria-hidden="true">#</a></h4><p>Secret to sign JWT refresh token</p><ul><li>object-path: <code>jwt.survey.refresh.secret</code></li><li>dotenv var: <code>JWT_SURVEY_REFRESH_SECRET</code></li><li>type: <code>string</code></li></ul><h4 id="refresh-token-audience-1" tabindex="-1">Refresh token audience <a class="header-anchor" href="#refresh-token-audience-1" aria-hidden="true">#</a></h4><p>Audience claim to sign JWT refresh token</p><ul><li>object-path: <code>jwt.survey.refresh.audience</code></li><li>type: <code>string[]</code></li><li>default: <code>[&#39;survey&#39;, &#39;refresh&#39;]</code></li></ul><h4 id="refresh-token-lifetime-1" tabindex="-1">Refresh token lifetime <a class="header-anchor" href="#refresh-token-lifetime-1" aria-hidden="true">#</a></h4><p>Lifetime of JWT refresh token. Defined as <code>ms-formatted</code> string, see <a href="https://github.com/vercel/ms" target="_blank" rel="noopener noreferrer">ms</a> for more information.</p><ul><li>object-path: <code>jwt.survey.refresh.lifetime</code></li><li>dotenv var: <code>JWT_SURVEY_REFRESH_LIFETIME</code></li><li>type: <code>string</code></li><li>default: <code>&#39;1d&#39;</code></li></ul><h4 id="jwt-refresh-token-cookie-1" tabindex="-1">JWT Refresh token cookie <a class="header-anchor" href="#jwt-refresh-token-cookie-1" aria-hidden="true">#</a></h4><p>Refresh token is stored in <code>http-only</code> cookie in client&#39;s browser. There are several properties to configure refresh token cookie.</p><h4 id="cookie-name-1" tabindex="-1">Cookie name <a class="header-anchor" href="#cookie-name-1" aria-hidden="true">#</a></h4><ul><li>object-path: <code>jwt.survey.cookie.name</code></li><li>type: <code>string</code></li><li>default: <code>it24s_refresh_token</code></li></ul><h4 id="cookie-maxage-1" tabindex="-1">Cookie maxAge <a class="header-anchor" href="#cookie-maxage-1" aria-hidden="true">#</a></h4><p>Lifetime of cookie. Defined as <code>ms-formatted</code> string, see <a href="https://github.com/vercel/ms" target="_blank" rel="noopener noreferrer">ms</a> for more information.</p><ul><li>object-path: <code>jwt.survey.cookie.maxAge</code></li><li>default: <code>jwt.survey.refresh.lifetime</code> value</li><li>type: <code>string</code></li></ul><h4 id="cookie-httponly-1" tabindex="-1">Cookie httpOnly <a class="header-anchor" href="#cookie-httponly-1" aria-hidden="true">#</a></h4><ul><li>object-path: <code>jwt.survey.cookie.httpOnly</code></li><li>type: <code>boolean</code></li><li>default: <code>true</code></li></ul><h4 id="cookie-path-1" tabindex="-1">Cookie path <a class="header-anchor" href="#cookie-path-1" aria-hidden="true">#</a></h4><ul><li>object-path: <code>jwt.survey.cookie.path</code></li><li>dotenv var: <code>JWT_SURVEY_COOKIE_PATH</code></li><li>type: <code>string</code></li><li>default: <code>&#39;/api/auth&#39;</code></li></ul><h4 id="cookie-samesite-1" tabindex="-1">Cookie sameSite <a class="header-anchor" href="#cookie-samesite-1" aria-hidden="true">#</a></h4><ul><li>object-path: <code>jwt.survey.cookie.sameSite</code></li><li>dotenv var: <code>JWT_SURVEY_COOKIE_SAMESITE</code></li><li>type: <code>boolean | &#39;lax&#39; | &#39;strict&#39; | &#39;none&#39;</code></li><li>default: <code>&#39;lax&#39;</code></li></ul><h4 id="cookie-secure-1" tabindex="-1">Cookie secure <a class="header-anchor" href="#cookie-secure-1" aria-hidden="true">#</a></h4><ul><li>object-path: <code>jwt.survey.cookie.secure</code></li><li>dotenv var: <code>JWT_SURVEY_COOKIE_SECURE</code></li><li>type: <code>boolean</code></li><li>default: <code>false</code></li></ul><h2 id="multi-factor-authentication-mfa" tabindex="-1">Multi-factor authentication (MFA) <a class="header-anchor" href="#multi-factor-authentication-mfa" aria-hidden="true">#</a></h2><p>System supports multi-factor authentication (<code>MFA</code>) for admin login.</p><p>Supported providers:</p><ul><li><a href="https://duo.com" target="_blank" rel="noopener noreferrer">Duo Security</a></li></ul><p>MFA has to be enabled on system-level (configuration) and user-level (database user record).</p><h3 id="enabled" tabindex="-1">Enabled <a class="header-anchor" href="#enabled" aria-hidden="true">#</a></h3><p>Determines whether the MFA is system-enabled or not</p><ul><li>object-path: <code>mfa.enabled</code></li><li>dotenv var: <code>MFA_ENABLED</code></li><li>type: <code>boolean</code></li><li>default: <code>false</code></li></ul><h3 id="provider" tabindex="-1">Provider <a class="header-anchor" href="#provider" aria-hidden="true">#</a></h3><p>Selected provider for MFA</p><ul><li>object-path: <code>mfa.provider</code></li><li>dotenv var: <code>MFA_PROVIDER</code></li><li>type: <code>&#39;duo&#39;</code></li><li>default: <code>&#39;duo&#39;</code></li></ul><h3 id="duo-provider-settings" tabindex="-1">Duo provider settings <a class="header-anchor" href="#duo-provider-settings" aria-hidden="true">#</a></h3><p>For more information, check out <a href="https://duo.com/docs/duoweb" target="_blank" rel="noopener noreferrer">duo&#39;s documentation for WebSDK</a>. Intake24 implements Universal Prompt flow.</p><h4 id="duo-client-id" tabindex="-1">Duo client ID <a class="header-anchor" href="#duo-client-id" aria-hidden="true">#</a></h4><p>Duo client ID - can be found in Duo administration</p><ul><li>object-path: <code>mfa.providers.duo.clientId</code></li><li>dotenv var: <code>DUO_CLIENT_ID</code></li><li>type: <code>string</code></li><li>default: <code>&#39;&#39;</code></li></ul><h4 id="duo-client-secret" tabindex="-1">Duo client secret <a class="header-anchor" href="#duo-client-secret" aria-hidden="true">#</a></h4><p>Duo client secret - can be found in Duo administration</p><ul><li>object-path: <code>mfa.providers.duo.clientSecret</code></li><li>dotenv var: <code>DUO_CLIENT_SECRET</code></li><li>type: <code>string</code></li><li>default: <code>&#39;&#39;</code></li></ul><h4 id="duo-api-host" tabindex="-1">Duo API host <a class="header-anchor" href="#duo-api-host" aria-hidden="true">#</a></h4><p>Duo API hostname (e.g. <a href="http://api-a1b2c3d4e5.duosecurity.com" target="_blank" rel="noopener noreferrer">api-a1b2c3d4e5.duosecurity.com</a>) - can be found in Duo administration</p><ul><li>object-path: <code>mfa.providers.duo.apiHost</code></li><li>dotenv var: <code>DUO_API_HOST</code></li><li>type: <code>string</code></li><li>default: <code>&#39;&#39;</code></li></ul><h4 id="duo-redirect-url" tabindex="-1">Duo redirect URL <a class="header-anchor" href="#duo-redirect-url" aria-hidden="true">#</a></h4><p>URL where to redirect from MFA verification step. This should be admin tool login page.</p><ul><li>object-path: <code>mfa.providers.duo.redirectUrl</code></li><li>dotenv var: <code>DUO_REDIRECT_URL</code></li><li>type: <code>string</code></li><li>default: <code>&#39;&#39;</code></li></ul><h2 id="passwords" tabindex="-1">Passwords <a class="header-anchor" href="#passwords" aria-hidden="true">#</a></h2><p>Settings for password restore functionality.</p><h3 id="expire" tabindex="-1">Expire <a class="header-anchor" href="#expire" aria-hidden="true">#</a></h3><p>Password reset link expiration in <strong>minutes</strong>.</p><ul><li>object-path: <code>passwords.expire</code></li><li>dotenv var: <code>PASSWORDS_EXPIRES_IN</code></li><li>type: <code>number</code></li><li>default: <code>60</code></li></ul><h2 id="authentication-tokens" tabindex="-1">Authentication tokens <a class="header-anchor" href="#authentication-tokens" aria-hidden="true">#</a></h2><p>Settings for generation of random authentication tokens.</p><h3 id="size" tabindex="-1">Size <a class="header-anchor" href="#size" aria-hidden="true">#</a></h3><p>Size of the tokens - string&#39;s length.</p><ul><li>object-path: <code>authTokens.size</code></li><li>dotenv var: <code>AUTH_TOKENS_SIZE</code></li><li>type: <code>number</code></li><li>default: <code>21</code></li></ul><h3 id="alphabet" tabindex="-1">Alphabet <a class="header-anchor" href="#alphabet" aria-hidden="true">#</a></h3><p>String of custom alphabet - character set to be used for token generation.</p><ul><li>object-path: <code>authTokens.alphabet</code></li><li>dotenv var: <code>AUTH_TOKENS_ALPHABET</code></li><li>type: <code>string | null</code></li><li>default: <code>null</code></li></ul><h2 id="sign-in-logging" tabindex="-1">Sign-in logging <a class="header-anchor" href="#sign-in-logging" aria-hidden="true">#</a></h2><p>Settings for sign-in logging.</p><h3 id="enabled-1" tabindex="-1">Enabled <a class="header-anchor" href="#enabled-1" aria-hidden="true">#</a></h3><p>Enable/disable database logging of sign-in attempts.</p><ul><li>object-path: <code>signInLog.enabled</code></li><li>dotenv var: <code>SIGN_IN_LOG_ENABLED</code></li><li>type: <code>boolean</code></li><li>default: <code>true</code></li></ul>',125),d=[r];function c(l,n,s,h,u,p){return o(),i("div",null,d)}var m=e(a,[["render",c]]);export{g as __pageData,m as default};
