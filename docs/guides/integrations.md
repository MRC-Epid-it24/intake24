# Integrations

Looking to integrate with Intake24? Here's how to do it.

Intake24 provides access to [REST API](/api/), consumed by 1<sup>st</sup> party applications, [admin tool](/admin/) and [survey app](/survey/).

[REST API](/api/) can be used to integrate with any other 3<sup>rd</sup> party system. For machine-to-machine communication, [personal access tokens](/admin/user/personal-access-tokens) can be used rather than primary user credentials.

While REST API is a generic interface to be used to implement custom flow, there are few features that can simplify the 3<sup>rd</sup> party integration into survey flow without delving too much into the API details:

- Respondent account creation

- Survey completion notifications

- Redirecting to 3<sup>rd</sup> party system

## Respondent account creation

Respondent accounts can be created on the fly using simplified API call with JWT-encoded parameters. This is suitable for studies, where seamless integration is required for real-time data processing/monitoring and respondent accounts are created on demand and respondents automatically redirected into the Intake24 system.

Survey can be enabled with respondent account generation using shared secret. To enable this feature, read [survey user settings](/admin/surveys/#users-settings) section.

- tick `allow user generation`
- set up `jwt secret` - opaque string to sign JWT for secure communication between Intake24 and 3<sup>rd</sup> party system

::: warning
JWT secret should be treated as a `shared secret for machine-to-machine communication`. Therefore it should always be securely stored in backend and not embedded in frontend code, where it can be easily extracted and misused.
:::

Once enabled, two options listed below can be used to create respondent accounts. Regardless of the selected option, [JWT token](/open-api.html#tag/survey/post/surveys/{slug}/create-user){target="blank"} with payload must be created.

#### A) API endpoint

- use [create user API endpoint](/open-api.html#tag/survey/post/surveys/{slug}/create-user){target="blank"}
- create JWT token with desired payload according the specification

#### Specifications of `token`

- `token` must be a valid JWT token signed with the [`JWT secret`](/admin/surveys/#users-settings)
- `HS256` and `HS512` algorithms are supported
- expected claims / payload shape:
  - `username` - Unique respondent username within the survey
  - `password` (optional) - password for username:password login
  - `redirectUrl` (optional) - redirect URL for user redirection after recall completion
  - `name` (optional) - user's name for personalisation

#### JWT payload

```json
{
  "username": string,
  "password"?: string
  "redirectUrl"?: string
  "name"?: string
}
```

- form authentication URL with response details [authentication URL patterns](/admin/surveys/#authentication-urls)
- redirect respondent to the URL

#### B) Frontend app URL

- route: `app.domain.com/{surveyId}/create-user/{token}`
- under the hood same API endpoint is used as in `option A` and user is directly authenticated

::: tip
Pick suitable option based on integration use case, depending whether you need to process API response (`A`) or not (`B`).
:::

## Survey completion notifications

Intake24 can notify 3<sup>rd</sup> party system about survey completion using registered webhook. To enable this feature, read [survey external communication](/admin/surveys/#external-communication) section.

- set up `webhook url` - URL to be called when survey recall is submitted
- upon each survey submission, system dispatches [survey submission notification](/admin/system/job-types.html#surveysubmissionnotification) job with described request.

Request payload contains submission data. If `JWT secret` is set in [survey external communication](/admin/surveys/#external-communication) section, Authorization header is attached with signed JWT token, which can be used to verify the request.

## Redirection to 3<sup>rd</sup> party system

Intake24 can redirect respondent to 3<sup>rd</sup> party system upon survey recall completion. To enable this feature, survey scheme needs to set up with terminal `redirect prompt` including desired parameters to form the `redirect URL`. Please see [redirect prompt](/admin/surveys/prompt-types.html#redirect-prompt) for more details.

## Missing integration?

Please note options described above are not exhaustive. It is a list of most used methods, for more details consult [API documentation](/api/).

Not found the integration you're looking for? We appreciate that every system is a bit different, so we're happy to advise and where possible extend Intake24 to allow for seamless integration and wider adoption. Open an issue on [GitHub](https://github.com/MRC-Epid-it24/intake24/issues) and we will try to help.
