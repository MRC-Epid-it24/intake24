import{_ as e,c as s,o as i,a as t}from"./app.df7875f4.js";const f='{"title":"Surveys","description":"","frontmatter":{},"headers":[{"level":2,"title":"Detail","slug":"detail"},{"level":2,"title":"Create / Edit","slug":"create-edit"},{"level":3,"title":"Users settings","slug":"users-settings"},{"level":3,"title":"Submission webhooks","slug":"submission-webhooks"},{"level":3,"title":"Search options","slug":"search-options"},{"level":3,"title":"Authentication URL settings","slug":"authentication-url-settings"},{"level":3,"title":"Submission limits","slug":"submission-limits"},{"level":3,"title":"Feedback settings","slug":"feedback-settings"},{"level":2,"title":"Overrides","slug":"overrides"},{"level":3,"title":"Scheme questions overrides","slug":"scheme-questions-overrides"},{"level":3,"title":"Scheme meals overrides","slug":"scheme-meals-overrides"},{"level":2,"title":"Respondents","slug":"respondents"},{"level":2,"title":"Submissions","slug":"submissions"},{"level":2,"title":"Data export","slug":"data-export"}],"relativePath":"admin/surveys/index.md"}',o={},a=t('<h1 id="surveys" tabindex="-1">Surveys <a class="header-anchor" href="#surveys" aria-hidden="true">#</a></h1><p>Survey section allows to manage surveys.</p><h2 id="detail" tabindex="-1">Detail <a class="header-anchor" href="#detail" aria-hidden="true">#</a></h2><p>Detail tab displays selected survey info.</p><h2 id="create-edit" tabindex="-1">Create / Edit <a class="header-anchor" href="#create-edit" aria-hidden="true">#</a></h2><p>Edit tab allows to modify selected survey.</p><ul><li><p><code>Survey ID</code> - Short and unique, ideally slug-based string. It is used as primary key in database and also forms the URL of the login / authentication links.</p></li><li><p><code>Survey name</code> - User friendly name for admin purposes</p></li><li><p><code>Locale</code> - Associated locale</p></li><li><p><code>Scheme</code> - Associated scheme</p></li><li><p><code>Start date</code> - Start date of the survey</p></li><li><p><code>End date</code> - End date of the survey</p></li><li><p><code>Support email</code> - Email which gets displayed to participant in footer</p></li><li><p><code>State</code> - Survey state</p><ul><li><code>Not started</code> - Respondent won&#39;t be allowed to complete a recall</li><li><code>Active</code> - Respondent will be allowed to complete a recall</li><li><code>Suspended</code> - Respondent won&#39;t be allowed to complete a recall</li></ul></li><li><p><code>Suspension reason</code> - If <code>Suspended</code> state is set, additional details can be passed on to respondent using this field..</p></li><li><p><code>Store user session on server</code> - If enabled, user partial submission data are sent to server for store and retrieval. If disabled, user partial submission data are only stored locally in client browser,</p></li></ul><h3 id="users-settings" tabindex="-1">Users settings <a class="header-anchor" href="#users-settings" aria-hidden="true">#</a></h3><ul><li><p><code>Allow user personal identifiers</code> - <code>on</code> / <code>off</code> control to allow persistance of <code>email</code> / <code>name</code> / <code>phone</code> fields in database for respondent account</p></li><li><p><code>Allow user custom fields</code> - <code>on</code> / <code>off</code> control to allow persistance of <code>user custom fields</code></p></li><li><p><code>Allow user generation</code> - <code>on</code> / <code>off</code> control to allow automatic user generation</p></li><li><p><code>JWT secret</code> - string to be used to generate / verify JWT token validity.</p></li></ul><p>If automatic user generation is enabled, it provides two ways to generate accounts.</p><h4 id="_1-jwt-secret-is-left-blank" tabindex="-1"><code>1. JWT secret is left blank</code> <a class="header-anchor" href="#_1-jwt-secret-is-left-blank" aria-hidden="true">#</a></h4><ul><li><p>Anyone can generate new respondent account using following survey URL: <code>survey-app.domain.com/:surveyId/generate-user</code>.</p></li><li><p>API endpoint is rate limited and protected by Google reCaptcha to minimize the misuses</p></li><li><p>This is useful for <code>demo-like</code> surveys.</p></li></ul><h4 id="_2-jwt-secret-is-set" tabindex="-1"><code>2. JWT secret is set</code> <a class="header-anchor" href="#_2-jwt-secret-is-set" aria-hidden="true">#</a></h4><ul><li>API endpoint can be used to create new respondent accounts. See <a href="/api/respondent/surveys-public.html#create-user">API docs</a> for more details.</li></ul><h3 id="submission-webhooks" tabindex="-1">Submission webhooks <a class="header-anchor" href="#submission-webhooks" aria-hidden="true">#</a></h3><ul><li><code>Submission notification URL</code> - Webhook to be called when recall data submitted. Internally it dispatches <a href="/admin/system/job-types.html#surveysubmissionnotification">SurveySubmissionNotification</a> job.</li></ul><h3 id="search-options" tabindex="-1">Search options <a class="header-anchor" href="#search-options" aria-hidden="true">#</a></h3><ul><li><p><code>Sorting algorithm</code> - Sorting algorithm to be used for foods search</p></li><li><p><code>Match score weight</code> - Match score weight parameter for sorting algorithm</p></li></ul><h3 id="authentication-url-settings" tabindex="-1">Authentication URL settings <a class="header-anchor" href="#authentication-url-settings" aria-hidden="true">#</a></h3><ul><li><p><code>Token character set</code> - string of characters to be used for authentication tokens (if empty, default is used)</p></li><li><p><code>Token length</code> - Authentication token length</p></li><li><p><code>Domain override</code> - URL used to generate full authentication links in CSV export file. Please note, valid redirect, CNAME or other mechanism to reach the original server needs to be set up.</p></li></ul><h3 id="submission-limits" tabindex="-1">Submission limits <a class="header-anchor" href="#submission-limits" aria-hidden="true">#</a></h3><ul><li><p><code>Maximum allowed submissions per calendar day</code> - maximum number of recalls allowed within the survey per day</p></li><li><p><code>Maximum allowed total submissions</code> - maximum total number of recalls allowed within the survey</p></li><li><p><code>Minimum interval between submissions (seconds)</code> - the shortest minimal internal between two following submission by same respondent</p></li></ul><h3 id="feedback-settings" tabindex="-1">Feedback settings <a class="header-anchor" href="#feedback-settings" aria-hidden="true">#</a></h3><ul><li><p><code>Feedback scheme</code> - associated feedback scheme. If not set, feedback feature is disabled.</p></li><li><p><code>Number of submissions for feedback</code> - minimal number of submissions per respondent account to allow to access the feedback</p></li></ul><h2 id="overrides" tabindex="-1">Overrides <a class="header-anchor" href="#overrides" aria-hidden="true">#</a></h2><p>Overrides tab allows to override certain parts of the scheme without a need to create whole new scheme.</p><p>There are two sections that can be overridden in limited way, so it doesn&#39;t influence the over scheme flow. UI is the same is in <a href="/admin/surveys/survey-schemes.html"><code>scheme section</code></a>, so should feel familiar.</p><h3 id="scheme-questions-overrides" tabindex="-1">Scheme questions overrides <a class="header-anchor" href="#scheme-questions-overrides" aria-hidden="true">#</a></h3><p>Scheme questions overrides section allow to override specific survey scheme question. When added to the list, user can modify the settings of particular question.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>New question cannot be added or existing question cannot be removed from the scheme in this way. It only allows to modify existing questions in order to retain original scheme flow. If you need to add / remove questions, clone existing scheme, modify it and assign to the survey.</p></div><h3 id="scheme-meals-overrides" tabindex="-1">Scheme meals overrides <a class="header-anchor" href="#scheme-meals-overrides" aria-hidden="true">#</a></h3><p>Scheme meals overrides section allows to override whole <code>default meal list</code>. If it is left empty, original one from scheme is used. If any entry is</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>Any entry overrides the whole default scheme meal list. This works differently to allow more flexibility as the meal list does not influence the survey flow.</p></div><h2 id="respondents" tabindex="-1">Respondents <a class="header-anchor" href="#respondents" aria-hidden="true">#</a></h2><p>Survey respondents section allows to:</p><ol><li><p>Create / view / search / edit / remove respondents</p></li><li><p>Bulk import respondents using CSV file. See <a href="/admin/system/job-types.html#surveyimportrespondents"><code>SurveyImportRespondents</code></a> for more details about CSV file structure.</p></li><li><p>Download respondents authentication details in CSV file</p></li></ol><h2 id="submissions" tabindex="-1">Submissions <a class="header-anchor" href="#submissions" aria-hidden="true">#</a></h2><p>Survey submissions with limited ability to search / view / delete submissions. To be expanded in future.</p><h2 id="data-export" tabindex="-1">Data export <a class="header-anchor" href="#data-export" aria-hidden="true">#</a></h2><p>Data export allows to export survey submission data into the flattened CSV file. Structure is defined in <a href="/admin/surveys/survey-schemes.html#data-export-tab">schemes</a>.</p><p><code>Start date</code> / <code>End date</code> can be specified for export. Export is submitted as background job and progress will appear below once export job is submitted.</p>',41),r=[a];function d(l,n,c,u,h,p){return i(),s("div",null,r)}var b=e(o,[["render",d]]);export{f as __pageData,b as default};
