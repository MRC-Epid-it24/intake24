# Surveys - public

Survey-specific public API endpoints.

## Public survey list

Publicly accessible survey list. Returns list of public surveys.

### Request

```http
GET /api/surveys

Content-Type: application/json
```

### Response

```json
200 OK

[
  {
    "id": string,
    "slug": string,
    "name": string,
    "localeId": string,
    "originatingUrl": string | null,
    "supportEmail": string,
    "openAccess": boolean,
  }
]
```

## Public survey parameters

Publicly accessible API end-point.

Returns survey parameters necessary to render the survey login page such as the language settings and the support e-mail.

### Request

```http
GET /api/surveys/{survey-slug}

Content-Type: application/json
```

### Response

```json
200 OK

{
    "id": string,
    "slug": string,
    "name": string,
    "localeId": string,
    "originatingUrl": string | null,
    "supportEmail": string,
    "openAccess": boolean,
  }
```

where:

**originatingURL** is a feature for integrating with external systems. In v3 respondents are redirected to this URL
in case of authentication failure so the external system can perform the authentication for them. A better solution
should be used for v4.

## Generate user

Publicly accessible API end-point.

Automatically create a new user account with a respondent role and random credentials if allowed by the survey settings.

:::tip
This functionality has to be allowed in survey settings. It is using captcha challenge and is rate-limited.
:::

### Request

```http
POST /api/surveys/{survey-slug}/generate-user

Content-Type: application/json

{
    "captcha": string
}
```

### Response

```json
200 OK

{
  "username": string,
  "password": string
}
```

## Create user

Publicly accessible API end-point.

Create a new user account with a specific user name and a unique redirect URL if allowed by the survey settings.
Currently used for integration with external survey systems.

:::warning
This functionality can present possible vulnerability if implemented incorrectly.

Secret for the JWT generation is stored server-side in survey settings. Client implementation should store the secret securely at their end. E.g. if the client implementation is done in frontend javascript done, such secret can then be extracted and misused.
:::

### Request

```http
POST /api/surveys/{survey-slug}/create-user?params={token}

Content-Type: application/json
```

`token` is the request parameters encoded as a signed JWT token. The signing key is set up in the survey parameters.

JWT payload expects following claims:

- `user` - Unique respondent username within the survey
- `redirect` - Unique respondent username within the survey

JWT Payload object

```json
{
  "user": string,
  "redirect": string,
}
```

### Response

```json
200 OK

{
  "userId": number,
  "redirect": string,
  "authToken": string
}
```

- `userId` - Internal Intake24 user ID

- `redirect` - Redirect URL decoded from the input token

- `authToken` - Authentication token for the new user
