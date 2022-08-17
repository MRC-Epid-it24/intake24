# Surveys - respondent

Survey-specific API endpoints accessible to respondents.

## Survey parameters

Returns survey parameters such as the scheme ID, current status, custom HTML content etc.

### Request

```json
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

```json
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
   "submissions": number,
   "showFeedback": boolean,
   "maximumTotalSubmissionsReached": boolean,
   "maximumDailySubmissionsReached": boolean
}
```

where:

**surveyId** is the internal (numerical) Intake24 user ID,

**name** is optional first name of the respondent (used to confirm that the right person is completing the recall),

**submissions** is the number of collected submissions,

**showFeedback** means if user can be offered feedback,

**maximumTotalSubmissionsReached** means that the user is not allowed to complete any more recalls (used to display the correct error page in case the dietary feedback redirect is disabled),

**maximumDailySubmissionsReached** means that the user is not allowed to complete any more recalls _today_ but they could do so tomorrow. "Today" is defined as the current day in the user's local time zone.

## Get user session

Get survey user session (current recall state), if any. Functionality is controlled by survey settings.

### Request

```json
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

```json
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

## Submit recall

Submit a completed recall.

### Request

```json
POST /api/surveys/{survey-slug}/submission?tzOffset={tzOffset}

Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "submission": {...}
}
```

### Response

```json
200 OK

{
   "id" : string,
   "name": string | null,
   "submissions": number,
   "showFeedback": boolean,
   "maximumTotalSubmissionsReached": boolean,
   "maximumDailySubmissionsReached": boolean,
   "followUpUrl": string | null,
}
```

## Request assistance

Notify people having support role for the survey to give the respondent a call to help them complete their recall.

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/system/user/HelpController.scala#L68-L138)

### Request

```json
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
