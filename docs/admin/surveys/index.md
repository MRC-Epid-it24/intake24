# Surveys

Survey section allows to manage surveys.

## Detail

Detail tab displays selected survey info.

## Create / Edit

Edit tab allows to modify selected survey.

- `Survey ID` - Short and unique, ideally slug-based string. It is used as primary key in database and also forms the URL of the login / authentication links.

- `Survey name` - User friendly name for admin purposes

- `Locale` - Associated locale

- `Scheme` - Associated scheme

- `Start date` - Start date of the survey

- `End date` - End date of the survey

- `Support email` - Email associated with the survey, `help requests` are sent to this email.

- `State` - Survey state

  - `Not started` - Respondent won't be allowed to complete a recall
  - `Active` - Respondent will be allowed to complete a recall
  - `Suspended` - Respondent won't be allowed to complete a recall

- `Suspension reason` - If `Suspended` state is set, additional details can be passed on to respondent using this field..

### Search options

- `Collect search data` - `on` / `off` control for search data contribution into the locale search index statistics

- `Sorting algorithm` - Sorting algorithm to be used for foods search

- `Match score weight` - Match score weight parameter for sorting algorithm

### Users settings

- `Allow user personal identifiers` - `on` / `off` control to allow persistance of `email` / `name` / `phone` fields in database for respondent account

- `Allow user custom fields` - `on` / `off` control to allow persistance of `user custom fields`

### Authentication settings

- `Captcha verification` - `on` / `off` control captcha verification step during authentication

- `URL token character set` - string of allowed characters to be used for authentication tokens embedded into the URL(if empty, default set is used)

- `URL token length` - Authentication token length (if empty, default length is used)

- `URL Domain override` - URL used to generate full authentication links in CSV export file. Please note, valid redirect, CNAME or other mechanism to reach the original server needs to be set up.

### Submission limits

- `Maximum allowed submissions per calendar day` - maximum number of recalls allowed within the survey per day

- `Maximum allowed total submissions` - maximum total number of recalls allowed within the survey

- `Minimum interval between submissions (seconds)` - the shortest minimal internal between two following submission by same respondent

### External communication

- `Allow user generation` - `on` / `off` control to allow automatic user generation

- `JWT secret for M2M communication` - string to sign JWT token.

If automatic user generation is enabled, it provides two ways to generate accounts.

**1. JWT secret is left blank**

- Anyone can generate new respondent account using following survey URL: `app.domain.com/:surveyId/generate-user`.
- API endpoint is rate limited and protected by `captcha` to minimize the misuse
- This is useful for `demo-like` surveys to allow open access to anyone

**2. JWT secret is set**

- API endpoint can be used to create new respondent accounts. See [API docs](/open-api.html#tag/survey/post/surveys/{slug}/create-user){target="blank"} for more details.

### Notifications

Supported events:

- `survey.session.started` - Triggered when new session is started
- `survey.session.cancelled` - Triggered when session is cancelled by user
- `survey.session.submitted` - Triggered when session is submitted

Supported notifications:

- `webhook` - Provides URL to be called with payload

```http
POST https://my-submission-notification-url.example.com

authorization: Bearer {token}
content-type: application/json
intake24-version: 1.0.0
user-agent: intake24

{
  "type": "survey.session.started" | "survey.session.cancelled",
  "sessionId": string,
  "surveyId": string,
  "userId": string,
}

|

{
  "type": "survey.session.submitted",
  "sessionId": string,
  "surveyId": string,
  "userId": string,
  "submissionId": string,
  "data": {...}
}
```

If JWT secret is set, it is used to sign JWT token (algorithm `HS256`) and attach as Bearer in `Authorization` header to allow verification of the request.

Expected JWT payload with claims:

```json
{
  "type": "event-type",
  "sessionId": "uuid",
  "surveyId": "1",
  "submissionId"?: "uuid",
  "userId": "1",
  "iat": 1711834245,
  "exp": 1711834305,
  "aud": "https://my-submission-notification-url.example.com",
  "iss": "intake24",
  "jti": "opaque-string"
}
```

- `slack` - to be implemented
- `email` - to be implemented

[SurveyEventNotification](/admin/system/job-types#surveyeventnotification) job is used to dispatch survey event notifications.

### Session settings

- `Store user session on server` - If enabled, user partial submission data are sent to server for store and retrieval. If disabled, user partial submission data are only stored locally in client browser

- `Session lifetime` - Session duration as `ms-formatted` string, e.g. `30m`, `2h`, `1d` (see [ms](https://github.com/vercel/ms) for more information) or number in milliseconds.

### Feedback settings

- `Feedback scheme` - Associated feedback scheme. If not set, feedback feature is disabled.

- `Number of submissions for feedback` - Minimal number of submissions per respondent account to allow to access the feedback

## Overrides

Overrides tab allows to override certain parts of the scheme without a need to create whole new scheme.

There are two sections that can be overridden in limited way, so it doesn't influence the overall scheme flow. UI is the same is in [`prompt editor`](/admin/surveys/schemes), so should feel familiar.

### Scheme prompts overrides

Scheme prompts overrides section allow to override specific survey scheme prompt. When added to the list, user can modify the settings of particular prompt.

::: warning

New prompt cannot be added or existing prompt cannot be removed from the scheme in this way. It only allows to modify existing prompts in order to retain original scheme flow. If you need to add / remove prompts, clone existing scheme, modify it and assign to the survey.

:::

### Scheme meals overrides

Scheme meals overrides section allows to override whole `default meal list`. If it is left empty, original one from scheme is used. If any entry is

::: warning

Any entry overrides the whole default scheme meal list. This works differently to allow more flexibility as the meal list does not influence the survey flow.

:::

## Respondents

Survey respondents section allows to:

1. Create / view / search / edit / remove respondents

2. Bulk import respondents using CSV file. See [`SurveyRespondentsImport`](/admin/system/job-types#surveyimportrespondents) for more details about CSV file structure.

3. Download respondents authentication details in CSV file

### Authentication URLs

Authentication URLs are formed of:

- base URL: `app.domain.com`
- survey ID: `{surveyId}`
- authentication token: `{token}`

#### Short URL patterns

- `app.domain.com/a/{token}` - `context` pattern
- `app.domain.com?auth={token}` - `query` pattern

:::tip
Short URL patterns can be used to let user land on survey home page
:::

#### Full URL patterns

- `app.domain.com/{surveyId}?auth={token}` - user is redirected to the survey landing page
- `app.domain.com/{surveyId}/recall?auth={token}` - user is redirected to the survey recall page
- `app.domain.com/{surveyId}/feedback?auth={token}` - user is redirected to the survey feedback page

:::tip
Full URL patterns using `{token}` as `query` parameter can be used in combination with any valid survey app URL to let user land on specific page
:::

## Submissions

Survey submissions with ability to search / view / delete submissions.

## Sessions

Survey sessions with limited ability to search / view / delete partial recall data.

## Tasks

Tasks section allows to submit resource specific tasks into the job queue with additional parameters. See [job types](/admin/system/job-types) for more information.

Jobs that can be submitted:

- [Authentication URLs export](/admin/system/job-types.html#surveyauthurlsexport)

- [Nutrient recalculation](/admin/system/job-types.html#surveynutrientsrecalculation)

- [Ratings export](/admin/system/job-types.html#surveyratingsexport)

- [Respondents import](/admin/system/job-types.html#surveyrespondentsimport)

- [Submission data export](/admin/system/job-types.html#surveydataexport)

- [Sessions export](/admin/system/job-types.html#surveysessionsexport)
