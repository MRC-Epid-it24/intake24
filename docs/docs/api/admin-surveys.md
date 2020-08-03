# Surveys

## List surveys

Get survey list

### Request

```http
GET /admin/surveys
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
POST /admin/surveys

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
    "finalPageHtml": string,
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
GET /admin/surveys/:surveyId

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

Update existing survey entry

### Request url

```http
PUT /admin/surveys/:surveyId

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
    "finalPageHtml": string,
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

Delete existing survey entry

### Request

```http
DELETE /admin/surveys/:surveyId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## List management users

Get list of survey management users. This includes usurs with `staff` and `support` roles.

### Request

```http
GET /admin/surveys/:surveyId/mgmt
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

## List available users

Get list of users, which can be assigned as survey management.

::: tip Requirements
User has to have system account and no `staff` or `support` role.
:::

### Request

```http
GET /admin/surveys/:surveyId/mgmt/available

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "data": [{...}]
}
```

## Update management user

Assign list of survey management roles to specified user

* `{surveyId}/staff`
* `{surveyId}/support`

### Request

```http
PUT /admin/surveys/:surveyId/mgmt/:userId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "roles": string[]
}
```

### Response

```json
200 OK
```
