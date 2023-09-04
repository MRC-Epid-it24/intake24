# Integrations

Looking to integrate with Intake24? Here's how to do it.

Intake24 provides access to [REST API](/api/), consumed by 1st party applications, [admin tool](/admin/) and [survey app](/survey/). Nevertheless it can be used to integrate with any other 3rd party system.

## Respondent account creation

Traditionally, respondent accounts can be created manually in [Admin Tool UI](/admin/surveys/#respondents) either using form UI or [uploading CSV file](/admin/system/job-types.html#surveyimportrespondents) for bulk creation. This is suitable for small scale studies or batch-style data processing where respondent accounts are created in advance.

Respondent accounts can also be created on the fly using [Survey API](#survey-api) or [Admin API](#admin-api). This is suitable for large scale studies, where seamless integration is required for real-time data processing/monitoring and respondent accounts are created on demand and users automatically redirected into the Intake24 system.

### Survey API

Survey can be enabled with respondent account generation using shared secret. To enable this feature, read [survey user settings](/admin/surveys/#users-settings) section.

- tick `allow user generation`
- set up `jwt secret` - opaque string to sign JWT for secure communication between Intake24 and 3rd party system
- use [create user endpoint](/api/survey/surveys-public.html#create-user) to create respondent accounts

::: warning
JWT secret should be treated as a `shared secret for machine-to-machine communication`. Therefore it should always be securely stored in backend and not embedded in frontend code, where it can be easily extracted and misused.
:::

## Survey completion notifications

Intake24 can notify 3rd party system about survey completion using registered webhook. To enable this feature, read [survey submission webhooks](/admin/surveys/#submission-webhooks) section.

- set up `webhook url` - URL to be called when survey recall is submitted
- upon each survey submission, system dispatches [survey submission notification](/admin/system/job-types.html#surveysubmissionnotification) job with described request.

Request payload contains submission data. If `JWT secret` is set in [survey user settings](/admin/surveys/#users-settings) section, Authorization header is attached with signed JWT token.

### Admin API

[Admin API](/api/admin/surveys/respondents) can be used to create respondent accounts. This requires admin access to Intake24 and going through admin authentication flow.

## Redirecting to 3rd party system

Intake24 can redirect respondent to 3rd party system upon survey recall completion. To enable this feature, survey scheme needs to set up with terminal `redirect prompt` including desired parameters to form the `redirect URL`. Please see [redirect prompt](/admin/surveys/prompt-types.html#redirect-prompt) for more details.

## Missing integration?

Please note options described above are not exhaustive. It is a list of most used methods, for more details consult [API documentation](/api/).

Not found integration you're looking for? We appreciate that every system is a bit different and we're happy to help with integration and extend Intake24 to allow for seamless integration and wider adoption. Open an issue on [GitHub](https://github.com/MRC-Epid-it24/intake24/issues) and we will try to help.
