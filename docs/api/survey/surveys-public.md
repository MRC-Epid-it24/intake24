# Surveys - public

Survey-specific public API endpoints.

## Public survey list

Publicly accessible survey list. Returns list of public surveys.

### Request

```json
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

```json
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

```json
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

Create a new user account with a specific user name and a redirect URL if allowed by the survey settings. User generation must be allowed in survey settings and JWT secret must be set.

:::warning
JWT secret should be treated as a `shared secret for machine-to-machine communication`. Therefore it should always be securely stored in backend and not embedded in frontend code, where it can be easily extracted and misused.
:::

### Request

```json
POST /api/surveys/{survey-slug}/create-user

Content-Type: application/json

{
    "token": string
}
```

#### Specifications of `token`

- `token` must be a valid JWT token signed with the [`JWT secret`](/admin/surveys/#users-settings).
- `HS256` and `HS512` algorithms are supported.
- expected claims / payload shape:
  - `username` - Unique respondent username within the survey
  - `redirectUrl` (optional) - redirect URL for user redirection after recall completion

#### JWT payload

```json
{
  "username": string,
  "redirectUrl"?: string
}
```

### Response

```json
200 OK

{
  "userId": string,
  "username": string,
  "authToken": string,
  "redirectUrl"?: string
}
```

- `userId` - Sequential internal Intake24 user ID

- `username` - Survey-unique username supplied in JWT payload

- `authToken` - Authentication token for the new user

- `redirectUrl` - optional redirect URL supplied in JWT payload
