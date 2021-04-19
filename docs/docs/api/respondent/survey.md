# Survey

Survey-specific API functions accessible to respondents.

## Public survey parameters

Publicly accessible API end-point.
 
Returns survey parameters necessary to render the survey login page such as the language settings and the support e-mail.

### Request

```http
GET /api/surveys/{surveyId}/parameters
```

where: 

**surveyId** is the survey ID.

### Response

```json
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


## Survey parameters

Returns survey parameters such as the scheme ID, current status, custom HTML content etc.

### Request

```http
GET /api/surveys/{surveyId}/parameters

Authorization: Bearer {accessToken}
Content-Type: application/json
```

where: 

**surveyId** is the survey ID.

### Response

```json
{
  "id": string,
  "schemeId": string,
  "state": "pending" | "running" | "finished" | "suspended",
  "suspensionReason": string?,
  "description": string?,
  "finalPageHtml": string?,
  "uxEventSettings": {
    "enableSearchEvents": boolean, 
    "enableAssociatedFoodsEvents": boolean
  },
  "storeUserSessionOnServer": boolean,
  "maximumDailySubmissions": number
}
```

## Survey follow-up

Returns actions available at the end of the recall which an be a link to the next (external) stage of the survey
and/or a link to the dietary feedback.  

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/system/user/SurveyController.scala#L116-L138)

### Request

```http
GET /api/surveys/{surveyId}/follow-up

Authorization: Bearer {accessToken}
Content-Type: application/json
```

where: 

**surveyId** is the survey ID.

### Response

```json
{
  "followUpUrl": string?, 
  "showFeedback": boolean
}
```

## User info

Returns a subset of personal data for the current user that is relevant to the recall application.

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/system/user/SurveyController.scala#L86-L114)

### Request

```http
GET /api/surveys/{surveyId}/user-info?tz={timeZone}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

where:

**surveyId** is the survey ID,

**tz** is the user's local time zone in tzdata format (e.g. as returned by `Intl.DateTimeFormat().resolvedOptions().timeZone` 
in web browsers).

### Response

```json
{
   "id" : string,
   "name": string?,
   "recallNumber": number,
   "redirectToFeedback": boolean,
   "maximumTotalSubmissionsReached": boolean,
   "maximumDailySubmissionsReached": boolean
}
```

where:

**surveyId** is the internal (numerical) Intake24 user ID,

**name** is optional first name of the respondent (used to confirm that the right person is completing the recall),

**recallNumber** is the current recall number, i.e. the number of previous submissions + 1,

**redirectToFeedback** means that the user should be redirected to dietary feedback and not allowed to complete,
any more recalls

**maximumTotalSubmissionsReached** means that the user is not allowed to complete any more recalls (used to display
the correct error page in case the dietary feedback redirect is disabled),

**maximumDailySubmissionsReached** means that the user is not allowed to complete any more recalls *today* but they
could do so tomorrow. "Today" is defined as the current day in the user's local time zone.  


## Submit recall

Submit a completed recall.

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/system/user/SurveyController.scala#L181-L290)

### Request

```http
POST /api/surveys/{surveyId}/submissions

Authorization: Bearer {accessToken}
Content-Type: application/json

{ recall } 
```

where:

**surveyId** is the survey ID,

**recall** is a completed dietary recall in JSON format. 


### Response

Same as survey follow-up:

```json
{
  "followUpUrl": string?, 
  "showFeedback": boolean
}
```

## Request assistance

Notify people having support role for the survey to give the respondent a call to help them complete their recall. 

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/system/user/HelpController.scala#L68-L138)

### Request

```http
POST /api/surveys/{surveyId}/request-callback

Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": string,
  "phone": string
} 
```

where:

**surveyId** is the survey ID,

**name** and **phone** are the respondent's contact details (as entered into the assistance request form by the 
respondent).

### Response

The response has no body.

## Generate user  

Publicly accessible API end-point.

Automatically create a new user account with a respondent role and random credentials if allowed by the survey settings.
Currently used for the demo survey feature.

:::tip
This function is using reCaptcha challenge and is rate-limited.
:::

### Request

```http
POST /api/surveys/{surveyId}/generate-user
```

where:

**surveyId** is the survey ID.

### Response

The randomly generated credentials: 

```json
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

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/system/user/GeneratedUsersController.scala#L126-L153)

### Request

```http
POST /api/surveys/{surveyId}/create-user?params={token}
```

where:

**surveyId** is the survey ID,

**token** is the request parameters encoded as a signed JWT token. The signing key is set up in the survey parameters.

### Response

```json
{
  "userId": number, 
  "redirect": string, 
  "authToken": string
}
```

where:

**userId** is the internal Intake24 user ID,

**redirect** is the redirect URL decoded from the input token,

**authToken** is the authentication token for the new user.
