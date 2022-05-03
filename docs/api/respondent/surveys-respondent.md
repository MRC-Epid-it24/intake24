# Surveys - respondent

Survey-specific API endpoints accessible to respondents.

## Survey parameters

Returns survey parameters such as the scheme ID, current status, custom HTML content etc.

### Request

```http
GET /api/surveys/{survey-slug}/parameters

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

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

## User info

Returns a subset of personal data for the current user that is relevant to the recall application.

### Request

```http
GET /api/surveys/{survey-slug}/user-info?tzOffset={tzOffset}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

:::tip
**tzOffset** is client's timezone offset, (e.g. as returned by `new Date().getTimezoneOffset()` in web browsers).
:::

### Response

```json
200 OK

{
   "id" : string,
   "name": string | null,
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

**redirectToFeedback** means that the user should be redirected to dietary feedback and not allowed to complete, any more recalls

**maximumTotalSubmissionsReached** means that the user is not allowed to complete any more recalls (used to display the correct error page in case the dietary feedback redirect is disabled),

**maximumDailySubmissionsReached** means that the user is not allowed to complete any more recalls _today_ but they could do so tomorrow. "Today" is defined as the current day in the user's local time zone.

## Get user session

Get survey user session (current recall state), if any. Functionality is controlled by survey settings.

### Request

```http
GET /api/surveys/{survey-slug}/session

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
  "userId": string,
  "surveyId": string,
  "sessionData": {...}
}
```

## Set user session

Save survey user session (current recall state) on server. Functionality is controlled by survey settings.

### Request

```http
POST /api/surveys/{survey-slug}/session

Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "sessionData": {...},
}
```

### Response

```json
200 OK

{
  "userId": string,
  "surveyId": string,
  "sessionData": {...}
}
```

## Survey follow-up

Returns actions available at the end of the recall which can be a link to the next (external) stage of the survey and/or a link to the dietary feedback.

### Request

```http
GET /api/surveys/{survey-slug}/follow-up

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
  "followUpUrl": string | null,
  "showFeedback": boolean
}
```

## Submit recall

Submit a completed recall.

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/system/user/SurveyController.scala#L181-L290)

### Request

```http
POST /api/surveys/{survey-slug}/submissions

Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "recall": {...}
}
```

### Response

Same as survey follow-up:

```json
200 OK

{
  "followUpUrl": string | null,
  "showFeedback": boolean
}
```

## Request assistance

Notify people having support role for the survey to give the respondent a call to help them complete their recall.

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/system/user/HelpController.scala#L68-L138)

### Request

```http
POST /api/surveys/{survey-slug}/request-callback

Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": string,
  "phone": string
}
```

where:

**slug** is the survey ID,

**name** and **phone** are the respondent's contact details (as entered into the assistance request form by the
respondent).

### Response

```json
200 OK
```
