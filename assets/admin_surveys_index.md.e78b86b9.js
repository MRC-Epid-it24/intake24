import{_ as e,o as t,c as o,Q as a}from"./chunks/framework.b637c96f.js";const b=JSON.parse('{"title":"Surveys","description":"","frontmatter":{},"headers":[],"relativePath":"admin/surveys/index.md","filePath":"admin/surveys/index.md"}'),i={name:"admin/surveys/index.md"},s=a('<h1 id="surveys" tabindex="-1">Surveys <a class="header-anchor" href="#surveys" aria-label="Permalink to &quot;Surveys&quot;">​</a></h1><p>Survey section allows to manage surveys.</p><h2 id="detail" tabindex="-1">Detail <a class="header-anchor" href="#detail" aria-label="Permalink to &quot;Detail&quot;">​</a></h2><p>Detail tab displays selected survey info.</p><h2 id="create-edit" tabindex="-1">Create / Edit <a class="header-anchor" href="#create-edit" aria-label="Permalink to &quot;Create / Edit&quot;">​</a></h2><p>Edit tab allows to modify selected survey.</p><ul><li><p><code>Survey ID</code> - Short and unique, ideally slug-based string. It is used as primary key in database and also forms the URL of the login / authentication links.</p></li><li><p><code>Survey name</code> - User friendly name for admin purposes</p></li><li><p><code>Locale</code> - Associated locale</p></li><li><p><code>Scheme</code> - Associated scheme</p></li><li><p><code>Start date</code> - Start date of the survey</p></li><li><p><code>End date</code> - End date of the survey</p></li><li><p><code>Support email</code> - Email which gets displayed to participant in footer</p></li><li><p><code>State</code> - Survey state</p><ul><li><code>Not started</code> - Respondent won&#39;t be allowed to complete a recall</li><li><code>Active</code> - Respondent will be allowed to complete a recall</li><li><code>Suspended</code> - Respondent won&#39;t be allowed to complete a recall</li></ul></li><li><p><code>Suspension reason</code> - If <code>Suspended</code> state is set, additional details can be passed on to respondent using this field..</p></li><li><p><code>Store user session on server</code> - If enabled, user partial submission data are sent to server for store and retrieval. If disabled, user partial submission data are only stored locally in client browser,</p></li></ul><h3 id="users-settings" tabindex="-1">Users settings <a class="header-anchor" href="#users-settings" aria-label="Permalink to &quot;Users settings&quot;">​</a></h3><ul><li><p><code>Allow user personal identifiers</code> - <code>on</code> / <code>off</code> control to allow persistance of <code>email</code> / <code>name</code> / <code>phone</code> fields in database for respondent account</p></li><li><p><code>Allow user custom fields</code> - <code>on</code> / <code>off</code> control to allow persistance of <code>user custom fields</code></p></li></ul><h3 id="external-communication" tabindex="-1">External communication <a class="header-anchor" href="#external-communication" aria-label="Permalink to &quot;External communication&quot;">​</a></h3><ul><li><p><code>Allow user generation</code> - <code>on</code> / <code>off</code> control to allow automatic user generation</p></li><li><p><code>JWT secret for M2M communication</code> - string to sign JWT token.</p></li><li><p><code>Submission notification URL</code> - Webhook to be called when recall data submitted. Internally it dispatches <a href="/admin/system/job-types.html#surveysubmissionnotification">SurveySubmissionNotification</a> job.</p></li></ul><p>If automatic user generation is enabled, it provides two ways to generate accounts.</p><h4 id="_1-jwt-secret-is-left-blank" tabindex="-1"><code>1. JWT secret is left blank</code> <a class="header-anchor" href="#_1-jwt-secret-is-left-blank" aria-label="Permalink to &quot;`1. JWT secret is left blank`&quot;">​</a></h4><ul><li><p>Anyone can generate new respondent account using following survey URL: <code>app.domain.com/:surveyId/generate-user</code>.</p></li><li><p>API endpoint is rate limited and protected by <code>captcha</code> to minimize the misuse</p></li><li><p>This is useful for <code>demo-like</code> surveys to allow open access to anyone</p></li></ul><h4 id="_2-jwt-secret-is-set" tabindex="-1"><code>2. JWT secret is set</code> <a class="header-anchor" href="#_2-jwt-secret-is-set" aria-label="Permalink to &quot;`2. JWT secret is set`&quot;">​</a></h4><ul><li>API endpoint can be used to create new respondent accounts. See <a href="/api/survey/surveys-public.html#create-user">API docs</a> for more details.</li></ul><h3 id="search-options" tabindex="-1">Search options <a class="header-anchor" href="#search-options" aria-label="Permalink to &quot;Search options&quot;">​</a></h3><ul><li><p><code>Sorting algorithm</code> - Sorting algorithm to be used for foods search</p></li><li><p><code>Match score weight</code> - Match score weight parameter for sorting algorithm</p></li></ul><h3 id="authentication-url-settings" tabindex="-1">Authentication URL settings <a class="header-anchor" href="#authentication-url-settings" aria-label="Permalink to &quot;Authentication URL settings&quot;">​</a></h3><ul><li><p><code>Token character set</code> - string of characters to be used for authentication tokens (if empty, default set is used)</p></li><li><p><code>Token length</code> - Authentication token length (if empty, default length is used)</p></li><li><p><code>Domain override</code> - URL used to generate full authentication links in CSV export file. Please note, valid redirect, CNAME or other mechanism to reach the original server needs to be set up.</p></li></ul><h3 id="submission-limits" tabindex="-1">Submission limits <a class="header-anchor" href="#submission-limits" aria-label="Permalink to &quot;Submission limits&quot;">​</a></h3><ul><li><p><code>Maximum allowed submissions per calendar day</code> - maximum number of recalls allowed within the survey per day</p></li><li><p><code>Maximum allowed total submissions</code> - maximum total number of recalls allowed within the survey</p></li><li><p><code>Minimum interval between submissions (seconds)</code> - the shortest minimal internal between two following submission by same respondent</p></li></ul><h3 id="feedback-settings" tabindex="-1">Feedback settings <a class="header-anchor" href="#feedback-settings" aria-label="Permalink to &quot;Feedback settings&quot;">​</a></h3><ul><li><p><code>Feedback scheme</code> - Associated feedback scheme. If not set, feedback feature is disabled.</p></li><li><p><code>Number of submissions for feedback</code> - Minimal number of submissions per respondent account to allow to access the feedback</p></li></ul><h2 id="overrides" tabindex="-1">Overrides <a class="header-anchor" href="#overrides" aria-label="Permalink to &quot;Overrides&quot;">​</a></h2><p>Overrides tab allows to override certain parts of the scheme without a need to create whole new scheme.</p><p>There are two sections that can be overridden in limited way, so it doesn&#39;t influence the overall scheme flow. UI is the same is in <a href="/admin/surveys/schemes.html"><code>prompt editor</code></a>, so should feel familiar.</p><h3 id="scheme-prompts-overrides" tabindex="-1">Scheme prompts overrides <a class="header-anchor" href="#scheme-prompts-overrides" aria-label="Permalink to &quot;Scheme prompts overrides&quot;">​</a></h3><p>Scheme prompts overrides section allow to override specific survey scheme prompt. When added to the list, user can modify the settings of particular prompt.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>New prompt cannot be added or existing prompt cannot be removed from the scheme in this way. It only allows to modify existing prompts in order to retain original scheme flow. If you need to add / remove prompts, clone existing scheme, modify it and assign to the survey.</p></div><h3 id="scheme-meals-overrides" tabindex="-1">Scheme meals overrides <a class="header-anchor" href="#scheme-meals-overrides" aria-label="Permalink to &quot;Scheme meals overrides&quot;">​</a></h3><p>Scheme meals overrides section allows to override whole <code>default meal list</code>. If it is left empty, original one from scheme is used. If any entry is</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>Any entry overrides the whole default scheme meal list. This works differently to allow more flexibility as the meal list does not influence the survey flow.</p></div><h2 id="respondents" tabindex="-1">Respondents <a class="header-anchor" href="#respondents" aria-label="Permalink to &quot;Respondents&quot;">​</a></h2><p>Survey respondents section allows to:</p><ol><li><p>Create / view / search / edit / remove respondents</p></li><li><p>Bulk import respondents using CSV file. See <a href="/admin/system/job-types.html#surveyimportrespondents"><code>SurveyRespondentsImport</code></a> for more details about CSV file structure.</p></li><li><p>Download respondents authentication details in CSV file</p></li></ol><h3 id="authentication-urls" tabindex="-1">Authentication URLs <a class="header-anchor" href="#authentication-urls" aria-label="Permalink to &quot;Authentication URLs&quot;">​</a></h3><p>Authentication URLs are formed of:</p><ul><li>base URL: <code>app.domain.com</code></li><li>survey ID: <code>{surveyId}</code></li><li>authentication token: <code>{token}</code></li></ul><h4 id="short-url-patterns" tabindex="-1">Short URL patterns <a class="header-anchor" href="#short-url-patterns" aria-label="Permalink to &quot;Short URL patterns&quot;">​</a></h4><ul><li><code>app.domain.com/a/{token}</code> - <code>context</code> pattern</li><li><code>app.domain.com?auth={token}</code> - <code>query</code> pattern</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Short URL patterns can be used to let user land on survey home page</p></div><h4 id="full-url-patterns" tabindex="-1">Full URL patterns <a class="header-anchor" href="#full-url-patterns" aria-label="Permalink to &quot;Full URL patterns&quot;">​</a></h4><ul><li><code>app.domain.com/{surveyId}?auth={token}</code> - user is redirected to the survey landing page</li><li><code>app.domain.com/{surveyId}/recall?auth={token}</code> - user is redirected to the survey recall page</li><li><code>app.domain.com/{surveyId}/feedback?auth={token}</code> - user is redirected to the survey feedback page</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Full URL patterns using <code>{token}</code> as <code>query</code> parameter can be used in combination with any valid survey app URL to let user land on specific page</p></div><h2 id="submissions" tabindex="-1">Submissions <a class="header-anchor" href="#submissions" aria-label="Permalink to &quot;Submissions&quot;">​</a></h2><p>Survey submissions with limited ability to search / view / delete submissions. To be expanded in future.</p><h2 id="tasks" tabindex="-1">Tasks <a class="header-anchor" href="#tasks" aria-label="Permalink to &quot;Tasks&quot;">​</a></h2><p>Tasks section allows to submit resource specific tasks into the job queue with additional parameters. See <a href="/admin/system/job-types.html">job types</a> for more information.</p><p>Jobs that can be submitted:</p><ul><li><p><a href="/admin/system/job-types.html#surveyauthurlsexport">Export authentication URLs</a></p></li><li><p><a href="/admin/system/job-types.html#surveydataexport">Submission data export</a></p></li><li><p><a href="/admin/system/job-types.html#surveynutrientsrecalculation">Nutrient recalculation</a></p></li><li><p><a href="/admin/system/job-types.html#surveyrespondentsimport">Import respondents</a></p></li></ul>',51),r=[s];function l(n,d,c,u,p,h){return t(),o("div",null,r)}const f=e(i,[["render",l]]);export{b as __pageData,f as default};
