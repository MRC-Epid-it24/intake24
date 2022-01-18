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
    "name": string,
    "localeId": string
  }
]
``` 

## Public survey parameters

Publicly accessible API end-point.
 
Returns survey parameters necessary to render the survey login page such as the language settings and the support e-mail.

### Request

```http
GET /api/surveys/{surveyId}

Content-Type: application/json
```

### Response

```json
200 OK

{
  "localeId": string,
  "respondentLanguageId": string,
  "supportEmail": string,
  "originatingURL": string?
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
This functionality has to be allowed in survey settings. It is using reCaptcha challenge and is rate-limited.
:::

### Request

```http
POST /api/surveys/{surveyId}/generate-user

Content-Type: application/json

{
    "reCaptchaToken": string
}
```

### Response

```json
200 OK

{
  "userName": string,
  "password": string
}
```

## Create user  

Publicly accessible API end-point.

Create a new user account with a specific user name and a unique redirect URL if allowed by the survey settings.
Currently used for integration with external survey systems.

:::warning
This function presents a vulnerability similar to the generate user function. The JWT signing is done on the 
client side by the current users of this function and can therefore be easily extracted. 
:::

### Request

```http
POST /api/surveys/{surveyId}/create-user?params={token}

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
