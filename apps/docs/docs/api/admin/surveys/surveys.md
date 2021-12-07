# Surveys

## Browse surveys

Browse paginated survey list

### Request

```http
GET /api/admin/surveys
    ?search={searchText}
    &page={page}
    &limit={limit}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "data": [{...}],
    "meta": {...}
}
```

## Create survey

Create new survey entry

### Request

```http
POST /api/admin/surveys

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "id": string,
    "state": 0 | 1 | 2,
    "startDate": Date,
    "endDate": Date,
    "schemeId": string,
    "locale": string,
    "allowGenUsers": boolean,
    "suspensionReason": string,
    "surveyMonkeyUrl": string,
    "supportEmail": string,
    "originatingUrl": string,
    "description": string,
    "feedbackEnabled": boolean,
    "feedbackStyle": string,
    "submissionNotificationUrl": string,
    "storeUserSessionOnServer": boolean,
    "numberOfSubmissionsForFeedback": number,
    "finalPageHtml": string
}
```

### Response

```json
201 Created

{
    "data": {...}
}
```

## Get survey

Get survey entry

### Request url

```http
GET /api/admin/surveys/:surveyId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "data": {...},
    "refs": {...}
}
```

## Update survey

Update survey entry

### Request url

```http
PUT /api/admin/surveys/:surveyId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "state": 0 | 1 | 2,
    "startDate": Date,
    "endDate": Date,
    "schemeId": string,
    "locale": string,
    "allowGenUsers": boolean,
    "suspensionReason": string,
    "surveyMonkeyUrl": string,
    "supportEmail": string,
    "originatingUrl": string,
    "description": string,
    "feedbackEnabled": boolean,
    "feedbackStyle": string,
    "submissionNotificationUrl": string,
    "storeUserSessionOnServer": boolean,
    "numberOfSubmissionsForFeedback": number,
    "finalPageHtml": string
}
```

### Response

```json
200 OK

{
    "data": {...},
    "refs": {...}
}
```

## Delete survey

Delete survey entry

### Request

```http
DELETE /api/admin/surveys/:surveyId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
