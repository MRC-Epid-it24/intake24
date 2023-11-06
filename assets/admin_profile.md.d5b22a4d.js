import{_ as e,o as a,c as t,Q as o}from"./chunks/framework.8290ef30.js";const f=JSON.parse('{"title":"Profile","description":"","frontmatter":{},"headers":[],"relativePath":"admin/profile.md","filePath":"admin/profile.md"}'),i={name:"admin/profile.md"},r=o('<h1 id="profile" tabindex="-1">Profile <a class="header-anchor" href="#profile" aria-label="Permalink to &quot;Profile&quot;">​</a></h1><p>Profile allows user to see the profile information and perform profile-related changes.</p><h2 id="information" tabindex="-1">Information <a class="header-anchor" href="#information" aria-label="Permalink to &quot;Information&quot;">​</a></h2><ul><li><code>email</code> - user&#39;s email address</li><li><code>name</code> - user&#39;s name</li><li><code>phone</code> - user&#39;s phone number</li></ul><h3 id="change-password" tabindex="-1">Change password <a class="header-anchor" href="#change-password" aria-label="Permalink to &quot;Change password&quot;">​</a></h3><p>User can change their password by entering the current password and the new password twice.</p><h2 id="access" tabindex="-1">Access <a class="header-anchor" href="#access" aria-label="Permalink to &quot;Access&quot;">​</a></h2><ul><li><p><code>assigned roles</code> - list of roles that user was assigned to</p></li><li><p><code>assigned permissions</code> - list of permissions that user was granted</p></li></ul><h2 id="settings" tabindex="-1">Settings <a class="header-anchor" href="#settings" aria-label="Permalink to &quot;Settings&quot;">​</a></h2><ul><li><code>language</code> - user&#39;s preferred language</li></ul><h2 id="multi-factor-authentication" tabindex="-1">Multi-factor authentication <a class="header-anchor" href="#multi-factor-authentication" aria-label="Permalink to &quot;Multi-factor authentication&quot;">​</a></h2><p>Multi-factor authentication can be set up by adding at least one authentication method and then enabling the multi-factor authentication toggle.</p><h3 id="one-time-password-otp" tabindex="-1">One-time password (OTP) <a class="header-anchor" href="#one-time-password-otp" aria-label="Permalink to &quot;One-time password (OTP)&quot;">​</a></h3><p>One-time password (OTP) authentication method can be set up by installing an authenticator app (e.g. Google Authenticator, MS Authenticator, etc) and scanning the QR code or entering the secret key manually.</p><h3 id="fido2-webauthn" tabindex="-1">FIDO2 / WebAuthn <a class="header-anchor" href="#fido2-webauthn" aria-label="Permalink to &quot;FIDO2 / WebAuthn&quot;">​</a></h3><p>Several <code>FIDO2</code> / <code>WebAuthn</code> authentication methods are available based on user&#39;s browser / platform support:</p><ul><li><p>hardware security key (e.g. YubiKey)</p></li><li><p>platform <code>passkey</code> authentication flows (e.g. Windows Hello / Phone prompts)</p></li></ul><h3 id="duo-security" tabindex="-1">Duo Security <a class="header-anchor" href="#duo-security" aria-label="Permalink to &quot;Duo Security&quot;">​</a></h3><p>Optionally, <a href="https://duo.com" target="_blank" rel="noreferrer">Duo Security</a> can be used as a multi-factor authentication provider. Intake24 supports <a href="https://duo.com/docs/duoweb" target="_blank" rel="noreferrer">Universal Prompt</a> authentication method.</p><p>Please check that relevant intake24 instance is available, configured and that user is enrolled.</p><div class="tip custom-block"><p class="custom-block-title">To set up Duo Security as a multi-factor authentication provider:</p><ul><li><p>create Web SDK application in Duo Security admin panel</p></li><li><p>configure intake24 to use <a href="/config/api/security.html#duo-provider-settings">Duo Security as an authentication provider</a></p></li><li><p>user&#39;s <code>email</code> is passed to Duo Security as a primary identifier -&gt; Duo user accounts need to hold the email as primary identifier or as an additional alias</p></li></ul></div>',21),n=[r];function s(l,c,d,u,h,p){return a(),t("div",null,n)}const b=e(i,[["render",s]]);export{f as __pageData,b as default};
